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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-950 min-h-screen p-4 flex flex-col">
      <Link href="/admin/dashboard" className="font-display font-bold text-lg mb-8">
        <span className="gradient-brand bg-clip-text text-transparent">Sastika Admin</span>
      </Link>
      <nav className="space-y-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              pathname === href
                ? 'gradient-brand text-white'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push('/admin/login');
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-900 rounded-lg"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </aside>
  );
}
