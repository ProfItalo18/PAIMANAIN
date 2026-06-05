import { signInWithRedirect, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export const loginWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const logoutFirebase = () => signOut(auth);
