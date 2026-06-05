'use client';

import { useEffect, useState } from 'react';
import { AdminRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TurmaForm } from '@/components/forms/TurmaForm';
import { Table, Th, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { atualizarTurma, criarTurma, excluirTurma, listarTurmasAdmin } from '@/services/turmasService';
import { Turma } from '@/types/turma';

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editing, setEditing] = useState<Turma | null>(null);

  async function load() {
    setTurmas(await listarTurmasAdmin());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminRoute>
      <AppShell>
        <Header title="Turmas" subtitle="Organize as turmas e mantenha o cadastro escolar centralizado." />
        <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
          <h3 className="mb-4 font-black text-slate-800">{editing ? 'Editar turma' : 'Nova turma'}</h3>
          <TurmaForm
            initialData={editing}
            onCancel={() => setEditing(null)}
            onSubmit={async d => {
              if (editing?.id) {
                await atualizarTurma(editing.id, d);
              } else {
                await criarTurma({ ...d, professoresIds: [], estudantesIds: [], disciplinasIds: [] });
              }
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
                <Th>Etapa</Th>
                <Th>Ano</Th>
                <Th>Turno</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {turmas.map(t => (
                <tr key={t.id}>
                  <Td>{t.nome}</Td>
                  <Td>{t.etapa}</Td>
                  <Td>{t.anoLetivo}</Td>
                  <Td>{t.turno}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="px-3 py-2" onClick={() => setEditing(t)}>
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-2"
                        onClick={async () => {
                          if (!confirm(`Excluir a turma ${t.nome}?`)) return;
                          await excluirTurma(t.id!);
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
