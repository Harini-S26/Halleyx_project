import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Please fill the field';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Please fill the field';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Email address</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input type="email" autoComplete="email"
            className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
            placeholder="your@email.com"
            value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.email}</p>}
      </div>

      <div>
        <label className="label">Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input type={show ? 'text' : 'password'} autoComplete="current-password"
            className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-200' : ''}`}
            placeholder="Enter your password"
            value={form.password} onChange={e => set('password', e.target.value)} />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.password}</p>}
      </div>

      <button type="submit" disabled={loading}
        className="btn-primary w-full justify-center py-3 text-base mt-2">
        {loading
          ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</span>
          : <span className="flex items-center gap-2">Sign in <ArrowRight size={16} /></span>
        }
      </button>

      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Create one free</Link>
      </p>
    </form>
  );
}
