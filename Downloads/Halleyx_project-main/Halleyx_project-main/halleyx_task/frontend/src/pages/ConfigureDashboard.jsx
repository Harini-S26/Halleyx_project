import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, LineChart, PieChart, TrendingUp, ScatterChart,
  Table2, Hash, ChevronDown, ChevronRight,
  GripVertical, Settings, Trash2, Check, ArrowLeft, Plus, DollarSign
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useDashboardData } from '../hooks/useDashboardData';
import WidgetRenderer from '../components/widgets/WidgetRenderer';
import WidgetSettingsPanel from '../components/widgets/WidgetSettingsPanel';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_CATALOG = {
  Charts: [
    { type: 'bar',             label: 'Bar Chart',          icon: BarChart2,    color: '#6366f1' },
    { type: 'line',            label: 'Line Chart',         icon: LineChart,    color: '#22d3ee' },
    { type: 'pie',             label: 'Pie Chart',          icon: PieChart,     color: '#f59e0b' },
    { type: 'area',            label: 'Area Chart',         icon: TrendingUp,   color: '#10b981' },
    { type: 'scatter',         label: 'Scatter Plot',       icon: ScatterChart, color: '#f43f5e' },
    { type: 'revenue-product', label: 'Revenue by Product', icon: DollarSign,   color: '#8b5cf6' },
  ],
  Tables: [
    { type: 'table', label: 'Table', icon: Table2, color: '#14b8a6' },
  ],
  KPIs: [
    { type: 'kpi', label: 'KPI Value', icon: Hash, color: '#a78bfa' },
  ],
};

const DEFAULT_SIZES = {
  bar: [5,5], line: [5,5], area: [5,5], scatter: [5,5], pie: [4,4],
  'revenue-product': [6,4], table: [4,4], kpi: [2,2],
};

const DATA_REQUIRED_TYPES = ['bar','line','area','scatter','pie','revenue-product','table'];

