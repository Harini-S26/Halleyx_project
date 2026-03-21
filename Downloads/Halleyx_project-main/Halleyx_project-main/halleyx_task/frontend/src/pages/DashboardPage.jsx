import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Plus, Download, FileText, BarChart3 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useDashboardData } from '../hooks/useDashboardData';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import WidgetSettingsPanel from '../components/widgets/WidgetSettingsPanel';
import RecentActivity from '../components/dashboard/RecentActivity';
import TopProducts from '../components/dashboard/TopProducts';
import MonthlyRevenueTrend from '../components/dashboard/MonthlyRevenueTrend';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { DollarSign, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { widgets, setWidgets, layouts, setLayouts, dateFilter } = useDashboard();
  const { chartData } = useDashboardData(widgets, dateFilter);

  const [configWidget, setConfigWidget] = useState(null);
  const [pageLoading, setPageLoading]   = useState(true);
  const [stats, setStats]               = useState(null);
  const [exportOpen, setExportOpen]     = useState(false);
  const exportRef                       = useRef();

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    loadDashboard();
    loadStats();
  }, []);

  useEffect(() => { loadStats(); }, [dateFilter]);

  useEffect(() => {
    const h = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await api.get('/dashboard/layout');
      if (data.widgets?.length) {
        setWidgets(data.widgets);
        setLayouts(data.layouts || { lg: [], md: [], sm: [] });
      }
    } catch {}
    finally { setPageLoading(false); }
  };

  const loadStats = async () => {
    try {
      const { data } = await api.get('/widgets/insights');
      setStats(data.stats);
    } catch {}
  };

  const handleDelete = (id) => {
    setWidgets(prev => prev.filter(w => w.i !== id));
    toast.success('Widget removed');
  };

  const handleSaveConfig = (updated) => {
    setWidgets(prev => prev.map(w => w.i === updated.i ? updated : w));
    setConfigWidget(null);
    toast.success('Widget updated');
  };

  const handleLayoutChange = (_, allLayouts) => setLayouts(allLayouts);

  // Export to CSV
  const exportCSV = async () => {
    try {
      const { data: orders } = await api.get('/orders');
      if (!orders.length) { toast.error('No order data to export'); return; }
      const headers = ['First Name','Last Name','Email','Phone','Product','Quantity','Unit Price','Total','Status','Created By','Date'];
      const rows = orders.map(o => [o.firstName,o.lastName,o.email,o.phone,o.product,o.quantity,o.unitPrice,o.totalAmount,o.status,o.createdBy,new Date(o.createdAt).toLocaleDateString()]);
      const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'halleyx-dashboard.csv'; a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch { toast.error('Export failed'); }
    setExportOpen(false);
  };

  // Export to PDF (simple print)
  const exportPDF = () => {
    window.print();
    setExportOpen(false);
  };

  const KPI_CARDS = [
    { title: 'Total Revenue', value: stats?.revenue ?? 0, prefix: '$', color: '#6366f1', icon: DollarSign, bg: 'from-indigo-500 to-indigo-600' },
    { title: 'Total Orders',  value: stats?.total    ?? 0, prefix: '',  color: '#22d3ee', icon: ShoppingBag, bg: 'from-cyan-500 to-cyan-600' },
    { title: 'Completed',     value: stats?.completed?? 0, prefix: '',  color: '#10b981', icon: CheckCircle, bg: 'from-emerald-500 to-emerald-600' },
    { title: 'Pending',       value: stats?.pending  ?? 0, prefix: '',  color: '#f59e0b', icon: Clock,       bg: 'from-amber-500 to-amber-600' },
  ];

  if (pageLoading) return (
    <div className="flex items-center justify-center h-full min-h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* Header row: greeting + export */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Export + Configure buttons */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={exportRef}>
            <button onClick={() => setExportOpen(!exportOpen)}
              className="btn-secondary flex items-center gap-2">
              <Download size={14} /> Export
            </button>
            <AnimatePresence>
              {exportOpen && (
                <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-1.5 w-40 bg-white dark:bg-[#1a1a1f] border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-modal z-50 overflow-hidden p-1">
                  <button onClick={exportCSV} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <FileText size={14} className="text-emerald-500" /> Export CSV
                  </button>
                  <button onClick={exportPDF} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <FileText size={14} className="text-red-500" /> Export PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/app/configure" className="btn-primary">
            <Settings2 size={14} /> Configure Dashboard
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div key={kpi.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-[#1a1a1f] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-card p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{kpi.title}</p>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon size={16} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
              {kpi.prefix}{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Monthly Revenue Trend */}
      <MonthlyRevenueTrend dateFilter={dateFilter} />

      {/* Widget canvas + sidebar */}
      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          {widgets.length === 0 ? (
            /* Empty state — reference image 6 */
            <div className="bg-white dark:bg-[#1a1a1f] rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border-2 border-dashed border-brand-200 dark:border-brand-800 flex items-center justify-center mb-5">
                <BarChart3 size={28} className="text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-2">No widgets configured</h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs mb-6 leading-relaxed">
                Configure your dashboard to start visualising your data with charts, KPIs, and tables.
              </p>
              <Link to="/app/configure" className="btn-primary">
                <Plus size={15} /> Configure Dashboard
              </Link>
            </div>
          ) : (
            <DashboardGrid
              widgets={widgets} layouts={layouts} chartData={chartData}
              onLayoutChange={handleLayoutChange}
              onDeleteWidget={handleDelete}
              onSettingsWidget={setConfigWidget}
            />
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-5">
          <div className="h-96"><RecentActivity /></div>
          <TopProducts />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-80"><RecentActivity /></div>
        <TopProducts />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {configWidget && (
          <WidgetSettingsPanel
            widget={configWidget}
            onClose={() => setConfigWidget(null)}
            onSave={handleSaveConfig}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
