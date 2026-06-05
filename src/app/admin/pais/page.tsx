'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AdminRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Table, Th, Td } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { excluirPai, listarPaisAdmin, obterPai, registrarVistoPai } from '@/services/paisService';
import { Pai } from '@/types/pai';
import { formatarDataHoraFirestore, statusPaiLabel } from '@/utils/paiStatus';
import { useAuth } from '@/contexts/AuthContext';

export default function PaisAdminPage() {
  const [pais, setPais] = useState<Pai[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { user } = useAuth();

  async function carregar() {
    const data = await listarPaisAdmin();
    setPais(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  const totalPorAluno = useMemo(() => {
    const map = new Map<string, number>();
    pais.forEach(p => map.set(p.estudanteId, (map.get(p.estudanteId) || 0) + 1));
    return map;
  }, [pais]);

  async function handleExcluir(id?: string) {
    if (!id) return;
    if (!window.confirm('Deseja realmente excluir este PAI?')) return;
    setLoadingId(id);
    try {
      await excluirPai(id);
      await carregar();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleVisto(id?: string) {
    if (!id || !user) return;
    setLoadingId(id);
    try {
      const pai = await obterPai(id);
      if (!pai) return;
      await registrarVistoPai(id, pai, user);
      await carregar();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <AdminRoute>
      <AppShell>
        <Header title="Todos os PAIs" subtitle="Gerencie rascunhos, encaminhamentos para visto, vistos e exclusões de documentos duplicados." />
        <Table>
          <thead>
            <tr>
              <Th>Estudante</Th>
              <Th>Ano</Th>
              <Th>Status</Th>
              <Th>Professor</Th>
              <Th>Horário de encaminhamento</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {pais.map(p => (
              <tr key={p.id}>
                <Td>
                  <div className="space-y-1">
                    <div>{p.identificacao.nome}</div>
                    {(totalPorAluno.get(p.estudanteId) || 0) > 1 && (
                      <div className="text-xs font-semibold text-amber-600">Há mais de um PAI para este estudante</div>
                    )}
                  </div>
                </Td>
                <Td>{p.ano}</Td>
                <Td>{statusPaiLabel(p.status)}</Td>
                <Td>{p.encaminhadoPorNome || '—'}</Td>
                <Td>{formatarDataHoraFirestore(p.encaminhadoEm)}</Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Link className="font-semibold text-paiBlue" href={`/pai/visualizar/${p.id}`}>
                      Visualizar
                    </Link>
                    <Link className="font-semibold text-paiGreen" href={`/professor/pai/${p.id}`}>
                      Editar
                    </Link>
                    {p.status === 'encaminhado_visto' && (
                      <Button variant="secondary" disabled={loadingId === p.id} onClick={() => handleVisto(p.id)}>
                        Dar visto
                      </Button>
                    )}
                    <Button variant="danger" disabled={loadingId === p.id} onClick={() => handleExcluir(p.id)}>
                      Excluir
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </AppShell>
    </AdminRoute>
  );
}
