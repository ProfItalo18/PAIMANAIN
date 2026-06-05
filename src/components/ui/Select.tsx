'use client';

import { SelectHTMLAttributes } from 'react';

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full appearance-none rounded-2xl border border-slate-200/90 bg-white/85 px-4 py-3 pr-12 text-sm font-medium text-slate-900 outline-none transition focus:border-paiBlue focus:bg-white focus:ring-4 focus:ring-paiBlue/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(180deg, transparent 0%, transparent 35%, #94a3b8 35%, #94a3b8 65%, transparent 65%, transparent 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
        backgroundSize: '3px 20px'
      }}
      {...props}
    >
      {children}
    </select>
  );
}
