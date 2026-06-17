'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      try {
        const { data } = await api.post('/auth/supabase', {
          access_token: session.access_token,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          phone: session.user.phone || null,
        });

        localStorage.setItem('sastika_token', data.data.token);
        localStorage.setItem('sastika_user', JSON.stringify(data.data.user));
        
        setStatus('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
      } catch {
        setStatus('Login failed. Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="animate-pulse space-y-4">
        <div className="w-12 h-12 rounded-full gradient-brand mx-auto" />
        <p className="text-slate-400">{status}</p>
      </div>
    </div>
  );
}