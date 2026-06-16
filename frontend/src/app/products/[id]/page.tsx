'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { api, API_URL } from '@/lib/api';
import { formatINR, discountPercent, imageSrc } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ProductGridSkeleton } from '@/components/ui/ProductSkeleton';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCart, setDrawerOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    try {
      await api.post('/cart/add', { product_id: product!.id, quantity: qty });
      await refreshCart();
      setDrawerOpen(true);
      toast.success('Added to cart');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductGridSkeleton count={1} />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center py-16 text-slate-500">Product not found</p>;
  }

  const off = discountPercent(Number(product.price), Number(product.mrp));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-800">
          <Image
            src={imageSrc(product.image_url, API_URL)}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
          {off > 0 && (
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded">
              {off}% OFF
            </span>
          )}
        </div>
        <div>
          <p className="text-fuchsia-400 text-sm">{product.category}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold mt-2">{product.title}</h1>
          <p className="text-slate-400 mt-4 leading-relaxed">{product.description}</p>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-3xl font-bold">{formatINR(Number(product.price))}</span>
            {Number(product.mrp) > Number(product.price) && (
              <>
                <span className="text-lg text-slate-500 line-through">
                  {formatINR(Number(product.mrp))}
                </span>
                <span className="text-emerald-400 text-sm">
                  Save {formatINR(Number(product.mrp) - Number(product.price))}
                </span>
              </>
            )}
          </div>

          {Number(product.price) >= 299 && (
            <p className="flex items-center gap-2 text-emerald-400 text-sm mt-3">
              <Truck className="w-4 h-4" /> Free Delivery
            </p>
          )}

          <p className="text-sm text-slate-500 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-slate-700 rounded-lg">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 hover:bg-slate-800"
              >
                −
              </button>
              <span className="px-4 py-2 min-w-[48px] text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
                className="px-4 py-2 hover:bg-slate-800 disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={product.stock < 1}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-brand text-white font-medium disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
