'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/orders');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/orders')
      .then((res) => setOrders(res.data.data.orders))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Order History</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-slate-500 text-center py-12">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-fuchsia-500/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-fuchsia-400">
                    {formatINR(Number(order.total_amount))}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{order.status}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Payment: {order.payment_status} · Tracking: {order.tracking_number || '—'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
