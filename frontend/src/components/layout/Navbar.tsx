'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, User, LogOut, Package, Crown } from 'lucide-react';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { SearchBar } from './SearchBar';

export function Navbar() {
  const { user, logout } = useAuth();
  const { count, setDrawerOpen } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-display font-bold text-2xl shrink-0 flex items-center gap-2">
          <Crown className="w-5 h-5 text-purple-400" />
          <span className="gradient-brand bg-clip-text text-transparent">Sastika</span>
        </Link>

        <Suspense fallback={<div className="flex-1 h-10 bg-gray-700 rounded-full animate-pulse" />}>
          <SearchBar className="hidden sm:block" />
        </Suspense>

        <nav className="flex items-center gap-2 ml-auto">
          <Link
            href="/products"
            className="hidden md:inline text-sm text-purple-300 hover:text-purple-200 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Shop
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 rounded-lg hover:bg-gray-800 text-purple-300"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full gradient-brand text-white">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <>
              <Link href="/orders" className="p-2 rounded-lg hover:bg-gray-800 text-purple-300" title="Orders">
                <Package className="w-5 h-5" />
              </Link>
              <Link href="/profile" className="p-2 rounded-lg hover:bg-gray-800 text-purple-300" title="Profile">
                <User className="w-5 h-5" />
              </Link>
              <button type="button" onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-800 text-purple-300" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 rounded-lg border border-gray-600 text-purple-300 hover:bg-gray-800 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-1.5 rounded-lg gradient-brand text-white font-medium shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="sm:hidden px-4 pb-3">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
    </header>
  );
}