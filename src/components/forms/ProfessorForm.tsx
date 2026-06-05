'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AppUser, PROFESSOR_FUNCOES } from '@/types/user';

const schema = z.object({
  uid: z.string().min(4, 'Informe o UID do usuário após o primeiro login'),
  nome: z.string().min(2),
  email: z.string().email(),
  funcao: z.enum(['regente', 'ensino_religioso', 'educacao_fisica', 'arte'])
});

type FormData = z.infer<typeof schema>;

export function ProfessorForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: Partial<AppUser> | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { uid: '', nome: '', email: '', funcao: 'regente' }
  });

  useEffect(() => {
    reset({
      uid: initialData?.uid ?? '',
      nome: initialData?.nome ?? '',
      email: initialData?.email ?? '',
      funcao: (initialData?.funcao as FormData['funcao']) ?? 'regente'
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Input placeholder="UID Firebase do professor" {...register('uid')} />
      <Input placeholder="Nome" {...register('nome')} />
      <Input placeholder="E-mail Gmail" {...register('email')} />
      <Select {...register('funcao')}>
        {PROFESSOR_FUNCOES.map(f => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </Select>
      <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-4">
        <Button disabled={isSubmitting}>{initialData?.uid ? 'Atualizar professor' : 'Salvar professor'}</Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar edição
          </Button>
        ) : null}
      </div>
    </form>
  );
}
