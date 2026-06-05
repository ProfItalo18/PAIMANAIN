'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
export default function Dashboard() { const { user } = useAuth(); const router = useRouter(); useEffect(()=>{ if(user) router.replace(user.role === 'admin' ? '/admin' : '/professor'); },[user,router]); return <ProtectedRoute><div className="p-8">Redirecionando...</div></ProtectedRoute>; }
