'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ObjetivoDisciplinaForm } from './ObjetivoDisciplinaForm';
import { AppUser } from '@/types/user';
import { Pai, ObjetivoDisciplina, REGISTROS } from '@/types/pai';
import { Disciplina } from '@/types/disciplina';
import { Estudante } from '@/types/estudante';
import { normalizarPai } from '@/utils/pai';
import { uploadFotoPai } from '@/services/paisService';
import { ordenarPorDisciplina } from '@/utils/disciplinas';
import { canAccessDisciplina } from '@/utils/permissions';

const textoPadraoFamilia =
  'Utilizar comunicação alternativa, objetos concretos, apoio físico planejado, rotina visual, comandos simples, tempo ampliado e mediação individualizada, valorizando pequenas respostas e avanços funcionais.';

const exemplosPotencialidades = [
  'Exemplo: participa melhor quando a rotina é antecipada visualmente.',
  'Exemplo: responde com mais segurança quando recebe comandos simples e tempo ampliado.',
  'Exemplo: compreende melhor atividades com apoio concreto, imagens e demonstração.',
  'Exemplo: apresenta avanços graduais quando há repetição, mediação e reforço positivo.'
];

const exemplosDificuldades = [
  'Exemplo: necessita de apoio para iniciar, organizar ou finalizar propostas.',
  'Exemplo: pode apresentar dificuldade para compreender enunciados longos.',
  'Exemplo: pode precisar de adaptações em atividades que envolvem coordenação motora.',
  'Exemplo: requer orientação para manter rotina, materiais e autonomia nas tarefas.'
];

export function criarPaiBase(
  estudante: Estudante,
  disciplinas: Disciplina[],
  uid: string
): Omit<Pai, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    estudanteId: estudante.id!,
    turmaId: estudante.turmaId,
    instituicao: 'Escola Manain',
    semestre: '1º semestre',
    ano: new Date().getFullYear(),
    identificacao: {
      nome: estudante.nome,
      etapaSeriacao: estudante.etapaSeriacao,
      dataNascimento: estudante.dataNascimento,
      idade: estudante.idade,
      regente1: '',
      ensinoReligioso: '',
      arte: '',
      educacaoFisica: '',
      pedagoga: '',
      fotoUrl: estudante.fotoUrl
    },
    mapeamento: {
      potencialidades: { participacao: '', respostas: '', compreensao: '', desenvolvimento: '' },
      dificuldades: { dependencia: '', comunicacao: '', motricidade: '', autonomia: '' }
    },
    acaoFamilia: textoPadraoFamilia,
    objetivos: ordenarPorDisciplina(disciplinas).map(
      d =>
        ({
          disciplinaId: d.id!,
          disciplinaNome: d.nome,
          professorId: d.professorId,
          objetivoAfetivo: '',
          objetivoPsicomotor: '',
          objetivoCognitivo: '',
          nivelEstudante: ['Lembrar', 'Entender'],
          estrategiaEnsino: ''
        }) as ObjetivoDisciplina
    ),
    registroProcessual: {
      itens: ordenarPorDisciplina(disciplinas).map(d => ({ nome: d.nome, registro: 'NR' as const }))
    },
    acaoColaborativaEscolar: '',
    status: 'rascunho',
    criadoPor: uid,
    atualizadoPor: uid
  };
}

