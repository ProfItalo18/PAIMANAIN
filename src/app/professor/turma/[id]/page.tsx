'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfessorRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Table, Th, Td } from '@/components/ui/Table';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { listarEstudantesPorTurma } from '@/services/estudantesService';
import { listarDisciplinasProfessorPorTurma } from '@/services/disciplinasService';
import { criarPaiBase } from '@/components/forms/PaiForm';
import { criarPai, listarPaisPorTurma, obterPaiPorEstudanteTurma } from '@/services/paisService';
import { Estudante } from '@/types/estudante';
import { Pai } from '@/types/pai';
import { FilePlus2 } from 'lucide-react';
import { formatarDataHoraFirestore, statusPaiLabel } from '@/utils/paiStatus';

export default function TurmaDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [pais, setPais] = useState<Pai[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErro(null);
    try {
      const [estudantesData, paisData] = await Promise.all([listarEstudantesPorTurma(id), listarPaisPorTurma(id)]);
      setEstudantes(estudantesData);
      setPais(paisData);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados da turma.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const paiPorEstudante = useMemo(() => {
    const map = new Map<string, Pai>();
    pais.forEach(p => map.set(p.estudanteId, p));
    return map;
  }, [pais]);

  async function abrirOuCriarPai(e: Estudante) {
    if (!user) return;

    try {
      const existente = await obterPaiPorEstudanteTurma(e.id!, id);
      if (existente?.id) {
        window.location.href = `/professor/pai/${existente.id}`;
        return;
      }

      const disciplinas = await listarDisciplinasProfessorPorTurma(user.uid, id);
      if (!disciplinas.length) {
        setErro('Você está vinculado à turma, mas ainda não possui disciplina vinculada nela. Solicite ao administrador o vínculo da disciplina.');
        return;
      }

      const ref = await criarPai(criarPaiBase(e, disciplinas, user.uid));
      window.location.href = `/professor/pai/${ref.id}`;
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao abrir ou criar PAI.');
    }
  }

  return (
    <ProfessorRoute>
      <AppShell>
        <Header title="Estudantes da turma" subtitle="Abra o PAI existente ou crie um novo somente quando ainda não houver rascunho para o estudante." />
        {erro && <ErrorNotice message={erro} />}
        {loading && <div className="glass rounded-[1.7rem] p-6 text-sm font-bold text-slate-600">Carregando estudantes...</div>}
        {!loading && !erro && estudantes.length === 0 && (
          <EmptyState title="Nenhum estudante cadastrado">
            <p>O administrador precisa cadastrar estudantes e vinculá-los a esta turma.</p>
          </EmptyState>
        )}

        {estudantes.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Estudante</Th>
                <Th>Etapa/Seriação</Th>
                <Th>Professor</Th>
                <Th>Horário de encaminhamento</Th>
                <Th>Status</Th>
                <Th>Ação</Th>
              </tr>
            </thead>
            <tbody>
              {estudantes.map(e => {
                const pai = paiPorEstudante.get(e.id!);

                return (
                  <tr key={e.id}>
                    <Td>
                      <b className="text-slate-950">{e.nome}</b>
                      <p className="text-xs text-slate-500">Nascimento: {e.dataNascimento}</p>
                    </Td>
                    <Td>{e.etapaSeriacao}</Td>
                    <Td>{pai?.encaminhadoPorNome || '—'}</Td>
                    <Td>{formatarDataHoraFirestore(pai?.encaminhadoEm)}</Td>
                    <Td>{statusPaiLabel(pai?.status)}</Td>
                    <Td>
                      <Button onClick={() => abrirOuCriarPai(e)}>
                        <FilePlus2 size={16} />
                        {pai ? 'Abrir PAI' : 'Criar PAI'}
                      </Button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </AppShell>
    </ProfessorRoute>
  );
}
