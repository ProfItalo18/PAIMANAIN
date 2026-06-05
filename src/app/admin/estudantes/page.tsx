'use client';

import { useEffect, useState } from 'react';
import { AdminRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { EstudanteForm } from '@/components/forms/EstudanteForm';
import { Table, Th, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import {
  atualizarEstudante,
  criarEstudante,
  excluirEstudante,
  listarEstudantesAdmin,
  uploadFotoEstudante
} from '@/services/estudantesService';
import { listarTurmasAdmin } from '@/services/turmasService';
import { Estudante } from '@/types/estudante';
import { Turma } from '@/types/turma';

export default function EstudantesPage() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editing, setEditing] = useState<Estudante | null>(null);

  async function load() {
    setTurmas(await listarTurmasAdmin());
    setEstudantes(await listarEstudantesAdmin());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminRoute>
      <AppShell>
        <Header title="Estudantes" subtitle="Cadastre alunos, envie foto e mantenha os dados organizados." />
        <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-800">{editing ? 'Editar estudante' : 'Novo estudante'}</h3>
              <p className="text-sm text-slate-500">A foto enviada será usada automaticamente no PAI.</p>
            </div>
          </div>
          <EstudanteForm
            turmas={turmas}
            initialData={editing}
            onCancel={() => setEditing(null)}
            onSubmit={async d => {
              if (editing?.id) {
                let fotoUrl = editing.fotoUrl || '';
                if (d.fotoFile) fotoUrl = await uploadFotoEstudante(d.fotoFile, editing.id);
                await atualizarEstudante(editing.id, {
                  nome: d.nome,
                  dataNascimento: d.dataNascimento,
                  idade: d.idade,
                  etapaSeriacao: d.etapaSeriacao,
                  turmaId: d.turmaId,
                  responsaveis: d.responsaveis,
                  fotoUrl
                });
              } else {
                const ref = await criarEstudante({
                  nome: d.nome,
                  dataNascimento: d.dataNascimento,
                  idade: d.idade,
                  etapaSeriacao: d.etapaSeriacao,
                  turmaId: d.turmaId,
                  responsaveis: d.responsaveis,
                  fotoUrl: ''
                });
                if (d.fotoFile) {
                  const fotoUrl = await uploadFotoEstudante(d.fotoFile, ref.id);
                  await atualizarEstudante(ref.id, { fotoUrl });
                }
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
                <Th>Turma</Th>
                <Th>Idade</Th>
                <Th>Foto</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {estudantes.map(e => (
                <tr key={e.id}>
                  <Td>{e.nome}</Td>
                  <Td>{turmas.find(t => t.id === e.turmaId)?.nome}</Td>
                  <Td>{e.idade}</Td>
                  <Td>{e.fotoUrl ? 'Enviada' : 'Sem foto'}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="px-3 py-2" onClick={() => setEditing(e)}>
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        className="px-3 py-2"
                        onClick={async () => {
                          if (!confirm(`Excluir ${e.nome}?`)) return;
                          await excluirEstudante(e.id!, e.turmaId);
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
