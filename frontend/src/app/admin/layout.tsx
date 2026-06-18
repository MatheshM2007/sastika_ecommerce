'use client';

import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) return <>{children}</>;

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-black">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {/* Top bar */}
          <div
            className="px-8 py-5 flex items-center justify-between sticky top-0 z-10"
            style={{
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="text-xs text-white/25 font-mono">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
          {/* Content */}
          <div className="px-8 py-8">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
