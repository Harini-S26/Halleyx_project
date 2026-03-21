import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StrengthBar = ({ p }) => {
  const s = p.length === 0 ? 0 : p.length < 6 ? 1 : p.length < 10 ? 2 : /[A-Z]/.test(p) && /[0-9]/.test(p) ? 4 : 3;
  const colors = ['','bg-red-400','bg-amber-400','bg-emerald-400','bg-emerald-500'];
  const labels = ['','Weak','Fair','Good','Strong'];
  return p ? (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i<=s ? colors[s] : 'bg-zinc-200'}`} />)}
      </div>
      <p className={`text-xs font-medium ${s<=1?'text-red-500':s<=2?'text-amber-500':'text-emerald-600'}`}>{labels[s]} password</p>
    </div>
  ) : null;
};

export default function RegisterForm() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name    = 'Please fill the field';
    if (!form.email)        e.email   = 'Please fill the field';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)     e.password = 'Please fill the field';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (!form.confirm)      e.confirm = 'Please fill the field';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      toast.success('Welcome to Halleyx!');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="label">Full name</label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input type="text" autoComplete="name"
            className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
            placeholder="Your full name"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="label">Work email</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input type="email" autoComplete="email"
            className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
            placeholder="you@company.com"
            value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input type={showPwd ? 'text' : 'password'} autoComplete="new-password"
            className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
            placeholder="Min. 6 characters"
            value={form.password} onChange={e => set('password', e.target.value)} />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.password}</p>}
        <StrengthBar p={form.password} />
      </div>

      {/* Confirm */}
      <div>
        <label className="label">Confirm password</label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input type="password" autoComplete="new-password"
            className={`input-field pl-10 ${errors.confirm ? 'border-red-400' : ''}`}
            placeholder="Repeat your password"
            value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          {form.confirm && form.confirm === form.password && (
            <CheckCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
          )}
        </div>
        {errors.confirm && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.confirm}</p>}
      </div>

      <button type="submit" disabled={loading}
        className="btn-primary w-full justify-center py-3 text-base mt-2">
        {loading
          ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</span>
          : <span className="flex items-center gap-2">Create account <ArrowRight size={16} /></span>
        }
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
      </p>
    </form>
  );
}
