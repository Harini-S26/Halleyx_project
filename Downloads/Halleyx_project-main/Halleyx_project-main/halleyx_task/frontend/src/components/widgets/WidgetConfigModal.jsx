import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const COLORS = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#a78bfa','#fb923c','#14b8a6'];
const DATA_SOURCES = ['revenue-by-product','orders-over-time','status-distribution','revenue-over-time'];

export default function WidgetConfigModal({ widget, onClose, onSave }) {
  const [config, setConfig] = useState({ ...widget.config });
  const set = (k, v) => setConfig(c => ({ ...c, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-modal w-full max-w-md border border-zinc-100"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <h2 className="font-bold text-zinc-900">Configure Widget</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="label">Title</label>
            <input className="input-field" value={config.title||''} onChange={e => set('title', e.target.value)} placeholder="Widget title" />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input-field" value={config.description||''} onChange={e => set('description', e.target.value)} placeholder="Optional description" />
          </div>

          {widget.type === 'kpi' && (
            <>
              <div>
                <label className="label">Metric</label>
                <select className="select-field" value={config.metric||'revenue'} onChange={e => set('metric', e.target.value)}>
                  <option value="revenue">Total Revenue</option>
                  <option value="orders">Total Orders</option>
                  <option value="pending">Pending Orders</option>
                  <option value="completed">Completed Orders</option>
                </select>
              </div>
              <div>
                <label className="label">Format</label>
                <select className="select-field" value={config.format||'number'} onChange={e => set('format', e.target.value)}>
                  <option value="number">Number</option>
                  <option value="currency">Currency ($)</option>
                </select>
              </div>
            </>
          )}

          {['bar','line','area','scatter'].includes(widget.type) && (
            <>
              <div>
                <label className="label">Data Source</label>
                <select className="select-field" value={config.dataSource||''} onChange={e => set('dataSource', e.target.value)}>
                  <option value="">Select source</option>
                  {DATA_SOURCES.map(s => <option key={s} value={s}>{s.replace(/-/g,' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => set('color', c)}
                      className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${config.color === c ? 'ring-2 ring-offset-1 ring-brand-500' : ''}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {widget.type === 'pie' && (
            <>
              <div>
                <label className="label">Data Source</label>
                <select className="select-field" value={config.dataSource||''} onChange={e => set('dataSource', e.target.value)}>
                  <option value="">Select source</option>
                  {DATA_SOURCES.map(s => <option key={s} value={s}>{s.replace(/-/g,' ')}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="showLegend" checked={config.showLegend !== false} onChange={e => set('showLegend', e.target.checked)} className="accent-brand-500" />
                <label htmlFor="showLegend" className="text-sm text-zinc-700">Show Legend</label>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-100">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => onSave({ ...widget, config })} className="btn-primary">Save Changes</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
