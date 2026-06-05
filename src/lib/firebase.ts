import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDemipIP3pF6pPZzLP8SilsIWHzez0oyQ",
  authDomain: "planoindat.firebaseapp.com",
  projectId: "planoindat",
  storageBucket: "planoindat.firebasestorage.app",
  messagingSenderId: "311463711557",
  appId: "1:311463711557:web:f1d0acd5eb4d10b0f8642c"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const ADMIN_EMAIL = "itaopovos@gmail.com";
export const ADMIN_EMAILS = ["itaopovos@gmail.com", "colavaliacao@gmail.com"];
export const isAdminEmail = (email?: string | null) => Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
