'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        toast.error('Admin access only');
        return;
      }
      toast.success('Admin login successful');
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-800 bg-slate-900/60">
        <h1 className="font-display text-2xl font-bold text-center mb-2">Admin Portal</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Restricted access</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-brand text-white font-medium"
          >
            {loading ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
