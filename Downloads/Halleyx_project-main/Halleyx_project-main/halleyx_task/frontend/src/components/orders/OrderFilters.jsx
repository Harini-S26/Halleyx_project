import React from 'react';
import { Search, X } from 'lucide-react';

const STATUSES = ['All','Pending','In Progress','Completed'];

export default function OrderFilters({ search, onSearch, statusFilter, onStatusFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="flex-1 min-w-48 bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-zinc-700 rounded-2xl p-3 flex items-center gap-2 shadow-card">
        <Search size={15} className="text-zinc-400 flex-shrink-0" />
        <input
          className="flex-1 bg-transparent text-sm outline-none text-zinc-700 dark:text-zinc-300 placeholder-zinc-400"
          placeholder="Search by name, email, product…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => onSearch('')} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => onStatusFilter(s === 'All' ? '' : s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              (s === 'All' && !statusFilter) || statusFilter === s
                ? 'bg-brand-600 text-white shadow-brand'
                : 'bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
