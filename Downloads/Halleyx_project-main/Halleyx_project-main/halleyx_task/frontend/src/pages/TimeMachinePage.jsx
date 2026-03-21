import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Minus, RefreshCw, ArrowUpRight, ArrowDownRight, Clock3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PERIODS = [
  { label: 'Last 7 days',  value: '7d',  days: 7  },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 90 days', value: '90d', days: 90 },
];

const Skeleton = ({ h = 'h-8', w = 'w-full' }) => (
  <div className={`${h} ${w} bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse`} />
);

export default function TimeMachinePage() {
  const [period,  setPeriod]  = useState('30d');
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComparison(); }, [period]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const days = PERIODS.find(p => p.value === period)?.days || 30;
      const now  = Date.now();
      const periodStart = new Date(now - days * 86400000);
      const prevStart   = new Date(now - 2 * days * 86400000);

      const [currentOrders, prevOrders] = await Promise.all([
        api.get('/orders', { params: { dateFilter: period === '7d' ? '7days' : period === '30d' ? '30days' : '90days' } }),
        api.get('/orders'),
      ]);

      const all = prevOrders.data;
      const current = currentOrders.data;
      const previous = all.filter(o => {
        const d = new Date(o.createdAt);
        return d >= prevStart && d < periodStart;
      });

      const calcStats = (orders) => ({
        revenue:   orders.reduce((s, o) => s + Number(o.totalAmount), 0),
        orders:    orders.length,
        completed: orders.filter(o => o.status === 'Completed').length,
        pending:   orders.filter(o => o.status === 'Pending').length,
        avgOrder:  orders.length ? orders.reduce((s,o) => s+Number(o.totalAmount),0) / orders.length : 0,
      });

      const cur  = calcStats(current);
      const prev = calcStats(previous);

      const pct = (a, b) => b === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - b) / b) * 100);

      // Build timeline chart data (group by day)
      const buildTimeline = (orders) => {
        const map = {};
        orders.forEach(o => {
          const d = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!map[d]) map[d] = { revenue: 0, orders: 0 };
          map[d].revenue += Number(o.totalAmount);
          map[d].orders++;
        });
        return Object.entries(map).map(([name, v]) => ({ name, ...v }));
      };

      // Product breakdown
      const buildProducts = (orders) => {
        const map = {};
        orders.forEach(o => {
          const name = o.product.replace(' Mbps','').replace(' Mobile Plan','').replace(' Package','').replace(' Internet','');
          map[name] = (map[name] || 0) + Number(o.totalAmount);
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
      };

      setData({
        cur, prev,
        changes: {
          revenue:   pct(cur.revenue,   prev.revenue),
          orders:    pct(cur.orders,    prev.orders),
          completed: pct(cur.completed, prev.completed),
          pending:   pct(cur.pending,   prev.pending),
        },
        curTimeline:  buildTimeline(current),
        prevTimeline: buildTimeline(previous),
        curProducts:  buildProducts(current),
        prevProducts: buildProducts(previous),
      });
    } catch (err) {
      toast.error('Failed to load comparison data');
    } finally { setLoading(false); }
  };

  const ChangeChip = ({ pct }) => {
    if (pct === 0) return <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full"><Minus size={10} /> 0%</span>;
    const up = pct > 0;
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400'}`}>
        {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(pct)}%
      </span>
    );
  };

  const statCards = data ? [
    { label: 'Revenue', cur: `$${data.cur.revenue.toLocaleString()}`, prev: `$${data.prev.revenue.toLocaleString()}`, pct: data.changes.revenue, color: '#6366f1' },
    { label: 'Orders', cur: data.cur.orders, prev: data.prev.orders, pct: data.changes.orders, color: '#22d3ee' },
    { label: 'Completed', cur: data.cur.completed, prev: data.prev.completed, pct: data.changes.completed, color: '#10b981' },
    { label: 'Pending', cur: data.cur.pending, prev: data.prev.pending, pct: data.changes.pending, color: '#f59e0b' },
    { label: 'Avg Order Value', cur: `$${Math.round(data.cur.avgOrder).toLocaleString()}`, prev: `$${Math.round(data.prev.avgOrder).toLocaleString()}`, pct: Math.round(data.changes.revenue - data.changes.orders), color: '#a78bfa' },
  ] : [];

  // Key insight: biggest absolute change
  const insight = data ? (() => {
    const entries = Object.entries(data.changes);
    const max = entries.reduce((a, b) => Math.abs(b[1]) > Math.abs(a[1]) ? b : a, entries[0]);
    return max;
  })() : null;

  const tooltip = { contentStyle: { borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px', background: '#fff' } };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <Clock3 size={20} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Time Machine</h1>
            <p className="text-sm text-zinc-400">Compare current vs previous period</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${period === p.value ? 'bg-brand-600 text-white shadow-brand' : 'bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
              {p.label}
            </button>
          ))}
          <button onClick={fetchComparison} className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Key insight banner */}
      {!loading && insight && Math.abs(insight[1]) > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-2xl border ${insight[1] > 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'}`}>
          {insight[1] > 0 ? <TrendingUp size={18} className="text-emerald-600 flex-shrink-0" /> : <TrendingDown size={18} className="text-red-500 flex-shrink-0" />}
          <p className={`text-sm font-semibold ${insight[1] > 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            <span className="font-black">{insight[1] > 0 ? '↑' : '↓'} {Math.abs(insight[1])}%</span> change in{' '}
            <span className="capitalize">{insight[0]}</span> compared to the previous period
            {insight[1] > 0 ? ' — great progress! 🎉' : ' — needs attention.'}
          </p>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 space-y-3">
                <Skeleton h="h-3" w="w-20" /><Skeleton h="h-7" w="w-24" /><Skeleton h="h-4" w="w-16" />
              </div>
            ))
          : statCards.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 hover:shadow-card-hover transition-shadow">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{s.label}</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-none mb-2">{s.cur}</p>
                <div className="flex items-center gap-2">
                  <ChangeChip pct={s.pct} />
                  <span className="text-xs text-zinc-400">prev: {s.prev}</span>
                </div>
              </motion.div>
            ))
        }
      </div>

      {/* Charts comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue over time */}
        <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">Revenue Comparison</h3>
          <div className="h-52">
            {loading ? (
              <div className="h-full flex items-end gap-2">
                {[60,45,80,55,90,40,75].map((h,i)=><div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-t animate-pulse" style={{height:`${h}%`}} />)}
              </div>
            ) : (data?.curProducts?.length || 0) === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-zinc-400">No data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(() => {
                  const merged = {};
                  (data.curProducts || []).forEach(d => { merged[d.name] = { name: d.name, current: d.value, previous: 0 }; });
                  (data.prevProducts|| []).forEach(d => { if (!merged[d.name]) merged[d.name] = { name: d.name, current: 0, previous: 0 }; merged[d.name].previous = d.value; });
                  return Object.values(merged);
                })()} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <Tooltip {...tooltip} formatter={v => [`$${v.toLocaleString()}`]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="current"  name="Current"  fill="#6366f1" radius={[3,3,0,0]} />
                  <Bar dataKey="previous" name="Previous" fill="#a5b4fc" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Orders over time */}
        <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">Order Volume Trend</h3>
          <div className="h-52">
            {loading ? (
              <div className="h-full flex items-end gap-2">
                {[50,70,40,85,60,75,45].map((h,i)=><div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-t animate-pulse" style={{height:`${h}%`}} />)}
              </div>
            ) : (data?.curTimeline?.length || 0) === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-zinc-400">No timeline data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.curTimeline} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <Tooltip {...tooltip} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Period labels */}
      {!loading && data && (
        <div className="flex items-center gap-3 text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded-xl px-4 py-2.5 border border-zinc-100 dark:border-zinc-800">
          <Calendar size={13} />
          <span>Comparing last <strong className="text-zinc-600 dark:text-zinc-300">{PERIODS.find(p=>p.value===period)?.days} days</strong> vs the same length period before</span>
        </div>
      )}
    </div>
  );
}
