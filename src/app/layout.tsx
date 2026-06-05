import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
export const metadata: Metadata = { title: 'Sistema PAI', description: 'Plano de Atendimento Individualizado' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body><AuthProvider>{children}</AuthProvider></body></html>; }
