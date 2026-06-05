import { Pai } from '@/types/pai';

export function statusPaiLabel(status?: Pai['status']) {
  if (status === 'encaminhado_visto') return 'Encaminhado para visto';
  if (status === 'visto') return 'Visto';
  if (status === 'finalizado') return 'Finalizado';
  return 'Rascunho';
}

export function formatarDataHoraFirestore(value: any) {
  if (!value) return '—';

  try {
    if (typeof value?.toDate === 'function') {
      return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(value.toDate());
    }

    if (value instanceof Date) {
      return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(value);
    }

    if (typeof value === 'string') {
      return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
    }
  } catch {
    return '—';
  }

  return '—';
}
