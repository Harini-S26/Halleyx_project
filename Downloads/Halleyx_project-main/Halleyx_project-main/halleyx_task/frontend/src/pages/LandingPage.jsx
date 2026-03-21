import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Shield, Layers, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Real-time charts and KPIs built from your order data automatically.' },
  { icon: Layers,    title: 'Drag & Drop Builder', desc: 'Build custom dashboards in seconds — no code required.' },
  { icon: Shield,    title: 'Secure by Design', desc: 'JWT auth, encrypted data, and role-based access control.' },
  { icon: Zap,       title: 'Live Insights', desc: 'Automatic trend detection and intelligent widget recommendations.' },
];

export default function LandingPage() {
  return (
    /* Force light: white bg, dark text — unaffected by dark mode */
    <div className="min-h-screen font-sans" style={{ background: '#ffffff', color: '#18181b' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #f4f4f5', backdropFilter: 'blur(12px)' }}
        className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-black text-zinc-900">Halleyx</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors px-4 py-2">Sign in</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-6"
              style={{ background: '#eef2ff', color: '#4338ca', borderColor: '#c7d2fe' }}>
              <Zap size={12} /> Smart Dashboard Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-tight tracking-tight mb-6">
              Build dashboards that
              <span className="block bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"> actually work</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10">
              Halleyx turns your order data into beautiful, actionable dashboards. Drag, drop, and launch in minutes.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200">
                Start for free <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-zinc-200 text-zinc-700 font-semibold text-base hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
                Sign in <ChevronRight size={17} />
              </Link>
            </div>
          </motion.div>

          {/* Dashboard preview mockup */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-16 rounded-2xl border border-zinc-200 overflow-hidden shadow-2xl" style={{ background: '#fafafa' }}>
            <div className="h-9 flex items-center px-4 gap-1.5 border-b border-zinc-200" style={{ background: '#f4f4f5' }}>
              {['#f43f5e','#f59e0b','#10b981'].map((c,i) => <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              <div className="ml-4 h-4 rounded bg-zinc-300 max-w-xs flex-1" />
            </div>
            <div className="p-6 grid grid-cols-4 gap-4">
              {[['Total Revenue','$48.2K','#6366f1'],['Orders','1,284','#22d3ee'],['Completed','891','#10b981'],['Pending','142','#f59e0b']].map(([t,v,c]) => (
                <div key={t} className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm">
                  <p className="text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>{t}</p>
                  <p className="text-2xl font-black text-zinc-900">{v}</p>
                  <div className="w-full h-1.5 rounded-full mt-3" style={{ background: `${c}22` }}>
                    <div className="h-full rounded-full" style={{ background: c, width: '65%' }} />
                  </div>
                </div>
              ))}
              <div className="col-span-4 bg-white rounded-xl border border-zinc-100 p-4 h-28 flex items-end gap-1 shadow-sm">
                {[45,60,40,80,55,90,70,85,50,75,95,65].map((h,i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, #6366f1, #818cf8)`, opacity: 0.8 }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-zinc-900 mb-3">Everything you need</h2>
            <p className="text-zinc-500 text-lg">Built for teams that care about data.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl p-12" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <h2 className="text-3xl font-black text-white mb-4">Ready to get started?</h2>
            <p className="mb-8" style={{ color: '#c7d2fe' }}>Join teams using Halleyx to make better decisions, faster.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="px-8 py-3.5 rounded-xl bg-white font-bold text-sm hover:bg-indigo-50 transition-colors" style={{ color: '#4f46e5' }}>
                Get started free
              </Link>
              <Link to="/login" className="px-8 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f4f4f5' }} className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-700">Halleyx</span>
          </div>
          <p className="text-xs text-zinc-400">© 2026 Halleyx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
