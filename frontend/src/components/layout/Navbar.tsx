'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, User, LogOut, Package, Crown, Sparkles } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { SearchBar } from './SearchBar';

export function Navbar() {
  const { user, logout } = useAuth();
  const { count, setDrawerOpen } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-5">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
          <div className="relative logo-shine w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 pulse-ring">
            <Crown className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />
          </div>
          <span
            className="font-display font-bold text-xl tracking-tight gradient-brand-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            Sastika
          </span>
        </Link>

        {/* Search */}
        <Suspense fallback={<div className="flex-1 h-10 bg-white/5 rounded-full animate-pulse" />}>
          <SearchBar className="hidden sm:block" />
        </Suspense>

        {/* Nav */}
        <nav className="flex items-center gap-1 ml-auto">
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white font-medium px-3.5 py-2 rounded-xl hover:bg-white/[0.06] transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Shop
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-white/[0.06] text-white/70 hover:text-white transition-all duration-200 group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold rounded-full gradient-brand text-white px-1 shadow-lg animate-bounce">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <>
              <Link
                href="/orders"
                className="p-2.5 rounded-xl hover:bg-white/[0.06] text-white/70 hover:text-white transition-all duration-200 group"
                title="Orders"
              >
                <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/profile"
                className="p-2.5 rounded-xl hover:bg-white/[0.06] text-white/70 hover:text-white transition-all duration-200 group"
                title="Profile"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-xl hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-all duration-200 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-xl btn-glass font-medium transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-xl btn-primary font-semibold ml-1"
              >
                <span>Sign up</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-5 pb-3">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
    </header>
  );
}
