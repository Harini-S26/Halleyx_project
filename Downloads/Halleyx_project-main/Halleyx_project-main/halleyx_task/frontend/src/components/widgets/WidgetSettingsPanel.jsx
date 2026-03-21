import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const SWATCHES = ['#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e','#a78bfa','#fb923c','#14b8a6'];
const AXIS_OPTIONS  = ['Product','Quantity','Unit price','Total amount','Status','Created by','Duration'];
const KPI_METRICS   = ['Customer ID','Customer name','Email id','Address','Order date','Product','Created by','Status','Total amount','Unit price','Quantity'];
const PIE_DATA      = ['Product','Quantity','Unit price','Total amount','Status','Created by'];
const TABLE_COLUMNS = ['Customer ID','Customer name','Email id','Phone number','Address','Order ID','Order date','Product','Quantity','Unit price','Total amount','Status','Created by'];
const SORT_OPTIONS  = ['Ascending','Descending','Order date'];
const PAGE_OPTS     = ['5','10','15'];
const TYPE_LABELS   = { bar:'Bar Chart', line:'Line Chart', area:'Area Chart', scatter:'Scatter Plot', pie:'Pie Chart', table:'Table', kpi:'KPI', 'revenue-product':'Revenue by Product' };

export default function WidgetSettingsPanel({ widget, onClose, onSave }) {
  const [cfg, setCfg] = useState({ ...widget.config });
  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  const isChart = ['bar','line','area','scatter'].includes(widget.type);
  const isPie   = widget.type === 'pie';
  const isKPI   = widget.type === 'kpi';
  const isTable = widget.type === 'table';

  const handleApply = () => {
    // Merge size changes back to widget dimensions
    const updated = {
      ...widget,
      w: cfg.widthCols  ? Number(cfg.widthCols)  : widget.w,
      h: cfg.heightRows ? Number(cfg.heightRows) : widget.h,
      config: { ...cfg }
    };
    onSave(updated);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-[#1a1a1f] border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">Widget Settings</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── GENERAL ─────────────────── */}
          <section>
            <p className="section-label">General</p>
            <div className="space-y-3">
              <div>
                <label className="label">Widget Title</label>
                <input className="input-field" value={cfg.title || ''} placeholder="Untitled"
                  onChange={e => set('title', e.target.value)} />
              </div>
              <div>
                <label className="label">Widget Type</label>
                <input className="input-field bg-zinc-50 dark:bg-zinc-800 cursor-default text-zinc-500 dark:text-zinc-400"
                  value={TYPE_LABELS[widget.type] || widget.type} readOnly />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field resize-none" rows={2}
                  value={cfg.description || ''} placeholder="Optional description"
                  onChange={e => set('description', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── WIDGET SIZE ──────────────── */}
          <section>
            <p className="section-label">Widget Size</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Width (Columns)</label>
                <input type="number" min={1} max={12} className="input-field"
                  value={cfg.widthCols ?? widget.w ?? (isKPI ? 2 : isTable ? 4 : 5)}
                  onChange={e => set('widthCols', Math.max(1, Number(e.target.value)))} />
              </div>
              <div>
                <label className="label">Height (Rows)</label>
                <input type="number" min={1} max={12} className="input-field"
                  value={cfg.heightRows ?? widget.h ?? (isKPI ? 2 : isTable ? 4 : 5)}
                  onChange={e => set('heightRows', Math.max(1, Number(e.target.value)))} />
              </div>
            </div>
          </section>

          {/* ── DATA SETTINGS: Charts ────── */}
          {isChart && (
            <section>
              <p className="section-label">Data Settings</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Choose X-Axis Data</label>
                  <select className="select-field" value={cfg.xAxis || 'Product'} onChange={e => set('xAxis', e.target.value)}>
                    {AXIS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Choose Y-Axis Data</label>
                  <select className="select-field" value={cfg.yAxis || 'Total amount'} onChange={e => set('yAxis', e.target.value)}>
                    {AXIS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* ── DATA SETTINGS: Pie ────────── */}
          {isPie && (
            <section>
              <p className="section-label">Data Settings</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Choose Chart Data</label>
                  <select className="select-field" value={cfg.chartData || 'Status'} onChange={e => set('chartData', e.target.value)}>
                    {PIE_DATA.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-brand-500"
                    checked={cfg.showLegend !== false} onChange={e => set('showLegend', e.target.checked)} />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Show Legend</span>
                </label>
              </div>
            </section>
          )}

          {/* ── DATA SETTINGS: KPI ────────── */}
          {isKPI && (
            <section>
              <p className="section-label">Data Settings</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Select Metric</label>
                  <select className="select-field" value={cfg.metric || 'Total amount'} onChange={e => set('metric', e.target.value)}>
                    {KPI_METRICS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Aggregation</label>
                  <select className="select-field" value={cfg.aggregation || 'Count'} onChange={e => set('aggregation', e.target.value)}>
                    {['Sum','Average','Count'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Data Format</label>
                  <select className="select-field" value={cfg.format || 'Number'} onChange={e => set('format', e.target.value)}>
                    <option value="Number">Number</option>
                    <option value="Currency">Currency ($)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Decimal Precision</label>
                  <input type="number" min={0} max={6} className="input-field"
                    value={cfg.decimals ?? 0} onChange={e => set('decimals', Math.max(0, Number(e.target.value)))} />
                </div>
              </div>
            </section>
          )}

          {/* ── DATA SETTINGS: Table ──────── */}
          {isTable && (
            <section>
              <p className="section-label">Data Settings</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Choose Columns</label>
                  <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 space-y-1.5">
                    {TABLE_COLUMNS.map(col => (
                      <label key={col} className="flex items-center gap-2.5 cursor-pointer px-1 py-0.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <input type="checkbox" className="w-3.5 h-3.5 accent-brand-500"
                          checked={cfg.columns?.includes(col) || false}
                          onChange={e => {
                            const cols = cfg.columns || [];
                            set('columns', e.target.checked ? [...cols, col] : cols.filter(c => c !== col));
                          }} />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Sort By</label>
                  <select className="select-field" value={cfg.sortBy || ''} onChange={e => set('sortBy', e.target.value)}>
                    <option value="">None</option>
                    {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Pagination (rows/page)</label>
                  <select className="select-field" value={cfg.pagination || '5'} onChange={e => set('pagination', e.target.value)}>
                    {PAGE_OPTS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-brand-500"
                      checked={cfg.applyFilter === true} onChange={e => set('applyFilter', e.target.checked)} />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Apply Filter</span>
                  </label>
                  {cfg.applyFilter && (
                    <div className="mt-3 space-y-2 pl-2 border-l-2 border-brand-200 dark:border-brand-800">
                      {(cfg.filters || [{}]).map((f, i) => (
                        <div key={i} className="flex gap-2">
                          <select className="select-field flex-1" value={f.column || ''}
                            onChange={e => { const fs=[...(cfg.filters||[{}])]; fs[i]={...fs[i],column:e.target.value}; set('filters',fs); }}>
                            <option value="">Column…</option>
                            {TABLE_COLUMNS.map(c => <option key={c}>{c}</option>)}
                          </select>
                          <input className="input-field flex-1" placeholder="Value" value={f.value || ''}
                            onChange={e => { const fs=[...(cfg.filters||[{}])]; fs[i]={...fs[i],value:e.target.value}; set('filters',fs); }} />
                        </div>
                      ))}
                      <button onClick={() => set('filters',[...(cfg.filters||[{}]),{}])}
                        className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 transition-colors">
                        + Add filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── STYLING: Charts & Pie ─────── */}
          {(isChart || isPie) && (
            <section>
              <p className="section-label">Styling</p>
              <div className="space-y-4">
                <div>
                  <label className="label">Chart Color</label>
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {SWATCHES.map(c => (
                        <button key={c} onClick={() => set('color', c)}
                          className={`w-7 h-7 rounded-lg transition-all hover:scale-110 ${cfg.color === c ? 'ring-2 ring-offset-2 ring-brand-500' : ''}`}
                          style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(cfg.color || '') ? cfg.color : SWATCHES[0]}
                        onChange={e => set('color', e.target.value)}
                        className="w-9 h-9 rounded-xl border border-zinc-200 cursor-pointer p-1 flex-shrink-0" />
                      <div className="flex-1">
                        <input className="input-field font-mono text-xs w-full"
                          value={cfg.color || SWATCHES[0]}
                          placeholder="#6366f1"
                          maxLength={7}
                          onChange={e => set('color', e.target.value)}
                          onBlur={e => {
                            if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) set('color', SWATCHES[0]);
                          }}
                        />
                        {cfg.color && !/^#[0-9A-Fa-f]{6}$/.test(cfg.color) && (
                          <p className="text-[10px] text-red-500 mt-0.5">Invalid HEX code (e.g. #6366f1)</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {isChart && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="showDataLabel" className="w-4 h-4 accent-brand-500"
                      checked={cfg.showDataLabel === true} onChange={e => set('showDataLabel', e.target.checked)} />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Show Data Labels</span>
                  </label>
                )}
              </div>
            </section>
          )}

          {/* ── STYLING: Table ────────────── */}
          {isTable && (
            <section>
              <p className="section-label">Styling</p>
              <div className="space-y-3">
                <div>
                  <label className="label">Font Size (12–18)</label>
                  <input type="number" min={12} max={18} className="input-field"
                    value={cfg.fontSize ?? 14} onChange={e => set('fontSize', Math.min(18, Math.max(12, Number(e.target.value))))} />
                </div>
                <div>
                  <label className="label">Header Background</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={cfg.headerBg || '#54bd95'} onChange={e => set('headerBg', e.target.value)}
                      className="w-9 h-9 rounded-xl border border-zinc-200 cursor-pointer p-1" />
                    <input className="input-field flex-1 font-mono text-xs" value={cfg.headerBg || '#54bd95'} placeholder="#54bd95"
                      onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) set('headerBg', e.target.value); }} />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleApply} className="btn-primary">Apply</button>
        </div>
      </motion.div>
    </>
  );
}
