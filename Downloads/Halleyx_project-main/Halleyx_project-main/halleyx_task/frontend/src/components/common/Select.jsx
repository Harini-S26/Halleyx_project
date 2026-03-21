import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({ label, error, options = [], placeholder = 'Select…', className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <select
          className={`select-field ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">⚠ {error}</p>}
    </div>
  );
}
