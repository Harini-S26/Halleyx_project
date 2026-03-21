import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ShoppingBag, Package, Check, ArrowRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ICONS = { 'chart-bar': BarChart2, 'shopping-bag': ShoppingBag, 'cube': Package };
const COLORS = { sales: '#6366f1', orders: '#10b981', product: '#f59e0b' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const { setWidgets, setLayouts } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data);
    } catch { toast.error('Failed to load templates'); }
    finally { setLoading(false); }
  };

  const applyTemplate = async (template) => {
    setApplying(template.id);
    try {
      const widgets = template.widgets;
      const lgLayout = widgets.map(w => ({ i: w.i, x: w.x, y: w.y, w: w.w, h: w.h }));
      setWidgets(widgets);
      setLayouts({ lg: lgLayout, md: lgLayout.map(l => ({...l, w: Math.min(l.w, 8)})), sm: lgLayout.map(l => ({...l, w: 4})) });
      await api.post('/dashboard/layout', { layouts: { lg: lgLayout, md: lgLayout.map(l => ({...l, w: Math.min(l.w, 8)})), sm: lgLayout.map(l => ({...l, w: 4})) }, widgets });
      toast.success(`${template.name} applied!`);
      navigate('/app/dashboard');
    } catch { toast.error('Failed to apply template'); }
    finally { setApplying(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-900">Dashboard Templates</h1>
        <p className="text-sm text-zinc-400 mt-1">Launch a complete dashboard instantly with pre-built widget layouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, i) => {
          const Icon = ICONS[template.icon] || BarChart2;
          const color = COLORS[template.id] || '#6366f1';
          return (
            <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card p-6 hover:shadow-card-hover transition-all cursor-pointer group"
              onClick={() => applyTemplate(template)}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}14` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-zinc-400">{template.widgets.length} widgets</span>
              </div>

              <h3 className="text-base font-bold text-zinc-900 mb-1">{template.name}</h3>
              <p className="text-sm text-zinc-500 mb-5">{template.description}</p>

              {/* Widget preview dots */}
              <div className="grid grid-cols-3 gap-1.5 mb-5">
                {template.widgets.slice(0, 6).map((w, j) => (
                  <div key={j} className="h-8 rounded-lg" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <div className="h-full rounded-lg" style={{ background: `${color}30`, width: `${60 + j * 5}%` }} />
                  </div>
                ))}
              </div>

              <button className="btn-primary w-full justify-center text-sm group-hover:shadow-brand transition-shadow">
                {applying === template.id ? (
                  <span className="animate-pulse">Applying…</span>
                ) : (
                  <>Use Template <ArrowRight size={14} /></>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
