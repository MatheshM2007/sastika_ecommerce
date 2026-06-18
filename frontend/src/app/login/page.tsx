'use client';

import { useState, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Phone, QrCode, KeyRound, Crown, Lock } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import {
  isPasskeySupported,
  registerPasskey,
  authenticateWithPasskey,
  generateLoginQR,
} from './passkeyflow';

function LoginForm() {
  const { login, googleLogin, sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'passkey'>('email');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  // Check passkey support on mount
  useState(() => {
    isPasskeySupported().then(setPasskeyAvailable);
  });

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
      {/* Brand Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand mb-4">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-100">Welcome to Sastika</h2>
        <p className="text-gray-400 text-sm mt-1">Login to shop royal ethnic wear</p>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-600 bg-gray-800/60 hover:bg-gray-700 transition-colors text-sm font-medium text-gray-200 shadow-sm"
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
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="flex-1 h-px bg-gray-700" />
        OR
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      {/* Method Tabs */}
      <div className="flex rounded-xl border border-gray-600 overflow-hidden bg-gray-800/40">
        <button
          onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            loginMethod === 'email' ? 'gradient-brand text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Mail className="w-4 h-4" /> Email
        </button>
        <button
          onClick={() => setLoginMethod('phone')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            loginMethod === 'phone' ? 'gradient-brand text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Phone className="w-4 h-4" /> Phone OTP
        </button>
        <button
          onClick={() => setLoginMethod('passkey')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            loginMethod === 'passkey' ? 'gradient-brand text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Passkey / QR
        </button>
      </div>

      {/* Email Login Form */}
      {loginMethod === 'email' && (
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pl-10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-primary disabled:opacity-50"
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
                <span className="px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-sm flex items-center font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Phone number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="input-field flex-1"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={phoneLoading}
                className="w-full py-3 rounded-xl btn-primary disabled:opacity-50"
              >
                {phoneLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 text-center">
                OTP sent to <span className="text-purple-300 font-medium">+91 {phone}</span>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-lg tracking-widest"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 rounded-xl btn-primary disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="text-sm text-gray-400 hover:text-gray-300 text-center w-full"
              >
                Change phone number
              </button>
            </>
          )}
        </div>
      )}

      {/* Passkey / QR Login */}
      {loginMethod === 'passkey' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            Use a <strong className="text-purple-300">passkey</strong> to log in instantly
            with your fingerprint, face, or device PIN.
          </p>

          {!passkeyAvailable ? (
            <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
              <p className="text-xs text-amber-300 text-center">
                ⚠️ Passkey not available on this device.
                Use <strong>QR Code</strong> below to log in from another device.
              </p>
            </div>
          ) : (
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const result = await authenticateWithPasskey();
                  if (result) {
                    toast.success('Passkey authentication successful!');
                    const redirect = params.get('redirect') || '/';
                    router.push(redirect);
                  }
                } catch (err: unknown) {
                  const msg = (err as Error)?.message || 'Passkey authentication failed';
                  toast.error(msg);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-5 h-5" />
              {loading ? 'Authenticating...' : 'Login with Passkey'}
            </button>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex-1 h-px bg-gray-700" />
            OR SCAN QR
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                const url = generateLoginQR();
                setQrUrl(url);
              }}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium"
            >
              <QrCode className="w-5 h-5" />
              {qrUrl ? 'Refresh QR Code' : 'Generate QR Code'}
            </button>
            {qrUrl && (
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 shadow-sm">
                <QRCodeCanvas value={qrUrl} size={180} />
              </div>
            )}
            {qrUrl && (
              <p className="text-xs text-gray-400 text-center">
                Scan this QR with your phone camera to log in instantly.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-gray-800 via-gray-900 to-black px-4 py-12">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl shadow-purple-900/30 border border-gray-700/50 p-8">
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-gray-400 mt-6">
          New here?{' '}
          <Link href="/register" className="text-purple-400 font-medium hover:text-purple-300 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}