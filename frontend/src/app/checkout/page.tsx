'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Crown, CreditCard, Banknote, Shield } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type PaymentMethod = 'razorpay' | 'cod';

const PAYMENT_OPTIONS = [
  { id: 'razorpay', label: 'Online Payment (UPI / Cards / Net Banking)', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote className="w-5 h-5" /> },
] as const;

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, refreshCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
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
      const { data } = await api.post('/orders', {
        shipping_address: form,
        payment_method: paymentMethod,
      });
      const { order, razorpay, payment_mode } = data.data;

      if (paymentMethod === 'cod' || !razorpay) {
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
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setSubmitting(false);
          },
        },
        prefill: {
          name: form.fullName,
          email: user?.email || '',
          contact: form.phone,
        },
        theme: { color: '#7c3aed' },
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
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-800 via-gray-900 to-black py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-100">Checkout</h1>
              <p className="text-sm text-gray-400">Complete your royal purchase</p>
            </div>
          </div>

          <p className="text-purple-300 font-semibold mb-6 text-lg">
            Order total: {formatINR(total)}
          </p>

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
                <label className="block text-sm text-gray-300 mb-1 font-medium">{label}</label>
                <input
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  required={name !== 'addressLine2'}
                  className="input-field"
                />
              </div>
            ))}

            {/* Payment Method Selection */}
            <div className="pt-4">
              <label className="block text-sm text-gray-300 mb-3 font-medium">Payment Method</label>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === opt.id
                        ? 'border-purple-500 bg-purple-900/30 shadow-sm'
                        : 'border-gray-600 bg-gray-800/60 hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id as PaymentMethod)}
                      className="accent-purple-500"
                    />
                    <span className="text-purple-300">{opt.icon}</span>
                    <span className="text-sm text-gray-200 font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Info Box */}
            {paymentMethod === 'razorpay' && (
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-300 space-y-2">
                <p className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Online Payment Options via Razorpay:
                </p>
                <div className="grid grid-cols-2 gap-2 text-gray-400">
                  <span className="flex items-center gap-1.5">🔵 <span>UPI (GPay, PhonePe, Paytm)</span></span>
                  <span className="flex items-center gap-1.5">💳 <span>Credit / Debit Cards</span></span>
                  <span className="flex items-center gap-1.5">🏦 <span>Net Banking (all banks)</span></span>
                  <span className="flex items-center gap-1.5">📱 <span>EMI / Wallet</span></span>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Secured by Razorpay
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 text-sm text-amber-300 flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                Pay when your order is delivered. Available for orders up to ₹10,000.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !items.length}
              className="w-full py-3.5 rounded-xl btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting
                ? 'Processing...'
                : paymentMethod === 'cod'
                ? 'Place Order (Cash on Delivery)'
                : 'Pay Securely via Razorpay'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}