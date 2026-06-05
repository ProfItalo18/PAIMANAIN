import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Turma } from '@/types/turma';

export async function criarTurma(data: Omit<Turma, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'turmas'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function atualizarTurma(id: string, data: Partial<Turma>) {
  await updateDoc(doc(db, 'turmas', id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function excluirTurma(id: string) {
  await deleteDoc(doc(db, 'turmas', id));
}

export async function listarTurmasAdmin() {
  const qs = await getDocs(query(collection(db, 'turmas'), orderBy('nome')));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Turma));
}

export async function listarTurmasProfessor(uid: string) {
  const userSnap = await getDoc(doc(db, 'users', uid));
  const userData = userSnap.exists() ? userSnap.data() : null;
  const turmasIds = Array.isArray(userData?.turmasIds) ? userData.turmasIds : [];

  if (!turmasIds.length) return [];

  const turmas = await Promise.all(
    turmasIds.map(async (turmaId: string) => {
      try {
        const turmaSnap = await getDoc(doc(db, 'turmas', turmaId));
        return turmaSnap.exists() ? ({ id: turmaSnap.id, ...turmaSnap.data() } as Turma) : null;
      } catch (error) {
        console.warn('Sem permissão para carregar turma vinculada:', turmaId, error);
        return null;
      }
    })
  );

  return (turmas.filter(Boolean) as Turma[]).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export async function vincularProfessorTurma(turmaId: string, professorId: string) {
  await updateDoc(doc(db, 'turmas', turmaId), {
    professoresIds: arrayUnion(professorId),
    updatedAt: serverTimestamp()
  });

  await updateDoc(doc(db, 'users', professorId), {
    turmasIds: arrayUnion(turmaId),
    updatedAt: serverTimestamp()
  });
}
