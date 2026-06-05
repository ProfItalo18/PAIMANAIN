'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PaiVisual } from '@/components/pai/PaiVisual';
import { PaiPrint } from '@/components/pai/PaiPrint';
import { obterPai, registrarVistoPai } from '@/services/paisService';
import { Pai } from '@/types/pai';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export default function VisualizarPaiPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [pai, setPai] = useState<Pai | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    obterPai(id).then(setPai);
  }, [id]);

  async function handleVisto() {
    if (!pai || !user) return;
    setSaving(true);
    try {
      await registrarVistoPai(id, pai, user);
      const atualizado = await obterPai(id);
      setPai(atualizado);
    } finally {
      setSaving(false);
    }
  }

  if (!pai)
    return (
      <ProtectedRoute>
        <main className="p-6">Carregando documento...</main>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <main className="p-4 md:p-6">
        <div className="no-print mx-auto mb-4 flex max-w-[297mm] items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-card backdrop-blur">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-semibold text-paiBlue">
              Voltar
            </Link>
            {isAdmin && pai.status === 'encaminhado_visto' && (
              <Button variant="secondary" disabled={saving} onClick={handleVisto}>
                Dar visto
              </Button>
            )}
          </div>
          <PaiPrint filename={`PAI-${pai.identificacao.nome}-${pai.ano}.pdf`} />
        </div>
        <PaiVisual pai={pai} />
      </main>
    </ProtectedRoute>
  );
}
