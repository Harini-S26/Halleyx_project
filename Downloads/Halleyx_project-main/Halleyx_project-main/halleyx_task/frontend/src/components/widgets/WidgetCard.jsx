import React from 'react';
import { Settings, X, GripVertical } from 'lucide-react';
import WidgetRenderer from './WidgetRenderer';

const TYPE_LABELS = { bar:'Bar Chart', line:'Line Chart', pie:'Pie Chart', area:'Area Chart', scatter:'Scatter Plot', table:'Table', kpi:'KPI', 'revenue-product':'Revenue' };

export default function WidgetCard({ widget, onDelete, onSettings, data, readOnly = false }) {
  return (
    <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card flex flex-col overflow-hidden h-full hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {!readOnly && <GripVertical size={12} className="text-zinc-300 cursor-grab flex-shrink-0" />}
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
              {widget.config?.title || TYPE_LABELS[widget.type] || 'Widget'}
            </p>
            {widget.config?.description && (
              <p className="text-[11px] text-zinc-400 truncate">{widget.config.description}</p>
            )}
          </div>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <span className="hidden sm:inline text-[10px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg">
              {widget.type}
            </span>
            {onSettings && (
              <button onClick={() => onSettings(widget)}
                className="w-8 h-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex items-center justify-center"
                title="Widget settings">
                <Settings size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(widget.i)}
                className="w-8 h-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors flex items-center justify-center"
                title="Remove widget">
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 px-3 pb-3 min-h-0">
        <WidgetRenderer widget={widget} data={data} />
      </div>
    </div>
  );
}
