'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, Th, Td } from '@/components/ui/Table';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import {
  atualizarDisciplina,
  criarDisciplina,
  DISCIPLINAS_PADRAO,
  excluirDisciplina,
  listarDisciplinas
} from '@/services/disciplinasService';
import { listProfessores } from '@/services/usersService';
import { listarTurmasAdmin } from '@/services/turmasService';
import { Disciplina } from '@/types/disciplina';
import { Turma } from '@/types/turma';
import { AppUser } from '@/types/user';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type FormState = {
  nome: string;
  turmaId: string;
  professorId: string;
};

const INITIAL_FORM: FormState = {
  nome: '',
  turmaId: '',
  professorId: ''
};

const ORDEM_DISCIPLINAS = [
  'Língua Portuguesa',
  'Matemática',
  'Competências Digitais',
  'Ciências',
  'Geografia',
  'História',
  'Ensino Religioso',
  'Arte',
  'Educação Física'
];

function ordenarDisciplinas(lista: Disciplina[]) {
  return [...lista].sort((a, b) => {
    const ia = ORDEM_DISCIPLINAS.indexOf(a.nome);
    const ib = ORDEM_DISCIPLINAS.indexOf(b.nome);
    if (ia === -1 && ib === -1) return a.nome.localeCompare(b.nome);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export default function AdminDisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<AppUser[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [editando, setEditando] = useState<Disciplina | null>(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function load() {
    try {
      setErro('');
      const [disciplinasData, turmasData, professoresData] = await Promise.all([
        listarDisciplinas(),
        listarTurmasAdmin(),
        listProfessores()
      ]);

      setDisciplinas(ordenarDisciplinas(disciplinasData));
      setTurmas(turmasData);
      setProfessores(professoresData);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar disciplinas.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  const turmasMap = useMemo(
    () => new Map(turmas.filter(t => t.id).map(t => [t.id as string, t])),
    [turmas]
  );

  const professoresMap = useMemo(
    () => new Map(professores.map(p => [p.uid, p])),
    [professores]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome.trim()) {
      setErro('Informe o nome da disciplina.');
      return;
    }

    if (!form.turmaId) {
      setErro('Selecione uma turma.');
      return;
    }

    if (!form.professorId) {
      setErro('Selecione um professor.');
      return;
    }

    try {
      setSalvando(true);
      setErro('');

      const payload = {
        nome: form.nome.trim(),
        turmaId: form.turmaId,
        professorId: form.professorId
      };

      if (editando?.id) {
        await atualizarDisciplina(editando.id, payload);
      } else {
        await criarDisciplina(payload);
      }

      setForm(INITIAL_FORM);
      setEditando(null);
      await load();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar disciplina.');
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(item: Disciplina) {
    setEditando(item);
    setForm({
      nome: item.nome ?? '',
      turmaId: item.turmaId ?? '',
      professorId: item.professorId ?? ''
    });
    setErro('');
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm(INITIAL_FORM);
    setErro('');
  }

  return (
    <AdminRoute>
      <AppShell>
        <Header
          title="Disciplinas"
          subtitle="Vincule os componentes curriculares às turmas e aos professores com um enquadramento mais limpo, equilibrado e responsivo."
        />

        {erro ? <ErrorNotice message={erro} /> : null}

        <section className="neo-card rounded-[2rem] p-4 sm:p-5 lg:p-6">
          <form onSubmit={onSubmit} className="grid gap-3 xl:grid-cols-[1.15fr_1fr_1fr_auto] xl:items-end">
            <div className="space-y-2">
              <label className="form-label">Disciplina</label>
              <Input
                list="disciplinas"
                placeholder="Nome da disciplina"
                value={form.nome}
                onChange={e => setForm(prev => ({ ...prev, nome: e.target.value }))}
              />
              <datalist id="disciplinas">
                {DISCIPLINAS_PADRAO.map(disciplina => (
                  <option key={disciplina} value={disciplina} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <label className="form-label">Turma</label>
              <Select value={form.turmaId} onChange={e => setForm(prev => ({ ...prev, turmaId: e.target.value }))}>
                <option value="">Selecione a turma</option>
                {turmas.map(turma => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="form-label">Professor</label>
              <Select
                value={form.professorId}
                onChange={e => setForm(prev => ({ ...prev, professorId: e.target.value }))}
              >
                <option value="">Selecione o professor</option>
                {professores.map(professor => (
                  <option key={professor.uid} value={professor.uid}>
                    {professor.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Button type="submit" disabled={salvando} className="min-w-40">
                {editando ? <Pencil size={16} /> : <Plus size={16} />}
                {editando ? 'Salvar edição' : 'Criar disciplina'}
              </Button>
              {editando ? (
                <Button type="button" variant="secondary" onClick={cancelarEdicao}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        </section>

        <Table>
          <thead>
            <tr>
              <Th>Disciplina</Th>
              <Th>Turma</Th>
              <Th>Professor</Th>
              <Th className="text-right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map(item => {
              const turma = turmasMap.get(item.turmaId);
              const professor = professoresMap.get(item.professorId);

              return (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <Td className="font-semibold text-slate-800">{item.nome}</Td>
                  <Td>{turma?.nome ?? '—'}</Td>
                  <Td>{professor?.nome ?? 'Professor não encontrado'}</Td>
                  <Td className="whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button type="button" variant="secondary" onClick={() => iniciarEdicao(item)} className="min-w-28">
                        <Pencil size={15} />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={async () => {
                          if (!item.id) return;
                          const ok = window.confirm(`Deseja excluir a disciplina "${item.nome}"?`);
                          if (!ok) return;
                          try {
                            await excluirDisciplina(item.id);
                            await load();
                          } catch (error) {
                            setErro(error instanceof Error ? error.message : 'Erro ao excluir disciplina.');
                          }
                        }}
                        className="min-w-28"
                      >
                        <Trash2 size={15} />
                        Excluir
                      </Button>
                    </div>
                  </Td>
                </tr>
              );
            })}

            {disciplinas.length === 0 ? (
              <tr>
                <Td className="py-10 text-center text-slate-500" colSpan={4}>
                  Nenhuma disciplina cadastrada até o momento.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </AppShell>
    </AdminRoute>
  );
}
