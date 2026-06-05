'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function Guard({ children, role }: { children: ReactNode; role?: 'admin' | 'professor' }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    if (!loading && user && role && user.role !== role) {
      router.replace(user.role === 'admin' ? '/admin' : '/professor');
    }
  }, [loading, user, role, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-lg">
          <Loader2 className="animate-spin text-paiBlue" size={18} />
          Carregando acesso seguro...
        </div>
      </div>
    );
  }

  if (!user || (role && user.role !== role)) return null;

  return <>{children}</>;
}

export const ProtectedRoute = ({ children }: { children: ReactNode }) => <Guard>{children}</Guard>;
export const AdminRoute = ({ children }: { children: ReactNode }) => <Guard role="admin">{children}</Guard>;
export const ProfessorRoute = ({ children }: { children: ReactNode }) => <Guard role="professor">{children}</Guard>;
