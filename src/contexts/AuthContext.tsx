'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { loginWithGoogleRedirect, logoutFirebase } from '@/lib/auth';
import { ensureUser } from '@/services/usersService';
import { AppUser } from '@/types/user';

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  user: AppUser | null;
  loading: boolean;
  authError: string | null;
  isAdmin: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
  authError: null,
  isAdmin: false,
  loginGoogle: async () => {},
  logout: async () => {}
});

function messageFromError(error: unknown) {
  const fallback = 'Não foi possível concluir a autenticação. Confira as regras do Firestore e tente novamente.';
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fb => {
      setLoading(true);
      setAuthError(null);

      try {
        setFirebaseUser(fb);

        if (!fb?.email) {
          setUser(null);
          return;
        }

        const appUser = await ensureUser(fb.uid, fb.displayName ?? fb.email, fb.email);
        setUser(appUser);

        if (pathname === '/login') {
          router.replace(appUser.role === 'admin' ? '/admin' : '/professor');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setAuthError(messageFromError(error));
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [pathname, router]);

  async function loginGoogle() {
    setAuthError(null);
    setLoading(true);

    try {
      await loginWithGoogleRedirect();
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthError(messageFromError(error));
      setLoading(false);
    }
  }

  async function logout() {
    await logoutFirebase();
    setUser(null);
    setFirebaseUser(null);
    router.replace('/login');
  }

  const value = useMemo(
    () => ({ firebaseUser, user, loading, authError, isAdmin: user?.role === 'admin', loginGoogle, logout }),
    [firebaseUser, user, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
