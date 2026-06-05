'use client';

import { useEffect, useState } from 'react';
import { AdminRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { ProfessorForm } from '@/components/forms/ProfessorForm';
import { Table, Th, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { createProfessor, deleteProfessor, listProfessores } from '@/services/usersService';
import { listarTurmasAdmin, vincularProfessorTurma } from '@/services/turmasService';
import { AppUser, PROFESSOR_FUNCOES } from '@/types/user';
import { Turma } from '@/types/turma';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<AppUser[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editing, setEditing] = useState<AppUser | null>(null);

  async function load() {
    setProfessores(await listProfessores());
    setTurmas(await listarTurmasAdmin());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminRoute>
      <AppShell>
        <Header title="Professores" subtitle="Cadastre os docentes e vincule-os às turmas de forma rápida." />
        <section className="neo-card rounded-[2rem] p-5 sm:p-6">
          <h3 className="mb-4 font-black text-slate-800">{editing ? 'Editar professor' : 'Novo professor'}</h3>
          <ProfessorForm
            initialData={editing}
            onCancel={() => setEditing(null)}
            onSubmit={async d => {
              await createProfessor(d);
              setEditing(null);
              await load();
            }}
          />
        </section>
        <div className="mt-6">
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>E-mail</Th>
                <Th>Função</Th>
                <Th>Vincular à turma</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {professores.map(p => (
                <tr key={p.uid}>
                  <Td>{p.nome}</Td>
                  <Td>{p.email}</Td>
                  <Td>{PROFESSOR_FUNCOES.find(f => f.value === p.funcao)?.label ?? 'Não informada'}</Td>
                  <Td>
                    <select
                      className="w-full min-w-48 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold outline-none transition focus:border-paiBlue focus:ring-4 focus:ring-paiBlue/10"
                      onChange={async e => {
                        if (e.target.value) {
                          await vincularProfessorTurma(e.target.value, p.uid);
                          await load();
                        }
                      }}
                    >
                      <option value="">Selecionar...</option>
                      {turmas.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="px-3 py-2" onClick={() => setEditing(p)}>
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-2"
                        onClick={async () => {
                          if (!confirm(`Excluir o cadastro de ${p.nome}?`)) return;
                          await deleteProfessor(p.uid);
                          await load();
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </AppShell>
    </AdminRoute>
  );
}
