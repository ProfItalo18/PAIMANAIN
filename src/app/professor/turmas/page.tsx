'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProfessorRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { listarTurmasProfessor } from '@/services/turmasService';
import { Turma } from '@/types/turma';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowRight, School } from 'lucide-react';

export default function TurmasProfessorPage(){
  const { user } = useAuth();
  const [turmas,setTurmas]=useState<Turma[]>([]);
  const [erro,setErro]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    if(!user) return;
    setLoading(true); setErro(null);
    listarTurmasProfessor(user.uid)
      .then(setTurmas)
      .catch(e=>setErro(e instanceof Error ? e.message : 'Erro ao listar turmas.'))
      .finally(()=>setLoading(false));
  },[user]);
  return <ProfessorRoute><AppShell><Header title="Minhas turmas" subtitle="Acesse somente as turmas vinculadas ao seu usuário pelo administrador."/>{erro && <ErrorNotice message={erro}/>} {loading && <div className="glass rounded-[1.7rem] p-6 text-sm font-bold text-slate-600">Carregando turmas...</div>} {!loading && !erro && turmas.length === 0 && <EmptyState title="Nenhuma turma vinculada"><p>Peça para o administrador vincular seu usuário a uma turma em <b>Administração &gt; Professores</b>. Depois atualize esta página.</p></EmptyState>}<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{turmas.map(t=><Link key={t.id} href={`/professor/turma/${t.id}`} className="group glass relative overflow-hidden rounded-[1.7rem] p-6 transition hover:-translate-y-1 hover:shadow-glow"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-paiBlue/10 blur-2xl transition group-hover:bg-paiBlue/20"/><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-paiBlue/10 text-paiBlue"><School size={23}/></div><h2 className="text-xl font-black text-slate-950">{t.nome}</h2><p className="mt-1 text-sm text-slate-600">{t.etapa} · {t.turno} · {t.anoLetivo}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-paiBlue">Abrir turma <ArrowRight size={16} className="transition group-hover:translate-x-1"/></span></Link>)}</div></AppShell></ProfessorRoute>;
}
