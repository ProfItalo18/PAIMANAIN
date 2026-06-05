import { ShieldAlert } from 'lucide-react';

export function ErrorNotice({ message }: { message: string }) {
  const isPerm = message.toLowerCase().includes('permission') || message.toLowerCase().includes('permiss');

  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-800 shadow-sm">
      <div className="mb-2 flex items-center gap-2 font-black">
        <ShieldAlert size={18} />
        Atenção
      </div>
      <p>{message}</p>
      {isPerm ? (
        <p className="mt-2 text-xs text-rose-700">
          Verifique se as regras do Firebase foram publicadas e se o professor foi vinculado corretamente à turma e/ou disciplina.
        </p>
      ) : null}
    </div>
  );
}
