import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sastika — Royal Indian Fashion & Lifestyle',
  description: 'Premium ethnic wear, kurtis, sarees & more. Free delivery on orders above ₹299.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-black text-white antialiased`}>
        <AuthProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: {
                  background: 'rgba(15,15,15,0.95)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#f5f5f7',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
