import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, Plus } from 'lucide-react';
import api from '../../utils/api';

export default function WidgetRecommendations({ onAddWidget, onDismiss }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/widgets/recommendations')
      .then(({ data }) => setRecs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || recs.length === 0) return null;

  const TYPE_DEFAULTS = {
    bar: { w: 6, h: 4, dataSource: 'revenue-by-product', color: '#6366f1' },
    line: { w: 6, h: 4, dataSource: 'orders-over-time', color: '#22d3ee' },
    pie: { w: 5, h: 4, dataSource: 'status-distribution' },
    kpi: { w: 3, h: 2, metric: 'revenue', format: 'currency' },
  };

  const handleAdd = (rec) => {
    const defaults = TYPE_DEFAULTS[rec.type] || { w: 4, h: 3 };
    onAddWidget({
      i: `rec_${Date.now()}`,
      x: 0, y: Infinity,
      w: defaults.w, h: defaults.h,
      type: rec.type,
      config: { title: rec.title, ...defaults },
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 border-brand-100 bg-gradient-to-r from-brand-50/50 to-transparent">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={15} className="text-brand-500" />
          <span className="text-sm font-semibold text-zinc-800">AI Recommendations</span>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 rounded hover:bg-brand-100 text-zinc-400"><X size={13} /></button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {recs.map((rec, i) => (
          <button key={i} onClick={() => handleAdd(rec)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brand-200 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors shadow-sm">
            <Plus size={11} /> {rec.title}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
