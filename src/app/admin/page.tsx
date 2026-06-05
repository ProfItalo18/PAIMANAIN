'use client';
import Link from 'next/link';
import { AdminRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { BookOpen, FileText, GraduationCap, School, Users, ArrowRight } from 'lucide-react';

const cards = [
  { title: 'Turmas', href: '/admin/turmas', icon: School, text: 'Cadastre séries, turnos, ano letivo e vínculos.' },
  { title: 'Professores', href: '/admin/professores', icon: Users, text: 'Crie usuários e vincule-os às turmas.' },
  { title: 'Disciplinas', href: '/admin/disciplinas', icon: BookOpen, text: 'Associe disciplinas aos professores responsáveis.' },
  { title: 'Estudantes', href: '/admin/estudantes', icon: GraduationCap, text: 'Organize identificação e turma de cada estudante.' },
  { title: 'PAIs', href: '/admin/pais', icon: FileText, text: 'Visualize, edite e exporte todos os documentos.' }
];

export default function AdminPage() {
  return <AdminRoute><AppShell><Header title="Painel administrativo" subtitle="Central de gestão do PAI com controle total de turmas, professores, estudantes e documentos."/><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{cards.map(({ title, href, icon: Icon, text }) => <Link href={href} key={href} className="group"><Card title={title} eyebrow="Gestão" className="h-full transition group-hover:-translate-y-1 group-hover:shadow-glow"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-paiBlue/10 text-paiBlue"><Icon size={23}/></div><p className="mb-5 text-sm text-slate-600">{text}</p><span className="inline-flex items-center gap-2 text-sm font-black text-paiBlue">Abrir módulo <ArrowRight size={16} className="transition group-hover:translate-x-1"/></span></Card></Link>)}</div></AppShell></AdminRoute>;
}
