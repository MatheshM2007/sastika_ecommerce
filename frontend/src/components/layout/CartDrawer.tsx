'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Crown, ArrowRight, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_URL } from '@/lib/api';
import { formatINR, imageSrc } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const { items, subtotal, deliveryFee, total, drawerOpen, setDrawerOpen, refreshCart } = useCart();

  const updateQty = async (productId: number, quantity: number) => {
    try {
      await api.put('/cart/update', { product_id: productId, quantity });
      await refreshCart();
    } catch { toast.error('Could not update quantity'); }
  };

  const remove = async (productId: number) => {
    try {
      await api.delete('/cart/remove', { data: { product_id: productId } });
      await refreshCart();
      toast.success('Removed from cart');
    } catch { toast.error('Could not remove item'); }
  };

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 flex flex-col"
        style={{
          background: 'rgba(8,8,8,0.98)',
          backdropFilter: 'blur(40px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm">Your Cart</h2>
              <p className="text-[10px] text-white/30">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
              <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/40 text-sm mb-1">Your cart is empty</p>
              <p className="text-white/20 text-xs">Add items to get started</p>
              <Link
                href="/products"
                onClick={() => setDrawerOpen(false)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl transition-all duration-200 group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Image src={imageSrc(item.image_url, API_URL)} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/80 line-clamp-2 leading-snug">{item.title}</p>
                  <p className="text-sm font-bold gradient-brand-text mt-1">{formatINR(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product_id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold text-white w-5 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors disabled:opacity-30"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.product_id)}
                      className="ml-auto text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)' }}>
            {/* Delivery note */}
            {deliveryFee === 0 && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 px-3 py-2 rounded-xl" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
                <Truck className="w-3.5 h-3.5 shrink-0" /> Free delivery applied!
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/40">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-400' : ''}>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-white">Total</span>
                <span className="gradient-brand-text">{formatINR(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl btn-primary text-sm font-semibold"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </Link>
            <Link
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
