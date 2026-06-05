import { Timestamp } from 'firebase/firestore';

export const NIVEIS_ESTUDANTE = ['Lembrar', 'Entender', 'Aplicar', 'Analisar', 'Avaliar', 'Criar'] as const;
export const REGISTROS = ['R', 'RP', 'NP', 'NR'] as const;

export type NivelEstudante = (typeof NIVEIS_ESTUDANTE)[number];
export type RegistroCodigo = (typeof REGISTROS)[number];

export type ObjetivoDisciplina = {
  disciplinaId: string;
  disciplinaNome: string;
  professorId: string;
  objetivoAfetivo: string;
  objetivoPsicomotor: string;
  objetivoCognitivo: string;
  nivelEstudante: NivelEstudante[];
  estrategiaEnsino: string;
};

export type RegistroProcessualItem = {
  nome: string;
  registro: RegistroCodigo;
};

export type AssinaturaDigital = {
  nome: string;
  funcao: string;
  uid?: string;
  dataHora?: Timestamp | string;
};

export type Pai = {
  id?: string;
  estudanteId: string;
  turmaId: string;
  instituicao: string;
  semestre: string;
  ano: number;
  identificacao: {
    nome: string;
    etapaSeriacao: string;
    dataNascimento: string;
    idade: string;
    regente1: string;
    ensinoReligioso: string;
    arte: string;
    educacaoFisica: string;
    pedagoga: string;
    fotoUrl?: string;
  };
  mapeamento: {
    potencialidades: {
      participacao: string;
      respostas: string;
      compreensao: string;
      desenvolvimento: string;
    };
    dificuldades: {
      dependencia: string;
      comunicacao: string;
      motricidade: string;
      autonomia: string;
    };
  };
  acaoFamilia: string;
  objetivos: ObjetivoDisciplina[];
  registroProcessual: {
    itens: RegistroProcessualItem[];
  };
  acaoColaborativaEscolar: string;
  status: 'rascunho' | 'encaminhado_visto' | 'visto' | 'finalizado';
  encaminhadoPor?: string;
  encaminhadoPorNome?: string;
  encaminhadoEm?: Timestamp | string;
  vistadoPor?: string;
  vistadoPorNome?: string;
  vistadoEm?: Timestamp | string;
  assinaturasDigitais?: {
    professores?: AssinaturaDigital[];
    coordenacao?: AssinaturaDigital | null;
  };
  criadoPor: string;
  atualizadoPor: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
