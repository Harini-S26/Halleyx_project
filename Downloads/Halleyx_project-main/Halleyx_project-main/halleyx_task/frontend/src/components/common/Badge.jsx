import React from 'react';
const styles = {
  pending:   'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30',
  progress:  'bg-blue-50  dark:bg-blue-900/20  text-blue-700  dark:text-blue-400  border border-blue-200  dark:border-blue-900/30',
  completed: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30',
  default:   'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700',
};
export default function Badge({ label, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant] || styles.default}`}>
      {label}
    </span>
  );
}
