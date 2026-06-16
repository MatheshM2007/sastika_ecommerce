'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_URL } from '@/lib/api';
import { formatINR, imageSrc } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, deliveryFee, total, refreshCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/cart');
  }, [user, authLoading, router]);

  const updateQty = async (productId: number, quantity: number) => {
    await api.put('/cart/update', { product_id: productId, quantity });
    await refreshCart();
  };

  const remove = async (productId: number) => {
    await api.delete('/cart/remove', { data: { product_id: productId } });
    await refreshCart();
    toast.success('Removed');
  };

  if (authLoading) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">Your cart is empty</p>
          <Link href="/products" className="text-fuchsia-400 hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <Image src={imageSrc(item.image_url, API_URL)} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-fuchsia-400 mt-1">{formatINR(item.price)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button type="button" onClick={() => updateQty(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 border border-slate-700 rounded">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="p-1 border border-slate-700 rounded">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => remove(item.product_id)} className="ml-auto text-sm text-red-400">
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-semibold">{formatINR(item.line_total)}</p>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 h-fit space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Delivery</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-slate-800 pt-3">
              <span>Total</span>
              <span className="text-fuchsia-400">{formatINR(total)}</span>
            </div>
            <Link href="/checkout" className="block w-full text-center py-3 rounded-xl gradient-brand text-white font-medium mt-4">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
