'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Image,
  LogOut,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-violet-400' },
  { href: '/admin/products', label: 'Products', icon: Package, color: 'text-blue-400' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, color: 'text-emerald-400' },
  { href: '/admin/users', label: 'Users', icon: Users, color: 'text-pink-400' },
  { href: '/admin/banners', label: 'Banners', icon: Image, color: 'text-amber-400' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: 'text-cyan-400' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <aside
      className="w-60 shrink-0 min-h-screen flex flex-col p-5"
      style={{
        background: 'rgba(5,5,5,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <Link href="/admin/dashboard" className="flex items-center gap-3 mb-10 group">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center logo-shine shadow-lg group-hover:scale-110 transition-transform">
          <Crown style={{ width: 18, height: 18, color: 'white' }} />
        </div>
        <div>
          <span
            className="font-display font-bold text-base gradient-brand-text block"
            style={{ letterSpacing: '-0.02em' }}
          >
            Sastika
          </span>
          <span className="text-[10px] text-white/30 tracking-widest uppercase">Admin Portal</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {links.map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
              style={{
                background: active ? 'rgba(168,85,247,0.12)' : 'transparent',
                color: active ? '#e9d5ff' : 'rgba(255,255,255,0.45)',
                border: active ? '1px solid rgba(168,85,247,0.2)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                }
              }}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full gradient-brand" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-purple-400' : color} transition-colors`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="divider-glow my-4" />

      {/* Logout */}
      <button
        type="button"
        onClick={() => { logout(); router.push('/admin/login'); }}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full"
        style={{ color: 'rgba(248,113,113,0.7)', background: 'transparent' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
          (e.currentTarget as HTMLElement).style.color = 'rgb(248,113,113)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.7)';
        }}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </aside>
  );
}
