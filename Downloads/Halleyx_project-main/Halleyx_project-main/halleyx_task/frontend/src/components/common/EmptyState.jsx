import React from 'react';
import { motion } from 'framer-motion';
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-5 border border-brand-100 dark:border-brand-900/30">
          <Icon size={28} className="text-brand-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-zinc-400 max-w-xs mb-6 leading-relaxed">{description}</p>}
      {action}
    </motion.div>
  );
}
