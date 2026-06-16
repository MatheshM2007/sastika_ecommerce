'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { api, API_URL } from '@/lib/api';
import { formatINR, imageSrc } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.data.order));
  }, [id, user]);

  if (!order) {
    return <div className="p-8 animate-pulse h-64 bg-slate-900 rounded-xl max-w-4xl mx-auto mt-8" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-2">Order #{order.id}</h1>
      <p className="text-slate-400 text-sm mb-8">
        Placed on {new Date(order.created_at).toLocaleString('en-IN')}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-4">Track Order</h2>
          <OrderTimeline currentStatus={order.status} />
          {order.tracking_number && (
            <p className="mt-4 text-sm text-slate-400">
              Tracking ID: <span className="text-white font-mono">{order.tracking_number}</span>
            </p>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border border-slate-800">
                {item.image_url && (
                  <div className="relative w-14 h-14 rounded overflow-hidden bg-slate-800">
                    <Image src={imageSrc(item.image_url, API_URL)} alt="" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    Qty {item.quantity} × {formatINR(Number(item.price))}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-lg font-bold text-fuchsia-400">
            Total: {formatINR(Number(order.total_amount))}
          </p>
          <p className="text-sm text-slate-500 mt-2">Payment: {order.payment_status}</p>
        </div>
      </div>
    </div>
  );
}
