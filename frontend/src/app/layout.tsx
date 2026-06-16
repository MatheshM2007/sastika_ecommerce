import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Sastika — Indian Fashion & Lifestyle',
  description: 'Affordable ethnic wear, kurtis, sarees & more. Free delivery on orders above ₹299.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
            <Toaster position="top-center" richColors theme="dark" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
