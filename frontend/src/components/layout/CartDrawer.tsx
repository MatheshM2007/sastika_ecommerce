'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Crown } from 'lucide-react';
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
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700/50 z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2 text-gray-100">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            Your Cart ({items.length})
          </h2>
          <button type="button" onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-gray-700/50 pb-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700 shrink-0">
                  <Image
                    src={imageSrc(item.image_url, API_URL)}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 text-gray-200">{item.title}</p>
                  <p className="text-sm text-purple-300 mt-1">{formatINR(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product_id, Math.max(1, item.quantity - 1))}
                      className="p-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center text-gray-200">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.product_id)}
                      className="ml-auto text-xs text-red-400 hover:text-red-300"
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
          <div className="p-4 border-t border-gray-700/50 space-y-3 bg-gray-800/60">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-200">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery</span>
              <span className="text-gray-200">{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-600">
              <span className="text-gray-100">Total</span>
              <span className="gradient-brand bg-clip-text text-transparent">{formatINR(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center py-3 rounded-xl btn-primary"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center py-2 text-sm text-gray-400 hover:text-gray-300"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}