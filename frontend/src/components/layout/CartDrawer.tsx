'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_URL } from '@/lib/api';
import { formatINR, imageSrc } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    drawerOpen,
    setDrawerOpen,
    refreshCart,
  } = useCart();

  const updateQty = async (productId: number, quantity: number) => {
    try {
      await api.put('/cart/update', { product_id: productId, quantity });
      await refreshCart();
    } catch {
      toast.error('Could not update quantity');
    }
  };

  const remove = async (productId: number) => {
    try {
      await api.delete('/cart/remove', { data: { product_id: productId } });
      await refreshCart();
      toast.success('Removed from cart');
    } catch {
      toast.error('Could not remove item');
    }
  };

  if (!drawerOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-fuchsia-400" />
            Your Cart ({items.length})
          </h2>
          <button type="button" onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-slate-500 py-12">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-slate-800 pb-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                  <Image
                    src={imageSrc(item.image_url, API_URL)}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                  <p className="text-sm text-fuchsia-400 mt-1">{formatINR(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product_id, Math.max(1, item.quantity - 1))}
                      className="p-1 rounded border border-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 rounded border border-slate-700 disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.product_id)}
                      className="ml-auto text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Delivery</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-fuchsia-400">{formatINR(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center py-3 rounded-xl gradient-brand font-medium text-white"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center py-2 text-sm text-slate-400 hover:text-white"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
