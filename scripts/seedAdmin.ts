import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCDemipIP3pF6pPZzLP8SilsIWHzez0oyQ',
  authDomain: 'planoindat.firebaseapp.com',
  projectId: 'planoindat',
  storageBucket: 'planoindat.firebasestorage.app',
  messagingSenderId: '311463711557',
  appId: '1:311463711557:web:f1d0acd5eb4d10b0f8642c'
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log('Os registros admin reais são criados automaticamente no primeiro login dos e-mails:');
  console.log('- itaopovos@gmail.com');
  console.log('- colavaliacao@gmail.com');
  console.log('Use este script apenas se tiver o UID do usuário admin.');

  const uid = process.env.ADMIN_UID;
  if (!uid) return;

  const email = process.env.ADMIN_EMAIL || 'itaopovos@gmail.com';

  await setDoc(
    doc(db, 'users', uid),
    {
      uid,
      nome: 'Administrador PAI',
      email,
      role: 'admin',
      turmasIds: [],
      disciplinasIds: [],
      ativo: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  console.log('Admin criado/atualizado.');
}

main();
