import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="glass rounded-[1.7rem] p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-paiBlue/10 text-paiBlue"><Sparkles size={22}/></div>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      {children && <div className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{children}</div>}
    </div>
  );
}
