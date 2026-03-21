import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon, color = 'brand', index = 0 }) {
  const colorMap = {
    brand: { bg: 'bg-brand-50', icon: 'text-brand-600', text: 'text-brand-700' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', text: 'text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-700' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      className="card p-5 hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
            <Icon size={16} className={c.icon} />
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-zinc-900 leading-none">{value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      )}
    </motion.div>
  );
}
