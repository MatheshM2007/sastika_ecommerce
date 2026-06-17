'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Phone, Chrome } from 'lucide-react';
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
        <Chrome className="w-5 h-5 text-fuchsia-400" />
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