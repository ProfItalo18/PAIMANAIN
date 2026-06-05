import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Estudante } from '@/types/estudante';

export async function uploadFotoEstudante(file: File, estudanteId: string) {
  const r = ref(storage, `estudantes/${estudanteId}/${Date.now()}-${file.name}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function criarEstudante(data: Omit<Estudante, 'id' | 'createdAt'>) {
  const refDoc = await addDoc(collection(db, 'estudantes'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await updateDoc(doc(db, 'turmas', data.turmaId), {
    estudantesIds: arrayUnion(refDoc.id),
    updatedAt: serverTimestamp()
  });

  return refDoc;
}

export async function atualizarEstudante(id: string, data: Partial<Estudante>) {
  return updateDoc(doc(db, 'estudantes', id), { ...data, updatedAt: serverTimestamp() });
}

export async function excluirEstudante(id: string, turmaId?: string) {
  await deleteDoc(doc(db, 'estudantes', id));
  if (turmaId) {
    await updateDoc(doc(db, 'turmas', turmaId), {
      estudantesIds: arrayRemove(id),
      updatedAt: serverTimestamp()
    });
  }
}

export async function listarEstudantesAdmin() {
  const qs = await getDocs(collection(db, 'estudantes'));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Estudante));
}

export async function listarEstudantesPorTurma(turmaId: string) {
  const qs = await getDocs(query(collection(db, 'estudantes'), where('turmaId', '==', turmaId)));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Estudante));
}

export async function obterEstudante(id: string) {
  const s = await getDoc(doc(db, 'estudantes', id));
  return s.exists() ? ({ id: s.id, ...s.data() } as Estudante) : null;
}
