import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpWithEmail = async (email, password, userData) => {
    setAuthError('');
    try {
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
      
      // Profile is auto-created by triggers, but we can update extra fields here
      if (data.user) {
        await supabase.from('profiles').update({
          full_name_hindi: userData.full_name_hindi,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
          address: userData.address,
        }).eq('id', data.user.id);
      }
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const signInWithEmail = async (email, password) => {
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

  const signInWithPhone = async (phone) => {
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const verifyOTP = async (phone, token) => {
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const signInWithGoogle = async () => {
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const signOut = async () => {
    setAuthError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email) => {
    setAuthError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    }
  };

  const updateProfile = async (userData) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
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

  const getCurrentUser = () => {
    return { ...user, profile };
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
      signInWithPhone,
      verifyOTP,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
      getCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
