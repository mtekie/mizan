'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getProfileCompletion } from '@/lib/profile/completeness';

export function ProfileCompleteness({ user }: { user: any }) {
  const completion = getProfileCompletion(user || {});
  const percentage = completion.corePercentage;
  
  if (completion.isCoreComplete) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mint-card bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-none shadow-xl overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Trophy className="w-24 h-24 text-blue-400 rotate-12" />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="#3EA63B"
              strokeWidth="6"
              strokeDasharray={176}
              initial={{ strokeDashoffset: 176 }}
              animate={{ strokeDashoffset: 176 - (176 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-black text-white">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Profile Status</span>
          </div>
          <h3 className="text-sm font-bold text-white">Your profile is {percentage}% complete</h3>
          <p className="text-[11px] text-slate-400 mt-1">Complete your profile to unlock better product matches and credit insights.</p>
        </div>

        <Link 
          href="/onboarding" 
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}
