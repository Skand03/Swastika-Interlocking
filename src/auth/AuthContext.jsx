import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseUrl !== '' && supabaseAnonKey && supabaseAnonKey !== '');
};

// Function to create a profile if it doesn't exist, with error handling for RLS issues
const createProfileIfNotExists = async (userId, userData) => {
  try {
    // Try to insert directly first (avoids SELECT that causes recursion)
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        full_name: userData.full_name || userData.name || 'User',
        email: userData.email,
        phone: userData.phone || '',
        city: userData.city || '',
        pincode: userData.pincode || '',
        address: userData.address || '',
        role: 'customer',
        preferred_language: 'hi',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (!insertError && newProfile) {
      return newProfile;
    }

    // If insert fails with unique constraint (23505), check if it's phone or id
    if (insertError && insertError.code === '23505') {
      // Check if it's the phone number unique constraint
      if (insertError.message && insertError.message.toLowerCase().includes('phone')) {
        throw new Error('यह फोन नंबर पहले से पंजीकृत है! कृपया दूसरा फोन नंबर उपयोग करें या लॉगिन करें।');
      }
      // If it's the id unique constraint, that means profile already exists, so try to fetch it
    }

    // If insert fails (maybe profile already exists), try to fetch it with retry logic
    if (insertError && insertError.code !== '23505') {
      throw insertError;
    }

    // Try to fetch the existing profile, with multiple attempts to avoid recursion issues
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (!fetchError && existingProfile) {
          return existingProfile;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        if (attempt === 2) throw e;
      }
    }

    return null;
  } catch (err) {
    console.error('Error in createProfileIfNotExists:', err);
    throw err;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const fetchProfile = async (userId, userMetadata = null) => {
    if (!isSupabaseConfigured()) {
      setProfile(null);
      return;
    }
    try {
      // Try to fetch profile
      let profileData = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          if (!error && data) {
            profileData = data;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          if (attempt === 2) throw e;
        }
      }
      
      if (profileData) {
        setProfile(profileData);
        return;
      }
      
      // If profile not found and we have userMetadata, try to create it
      if (userMetadata) {
        const newProfile = await createProfileIfNotExists(userId, userMetadata);
        if (newProfile) {
          setProfile(newProfile);
          return;
        }
      }
      
      // If no profile found, log the user out
      await supabase.auth.signOut();
      setProfile(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      // If something goes wrong, log the user out
      await supabase.auth.signOut();
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Auth features will be limited.');
      setLoading(false);
      return;
    }

    // Get existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error getting session:', err);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, Google OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if a phone number is already in use
  const isPhoneInUse = async (phone) => {
    if (!isSupabaseConfigured()) {
      return false;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();
      
      if (error) {
        // If we get an RLS error or something, we can still proceed with the database unique constraint
        console.warn('Error checking phone number:', error);
        return false;
      }
      
      return !!data; // Return true if data exists, false otherwise
    } catch (err) {
      console.warn('Error checking phone number:', err);
      return false;
    }
  };

  // Email + Password Sign Up
  const signUpWithEmail = async (email, password, userData) => {
    if (!isSupabaseConfigured()) {
      const msg = 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
    setAuthError('');
    try {
      // First check if phone is already in use
      if (userData.phone) {
        const phoneInUse = await isPhoneInUse(userData.phone);
        if (phoneInUse) {
          const msg = 'यह फोन नंबर पहले से पंजीकृत है! कृपया दूसरा फोन नंबर उपयोग करें या लॉगिन करें।';
          setAuthError(msg);
          return { success: false, message: msg };
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
          }
        }
      });
      if (error) throw error;

      // Create profile
      if (data.user) {
        await createProfileIfNotExists(data.user.id, {
          ...userData,
          email: email
        });
      }
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Email + Password Sign In
  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured()) {
      const msg = 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Google OAuth Sign In
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      const msg = 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      setUser(null);
      setProfile(null);
      return;
    }
    setAuthError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured()) {
      const msg = 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
    setAuthError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth',
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Update profile fields in DB
  const updateProfile = async (userData) => {
    if (!user) return { success: false, message: 'Not logged in' };
    if (!isSupabaseConfigured()) {
      const msg = 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.';
      return { success: false, message: msg };
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      return { success: true, profile: data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      authError,
      setAuthError,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
      isSupabaseConfigured,
      isPhoneInUse,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
