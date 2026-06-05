'use client';

import { ObjetivoDisciplina, NIVEIS_ESTUDANTE, Pai } from '@/types/pai';
import { Textarea } from '@/components/ui/Textarea';
import { canEditObjetivo } from '@/utils/permissions';
import { AppUser } from '@/types/user';

export function ObjetivoDisciplinaForm({
  objetivo,
  user,
  status,
  onChange
}: {
  objetivo: ObjetivoDisciplina;
  user: AppUser | null;
  status?: Pai['status'];
  onChange: (o: ObjetivoDisciplina) => void;
}) {
  const disabled = !canEditObjetivo(user, objetivo.professorId, {
    disciplinaId: objetivo.disciplinaId,
    status
  });

  const set = (patch: Partial<ObjetivoDisciplina>) => onChange({ ...objetivo, ...patch });

  return (
    <div className="rounded-2xl border bg-white p-4">
      <h3 className="mb-3 font-bold text-paiGreen">{objetivo.disciplinaNome}</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <Textarea disabled={disabled} placeholder="Objetivo afetivo" value={objetivo.objetivoAfetivo} onChange={e => set({ objetivoAfetivo: e.target.value })} />
        <Textarea disabled={disabled} placeholder="Objetivo psicomotor" value={objetivo.objetivoPsicomotor} onChange={e => set({ objetivoPsicomotor: e.target.value })} />
        <Textarea disabled={disabled} placeholder="Objetivo cognitivo" value={objetivo.objetivoCognitivo} onChange={e => set({ objetivoCognitivo: e.target.value })} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3">
          <p className="mb-2 text-sm font-semibold">Nível do estudante</p>
          {NIVEIS_ESTUDANTE.map(n => (
            <label key={n} className="mr-4 inline-flex items-center gap-2 text-sm">
              <input
                disabled={disabled}
                type="checkbox"
                checked={objetivo.nivelEstudante.includes(n)}
                onChange={e =>
                  set({
                    nivelEstudante: e.target.checked
                      ? [...objetivo.nivelEstudante, n]
                      : objetivo.nivelEstudante.filter(x => x !== n)
                  })
                }
              />
              {n}
            </label>
          ))}
        </div>
        <Textarea disabled={disabled} placeholder="Estratégia de ensino" value={objetivo.estrategiaEnsino} onChange={e => set({ estrategiaEnsino: e.target.value })} />
      </div>
      {disabled && (
        <p className="mt-2 text-xs text-amber-700">
          Este PAI já foi encaminhado para visto ou você não está vinculado a esta disciplina.
        </p>
      )}
    </div>
  );
}
