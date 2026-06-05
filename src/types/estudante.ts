import { Timestamp } from 'firebase/firestore';
export type Estudante = { id?: string; nome: string; dataNascimento: string; idade: string; etapaSeriacao: string; turmaId: string; fotoUrl?: string; responsaveis: string[]; createdAt?: Timestamp; updatedAt?: Timestamp };
