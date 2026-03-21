import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const COLORS = ['#6366f1','#22d3ee','#10b981','#f59e0b','#f43f5e'];
const short = (n) => n.replace(' Mbps','').replace(' Mobile Plan','').replace(' Package','').replace(' Internet','').replace('Business ','Biz ');

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      const map = {};
      data.forEach(o => {
        if (!map[o.product]) map[o.product] = { name: o.product, orders: 0, revenue: 0 };
        map[o.product].orders++;
        map[o.product].revenue += Number(o.totalAmount);
      });
      const sorted = Object.values(map).sort((a,b) => b.orders - a.orders).slice(0,5);
      const max = sorted[0]?.orders || 1;
      setProducts(sorted.map(p => ({ ...p, pct: Math.round((p.orders/max)*100) })));
    }).catch(()=>{}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <TrendingUp size={15} className="text-brand-600" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Top Products</h3>
        </div>
        <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">By orders</span>
      </div>
      {loading ? (
        <div className="space-y-4">
          {Array.from({length:4}).map((_,i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-2/3" />
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Package size={22} className="text-zinc-300 dark:text-zinc-600 mb-2" />
          <p className="text-sm text-zinc-400">No orders yet</p>
          <Link to="/app/orders" className="text-xs text-brand-600 font-semibold mt-1 hover:underline">Create an order →</Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {products.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.07 }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{short(p.name)}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{p.orders}</span>
                  <span className="text-[10px] text-zinc-400 w-14 text-right">${p.revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:`${p.pct}%` }} transition={{ delay:i*0.07+0.2, duration:0.6 }}
                  className="h-full rounded-full" style={{ background: COLORS[i] }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
