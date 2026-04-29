'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProfileCompletion } from '@mizan/shared';
import { appendParityQuery } from '@/lib/parity-query';

export function ProfileCompleteness({ user }: { user: any }) {
  const { percentage } = getProfileCompletion(user || {});
  const searchParams = useSearchParams();
  
  if (percentage === 100) return null;

  return (
    <Link href={appendParityQuery('/onboarding', searchParams)} className="block">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[20px] p-4 border border-slate-200 overflow-hidden relative group hover:shadow-md transition-shadow flex items-center justify-between"
      >
        <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
          <Trophy className="w-16 h-16 text-slate-900" />
        </div>

        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-1 mb-1">
             <ShieldCheck className="w-3 h-3 text-[var(--color-mint-primary)]" />
             <span className="text-[9px] font-black text-[var(--color-mint-primary)] tracking-widest uppercase">Profile Progress</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900">{percentage}% Complete</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Help Mizan understand you better.</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--color-mint-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[var(--color-mint-primary)] transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}
