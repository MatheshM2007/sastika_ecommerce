'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, refreshCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/checkout');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, fullName: user.name }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', { shipping_address: form });
      const { order, razorpay, payment_mode } = data.data;

      if (payment_mode === 'cod' || !razorpay) {
        toast.success('Order placed successfully!');
        await refreshCart();
        router.push('/orders');
        return;
      }

      const options = {
        key: razorpay.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: 'Sastika',
        description: `Order #${order.id}`,
        order_id: razorpay.order_id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.post('/payments/verify', {
              order_id: order.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            await refreshCart();
            router.push('/orders');
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: form.fullName, contact: form.phone },
        theme: { color: '#db2777' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Checkout failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>
        <p className="text-fuchsia-400 font-semibold mb-6">Order total: {formatINR(total)}</p>

        <form onSubmit={placeOrder} className="space-y-4">
          {[
            ['fullName', 'Full Name'],
            ['phone', 'Phone (10 digits)'],
            ['addressLine1', 'Address Line 1'],
            ['addressLine2', 'Address Line 2 (optional)'],
            ['city', 'City'],
            ['state', 'State'],
            ['pincode', 'Pincode'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm text-slate-400 mb-1">{label}</label>
              <input
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required={name !== 'addressLine2'}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-fuchsia-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={submitting || !items.length}
            className="w-full py-3 rounded-xl gradient-brand text-white font-medium disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </form>
      </div>
    </>
  );
}
