'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add items'); return; }
    setAdding(true);
    try {
      await api.post('/cart/add', { product_id: product.id, quantity: 1 });
      await refreshCart();
      setDrawerOpen(true);
      toast.success('Added to cart');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); router.push('/login?redirect=/checkout'); return; }
    try {
      await api.post('/cart/add', { product_id: product.id, quantity: 1 });
      await refreshCart();
      router.push('/checkout');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to process');
    }
  };

  return (
    <div className="group relative glass-card overflow-hidden">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-[18px] bg-white/5">
          <Image
            src={imageSrc(product.image_url, API_URL)}
            alt={product.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width:768px) 50vw, 25vw"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount badge */}
          {off > 0 && (
            <span className="badge-sale absolute top-3 left-3 shadow-lg">
              {off}% OFF
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setWished(!wished); toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist'); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Heart className={`w-4 h-4 transition-colors ${wished ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>

          {/* Add to cart on hover */}
          <button
            type="button"
            onClick={addToCart}
            disabled={adding}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full gradient-brand flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          {/* Category */}
          <span className="text-[10px] font-semibold tracking-widest uppercase text-purple-400/80 mb-1.5 block">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="text-sm font-medium line-clamp-2 text-white/90 leading-snug min-h-[2.5rem] group-hover:text-white transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-base font-bold gradient-brand-text">{formatINR(Number(product.price))}</span>
            {Number(product.mrp) > Number(product.price) && (
              <span className="text-xs text-white/30 line-through">{formatINR(Number(product.mrp))}</span>
            )}
          </div>

          {/* Free delivery */}
          {Number(product.price) >= 299 && (
            <p className="text-[10px] text-emerald-400/80 mt-1.5 flex items-center gap-1">
              <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Free Delivery
            </p>
          )}
        </Link>

        {/* Buy Now */}
        <button
          onClick={buyNow}
          className="mt-3.5 w-full py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Zap className="w-3.5 h-3.5 relative z-10" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