export default function ConfigureDashboard() {
  const { widgets, setWidgets, layouts, setLayouts } = useDashboard();
  const [saving, setSaving]                 = useState(false);
  const [settingsWidget, setSettingsWidget] = useState(null);
  const [collapsed, setCollapsed]           = useState({});
  const [dragOver, setDragOver]             = useState(false);
  const [hasOrders, setHasOrders]           = useState(null);
  const [loaded, setLoaded]                 = useState(false);
  const dragTypeRef                         = useRef(null);
  const navigate                            = useNavigate();

  // Fetch real chart data for live preview in canvas
  const { chartData } = useDashboardData(widgets, 'all');

  // Step 1: Clear stale context widgets on mount first
  useEffect(() => {
    setWidgets([]);
    setLayouts({ lg: [], md: [], sm: [] });
  }, []);

  // Step 2: Load saved layout from backend after clearing
  useEffect(() => {
    api.get('/dashboard/layout').then(({ data }) => {
      if (data.widgets?.length) {
        setWidgets(data.widgets);
        setLayouts(data.layouts || { lg: [], md: [], sm: [] });
      } else {
        setWidgets([]);
        setLayouts({ lg: [], md: [], sm: [] });
      }
    }).catch(() => {
      setWidgets([]);
      setLayouts({ lg: [], md: [], sm: [] });
    }).finally(() => setLoaded(true));
  }, []);

  // Step 3: Check if orders exist
  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setHasOrders(Array.isArray(data) && data.length > 0);
    }).catch(() => setHasOrders(false));
  }, []);

  const toggleGroup = (g) => setCollapsed(p => ({ ...p, [g]: !p[g] }));

  const checkDataAvailable = (type) => {
    if (DATA_REQUIRED_TYPES.includes(type) && hasOrders === false) {
      toast.error('Create orders first before adding this widget', { duration: 3000 });
      return false;
    }
    return true;
  };

  const addWidget = (type, label, color) => {
    if (!checkDataAvailable(type)) return;
    const [w, h] = DEFAULT_SIZES[type] || [4, 3];
    const newWidget = {
      i: `w${Date.now()}`, x: 0, y: Infinity, w, h, type,
      config: {
        title: label, color: color || '#6366f1',
        ...(type === 'revenue-product' ? { dataSource: 'revenue-by-product' } : {}),
      }
    };
    setWidgets(prev => [...prev, newWidget]);
    toast.success(`${label} added`);
  };

  const removeWidget = (id) => {
    setWidgets(prev => prev.filter(w => w.i !== id));
    if (settingsWidget?.i === id) setSettingsWidget(null);
  };

  const handleSettingsSave = (updated) => {
    setWidgets(prev => prev.map(w => w.i === updated.i ? updated : w));
    setSettingsWidget(updated);
    toast.success('Settings applied');
  };

  const handleLayoutChange = (_, allLayouts) => setLayouts(allLayouts);

  const handleDragStart = (e, type, label, color) => {
    dragTypeRef.current = { type, label, color };
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', type);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (dragTypeRef.current) {
      const { type, label, color } = dragTypeRef.current;
      addWidget(type, label, color);
      dragTypeRef.current = null;
    }
  };

  const saveDashboard = async () => {
    setSaving(true);
    try {
      await api.post('/dashboard/layout', { layouts, widgets });
      toast.success('Dashboard saved!');
      navigate('/app/dashboard');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  // Show loading spinner until layout is fetched
  if (!loaded) return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Loading canvas…</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Widget Library ── */}
      <aside className="w-60 bg-white dark:bg-[#13131a] border-r border-zinc-100 dark:border-zinc-800 flex flex-col flex-shrink-0 overflow-hidden">
        <div className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Widget Library</p>
          <p className="text-[11px] text-zinc-400 mt-1">Click to add · Drag onto canvas</p>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {Object.entries(WIDGET_CATALOG).map(([group, items]) => (
            <div key={group} className="mb-1">
              <button onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: items[0]?.color || '#6366f1', opacity: 0.8 }} />
                  <span className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{group}</span>
                </div>
                {collapsed[group] ? <ChevronRight size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
              </button>
              <AnimatePresence>
                {!collapsed[group] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                    {items.map(({ type, label, icon: Icon, color }) => {
                      const needsData = DATA_REQUIRED_TYPES.includes(type);
                      const blocked = needsData && hasOrders === false;
                      return (
                        <div key={type}
                          draggable={!blocked}
                          onDragStart={!blocked ? e => handleDragStart(e, type, label, color) : undefined}
                          onClick={() => addWidget(type, label, color)}
                          className={`flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-xl transition-colors group select-none
                            ${blocked ? 'cursor-not-allowed opacity-50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer'}`}
                          title={blocked ? 'Create orders first to use this widget' : label}>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}1a` }}>
                            <Icon size={13} style={{ color }} />
                          </div>
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors flex-1">{label}</span>
                          {!blocked && <Plus size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          {hasOrders === false && (
            <p className="text-[10px] text-amber-500 font-semibold mb-2">⚠ Create orders first to add charts</p>
          )}
          <p className="text-[10px] text-zinc-400">
            <span className="font-bold">Click</span> to add · <span className="font-bold">Drag</span> onto canvas
          </p>
        </div>
      </aside>

      {/* ── Canvas ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#13131a] border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app/dashboard')} className="btn-ghost"><ArrowLeft size={15} /> Back</button>
            <div>
              <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Configure Dashboard</h1>
              <p className="text-xs text-zinc-400">{widgets.length} widget{widgets.length !== 1 ? 's' : ''} on canvas</p>
            </div>
          </div>
          <button onClick={saveDashboard} disabled={saving} className="btn-primary">
            {saving ? <span className="animate-pulse">Saving…</span> : <><Check size={15} /> Save Configuration</>}
          </button>
        </div>

        {/* Drop zone */}
        <div
          className={`flex-1 overflow-y-auto p-6 transition-colors ${dragOver ? 'bg-brand-50/30 dark:bg-brand-900/10' : 'bg-zinc-50 dark:bg-[#0f0f11]'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleCanvasDrop}
        >
          {/* Empty state */}
          {widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed transition-colors ${dragOver ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1a1a1f]'}`}>
                <GripVertical size={28} className={dragOver ? 'text-brand-400' : 'text-zinc-300'} />
              </div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {dragOver ? 'Drop widget here' : 'Click a widget to add it — or drag it onto the canvas'}
              </p>
              {hasOrders === false && (
                <p className="text-xs text-amber-500 mt-2">Create customer orders first to enable chart widgets</p>
              )}
            </div>
          )}

          {/* Grid with live chart previews */}
          {widgets.length > 0 && (
            <ResponsiveGridLayout
              className="layout" layouts={layouts} onLayoutChange={handleLayoutChange}
              breakpoints={{ lg: 1200, md: 768, sm: 480 }} cols={{ lg: 12, md: 8, sm: 4 }}
              rowHeight={80} margin={[16, 16]} containerPadding={[0, 0]}
              resizeHandles={['se']} isDraggable isResizable draggableHandle=".drag-handle"
            >
              {widgets.map(w => {
                const data = chartData?.[w.i];
                const enriched = w.type === 'kpi' && data ? { ...w, config: { ...w.config, ...data } } : w;
                return (
                  <div key={w.i} data-grid={{ x: w.x||0, y: w.y||0, w: w.w||4, h: w.h||3 }}>
                    <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card flex flex-col overflow-hidden h-full hover:shadow-card-hover transition-shadow">

                      {/* Widget header */}
                      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-50 dark:border-zinc-800 flex-shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical size={13} className="drag-handle text-zinc-300 cursor-grab flex-shrink-0 active:cursor-grabbing" />
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{w.config?.title || w.type}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg">{w.type}</span>
                          <button onClick={() => setSettingsWidget(w)}
                            className="w-8 h-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex items-center justify-center" title="Settings">
                            <Settings size={14} />
                          </button>
                          <button onClick={() => removeWidget(w.i)}
                            className="w-8 h-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors flex items-center justify-center" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Live chart preview */}
                      <div style={{ flex: 1, padding: '8px', overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <WidgetRenderer widget={enriched} data={w.type !== 'kpi' ? data : undefined} />
                      </div>

                    </div>
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsWidget && (
          <WidgetSettingsPanel
            widget={settingsWidget}
            onClose={() => setSettingsWidget(null)}
            onSave={handleSettingsSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}