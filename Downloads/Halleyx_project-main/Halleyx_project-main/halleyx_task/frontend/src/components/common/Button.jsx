import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 hover:bg-red-100 active:scale-95 transition-all duration-150',
};

export default function Button({ children, variant = 'primary', loading = false, disabled = false, className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={`${variants[variant]} ${className} ${(disabled || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Loading…
        </span>
      ) : children}
    </motion.button>
  );
}
