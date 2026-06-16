'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { api } from '@/lib/api';
import { formatINR } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<{
    ordersByDay: Array<{ date: string; orders: number }>;
    revenueByDay: Array<{ date: string; revenue: number }>;
    topCategories: Array<{ category: string; sales: number }>;
  } | null>(null);

  useEffect(() => {
    api.get('/admin/analytics', { params: { days } }).then((res) => setData(res.data.data));
  }, [days]);

  if (!data) {
    return <div className="animate-pulse h-64 bg-slate-900 rounded-xl" />;
  }

  const ordersChart = data.ordersByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    orders: d.orders,
  }));

  const revenueChart = data.revenueByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    revenue: d.revenue,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 h-72">
          <h2 className="text-sm text-slate-400 mb-4">Orders per day</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={ordersChart}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="orders" fill="#db2777" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 h-72">
          <h2 className="text-sm text-slate-400 mb-4">Revenue per day</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={revenueChart}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                formatter={(v: number) => formatINR(v)}
                contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-800">
        <h2 className="text-sm text-slate-400 mb-4">Top categories by sales</h2>
        <div className="space-y-2">
          {data.topCategories.map((c) => (
            <div key={c.category} className="flex justify-between text-sm">
              <span>{c.category}</span>
              <span className="text-fuchsia-400">{c.sales} units sold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
