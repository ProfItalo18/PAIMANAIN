'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { PaiForm } from '@/components/forms/PaiForm';
import { useAuth } from '@/contexts/AuthContext';
import { editarPai, encaminharPaiParaVisto, obterPai, registrarAssinaturaProfessor } from '@/services/paisService';
import { Pai } from '@/types/pai';

export default function EditarPaiPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [pai, setPai] = useState<Pai | null>(null);

  useEffect(() => {
    obterPai(id).then(setPai);
  }, [id]);

  if (!pai) {
    return (
      <ProtectedRoute>
        <AppShell>Carregando PAI...</AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <Header title={`Editar PAI - ${pai.identificacao.nome}`} />
        <PaiForm
          initialPai={pai}
          user={user}
          onSave={async data => {
            if (!user) return;

            const payload = data as Partial<Pai>;

            if (payload.status === 'encaminhado_visto') {
              if (pai.status === 'encaminhado_visto') {
                await registrarAssinaturaProfessor(id, { ...pai, ...payload } as Pai, user);
              } else {
                await encaminharPaiParaVisto(id, payload, user);
              }
            } else {
              await editarPai(id, payload, user.uid);
            }

            router.push(`/pai/visualizar/${id}`);
          }}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
