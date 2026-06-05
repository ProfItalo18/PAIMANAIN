'use client';
import Link from 'next/link';
import { ProfessorRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { ArrowRight, FileText, School, ShieldCheck } from 'lucide-react';

export default function ProfessorPage() {
  return <ProfessorRoute><AppShell><Header title="Painel do professor" subtitle="Ambiente seguro para criar PAIs dos estudantes vinculados às suas turmas e disciplinas."/><section className="grid gap-5 md:grid-cols-3"><Card title="Minhas turmas" eyebrow="Acesso"><School className="mb-4 text-paiBlue"/><p className="mb-5 text-sm text-slate-600">Veja as turmas liberadas pelo administrador e acesse os estudantes.</p><Link className="inline-flex items-center gap-2 font-black text-paiBlue" href="/professor/turmas">Ver turmas <ArrowRight size={16}/></Link></Card><Card title="PAI por estudante" eyebrow="Documentos"><FileText className="mb-4 text-paiGreen"/><p className="text-sm text-slate-600">Preencha objetivos, mapeamento, registros processuais e ações colaborativas.</p></Card><Card title="Permissões ativas" eyebrow="Segurança"><ShieldCheck className="mb-4 text-sky-600"/><p className="text-sm text-slate-600">As regras do Firestore impedem acesso a turmas e PAIs não vinculados ao professor.</p></Card></section></AppShell></ProfessorRoute>;
}
