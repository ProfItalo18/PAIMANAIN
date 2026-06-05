import { Timestamp } from 'firebase/firestore';

export type Turma = {
  id?: string;
  nome: string;
  etapa: string;
  anoLetivo: number;
  turno: string;
  professoresIds: string[];
  estudantesIds: string[];
  disciplinasIds: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
