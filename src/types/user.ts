import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'professor';
export type ProfessorFuncao = 'regente' | 'ensino_religioso' | 'educacao_fisica' | 'arte';

export const PROFESSOR_FUNCOES: { value: ProfessorFuncao; label: string }[] = [
  { value: 'regente', label: 'Regente' },
  { value: 'ensino_religioso', label: 'Ensino Religioso' },
  { value: 'educacao_fisica', label: 'Educação Física' },
  { value: 'arte', label: 'Arte' }
];

export type AppUser = {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  funcao?: ProfessorFuncao | '';
  turmasIds: string[];
  disciplinasIds: string[];
  ativo: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
