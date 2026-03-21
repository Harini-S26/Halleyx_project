import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const makeSparkline = (seed = 100, count = 10) => {
  const data = [];
  let val = Math.max(seed * 0.6, 10);
  for (let i = 0; i < count; i++) {
    val = Math.max(1, val + (Math.random() - 0.42) * (seed * 0.12));
    data.push({ v: Math.round(val) });
  }
  return data;
};

export default function KPICard({ title, value, prefix = '', suffix = '', change, color = '#6366f1', icon: Icon, index = 0 }) {
  const isPositive = (change ?? 0) >= 0;
  const numVal = Number(String(value).replace(/[^0-9.]/g, '')) || 80;
  const sparkData = makeSparkline(numVal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="bg-white rounded-2xl border border-zinc-100 shadow-card p-5 hover:shadow-card-hover transition-all hover:-translate-y-0.5 duration-200"
    >
      {/* Top */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-zinc-900 mt-1.5 leading-none tracking-tight">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
        </div>
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-2"
            style={{ background: `${color}15` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
        )}
      </div>

      {/* Sparkline */}
      <div className="h-12 -mx-1 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
              strokeOpacity={0.85}
            />
            <Tooltip
              contentStyle={{ display: 'none' }}
              cursor={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Change */}
      {change !== undefined && (
        <div className={`flex items-center gap-1.5 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
          <span className="text-zinc-400 font-normal text-[11px]">vs last period</span>
        </div>
      )}
    </motion.div>
  );
}
