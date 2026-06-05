'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="relative min-h-screen pl-0 pt-24 lg:pl-[20rem] lg:pt-0">
        <div className="mx-auto w-full max-w-[1520px] px-3 pb-16 sm:px-5 md:px-7 lg:px-8 xl:px-10 2xl:px-12">
          <div className="pointer-events-none fixed right-6 top-24 hidden h-56 w-56 rounded-full bg-paiBlue/10 blur-3xl xl:block" />
          <div className="relative space-y-6 py-3 lg:py-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
