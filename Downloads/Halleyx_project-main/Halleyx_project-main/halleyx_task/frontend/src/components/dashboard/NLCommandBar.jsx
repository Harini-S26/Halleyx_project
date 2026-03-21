import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const COMMANDS = [
  { match: ['revenue', 'product'], type: 'bar', title: 'Revenue by Product', dataSource: 'revenue-by-product', color: '#6366f1' },
  { match: ['order', 'time'], type: 'line', title: 'Orders Over Time', dataSource: 'orders-over-time', color: '#22d3ee' },
  { match: ['order', 'trend'], type: 'line', title: 'Orders Trend', dataSource: 'orders-over-time', color: '#22d3ee' },
  { match: ['status', 'distribution'], type: 'pie', title: 'Status Distribution', dataSource: 'status-distribution' },
  { match: ['status'], type: 'pie', title: 'Order Status', dataSource: 'status-distribution' },
  { match: ['revenue', 'time'], type: 'area', title: 'Revenue Over Time', dataSource: 'revenue-over-time', color: '#10b981' },
  { match: ['kpi', 'revenue'], type: 'kpi', title: 'Revenue KPI', metric: 'revenue', format: 'currency' },
  { match: ['kpi', 'order'], type: 'kpi', title: 'Orders KPI', metric: 'orders', format: 'number' },
  { match: ['insight'], type: 'insights', title: 'Smart Insights' },
];

const SUGGESTIONS = [
  'Show revenue by product',
  'Orders over time',
  'Status distribution',
  'Revenue trend',
  'Add insights widget',
];

export default function NLCommandBar({ onAddWidget }) {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);

  const handleCommand = () => {
    const lower = input.toLowerCase();
    const words = lower.split(/\s+/);
    const match = COMMANDS.find(cmd => cmd.match.every(m => words.some(w => w.includes(m))));
    if (match) {
      const newWidget = {
        i: `nl_${Date.now()}`,
        x: 0, y: Infinity,
        w: ['kpi'].includes(match.type) ? 3 : 6,
        h: ['kpi'].includes(match.type) ? 2 : 4,
        type: match.type,
        config: { title: match.title, dataSource: match.dataSource, color: match.color, metric: match.metric, format: match.format },
      };
      onAddWidget(newWidget);
      setInput('');
      toast.success(`Added "${match.title}" widget`);
    } else {
      toast.error('Try: "show revenue by product" or "orders over time"');
    }
  };

  return (
    <div className="card p-3">
      <div className="flex items-center gap-3">
        <Sparkles size={15} className="text-brand-500 flex-shrink-0" />
        <div className="flex-1 relative">
          <input
            className="w-full bg-transparent text-sm outline-none text-zinc-700 placeholder-zinc-400"
            placeholder='Type a command like "Show revenue by product"…'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && input && handleCommand()}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
          />
          {focused && !input && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-2 w-72 bg-white border border-zinc-100 rounded-xl shadow-modal z-10 p-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">Suggestions</p>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setInput(s); }}
                  className="w-full text-left text-sm text-zinc-600 px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors">
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <button onClick={handleCommand} disabled={!input}
          className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors disabled:opacity-40">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
