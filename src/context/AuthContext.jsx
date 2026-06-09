import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { API_BASE } from "../config";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Call firebase_login.php with a fresh ID token */
async function callLoginApi(idToken, extraBody = {}) {
  const res = await fetch(`${API_BASE}/api/firebase_login.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
      'X-Firebase-Token': idToken,       // fallback for restrictive Apache configs
    },
    body: JSON.stringify(extraBody),
  });
  if (!res.ok && res.status !== 401 && res.status !== 403) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

/** Persist a verified DB user to localStorage */
function persistSession(user) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('auth_expires', String(Date.now() + 12 * 60 * 60 * 1000));
}

/** Clear ALL local session data */
function clearSession() {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_expires');
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);          // always null on first render
  const [loading, setLoading] = useState(true);        // true until Firebase resolves
  const [authError, setAuthError] = useState('');

  // ── On Firebase auth state change, ALWAYS re-verify with backend ────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        // Firebase says signed out — clear everything
        setDbUser(null);
        clearSession();
        setLoading(false);
        return;
      }

      // Firebase says there IS a current user — verify with our backend using a
      // fresh token.  This catches: deleted accounts, suspended accounts, stale
      // localStorage from a previously deleted Firebase identity.
      try {
        const idToken = await fbUser.getIdToken(/* forceRefresh */ true);
        const data = await callLoginApi(idToken, {
          email: fbUser.email,
          full_name: fbUser.displayName,
          is_google: fbUser.providerData?.[0]?.providerId === 'google.com',
        });

        if (data.success && data.user) {
          setDbUser(data.user);
          persistSession(data.user);
        } else if (data.needs_profile) {
          // New Google user who hasn't completed profile yet — keep fbUser set
          // but leave dbUser null so Auth page can detect and show profile form
          setDbUser(null);
          clearSession();
        } else {
          // Account suspended, deleted, or not found — force sign out
          setDbUser(null);
          clearSession();
          await signOut(auth);
        }
      } catch (err) {
        console.error('Session verification error:', err);
        // On network error keep existing session — don't log out user offline
        try {
          const saved = localStorage.getItem('user');
          const expires = parseInt(localStorage.getItem('auth_expires') || '0', 10);
          if (saved && expires > Date.now()) {
            setDbUser(JSON.parse(saved));
          } else {
            setDbUser(null);
            clearSession();
          }
        } catch {
          setDbUser(null);
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  // ── Register with email + password ──────────────────────────────────────────
  const registerWithEmail = useCallback(async (email, password, fullName, phone, city, address = '', pincode = '') => {
    setAuthError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });

      const res = await fetch(`${API_BASE}/api/firebase_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          city,
          address,
          pincode,
          firebase_uid: cred.user.uid,
          email: cred.user.email,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setDbUser(data.user);
        persistSession(data.user);
        return { success: true, user: data.user };
      } else {
        // Roll back Firebase user if DB registration failed
        try { await cred.user.delete(); } catch (_) { /* ignore */ }
        return { success: false, message: data.message || 'Failed to create account.' };
      }
    } catch (err) {
      console.error('Registration error:', err);
      let msg = 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Please login instead.';
      else if (err.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
      else if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Login with email + password ──────────────────────────────────────────────
  const loginWithEmail = useCallback(async (email, password) => {
    setAuthError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken(true);
      const data = await callLoginApi(idToken, { email: cred.user.email });

      if (data.success && data.user) {
        setDbUser(data.user);
        persistSession(data.user);
        return { success: true, user: data.user };
      }

      // Backend denied (suspended / deleted / not found) — sign out of Firebase too
      await signOut(auth);
      const message = data.message || 'Account not found. Please register first.';
      setAuthError(message);
      return { success: false, message, code: data.code };
    } catch (err) {
      console.error('Login error:', err);
      let msg = 'Login failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.';
      }
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Google Sign-In ────────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken(true);

      const data = await callLoginApi(idToken, {
        email: fbUser.email,
        full_name: fbUser.displayName,
        is_google: true,
      });

      if (data.success && data.user) {
        setDbUser(data.user);
        persistSession(data.user);
        return { success: true, user: data.user, needsProfile: false };
      }

      if (data.needs_profile) {
        // Brand-new Google user — leave them signed into Firebase so
        // completeGoogleProfile() can use auth.currentUser
        return { success: true, user: null, needsProfile: true, firebaseUser: fbUser };
      }

      // Account denied (suspended / deleted)
      await signOut(auth);
      setAuthError(data.message || 'Login failed.');
      return { success: false, message: data.message, code: data.code };
    } catch (err) {
      console.error('Google Sign-In error:', err);
      let msg = 'Google Sign-In failed.';
      if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in cancelled.';
      else if (err.code === 'auth/popup-blocked') msg = 'Popup blocked. Please allow popups and try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Complete Google profile (new user) ────────────────────────────────────────
  const completeGoogleProfile = useCallback(async (phone, city, address, pincode, fullName) => {
    setAuthError('');
    const fbUser = auth.currentUser;
    if (!fbUser) return { success: false, message: 'Not authenticated. Please sign in again.' };

    try {
      const res = await fetch(`${API_BASE}/api/firebase_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName || fbUser.displayName,
          phone,
          city,
          address,
          pincode,
          firebase_uid: fbUser.uid,
          email: fbUser.email,
          is_google: true,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setDbUser(data.user);
        persistSession(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Failed to save profile.', code: data.code };
    } catch (err) {
      console.error('completeGoogleProfile error:', err);
      return { success: false, message: 'Server error. Please try again.' };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setDbUser(null);
      setFirebaseUser(null);
      clearSession();
      // Clear any admin UI state stored in localStorage
      localStorage.removeItem('admin_name');
      localStorage.removeItem('admin_email');
    }
  }, []);

  // ── syncDbUser (kept for backward compat) ─────────────────────────────────────
  const syncDbUser = useCallback(async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;
    try {
      const idToken = await fbUser.getIdToken(true);
      const data = await callLoginApi(idToken, { email: fbUser.email });
      if (data.success && data.user) {
        setDbUser(data.user);
        persistSession(data.user);
        return data.user;
      }
      return null;
    } catch (err) {
      console.error('syncDbUser error:', err);
      return null;
    }
  }, []);

  // ── authFetch (adds Authorization header automatically) ───────────────────────
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    
    // Attempt to get token if user is signed in
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
        headers['X-Firebase-Token'] = idToken; // fallback
      } catch (err) {
        console.error('Failed to get Firebase token for request:', err);
      }
    }
    
    return fetch(url, { ...options, headers });
  }, []);

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      dbUser,
      loading,
      authError,
      setAuthError,
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle,
      completeGoogleProfile,
      logout,
      syncDbUser,
      authFetch,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
