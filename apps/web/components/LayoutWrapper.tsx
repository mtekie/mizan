import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <TopNav />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 hide-scrollbar">
          <div className="w-full h-full relative">
            {children}
          </div>
        </div>
        <BottomNav />
      </main>
    </div>
  );
}

