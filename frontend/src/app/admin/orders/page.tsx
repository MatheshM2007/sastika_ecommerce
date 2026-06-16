'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatINR, ORDER_STATUSES } from '@/lib/utils';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => api.get('/admin/orders').then((res) => setOrders(res.data.data.orders));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.put('/orders/status', { order_id: orderId, status });
      toast.success('Status updated');
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-slate-400">
                  {order.user_name} · {order.user_email}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(order.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-fuchsia-400">
                  {formatINR(Number(order.total_amount))}
                </p>
                <p className="text-xs text-slate-500">Payment: {order.payment_status}</p>
                <p className="text-xs text-slate-500">Tracking: {order.tracking_number}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label className="text-sm text-slate-400">Status:</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
