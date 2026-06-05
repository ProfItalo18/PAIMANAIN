import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppUser } from '@/types/user';
import { isAdminEmail } from '@/lib/firebase';

function normalizeUserData(data: Partial<AppUser> & { uid: string; nome: string; email: string; role: AppUser['role'] }): AppUser {
  return {
    uid: data.uid,
    nome: data.nome,
    email: data.email,
    role: data.role,
    funcao: data.funcao ?? (data.role === 'professor' ? 'regente' : ''),
    turmasIds: Array.isArray(data.turmasIds) ? data.turmasIds : [],
    disciplinasIds: Array.isArray(data.disciplinasIds) ? data.disciplinasIds : [],
    ativo: typeof data.ativo === 'boolean' ? data.ativo : true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export async function ensureUser(uid: string, nome: string, email: string) {
  const ref = doc(db, 'users', uid);
  const snapshot = await getDoc(ref);
  const role: AppUser['role'] = isAdminEmail(email) ? 'admin' : 'professor';

  if (!snapshot.exists()) {
    const newUser: Omit<AppUser, 'createdAt' | 'updatedAt'> = {
      uid,
      nome,
      email,
      role,
      funcao: role === 'professor' ? 'regente' : '',
      turmasIds: [],
      disciplinasIds: [],
      ativo: true
    };

    await setDoc(ref, {
      ...newUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return newUser as AppUser;
  }

  const current = snapshot.data() as AppUser;
  const isAdminUser = isAdminEmail(email);
  const merged = normalizeUserData({
    ...current,
    uid,
    nome: current.nome || nome,
    email,
    role: isAdminUser ? 'admin' : current.role || 'professor'
  });

  // Professores não podem alterar campos protegidos pelas rules no login.
  // Por isso, em documentos antigos, não forçamos role, função, turmas ou disciplinas.
  if (isAdminUser) {
    await setDoc(
      ref,
      {
        ...merged,
        role: 'admin',
        funcao: '',
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } else {
    await setDoc(
      ref,
      {
        nome: merged.nome,
        ativo: merged.ativo,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  return merged;
}

export async function listProfessores() {
  const qs = await getDocs(query(collection(db, 'users'), orderBy('nome')));
  return qs.docs
    .map(d => normalizeUserData(d.data() as AppUser))
    .filter(user => user.role === 'professor');
}

export async function createProfessor(
  data: Partial<AppUser> & { uid: string; nome: string; email: string; funcao?: AppUser['funcao'] }
) {
  const payload = normalizeUserData({
    uid: data.uid,
    nome: data.nome,
    email: data.email,
    role: 'professor',
    funcao: data.funcao ?? 'regente',
    turmasIds: data.turmasIds ?? [],
    disciplinasIds: data.disciplinasIds ?? [],
    ativo: true
  });

  await setDoc(
    doc(db, 'users', data.uid),
    {
      ...payload,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteProfessor(uid: string) {
  await deleteDoc(doc(db, 'users', uid));
}
