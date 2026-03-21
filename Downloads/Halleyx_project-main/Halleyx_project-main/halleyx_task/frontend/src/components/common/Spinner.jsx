import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sizes[size]} rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin ${className}`} />
  );
}
