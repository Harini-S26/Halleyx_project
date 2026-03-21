import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import api from '../../utils/api';

export default function MonthlyRevenueTrend({ dateFilter }) {
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData,  setOrdersData]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [rv, od] = await Promise.all([
          api.get('/widgets/chart-data', { params: { type: 'revenue-by-product', dateFilter } }),
          api.get('/widgets/chart-data', { params: { type: 'orders-over-time',   dateFilter } }),
        ]);
        setRevenueData(rv.data);
        setOrdersData(od.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [dateFilter]);

  const tooltip = { contentStyle: { borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px', background: 'white' } };

  const Skeleton = () => (
    <div className="h-48 flex items-end gap-2 px-4 pb-4">
      {[70,50,85,60,90,45,75].map((h,i) => (
        <div key={i} className="flex-1 bg-zinc-100 rounded-t animate-pulse" style={{ height: `${h}%` }} />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Revenue by product */}
      <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <BarChart3 size={15} className="text-brand-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Revenue by Product</h3>
            <p className="text-[11px] text-zinc-400">Based on selected date range</p>
          </div>
        </div>
        <div className="h-48">
          {loading ? <Skeleton /> : revenueData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-zinc-400">No data yet — create orders first</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <Tooltip {...tooltip} formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Orders over time */}
      <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <TrendingUp size={15} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Orders Over Time</h3>
            <p className="text-[11px] text-zinc-400">Order volume trend</p>
          </div>
        </div>
        <div className="h-48">
          {loading ? <Skeleton /> : ordersData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-zinc-400">No order history yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                <Tooltip {...tooltip} formatter={(v) => [v, 'Orders']} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
