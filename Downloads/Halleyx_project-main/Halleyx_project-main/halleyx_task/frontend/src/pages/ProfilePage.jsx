import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, User, Lock, Check, Eye, EyeOff, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile]           = useState({ name: user?.name || '', email: user?.email || '' });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [passwords, setPasswords]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors]   = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPwd, setShowPwd]           = useState({});
  const fileRef = useRef();

  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U';

  /* ── Avatar upload ── */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5 MB allowed'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Only image files accepted'); return; }

    // Instant local preview
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.put('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ avatar: data.avatar });
      setAvatarPreview(data.avatar);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  /* ── Profile save ── */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.name.trim())  errs.name  = 'Please fill the field';
    if (!profile.email.trim()) errs.email = 'Please fill the field';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errs.email = 'Enter a valid email';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    setProfileLoading(true);
    try {
      const { data } = await api.put('/profile', profile);
      updateUser(data);
      setProfileErrors({});
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setProfileLoading(false); }
  };

  /* ── Password change ── */
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.currentPassword) errs.currentPassword = 'Please fill the field';
    if (!passwords.newPassword)     errs.newPassword     = 'Please fill the field';
    else if (passwords.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters';
    if (passwords.newPassword !== passwords.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }

    setPasswordLoading(true);
    try {
      await api.put('/profile/password', {
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      toast.success('Password updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally { setPasswordLoading(false); }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Profile</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Manage your account settings</p>
      </div>

      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-2xl font-black overflow-hidden">
            {avatarPreview
              ? <img src={avatarPreview} alt="" role="presentation" className="w-full h-full object-cover" onError={() => setAvatarPreview('')} />
              : initials
            }
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button onClick={() => fileRef.current?.click()} disabled={uploadingAvatar}
            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-brand-600 border-2 border-white dark:border-[#1a1a1f] flex items-center justify-center text-white hover:bg-brand-700 transition-colors shadow-brand disabled:opacity-60"
            title="Upload photo">
            <Camera size={13} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-zinc-900 dark:text-zinc-100">{profile.name}</p>
          <p className="text-sm text-zinc-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} />{profile.email}</p>
          <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-1.5">Click the camera icon to change your photo</p>
        </div>
        <span className="flex-shrink-0 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs font-bold border border-brand-100 dark:border-brand-900/30">
          Active
        </span>
      </motion.div>

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <User size={16} className="text-brand-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Personal Information</h3>
            <p className="text-xs text-zinc-400">Update your name and email</p>
          </div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input type="text" placeholder="Your full name"
                className={`input-field pl-10 ${profileErrors.name ? 'border-red-400' : ''}`}
                value={profile.name} onChange={e => { setProfile(p=>({...p,name:e.target.value})); setProfileErrors(e2=>({...e2,name:''})); }} />
            </div>
            {profileErrors.name && <p className="text-xs text-red-500 mt-1.5">⚠ {profileErrors.name}</p>}
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input type="email" placeholder="your@email.com"
                className={`input-field pl-10 ${profileErrors.email ? 'border-red-400' : ''}`}
                value={profile.email} onChange={e => { setProfile(p=>({...p,email:e.target.value})); setProfileErrors(e2=>({...e2,email:''})); }} />
            </div>
            {profileErrors.email && <p className="text-xs text-red-500 mt-1.5">⚠ {profileErrors.email}</p>}
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={profileLoading} className="btn-primary">
              {profileLoading
                ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</span>
                : <><Check size={14} /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
            <Lock size={16} className="text-brand-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Change Password</h3>
            <p className="text-xs text-zinc-400">Keep your account secure</p>
          </div>
        </div>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password'   },
            { key: 'newPassword',     label: 'New Password'       },
            { key: 'confirmPassword', label: 'Confirm New Password'},
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input type={showPwd[key] ? 'text' : 'password'} placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${passwordErrors[key] ? 'border-red-400' : ''}`}
                  value={passwords[key]}
                  onChange={e => { setPasswords(p=>({...p,[key]:e.target.value})); setPasswordErrors(e2=>({...e2,[key]:''})); }} />
                <button type="button" onClick={() => setShowPwd(s=>({...s,[key]:!s[key]}))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPwd[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {passwordErrors[key] && <p className="text-xs text-red-500 mt-1.5">⚠ {passwordErrors[key]}</p>}
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={passwordLoading} className="btn-primary">
              {passwordLoading
                ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</span>
                : <><Lock size={14} /> Update Password</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
