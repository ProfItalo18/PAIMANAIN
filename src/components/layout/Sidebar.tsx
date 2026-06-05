'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  School,
  ShieldCheck,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

const adminLinks = [
  ['/admin', 'Painel', Home],
  ['/admin/turmas', 'Turmas', School],
  ['/admin/professores', 'Professores', Users],
  ['/admin/disciplinas', 'Disciplinas', BookOpen],
  ['/admin/estudantes', 'Estudantes', GraduationCap],
  ['/admin/pais', 'PAIs', FileText]
] as const;

const profLinks = [
  ['/professor', 'Painel', Home],
  ['/professor/turmas', 'Minhas turmas', School]
] as const;

function NavContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const links = user?.role === 'admin' ? adminLinks : profLinks;

  return (
    <div className="relative flex h-full flex-col">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-paiBlue/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-paiGreen/25 blur-3xl" />

      <div className="relative mb-5 rounded-[1.65rem] border border-white/10 bg-white/[.08] p-4 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-gradient-to-br from-paiBlue via-sky-400 to-paiGreen text-white shadow-glow">
            <Sparkles size={22} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black leading-tight">PAI Escolar</p>
            <p className="truncate text-xs text-slate-300">Gestão inclusiva inteligente</p>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-white/10 bg-black/20 p-3">
          <p className="truncate text-sm font-extrabold">{user?.nome || 'Usuário'}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-200">
            <ShieldCheck size={12} />
            {user?.role === 'admin' ? 'Admin' : 'Professor'}
          </span>
        </div>
      </div>

      <nav className="relative flex-1 space-y-1.5 overflow-y-auto pr-1">
        {links.map(([href, label, Icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              onClick={onClose}
              key={href}
              href={href}
              className={`group flex items-center justify-between rounded-[1.15rem] px-3.5 py-3 text-sm font-bold transition ${
                active
                  ? 'bg-white text-slate-950 shadow-xl'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${active ? 'bg-paiBlue text-white' : 'bg-white/10 text-slate-200 group-hover:bg-white/15'}`}>
                  <Icon size={18} />
                </span>
                {label}
              </span>
              <ChevronRight size={16} className={active ? 'text-paiBlue' : 'text-slate-500'} />
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-4 rounded-[1.4rem] border border-white/10 bg-white/[.06] p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut size={17} />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="no-print fixed left-0 right-0 top-0 z-50 border-b border-white/70 bg-white/78 px-3 py-2 shadow-lg backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div className="text-center">
            <p className="text-sm font-black text-slate-950">PAI Escolar</p>
            <p className="text-[11px] font-semibold text-slate-500">Plano de Atendimento Individualizado</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-paiBlue to-paiGreen shadow-glow" />
        </div>
      </div>

      <aside className="no-print fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-72 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-2xl lg:block">
        <NavContent />
      </aside>

      {open && (
        <div className="no-print fixed inset-0 z-[60] lg:hidden">
          <button className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Fechar menu" />
          <aside className="absolute left-3 top-3 h-[calc(100vh-1.5rem)] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/98 p-4 text-white shadow-2xl">
            <button
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            <NavContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
