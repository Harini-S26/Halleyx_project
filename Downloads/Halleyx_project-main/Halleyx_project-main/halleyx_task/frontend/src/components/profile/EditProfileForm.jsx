import React, { useState, useEffect } from 'react';
import { User, Mail, Image, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileForm() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', avatar: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', avatar: user.avatar || '' });
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please fill the field';
    if (!form.email) e.email = 'Please fill the field';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.put('/profile', form);
      updateUser(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const FIELDS = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Smith' },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@company.com' },
    { key: 'avatar', label: 'Avatar URL', icon: Image, type: 'url', placeholder: 'https://...' },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
          <User size={16} className="text-brand-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Personal Information</h3>
          <p className="text-xs text-zinc-400">Update your name, email and avatar</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {FIELDS.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <div className="relative">
              <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type={type}
                className={`input-field pl-10 ${errors[key] ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
            {errors[key] && <p className="text-xs text-red-500 mt-1.5">⚠ {errors[key]}</p>}
          </div>
        ))}

        {/* Avatar preview */}
        {form.avatar && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <img src={form.avatar} alt="" role="presentation" className="w-10 h-10 rounded-lg object-cover" onError={e => e.target.style.display='none'} />
            <p className="text-xs text-zinc-500">Avatar preview</p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</span>
              : <><Check size={14} /> Save Changes</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
