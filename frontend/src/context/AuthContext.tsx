'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { AuthError } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  googleLogin: () => Promise<void>;
  sendPhoneOTP: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOTP: (phone: string, otp: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('sastika_token');
    const u = localStorage.getItem('sastika_user');
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem('sastika_user');
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('sastika_token', t);
    localStorage.setItem('sastika_user', JSON.stringify(u));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.data.user, data.data.token);
      return data.data.user as User;
    },
    [persist]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post('/auth/register', { name, email, password });
      persist(data.data.user, data.data.token);
      return data.data.user as User;
    },
    [persist]
  );

  const handleSupabaseAuth = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) throw error || new Error('No session');

    // Send Supabase session to our backend for verification & user creation
    const { data } = await api.post('/auth/supabase', {
      access_token: session.access_token,
      email: session.user.email,
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      phone: session.user.phone,
    });

    persist(data.data.user, data.data.token);
    return data.data.user as User;
  }, [persist]);

  const googleLogin = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, []);

  const sendPhoneOTP = useCallback(async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      const authErr = err as AuthError;
      return { success: false, error: authErr.message || 'Failed to send OTP' };
    }
  }, []);

  const verifyPhoneOTP = useCallback(async (phone: string, otp: string) => {
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    if (error) throw error;
    if (!session) throw new Error('Verification failed');

    // Send to our backend
    const { data } = await api.post('/auth/supabase', {
      access_token: session.access_token,
      email: session.user.email || `${phone}@phone.sastika.in`,
      name: 'User',
      phone,
    });

    persist(data.data.user, data.data.token);
    return data.data.user as User;
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sastika_token');
    localStorage.removeItem('sastika_user');
    supabase.auth.signOut();
  }, []);

  const updateUser = useCallback((u: User) => {
    setUser(u);
    localStorage.setItem('sastika_user', JSON.stringify(u));
  }, []);

  const value = useMemo(
    () => ({
      user, token, loading,
      login, register, googleLogin,
      sendPhoneOTP, verifyPhoneOTP,
      logout, updateUser,
    }),
    [user, token, loading, login, register, googleLogin, sendPhoneOTP, verifyPhoneOTP, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}