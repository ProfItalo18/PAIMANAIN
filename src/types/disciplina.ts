import { Timestamp } from 'firebase/firestore';

export type Disciplina = {
  id?: string;
  nome: string;
  professorId: string;
  turmaId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
