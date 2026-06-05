import { ReactNode } from 'react';

export function Card({
  title,
  children,
  className = '',
  eyebrow
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`neo-card rounded-[2rem] p-5 sm:p-6 ${className}`}>
      {eyebrow && <p className="mb-1 text-xs font-black uppercase tracking-[0.22em] text-paiGreen">{eyebrow}</p>}
      {title && <h2 className="mb-4 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h2>}
      {children}
    </section>
  );
}
