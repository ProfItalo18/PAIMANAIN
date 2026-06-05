import { isAdminEmail as isAdminEmailFromConfig } from '@/lib/firebase';
import { AppUser } from '@/types/user';
import { Pai } from '@/types/pai';

export const isAdminEmail = (email?: string | null) => isAdminEmailFromConfig(email);

export const canAccessTurma = (user: AppUser | null, turmaId: string) =>
  !!user && (user.role === 'admin' || user.turmasIds.includes(turmaId));

export const canEditPaiDaTurmaAteVisto = (user: AppUser | null, pai: Pick<Pai, 'turmaId' | 'status'>) =>
  !!user && (user.role === 'admin' || (user.turmasIds.includes(pai.turmaId) && pai.status === 'rascunho'));

export const canAccessDisciplina = (
  user: AppUser | null,
  disciplina: { disciplinaId?: string; professorId?: string }
) => {
  if (!user) return false;
  if (user.role === 'admin') return true;

  return Boolean(
    (disciplina.professorId && user.uid === disciplina.professorId) ||
      (disciplina.disciplinaId && user.disciplinasIds.includes(disciplina.disciplinaId))
  );
};

export const canEditObjetivo = (
  user: AppUser | null,
  professorId: string,
  options?: { disciplinaId?: string; status?: Pai['status'] }
) => {
  if (!user) return false;
  if (user.role === 'admin') return true;

  const estaAntesDoVisto = !options?.status || options.status === 'rascunho';
  const vinculadoNaDisciplina =
    user.uid === professorId || Boolean(options?.disciplinaId && user.disciplinasIds.includes(options.disciplinaId));

  return estaAntesDoVisto && vinculadoNaDisciplina;
};

export const canAccessPai = (user: AppUser | null, pai: Pai) =>
  !!user && (user.role === 'admin' || user.turmasIds.includes(pai.turmaId));
