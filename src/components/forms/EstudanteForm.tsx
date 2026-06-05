'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Turma } from '@/types/turma';
import { Estudante } from '@/types/estudante';
import { calcularIdade } from '@/utils/dates';

const schema = z.object({
  nome: z.string().min(2),
  dataNascimento: z.string().min(8),
  etapaSeriacao: z.string().min(2),
  turmaId: z.string().min(2),
  responsaveisTexto: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type SubmitData = FormData & { idade: string; responsaveis: string[]; fotoFile?: File | null };

export function EstudanteForm({
  turmas,
  initialData,
  onSubmit,
  onCancel
}: {
  turmas: Turma[];
  initialData?: Partial<Estudante> | null;
  onSubmit: (data: SubmitData) => Promise<void>;
  onCancel?: () => void;
}) {
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      dataNascimento: '',
      etapaSeriacao: '',
      turmaId: '',
      responsaveisTexto: ''
    }
  });

  useEffect(() => {
    reset({
      nome: initialData?.nome ?? '',
      dataNascimento: initialData?.dataNascimento ?? '',
      etapaSeriacao: initialData?.etapaSeriacao ?? '',
      turmaId: initialData?.turmaId ?? '',
      responsaveisTexto: initialData?.responsaveis?.join(', ') ?? ''
    });
    setFotoFile(null);
  }, [initialData, reset]);

  const dataNascimento = watch('dataNascimento');

  return (
    <form
      onSubmit={handleSubmit(async d =>
        onSubmit({
          ...d,
          idade: calcularIdade(d.dataNascimento),
          responsaveis: (d.responsaveisTexto ?? '')
            .split(',')
            .map(x => x.trim())
            .filter(Boolean),
          fotoFile
        })
      )}
      className="grid gap-3 md:grid-cols-2"
    >
      <Input placeholder="Nome do estudante" {...register('nome')} />
      <Input type="date" {...register('dataNascimento')} />
      <Input placeholder="Etapa/Seriação" {...register('etapaSeriacao')} />
      <Input value={calcularIdade(dataNascimento)} readOnly placeholder="Idade calculada" />
      <Select {...register('turmaId')}>
        <option value="">Selecione a turma</option>
        {turmas.map(t => (
          <option key={t.id} value={t.id}>
            {t.nome}
          </option>
        ))}
      </Select>
      <Input placeholder="Responsáveis separados por vírgula" {...register('responsaveisTexto')} />
      <div className="md:col-span-2 grid gap-3 md:grid-cols-[1fr_auto] items-end">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Foto do aluno</label>
          <Input type="file" accept="image/*" onChange={e => setFotoFile(e.target.files?.[0] ?? null)} />
          {initialData?.fotoUrl ? <p className="mt-1 text-xs text-slate-500">Já existe uma foto cadastrada para este aluno.</p> : null}
        </div>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full md:w-auto">
            Cancelar edição
          </Button>
        ) : null}
      </div>
      <Button disabled={isSubmitting} className="md:col-span-2">
        {initialData?.id ? 'Atualizar estudante' : 'Salvar estudante'}
      </Button>
    </form>
  );
}
