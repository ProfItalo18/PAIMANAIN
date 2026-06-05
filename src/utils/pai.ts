import { Pai, RegistroCodigo } from '@/types/pai';
import { ordenarPorDisciplina } from '@/utils/disciplinas';

function registroValido(value: any): RegistroCodigo {
  return ['R', 'RP', 'NP', 'NR'].includes(value) ? (value as RegistroCodigo) : 'NR';
}

export function normalizarPai(data: any): Pai {
  const objetivos = ordenarPorDisciplina(Array.isArray(data?.objetivos) ? data.objetivos : []);

  const itensAntigos = [
    data?.registroProcessual?.regente1 ? { nome: 'Regente', registro: registroValido(data?.registroProcessual?.regente1) } : null,
    data?.registroProcessual?.arte ? { nome: 'Arte', registro: registroValido(data?.registroProcessual?.arte) } : null,
    data?.registroProcessual?.educacaoFisica ? { nome: 'Educação Física', registro: registroValido(data?.registroProcessual?.educacaoFisica) } : null,
    ...(Array.isArray(data?.registroProcessual?.outros)
      ? data.registroProcessual.outros.map((item: any) => ({ nome: item?.nome || 'Componente', registro: registroValido(item?.registro) }))
      : [])
  ].filter(Boolean) as { nome: string; registro: RegistroCodigo }[];

  const itensPorObjetivos = objetivos.map((o: any) => ({ nome: o?.disciplinaNome || 'Componente curricular', registro: 'NR' as RegistroCodigo }));
  const itensBrutos = Array.isArray(data?.registroProcessual?.itens) && data.registroProcessual.itens.length
    ? data.registroProcessual.itens.map((item: any) => ({ nome: item?.nome || 'Componente curricular', registro: registroValido(item?.registro) }))
    : itensAntigos.length
      ? itensAntigos
      : itensPorObjetivos;

  const itens = ordenarPorDisciplina(itensBrutos);

  return {
    ...data,
    instituicao: data?.instituicao || 'Escola Manain',
    status: data?.status || 'rascunho',
    identificacao: {
      nome: data?.identificacao?.nome || '',
      etapaSeriacao: data?.identificacao?.etapaSeriacao || '',
      dataNascimento: data?.identificacao?.dataNascimento || '',
      idade: data?.identificacao?.idade || '',
      regente1: data?.identificacao?.regente1 || '',
      ensinoReligioso: data?.identificacao?.ensinoReligioso || '',
      arte: data?.identificacao?.arte || '',
      educacaoFisica: data?.identificacao?.educacaoFisica || '',
      pedagoga: data?.identificacao?.pedagoga || '',
      fotoUrl: data?.identificacao?.fotoUrl || ''
    },
    mapeamento: {
      potencialidades: {
        participacao: data?.mapeamento?.potencialidades?.participacao || '',
        respostas: data?.mapeamento?.potencialidades?.respostas || '',
        compreensao: data?.mapeamento?.potencialidades?.compreensao || '',
        desenvolvimento: data?.mapeamento?.potencialidades?.desenvolvimento || ''
      },
      dificuldades: {
        dependencia: data?.mapeamento?.dificuldades?.dependencia || '',
        comunicacao: data?.mapeamento?.dificuldades?.comunicacao || '',
        motricidade: data?.mapeamento?.dificuldades?.motricidade || '',
        autonomia: data?.mapeamento?.dificuldades?.autonomia || ''
      }
    },
    objetivos,
    assinaturasDigitais: {
      professores: Array.isArray(data?.assinaturasDigitais?.professores) ? data.assinaturasDigitais.professores : [],
      coordenacao: data?.assinaturasDigitais?.coordenacao || null
    },
    registroProcessual: { itens }
  } as Pai;
}
