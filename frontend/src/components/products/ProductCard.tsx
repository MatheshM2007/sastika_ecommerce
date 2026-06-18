'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_URL } from '@/lib/api';
import { formatINR, discountPercent, imageSrc } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { refreshCart, setDrawerOpen } = useCart();
  const router = useRouter();
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

  const buyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      router.push('/login?redirect=/checkout');
      return;
    }
    try {
      await api.post('/cart/add', { product_id: product.id, quantity: 1 });
      await refreshCart();
      router.push('/checkout');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to process';
      toast.error(msg);
    }
  };

  return (
    <div className="group bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-200 hover:-translate-y-1">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-700 overflow-hidden">
          <Image
            src={imageSrc(product.image_url, API_URL)}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {off > 0 && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-xs font-bold px-2 py-0.5 rounded">
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
      </Link>
      <div className="p-3.5">
        <Link href={`/products/${product.id}`}>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-medium text-purple-300 bg-purple-900/40 px-1.5 py-0.5 rounded">
              {product.category}
            </span>
          </div>
          <h3 className="text-sm font-medium line-clamp-2 text-gray-200 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-purple-300">{formatINR(Number(product.price))}</span>
            {Number(product.mrp) > Number(product.price) && (
              <span className="text-xs text-gray-500 line-through">
                {formatINR(Number(product.mrp))}
              </span>
            )}
          </div>
          {Number(product.price) >= 299 && (
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> Free Delivery
            </p>
          )}
        </Link>
        {/* Buy Now Button */}
        <button
          onClick={buyNow}
          className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-500 hover:from-purple-600 hover:via-violet-500 hover:to-fuchsia-400 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-purple-800/40 active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5" />
          Buy Now
        </button>
      </div>
    </div>
  );
}