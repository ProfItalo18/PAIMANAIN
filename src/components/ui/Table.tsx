import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="neo-card overflow-hidden rounded-[2rem]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-separate border-spacing-0 text-left text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

export function Th({ children, className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`border-b border-slate-200/80 bg-white/85 px-4 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500 backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`border-b border-slate-100/80 px-4 py-4 align-middle text-slate-700 ${className}`} {...props}>
      {children}
    </td>
  );
}
