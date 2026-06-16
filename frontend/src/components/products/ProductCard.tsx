'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_URL } from '@/lib/api';
import { formatINR, discountPercent, imageSrc } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { refreshCart, setDrawerOpen } = useCart();
  const off = discountPercent(Number(product.price), Number(product.mrp));

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items');
      return;
    }
    try {
      await api.post('/cart/add', { product_id: product.id, quantity: 1 });
      await refreshCart();
      setDrawerOpen(true);
      toast.success('Added to cart');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to add';
      toast.error(msg);
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group card-hover block rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden"
    >
      <div className="relative aspect-square bg-slate-800 overflow-hidden">
        <Image
          src={imageSrc(product.image_url, API_URL)}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {off > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded">
            {off}% OFF
          </span>
        )}
        <button
          type="button"
          onClick={addToCart}
          className="absolute bottom-2 right-2 p-2 rounded-full gradient-brand text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-fuchsia-400 mb-1">{product.category}</p>
        <h3 className="text-sm font-medium line-clamp-2 text-slate-100 min-h-[2.5rem]">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-white">{formatINR(Number(product.price))}</span>
          {Number(product.mrp) > Number(product.price) && (
            <span className="text-xs text-slate-500 line-through">
              {formatINR(Number(product.mrp))}
            </span>
          )}
        </div>
        {Number(product.price) >= 299 && (
          <p className="text-[10px] text-emerald-400 mt-1">Free Delivery</p>
        )}
      </div>
    </Link>
  );
}
