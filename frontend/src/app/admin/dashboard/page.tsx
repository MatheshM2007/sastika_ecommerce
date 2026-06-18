'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { StatCard } from '@/components/admin/StatCard';
import { Users, ShoppingCart, TrendingUp, Package, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

const STATUS_COLORS: Record<string, string> = {
  'Order Placed': 'text-blue-400 bg-blue-400/10',
  'Packed': 'text-violet-400 bg-violet-400/10',
  'Shipped': 'text-amber-400 bg-amber-400/10',
  'Out For Delivery': 'text-orange-400 bg-orange-400/10',
  'Delivered': 'text-emerald-400 bg-emerald-400/10',
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data.data));
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-xl shimmer" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl shimmer" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="h-72 rounded-2xl shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-purple-400/70 mb-1">Overview</p>
        <h1 className="font-display text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          sub="Registered accounts"
          icon={Users}
          gradient="from-violet-500 to-purple-600"
          trend={{ value: 'Growing', up: true }}
        />
        <StatCard
          label="Total Orders"
          value={data.totalOrders.toLocaleString()}
          sub="All time orders"
          icon={ShoppingCart}
          gradient="from-blue-500 to-cyan-500"
          trend={{ value: 'Active', up: true }}
        />
        <StatCard
          label="Total Revenue"
          value={formatINR(data.totalRevenue)}
          sub="From paid orders"
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-500"
          trend={{ value: 'Revenue', up: true }}
        />
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <h2 className="font-semibold text-sm text-white">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 group">
              View all <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
            {data.recentOrders.map((o) => (
              <div key={o.id} className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm font-medium text-white/80">#{o.id} · <span className="text-white/50">{o.user_name}</span></p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_COLORS[o.status] || 'text-white/40 bg-white/5'}`}>
                    {o.status}
                  </span>
                </div>
                <p className="text-sm font-semibold gradient-brand-text">{formatINR(Number(o.total_amount))}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="font-semibold text-sm text-white">Low Stock Alert</h2>
            </div>
            <Link href="/admin/products" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 group">
              Manage <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
            {data.lowStockProducts.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Package className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
                <p className="text-sm text-white/30">All products well stocked</p>
              </div>
            ) : (
              data.lowStockProducts.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm text-white/70 line-clamp-1 flex-1 mr-4">{p.title}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${p.stock <= 5 ? 'text-red-400 bg-red-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
