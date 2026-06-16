'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { StatCard } from '@/components/admin/StatCard';

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: number;
    total_amount: number;
    status: string;
    payment_status: string;
    user_name: string;
    created_at: string;
  }>;
  lowStockProducts: Array<{
    id: number;
    title: string;
    stock: number;
    category: string;
    price: number;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data.data));
  }, []);

  if (!data) {
    return <div className="animate-pulse h-64 bg-slate-900 rounded-xl" />;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Total Orders" value={data.totalOrders} />
        <StatCard label="Total Revenue" value={formatINR(data.totalRevenue)} sub="Paid orders" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <h2 className="p-4 font-semibold border-b border-slate-800">Recent Orders</h2>
          <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
            {data.recentOrders.map((o) => (
              <div key={o.id} className="p-4 flex justify-between text-sm">
                <div>
                  <p className="font-medium">#{o.id} · {o.user_name}</p>
                  <p className="text-slate-500">{o.status}</p>
                </div>
                <p className="text-fuchsia-400">{formatINR(Number(o.total_amount))}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <h2 className="p-4 font-semibold border-b border-slate-800">Low Stock</h2>
          <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
            {data.lowStockProducts.length === 0 ? (
              <p className="p-4 text-slate-500 text-sm">All products well stocked</p>
            ) : (
              data.lowStockProducts.map((p) => (
                <div key={p.id} className="p-4 flex justify-between text-sm">
                  <p className="line-clamp-1">{p.title}</p>
                  <span className="text-amber-400 shrink-0 ml-2">{p.stock} left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
