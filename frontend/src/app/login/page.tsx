'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const { login, googleLogin, sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch {
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setPhoneLoading(true);
    const result = await sendPhoneOTP(`+91${phone}`);
    setPhoneLoading(false);
    if (result.success) {
      setOtpSent(true);
      toast.success('OTP sent to your phone!');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      const user = await verifyPhoneOTP(`+91${phone}`, otp);
      toast.success('Login successful!');
      const redirect = params.get('redirect') || '/';
      router.push(user.role === 'admin' ? '/admin/dashboard' : redirect);
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors text-sm font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <div className="flex-1 h-px bg-slate-800" />
        OR
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Method Tabs */}
      <div className="flex rounded-xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            loginMethod === 'email' ? 'gradient-brand text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
        <button
          onClick={() => setLoginMethod('phone')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            loginMethod === 'phone' ? 'gradient-brand text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          <Phone className="w-4 h-4" /> Phone OTP
        </button>
      </div>

      {/* Email Login Form */}
      {loginMethod === 'email' && (
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
            className="w-full py-3 rounded-xl gradient-brand text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      )}

      {/* Phone OTP Login */}
      {loginMethod === 'phone' && (
        <div className="space-y-4">
          {!otpSent ? (
            <>
              <div className="flex gap-2">
                <span className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-sm flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Phone number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={phoneLoading}
                className="w-full py-3 rounded-xl gradient-brand text-white font-medium disabled:opacity-50"
              >
                {phoneLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-400 text-center">
                OTP sent to <span className="text-white">+91 {phone}</span>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-fuchsia-500 focus:outline-none text-center text-lg tracking-widest"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-brand text-white font-medium disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="text-sm text-slate-500 hover:text-slate-300 text-center w-full"
              >
                Change phone number
              </button>
            </>
          )}
        </div>
      )}
    </div>
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