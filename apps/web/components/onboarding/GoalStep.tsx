'use client';

import { Target, ArrowRight, ArrowLeft, Home, Car, GraduationCap, Briefcase, Heart, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const goalPresets = [
  { id: '1', name: 'Emergency Fund', emoji: '🛡️', target: 50000, desc: '6 months of safety' },
  { id: '2', name: 'Land or House', emoji: '🏠', target: 2000000, desc: 'Long term asset' },
  { id: '3', name: 'New Car', emoji: '🚗', target: 800000, desc: 'For mobility' },
  { id: '4', name: 'Start Business', emoji: '🚀', target: 150000, desc: 'Entrepreneurship' },
];

export function GoalStep({ 
  goal, 
  setGoal, 
  onNext,
  onBack,
  loading,
  onSkip
}: { 
  goal: any, 
  setGoal: (g: any) => void, 
  onNext: () => void,
  onBack: () => void,
  loading: boolean,
  onSkip?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-sm flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
        <Target className="w-8 h-8 text-emerald-400" />
      </div>

      <h1 className="text-2xl font-black mb-2 text-center">Set Your First "Dream"</h1>
      <p className="text-slate-400 mb-8 text-sm text-center">Mizan helps you reach your goals faster. What are you saving for first?</p>

      <div className="w-full space-y-3">
        {goalPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setGoal({ name: preset.name, target: preset.target, emoji: preset.emoji })}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${goal?.name === preset.name ? 'bg-white/10 border-[#3EA63B] ring-1 ring-[#3EA63B]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
          >
            <span className="text-2xl">{preset.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{preset.name}</p>
              <p className="text-[10px] text-slate-500 font-bold">{preset.desc}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-black text-white">{preset.target.toLocaleString()}</p>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">ETB Target</p>
            </div>
          </button>
        ))}

        <div className="flex gap-3 pt-6">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!goal || loading}
            className="flex-[2] py-4 rounded-xl bg-[#3EA63B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2e7d2c] transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Finishing...' : <>Finalize <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
        
        {onSkip && (
          <button onClick={onSkip} className="w-full text-center text-xs text-slate-500 font-bold hover:text-slate-300 mt-2">
             Skip for now
          </button>
        )}
      </div>
    </motion.div>
  );
}
