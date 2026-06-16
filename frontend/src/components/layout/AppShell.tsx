'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { CartDrawer } from './CartDrawer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <CartDrawer />
    </>
  );
}
