'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { CheckCircle2, GraduationCap, LockKeyhole, Sparkles, type LucideIcon } from 'lucide-react';

export default function LoginPage() {
  const { loginGoogle, loading, authError } = useAuth();
  const features: Array<[string, LucideIcon]> = [['Seguro', LockKeyhole], ['Inclusivo', GraduationCap], ['Formal em PDF', CheckCircle2]];
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6 text-white">
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-paiBlue/30 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-paiGreen/25 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.15fr_.85fr]">
        <div className="p-8 md:p-12">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-100"><Sparkles size={15}/> Plataforma PAI</div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Plano de Atendimento Individualizado com visual inteligente.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">Crie, edite, acompanhe, imprima e exporte PAIs com segurança por perfil: administrador, professor e turmas vinculadas.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {features.map(([label, Icon]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold"><Icon className="mb-2 text-sky-300" size={22}/>{label}</div>)}
          </div>
        </div>
        <div className="border-t border-white/10 bg-white p-8 text-slate-950 md:p-12 lg:border-l lg:border-t-0">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-paiBlue to-paiGreen text-white shadow-glow"><Sparkles size={28}/></div>
          <h2 className="text-3xl font-black text-slate-950">Entrar no sistema</h2>
          <p className="mt-2 text-slate-600">Use sua conta Google/Gmail. O administrador principal é reconhecido automaticamente.</p>
          {authError && <div className="mt-5"><ErrorNotice message={authError}/></div>}
          <Button disabled={loading} onClick={loginGoogle} className="mt-6 w-full py-3">Entrar com Google</Button>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            <b className="text-slate-900">Administrador principal:</b><br/>itaopovos@gmail.com ou colavaliacao@gmail.com
          </div>
        </div>
      </section>
    </main>
  );
}
