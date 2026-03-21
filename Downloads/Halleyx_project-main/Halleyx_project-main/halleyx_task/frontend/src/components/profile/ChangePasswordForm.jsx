import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Please fill the field';
    if (!form.newPassword) e.newPassword = 'Please fill the field';
    else if (form.newPassword.length < 6) e.newPassword = 'Min 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please fill the field';
    else if (form.confirmPassword !== form.newPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.put('/profile/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { key: 'currentPassword', label: 'Current Password', placeholder: 'Your current password' },
    { key: 'newPassword', label: 'New Password', placeholder: 'Min 6 characters' },
    { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
          <Lock size={16} className="text-brand-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Change Password</h3>
          <p className="text-xs text-zinc-400">Keep your account secure with a strong password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type={show[key] ? 'text' : 'password'}
                className={`input-field pl-10 pr-10 ${errors[key] ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
              />
              <button type="button" onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors[key] && <p className="text-xs text-red-500 mt-1.5">⚠ {errors[key]}</p>}
          </div>
        ))}

        <div className="flex justify-end pt-1">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</span>
              : <><ShieldCheck size={14} /> Update Password</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
