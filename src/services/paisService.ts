import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Pai, AssinaturaDigital } from '@/types/pai';
import { AppUser } from '@/types/user';

function normalizarNome(value?: string) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function labelFuncaoProfessor(user: AppUser) {
  const labels: Record<string, string> = {
    regente: 'Regente',
    ensino_religioso: 'Ensino Religioso',
    educacao_fisica: 'Educação Física',
    arte: 'Arte'
  };

  return user.funcao ? labels[user.funcao] : '';
}

function identificarFuncaoDoProfessor(pai: Partial<Pai>, user: AppUser) {
  const funcaoCadastrada = labelFuncaoProfessor(user);
  if (funcaoCadastrada) return funcaoCadastrada;

  const nomeUser = normalizarNome(user.nome || user.email);

  const nomesFixos = [
    { nome: pai.identificacao?.regente1, funcao: 'Regente' },
    { nome: pai.identificacao?.ensinoReligioso, funcao: 'Ensino Religioso' },
    { nome: pai.identificacao?.arte, funcao: 'Arte' },
    { nome: pai.identificacao?.educacaoFisica, funcao: 'Educação Física' }
  ];

  const funcaoPorNome = nomesFixos.find(item => {
    const nome = normalizarNome(item.nome);
    return Boolean(nome && (nome === nomeUser || nomeUser.includes(nome) || nome.includes(nomeUser)));
  });

  if (funcaoPorNome) return funcaoPorNome.funcao;

  const disciplinasDoUsuario = (pai.objetivos || [])
    .filter(obj => obj.professorId === user.uid)
    .map(obj => obj.disciplinaNome)
    .filter(Boolean);

  if (disciplinasDoUsuario.length) return disciplinasDoUsuario.join(', ');

  return 'Professor responsável';
}

function assinaturaDoUsuario(pai: Partial<Pai>, user: AppUser): AssinaturaDigital {
  return {
    nome: user.nome || user.email,
    funcao: identificarFuncaoDoProfessor(pai, user),
    uid: user.uid,
    dataHora: new Date().toISOString()
  };
}

function usuarioTemDisciplinaNoPai(pai: Partial<Pai>, user: AppUser) {
  return (pai.objetivos || []).some(obj => obj.professorId === user.uid);
}

function mesclarAssinaturaProfessor(pai: Partial<Pai>, user: AppUser) {
  const atuais = Array.isArray(pai.assinaturasDigitais?.professores)
    ? pai.assinaturasDigitais!.professores!
    : [];

  if (!usuarioTemDisciplinaNoPai(pai, user)) {
    return atuais;
  }

  const nova = assinaturaDoUsuario(pai, user);
  const semDuplicar = atuais.filter(item => item.uid !== user.uid);

  return [...semDuplicar, nova];
}

export async function criarPai(data: Omit<Pai, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'pais'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function editarPai(id: string, data: Partial<Pai>, uid: string) {
  return updateDoc(doc(db, 'pais', id), { ...data, atualizadoPor: uid, updatedAt: serverTimestamp() });
}

export async function excluirPai(id: string) {
  return deleteDoc(doc(db, 'pais', id));
}

export async function encaminharPaiParaVisto(id: string, data: Partial<Pai>, user: AppUser) {
  return updateDoc(doc(db, 'pais', id), {
    ...data,
    status: 'encaminhado_visto',
    encaminhadoPor: data.encaminhadoPor || user.uid,
    encaminhadoPorNome: data.encaminhadoPorNome || user.nome || user.email,
    encaminhadoEm: data.encaminhadoEm || serverTimestamp(),
    assinaturasDigitais: {
      professores: mesclarAssinaturaProfessor(data, user),
      coordenacao: data.assinaturasDigitais?.coordenacao || null
    },
    atualizadoPor: user.uid,
    updatedAt: serverTimestamp()
  });
}

export async function registrarAssinaturaProfessor(id: string, pai: Pai, user: AppUser) {
  return updateDoc(doc(db, 'pais', id), {
    status: 'encaminhado_visto',
    encaminhadoPor: pai.encaminhadoPor || user.uid,
    encaminhadoPorNome: pai.encaminhadoPorNome || user.nome || user.email,
    encaminhadoEm: pai.encaminhadoEm || serverTimestamp(),
    assinaturasDigitais: {
      professores: mesclarAssinaturaProfessor(pai, user),
      coordenacao: pai.assinaturasDigitais?.coordenacao || null
    },
    atualizadoPor: user.uid,
    updatedAt: serverTimestamp()
  });
}

export async function registrarVistoPai(id: string, pai: Pai, user: AppUser) {
  return updateDoc(doc(db, 'pais', id), {
    status: 'visto',
    vistadoPor: user.uid,
    vistadoPorNome: user.nome || user.email,
    vistadoEm: serverTimestamp(),
    assinaturasDigitais: {
      professores: pai.assinaturasDigitais?.professores || [],
      coordenacao: {
        nome: pai.identificacao?.pedagoga || user.nome || user.email,
        funcao: 'Coordenação Pedagógica',
        uid: user.uid,
        dataHora: new Date().toISOString()
      }
    },
    atualizadoPor: user.uid,
    updatedAt: serverTimestamp()
  });
}

export async function obterPai(id: string) {
  const s = await getDoc(doc(db, 'pais', id));
  return s.exists() ? ({ id: s.id, ...s.data() } as Pai) : null;
}

export async function obterPaiPorEstudanteTurma(estudanteId: string, turmaId: string) {
  const qs = await getDocs(
    query(collection(db, 'pais'), where('estudanteId', '==', estudanteId), where('turmaId', '==', turmaId), limit(10))
  );
  const items = qs.docs.map(d => ({ id: d.id, ...d.data() } as Pai));
  items.sort((a: any, b: any) => (b?.updatedAt?.seconds || 0) - (a?.updatedAt?.seconds || 0));
  return items[0] || null;
}

export async function listarPaisAdmin() {
  const qs = await getDocs(collection(db, 'pais'));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Pai)).sort((a: any, b: any) => (b?.updatedAt?.seconds || 0) - (a?.updatedAt?.seconds || 0));
}

export async function listarPaisPorTurma(turmaId: string) {
  const qs = await getDocs(query(collection(db, 'pais'), where('turmaId', '==', turmaId)));
  return qs.docs.map(d => ({ id: d.id, ...d.data() } as Pai)).sort((a: any, b: any) => (b?.updatedAt?.seconds || 0) - (a?.updatedAt?.seconds || 0));
}

export async function listarPaisPermitidos(turmasIds: string[]) {
  if (!turmasIds.length) return [];
  const chunks = [];
  for (let i = 0; i < turmasIds.length; i += 10) chunks.push(turmasIds.slice(i, i + 10));
  const all: Pai[] = [];
  for (const c of chunks) {
    const qs = await getDocs(query(collection(db, 'pais'), where('turmaId', 'in', c)));
    all.push(...qs.docs.map(d => ({ id: d.id, ...d.data() } as Pai)));
  }
  return all.sort((a: any, b: any) => {
    const da = a?.updatedAt?.seconds || 0;
    const dbs = b?.updatedAt?.seconds || 0;
    return dbs - da;
  });
}

export async function uploadFotoPai(file: File, estudanteId: string) {
  try {
    const r = ref(storage, `pais/fotos/${estudanteId}/${Date.now()}-${file.name}`);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  } catch (error) {
    const fallback = ref(storage, `estudantes/fotos-pai/${estudanteId}/${Date.now()}-${file.name}`);
    await uploadBytes(fallback, file);
    return getDownloadURL(fallback);
  }
}
