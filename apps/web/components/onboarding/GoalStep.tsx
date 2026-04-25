'use client';

import { Target, ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const goalPresets = [
  { id: '1', name: 'Emergency Fund', emoji: '🛡️', defaultTarget: 50000, desc: '6 months of safety', detailLabel: 'How many months?' },
  { id: '2', name: 'Education', emoji: '🎓', defaultTarget: 100000, desc: 'For you or family', detailLabel: 'For who?' },
  { id: '3', name: 'Travel', emoji: '✈️', defaultTarget: 150000, desc: 'Your dream trip', detailLabel: 'Where to?' },
  { id: '4', name: 'Land or House', emoji: '🏠', defaultTarget: 2000000, desc: 'Long term asset', detailLabel: 'Location?' },
  { id: '5', name: 'New Car', emoji: '🚗', defaultTarget: 800000, desc: 'For mobility', detailLabel: 'Which car?' },
  { id: '6', name: 'Start Business', emoji: '🚀', defaultTarget: 150000, desc: 'Entrepreneurship', detailLabel: 'What business?' },
];

export function GoalStep({ 
  goals, 
  setGoals, 
  onNext,
  onBack,
  loading,
  onSkip
}: { 
  goals: any[], 
  setGoals: (g: any[]) => void, 
  onNext: () => void,
  onBack: () => void,
  loading: boolean,
  onSkip?: () => void
}) {
  const toggleGoal = (preset: typeof goalPresets[0]) => {
    if (goals.find((g) => g.name === preset.name)) {
      setGoals(goals.filter((g) => g.name !== preset.name));
    } else {
      setGoals([...goals, { name: preset.name, target: preset.defaultTarget, emoji: preset.emoji, extra: '' }]);
    }
  };

  const updateGoalDetail = (name: string, key: string, value: string | number) => {
    setGoals(goals.map((g) => g.name === name ? { ...g, [key]: value } : g));
  };

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

      <h1 className="text-2xl font-black mb-2 text-center">Set Your Goals</h1>
      <p className="text-slate-400 mb-8 text-sm text-center">Select all that apply. You can add specific details if you want.</p>

      <div className="w-full space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {goalPresets.map((preset) => {
          const isSelected = goals.find((g) => g.name === preset.name);
          const currentGoal = isSelected || {};

          return (
            <div key={preset.id} className={`w-full rounded-2xl border transition-all text-left overflow-hidden ${isSelected ? 'bg-white/10 border-[#3EA63B] ring-1 ring-[#3EA63B]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              <button
                onClick={() => toggleGoal(preset)}
                className="w-full flex items-center gap-4 p-4"
              >
                <span className="text-2xl">{preset.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{preset.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{preset.desc}</p>
                </div>
                <div className="text-slate-400">
                  {isSelected ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 border-t border-white/5"
                  >
                    <div className="pt-4 space-y-3">
                       <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{preset.detailLabel}</label>
                          <input 
                            type="text"
                            placeholder="Optional specifics..."
                            value={currentGoal.extra || ''}
                            onChange={(e) => updateGoalDetail(preset.name, 'extra', e.target.value)}
                            className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#3EA63B]"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Amount (ETB)</label>
                          <input 
                            type="number"
                            value={currentGoal.target || ''}
                            onChange={(e) => updateGoalDetail(preset.name, 'target', e.target.value)}
                            className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-[#3EA63B]"
                          />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="w-full flex gap-3 pt-6 mt-2 border-t border-white/10">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={goals.length === 0 || loading}
          className="flex-[2] py-4 rounded-xl bg-[#3EA63B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2e7d2c] transition-colors shadow-lg disabled:opacity-50"
        >
          {loading ? 'Continuing...' : <>Continue <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
      
      {onSkip && (
        <button onClick={onSkip} className="w-full text-center text-xs text-slate-500 font-bold hover:text-slate-300 mt-4">
           Skip for now
        </button>
      )}
    </motion.div>
  );
}
