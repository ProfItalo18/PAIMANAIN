'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Turma } from '@/types/turma';

const schema = z.object({
  nome: z.string().min(2),
  etapa: z.string().min(2),
  anoLetivo: z.coerce.number().min(2024),
  turno: z.string().min(2)
});

type FormData = z.infer<typeof schema>;

export function TurmaForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: Partial<Turma> | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', etapa: '', anoLetivo: new Date().getFullYear(), turno: 'Manhã' }
  });

  useEffect(() => {
    reset({
      nome: initialData?.nome ?? '',
      etapa: initialData?.etapa ?? '',
      anoLetivo: initialData?.anoLetivo ?? new Date().getFullYear(),
      turno: initialData?.turno ?? 'Manhã'
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
      <Input placeholder="Nome da turma" {...register('nome')} />
      <Input placeholder="Etapa/Seriação" {...register('etapa')} />
      <Input type="number" placeholder="Ano letivo" {...register('anoLetivo')} />
      <Select {...register('turno')}>
        <option>Manhã</option>
        <option>Tarde</option>
        <option>Noite</option>
        <option>Integral</option>
      </Select>
      <div className="md:col-span-2 flex flex-wrap gap-2">
        <Button disabled={isSubmitting}>{initialData?.id ? 'Atualizar turma' : 'Salvar turma'}</Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar edição
          </Button>
        ) : null}
      </div>
    </form>
  );
}
