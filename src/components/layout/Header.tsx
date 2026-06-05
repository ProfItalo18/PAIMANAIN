'use client';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays, Sparkles, ShieldCheck } from 'lucide-react';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuth();
  const now = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date());

  return (
    <header className="no-print mb-7 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
      <div className="neo-card rounded-[2rem] p-5 sm:p-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-paiBlue shadow-sm backdrop-blur">
          <Sparkles size={14} />
          Sistema PAI
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {subtitle ?? 'Plano de Atendimento Individualizado com gestão segura, visual moderno e exportação formal em PDF.'}
        </p>
      </div>

      <div className="neo-card rounded-[2rem] p-4 sm:min-w-72">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl">
            <CalendarDays size={19} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold capitalize text-slate-950">{now}</p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-600">
              <ShieldCheck size={12} />
              {user?.role === 'admin' ? 'Administrador' : 'Professor'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
