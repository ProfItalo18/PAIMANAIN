'use client';

import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-paiBlue via-sky-500 to-cyan-500 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl',
  secondary:
    'border border-slate-200/90 bg-white/88 text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-paiBlue/35 hover:bg-white',
  ghost:
    'border border-white/15 bg-white/10 text-white hover:bg-white/20',
  danger:
    'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
};

export function Button({ className = '', variant = 'primary', ...props }: Props) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-extrabold transition duration-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
