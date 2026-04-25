'use client';

import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function IdentityStep({ 
  name, 
  setName, 
  onNext 
}: { 
  name: string, 
  setName: (n: string) => void, 
  onNext: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-sm flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/20">
        <Sparkles className="w-8 h-8 text-[#6ED063]" />
      </div>

      <h1 className="text-3xl font-black mb-4">Welcome to Mizan</h1>
      <p className="text-slate-400 mb-8 text-sm">Let&apos;s get your financial journey started. What should we call you?</p>

      <div className="w-full flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          required
          autoFocus
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-center text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#3EA63B] transition-all"
        />
        
        <button
          onClick={onNext}
          disabled={!name.trim()}
          className="w-full mt-4 bg-[#3EA63B] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2e7d2c] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
