'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      const redirect = params.get('redirect') || '/';
      router.push(user.role === 'admin' ? '/admin/dashboard' : redirect);
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
    <form onSubmit={submit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl gradient-brand text-white font-medium"
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-center mb-2">Welcome to Sastika</h1>
      <p className="text-slate-400 text-center text-sm mb-8">Login to shop ethnic wear at best prices</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="text-center text-sm text-slate-400 mt-6">
        New here?{' '}
        <Link href="/register" className="text-fuchsia-400 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
