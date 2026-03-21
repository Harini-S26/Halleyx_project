import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Package, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_STYLE = {
  'Completed':   { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-400' },
  'Pending':     { icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20',     dot: 'bg-amber-400'   },
  'In Progress': { icon: Loader2,      color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-900/20',       dot: 'bg-blue-400'    },
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

export default function RecentActivity() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data.slice(0,8))).catch(()=>{}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50 dark:border-zinc-800 flex-shrink-0">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Recent Activity</h3>
        <Link to="/app/orders" className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
          View All <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          Array.from({length:5}).map((_,i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
              </div>
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-12" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
            <Package size={20} className="text-zinc-300 dark:text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-400">No activity yet</p>
            <Link to="/app/orders" className="text-xs text-brand-600 font-semibold mt-1.5 hover:underline">Create first order →</Link>
          </div>
        ) : orders.map((order, i) => {
          const s = STATUS_STYLE[order.status] || STATUS_STYLE['Pending'];
          const Icon = s.icon;
          return (
            <motion.div key={order._id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.04 }}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{order.firstName} {order.lastName}</p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{order.product.replace(' Mbps','').replace(' Mobile Plan','').replace(' Package','')}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">${Number(order.totalAmount).toFixed(0)}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{timeAgo(order.createdAt)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
