import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Disciplina } from '@/types/disciplina';

export const DISCIPLINAS_PADRAO = [
  'Língua Portuguesa',
  'Matemática',
  'Competências Digitais',
  'Ciências',
  'Geografia',
  'História',
  'Ensino Religioso',
  'Arte',
  'Educação Física'
];

export async function listarDisciplinas() {
  const qs = await getDocs(query(collection(db, 'disciplinas'), orderBy('nome')));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Disciplina));
}

export async function listarDisciplinasPorTurma(turmaId: string) {
  const qs = await getDocs(query(collection(db, 'disciplinas'), where('turmaId', '==', turmaId)));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Disciplina));
}

export async function listarDisciplinasProfessor(uid: string) {
  const qs = await getDocs(query(collection(db, 'disciplinas'), where('professorId', '==', uid)));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Disciplina));
}

export async function listarDisciplinasProfessorPorTurma(uid: string, turmaId: string) {
  const qs = await getDocs(
    query(collection(db, 'disciplinas'), where('professorId', '==', uid), where('turmaId', '==', turmaId))
  );
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Disciplina));
}

export async function criarDisciplina(data: Omit<Disciplina, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await addDoc(collection(db, 'disciplinas'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await updateDoc(doc(db, 'turmas', data.turmaId), {
    disciplinasIds: arrayUnion(ref.id),
    updatedAt: serverTimestamp()
  });

  await updateDoc(doc(db, 'users', data.professorId), {
    disciplinasIds: arrayUnion(ref.id),
    updatedAt: serverTimestamp()
  });

  return ref;
}

export async function atualizarDisciplina(id: string, data: Partial<Disciplina>) {
  await updateDoc(doc(db, 'disciplinas', id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function excluirDisciplina(id: string) {
  await deleteDoc(doc(db, 'disciplinas', id));
}
