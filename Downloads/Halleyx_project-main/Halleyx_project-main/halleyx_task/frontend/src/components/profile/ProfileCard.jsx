import React from 'react';
import { Camera, Mail, Calendar } from 'lucide-react';

export default function ProfileCard({ user, onAvatarClick }) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="card p-6 flex items-center gap-5">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-2xl font-black shadow-brand overflow-hidden">
          {user?.avatar
            ? <img src={user.avatar} alt="" role="presentation" className="w-full h-full object-cover" />
            : initials
          }
        </div>
        <button
          onClick={onAvatarClick}
          className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-brand-600 hover:border-brand-300 transition-all shadow-card"
        >
          <Camera size={12} />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-zinc-900 truncate">{user?.name || 'User'}</h2>
        <div className="flex items-center gap-1.5 text-sm text-zinc-500 mt-1">
          <Mail size={13} />
          <span className="truncate">{user?.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1.5">
          <Calendar size={12} />
          <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-100">
          Pro Plan
        </span>
      </div>
    </div>
  );
}
