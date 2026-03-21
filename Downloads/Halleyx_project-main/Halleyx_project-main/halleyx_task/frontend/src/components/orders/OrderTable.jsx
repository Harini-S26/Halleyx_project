import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Badge from '../common/Badge';

const STATUS_VARIANT = { 'Pending': 'pending', 'In Progress': 'progress', 'Completed': 'completed' };

export default function OrderTable({ orders, onEdit, onDelete, loading }) {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [menuId,  setMenuId]  = useState(null);
  const menuRef               = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuId(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...orders].sort((a, b) => {
    let av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const COLS = [
    { key: 'firstName',   label: 'Customer'   },
    { key: 'email',       label: 'Email'       },
    { key: 'product',     label: 'Product'     },
    { key: 'quantity',    label: 'Qty'         },
    { key: 'totalAmount', label: 'Total'       },
    { key: 'status',      label: 'Status'      },
    { key: 'createdBy',   label: 'Created By'  },
    { key: 'createdAt',   label: 'Date'        },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {COLS.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  className="group text-left py-3.5 px-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors select-none">
                  {col.label}
                  <span className="ml-1 inline-flex opacity-0 group-hover:opacity-100">
                    {sortKey === col.key
                      ? sortDir === 'asc' ? <ChevronUp size={11} className="text-brand-500" /> : <ChevronDown size={11} className="text-brand-500" />
                      : <ChevronDown size={11} className="text-zinc-300" />
                    }
                  </span>
                </th>
              ))}
              <th className="py-3.5 px-4 w-12" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800">
                  {COLS.map(c => (
                    <td key={c.key} className="py-4 px-4">
                      <div className="h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" style={{ width: `${55 + Math.random()*35}%` }} />
                    </td>
                  ))}
                  <td className="py-4 px-4" />
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={COLS.length + 1} className="text-center py-16 text-zinc-400 dark:text-zinc-600 text-sm">
                  No orders found
                </td>
              </tr>
            ) : sorted.map((order, idx) => (
              <motion.tr key={order._id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{order.firstName} {order.lastName}</p>
                  <p className="text-xs text-zinc-400">{order.city}, {order.country}</p>
                </td>
                <td className="py-3.5 px-4 text-sm text-zinc-500 dark:text-zinc-400">{order.email}</td>
                <td className="py-3.5 px-4 text-sm text-zinc-700 dark:text-zinc-300 max-w-[160px] truncate">{order.product}</td>
                <td className="py-3.5 px-4 text-sm text-zinc-600 dark:text-zinc-400">{order.quantity}</td>
                <td className="py-3.5 px-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="py-3.5 px-4"><Badge label={order.status} variant={STATUS_VARIANT[order.status] || 'default'} /></td>
                <td className="py-3.5 px-4 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{order.createdBy}</td>
                <td className="py-3.5 px-4 text-xs text-zinc-400 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="py-3.5 px-4 relative">
                  <div ref={menuId === order._id ? menuRef : null} className="relative inline-block">
                    {/* 3-dot button — always visible */}
                    <button onClick={() => setMenuId(menuId === order._id ? null : order._id)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                      <MoreVertical size={15} />
                    </button>
                    <AnimatePresence>
                      {menuId === order._id && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1a1a1f] border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-modal z-30 overflow-hidden">
                          <button onClick={() => { onEdit(order); setMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <Edit2 size={13} className="text-zinc-400" /> Edit order
                          </button>
                          <button onClick={() => { onDelete(order._id); setMenuId(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-zinc-50 dark:border-zinc-800">
                            <Trash2 size={13} className="text-red-400" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length > 0 && (
        <div className="px-4 py-3 border-t border-zinc-50 dark:border-zinc-800">
          <p className="text-xs text-zinc-400">{sorted.length} order{sorted.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}
