import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Package, Clock, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInsights } from '../hooks/useInsights';
import { useDashboard } from '../context/DashboardContext';
import Spinner from '../components/common/Spinner';

const COLORS = ['#6366f1','#22d3ee','#10b981','#f59e0b','#f43f5e'];
const tooltip = { contentStyle: { borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px', background: '#fff' } };

export default function InsightsPage() {
  const { dateFilter }                    = useDashboard();
  const { insights, chartData, loading, refetch } = useInsights(dateFilter);
  const stats                             = insights?.stats || {};

  const STAT_CARDS = [
    { title: 'Total Revenue',   value: `$${(stats.revenue  ||0).toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-500'  },
    { title: 'Total Orders',    value: (stats.total     ||0).toLocaleString(),      icon: Package,    color: 'bg-cyan-500'    },
    { title: 'Completed',       value: (stats.completed ||0).toLocaleString(),      icon: TrendingUp, color: 'bg-emerald-500' },
    { title: 'Pending',         value: (stats.pending   ||0).toLocaleString(),      icon: Clock,      color: 'bg-amber-500'   },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Smart Insights</h1>
          <p className="text-sm text-zinc-400 mt-0.5">AI-powered analysis of your business data</p>
        </div>
        <button onClick={refetch} className="btn-secondary">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{c.title}</p>
              <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center`}>
                <c.icon size={16} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-none">{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Observations */}
      <div className="card p-6">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          AI Observations
        </h2>
        {!(insights?.insights?.length) ? (
          <p className="text-sm text-zinc-400 text-center py-8">Create some orders to generate AI insights.</p>
        ) : (
          <div className="space-y-2.5">
            {insights.insights.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium ${
                  item.type === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : item.type === 'negative' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                  : item.type === 'warning'  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
                }`}>
                <span className="text-base leading-none mt-0.5">
                  {item.type==='positive'?'↑':item.type==='negative'?'↓':item.type==='warning'?'⚠':'ℹ'}
                </span>
                {item.text}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { key: 'revenue', title: 'Revenue by Product', type: 'bar',  color: '#6366f1' },
          { key: 'orders',  title: 'Orders Over Time',   type: 'line', color: '#22d3ee' },
        ].map(({ key, title, type, color }) => (
          <div key={key} className="card p-5">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">{title}</h3>
            <div className="h-52">
              {(chartData[key]?.length||0) === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-zinc-400">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {type === 'bar' ? (
                    <BarChart data={chartData[key]} margin={{ top:5, right:5, left:-20, bottom:5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                      <XAxis dataKey="name" tick={{ fontSize:10, fill:'#a1a1aa' }} />
                      <YAxis tick={{ fontSize:10, fill:'#a1a1aa' }} />
                      <Tooltip {...tooltip} />
                      <Bar dataKey="value" fill={color} radius={[4,4,0,0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData[key]} margin={{ top:5, right:5, left:-20, bottom:5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                      <XAxis dataKey="name" tick={{ fontSize:10, fill:'#a1a1aa' }} />
                      <YAxis tick={{ fontSize:10, fill:'#a1a1aa' }} />
                      <Tooltip {...tooltip} />
                      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r:3, fill:color }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        ))}

        {/* Status Distribution */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">Order Status Distribution</h3>
          <div className="h-56">
            {(chartData.status?.length||0) === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-zinc-400">No order data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData.status} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={4}>
                    {chartData.status.map((_,idx) => <Cell key={idx} fill={COLORS[idx%COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltip} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-xs text-zinc-600 dark:text-zinc-400">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