export function PaiForm({
  initialPai,
  user,
  onSave
}: {
  initialPai: Omit<Pai, 'id' | 'createdAt' | 'updatedAt'> | Pai;
  user: AppUser | null;
  onSave: (pai: Omit<Pai, 'id' | 'createdAt' | 'updatedAt'> | Pai) => Promise<void>;
}) {
  const [pai, setPai] = useState(normalizarPai(initialPai));
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const professorJaAssinou = Boolean(
    user?.uid && pai.assinaturasDigitais?.professores?.some(assinatura => assinatura.uid === user.uid)
  );
  const professorVinculadoNaTurma = Boolean(user?.turmasIds?.includes(pai.turmaId));
  const objetivosPermitidos =
    user?.role === 'admin'
      ? ordenarPorDisciplina(pai.objetivos)
      : ordenarPorDisciplina(
          pai.objetivos.filter(objetivo =>
            canAccessDisciplina(user, { disciplinaId: objetivo.disciplinaId, professorId: objetivo.professorId })
          )
        );
  const todosObjetivosOrdenados = ordenarPorDisciplina(pai.objetivos);
  const professorTemDisciplinaNoPai = objetivosPermitidos.length > 0;
  const podeEditarGeral = user?.role === 'admin';
  const podeEditarDisciplinas =
    user?.role === 'admin' || Boolean(professorVinculadoNaTurma && professorTemDisciplinaNoPai && pai.status === 'rascunho');
  const podeRegistrarAssinatura =
    Boolean(user && user.role !== 'admin' && professorVinculadoNaTurma && professorTemDisciplinaNoPai && pai.status === 'encaminhado_visto' && !professorJaAssinou);

  useEffect(() => setPai(normalizarPai(initialPai)), [initialPai]);

  const set = (path: string, value: any) => {
    setPai(prev => {
      const clone: any = structuredClone(prev);
      const keys = path.split('.');
      let cur = clone;
      keys.slice(0, -1).forEach(k => (cur = cur[k]));
      cur[keys.at(-1)!] = value;
      return clone;
    });
  };

  async function handleFotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFoto(true);
    try {
      const url = await uploadFotoPai(file, pai.estudanteId);
      set('identificacao.fotoUrl', url);
    } finally {
      setUploadingFoto(false);
    }
  }

  async function salvar(status?: 'rascunho' | 'encaminhado_visto' | 'visto' | 'finalizado') {
    setSaving(true);
    try {
      await onSave({
        ...pai,
        instituicao: 'Escola Manain',
        status: status ?? pai.status,
        ...(status === 'encaminhado_visto' && user
          ? {
              encaminhadoPor: user.uid,
              encaminhadoPorNome: user.nome || user.email,
              encaminhadoEm: new Date().toISOString()
            }
          : {})
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.25rem] border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-slate-700">
        <b>Status atual do documento:</b> {pai.status === 'encaminhado_visto' ? 'Encaminhado para visto' : pai.status === 'visto' ? 'Visto' : pai.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
      </div>
      <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-paiGreen">Identificação</h2>
            <p className="text-sm text-slate-500">Dados principais do estudante e dos profissionais responsáveis.</p>
          </div>

          <label className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-400 transition hover:border-paiBlue hover:bg-sky-50">
            {pai.identificacao.fotoUrl ? (
              <img src={pai.identificacao.fotoUrl} alt="Foto do aluno" className="h-full w-full object-cover" />
            ) : (
              <span>{uploadingFoto ? 'Enviando...' : 'Clique para inserir foto'}</span>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={handleFotoChange} disabled={uploadingFoto || !podeEditarGeral} />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Input value="Escola Manain" disabled />
          <Select disabled={!podeEditarGeral} value={pai.semestre} onChange={e => set('semestre', e.target.value)}>
            <option>1º semestre</option>
            <option>2º semestre</option>
            <option>Anual</option>
          </Select>
          <Input disabled={!podeEditarGeral} type="number" value={pai.ano} onChange={e => set('ano', Number(e.target.value))} />

          <Input value={pai.identificacao.nome} disabled />
          <Input value={pai.identificacao.etapaSeriacao} disabled />
          <Input value={pai.identificacao.idade} disabled />

          <Input disabled={!podeEditarGeral} placeholder="Regente" value={pai.identificacao.regente1} onChange={e => set('identificacao.regente1', e.target.value)} />
          <Input disabled={!podeEditarGeral} placeholder="Ensino Religioso" value={pai.identificacao.ensinoReligioso} onChange={e => set('identificacao.ensinoReligioso', e.target.value)} />
          <Input disabled={!podeEditarGeral} placeholder="Arte" value={pai.identificacao.arte} onChange={e => set('identificacao.arte', e.target.value)} />
          <Input disabled={!podeEditarGeral} placeholder="Educação Física" value={pai.identificacao.educacaoFisica} onChange={e => set('identificacao.educacaoFisica', e.target.value)} />
          <Input disabled={!podeEditarGeral} placeholder="Coordenação / Pedagoga(o) responsável" value={pai.identificacao.pedagoga} onChange={e => set('identificacao.pedagoga', e.target.value)} className="md:col-span-2" />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
        <h2 className="mb-1 font-black text-paiGreen">Mapeamento</h2>
        <p className="mb-4 text-sm text-slate-500">
          Preencha livremente. Os exemplos abaixo são apenas sugestões de escrita e não serão inseridos automaticamente no PAI.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <b className="text-paiBlue">Potencialidades do estudante</b>
            <Textarea
              disabled={!podeEditarGeral}
              placeholder={exemplosPotencialidades.join('\n')}
              value={[
                pai.mapeamento.potencialidades.participacao,
                pai.mapeamento.potencialidades.respostas,
                pai.mapeamento.potencialidades.compreensao,
                pai.mapeamento.potencialidades.desenvolvimento
              ].filter(Boolean).join('\n')}
              onChange={e => {
                const value = e.target.value;
                set('mapeamento.potencialidades.participacao', value);
                set('mapeamento.potencialidades.respostas', '');
                set('mapeamento.potencialidades.compreensao', '');
                set('mapeamento.potencialidades.desenvolvimento', '');
              }}
              rows={7}
            />
          </div>

          <div className="space-y-3">
            <b className="text-paiBlue">Dificuldades do estudante</b>
            <Textarea
              disabled={!podeEditarGeral}
              placeholder={exemplosDificuldades.join('\n')}
              value={[
                pai.mapeamento.dificuldades.dependencia,
                pai.mapeamento.dificuldades.comunicacao,
                pai.mapeamento.dificuldades.motricidade,
                pai.mapeamento.dificuldades.autonomia
              ].filter(Boolean).join('\n')}
              onChange={e => {
                const value = e.target.value;
                set('mapeamento.dificuldades.dependencia', value);
                set('mapeamento.dificuldades.comunicacao', '');
                set('mapeamento.dificuldades.motricidade', '');
                set('mapeamento.dificuldades.autonomia', '');
              }}
              rows={7}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
        <h2 className="mb-3 font-black text-paiGreen">Ação colaborativa da família</h2>
        <Textarea disabled={!podeEditarGeral} value={pai.acaoFamilia} onChange={e => set('acaoFamilia', e.target.value)} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-black text-paiGreen">Objetivos por disciplina</h2>
          <p className="text-sm text-slate-500">Organize os objetivos, nível do estudante e estratégias de ensino por componente curricular.</p>
        </div>
        {todosObjetivosOrdenados.map((o) => {
          const i = pai.objetivos.findIndex(item => item.disciplinaId === o.disciplinaId);
          return (
            <ObjetivoDisciplinaForm key={o.disciplinaId} objetivo={o} user={user} status={pai.status} onChange={novo => set(`objetivos.${i}`, novo)} />
          );
        })}
        {objetivosPermitidos.length === 0 && user?.role !== 'admin' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Você pode visualizar as disciplinas da turma, mas ainda não possui disciplina vinculada para edição neste PAI. Solicite ao administrador o vínculo da disciplina correta.
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
        <h2 className="mb-1 font-black text-paiGreen">Registro processual</h2>
        <p className="mb-4 text-sm text-slate-500">
          Use a legenda para indicar o que o estudante realiza em cada componente curricular: R = Realizado, RP = Realizado
          Parcialmente, NP = Não Realizado, NR = Não Registrado.
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ordenarPorDisciplina(pai.registroProcessual.itens).map((item) => {
            const idx = pai.registroProcessual.itens.findIndex(i => i.nome === item.nome);
            return (
            <div key={`${item.nome}-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">{item.nome}</label>
              <Select disabled={!(user?.role === 'admin' || (pai.status === 'rascunho' && objetivosPermitidos.some(obj => obj.disciplinaNome === item.nome)))} value={item.registro} onChange={e => set(`registroProcessual.itens.${idx}.registro`, e.target.value)}>
                {REGISTROS.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
          );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
        <h2 className="mb-3 font-black text-paiGreen">Ação colaborativa entre professores, comunidade escolar e equipe multiprofissional</h2>
        <Textarea disabled={!podeEditarGeral} value={pai.acaoColaborativaEscolar} onChange={e => set('acaoColaborativaEscolar', e.target.value)} />
      </section>

      {podeEditarDisciplinas ? (
        <div className="sticky bottom-4 flex flex-wrap gap-2 rounded-[1.5rem] border border-white/70 bg-white/90 p-3 shadow-card backdrop-blur">
          <Button disabled={saving || uploadingFoto} onClick={() => salvar('rascunho')}>
            Salvar rascunho
          </Button>
          <Button disabled={saving || uploadingFoto} variant="secondary" onClick={() => salvar('encaminhado_visto')}>
            Encaminhar para visto e assinar
          </Button>
        </div>
      ) : podeRegistrarAssinatura ? (
        <div className="sticky bottom-4 flex flex-wrap gap-2 rounded-[1.5rem] border border-white/70 bg-white/90 p-3 shadow-card backdrop-blur">
          <Button disabled={saving || uploadingFoto} variant="secondary" onClick={() => salvar('encaminhado_visto')}>
            Registrar minha assinatura
          </Button>
          <span className="text-sm text-slate-500">
            O conteúdo já foi encaminhado. Este botão registra apenas a sua assinatura digital individual.
          </span>
        </div>
      ) : (
        <div className="rounded-[1.25rem] border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
          Você pode visualizar este PAI, mas só o professor responsável pela disciplina pode editar. Após o encaminhamento para visto, a edição fica bloqueada.
        </div>
      )}
    </div>
  );
}
