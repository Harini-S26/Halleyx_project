import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 50%, #f0f4ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-8rem', right: '-8rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-8rem', left: '-8rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(99,102,241,0.06)', filter: 'blur(40px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '2rem', textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
              <Zap size={20} color="white" />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#18181b', letterSpacing: '-0.02em' }}>Halleyx</span>
          </Link>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(228,228,231,0.6)', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#18181b', margin: 0 }}>{title}</h1>
              {subtitle && <p style={{ fontSize: '14px', color: '#71717a', marginTop: '4px' }}>{subtitle}</p>}
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
