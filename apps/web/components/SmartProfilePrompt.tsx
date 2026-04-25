'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, Trophy } from 'lucide-react';
import { performUpdateOnboardingPhase } from '@/app/onboarding/actions';

interface Question {
  id: string;
  field: string;
  label: string;
  type: 'select' | 'text' | 'number';
  options?: { label: string; value: string }[];
  points: number;
}

const QUESTIONS: Question[] = [
  { 
    id: '1', 
    field: 'employmentStatus', 
    label: 'What is your current employment status?', 
    type: 'select', 
    points: 10,
    options: [
      { label: 'Employed', value: 'Employed' },
      { label: 'Self-Employed', value: 'Self-Employed' },
      { label: 'Unemployed', value: 'Unemployed' },
      { label: 'Student', value: 'Student' },
    ]
  },
  { 
    id: '2', 
    field: 'monthlyIncomeRange', 
    label: 'What is your approximate monthly income?', 
    type: 'select', 
    points: 15,
    options: [
      { label: 'Under 10k ETB', value: 'Under 10k' },
      { label: '10k - 50k ETB', value: '10k-50k' },
      { label: '50k - 100k ETB', value: '50k-100k' },
      { label: 'Over 100k ETB', value: 'Over 100k' },
    ]
  },
];

export function SmartProfilePrompt({ user }: { user: any }) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [value, setValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Find the first question that the user hasn't answered yet
    const nextQ = QUESTIONS.find(q => !user[q.field]);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      // Show prompt after a small delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSave = async () => {
    if (!currentQuestion || !value) return;
    
    const res = await performUpdateOnboardingPhase('progressive', { [currentQuestion.field]: value });
    if (res.success) {
      setIsCompleted(true);
      setTimeout(() => {
        setIsVisible(false);
        // Could find next question here
      }, 2000);
    }
  };

  if (!currentQuestion) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50 w-80 bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {isCompleted ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-[#3EA63B]/20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-[#3EA63B]" />
              </div>
              <h3 className="font-bold text-white">Profile Boosted!</h3>
              <p className="text-xs text-slate-400">+{currentQuestion.points} points added to your score.</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Smart Nudge</span>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mb-4">{currentQuestion.label}</h3>

              {currentQuestion.type === 'select' ? (
                <div className="space-y-2">
                  {currentQuestion.options?.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setValue(opt.value)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${value === opt.value ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              )}

              <button
                onClick={handleSave}
                disabled={!value}
                className="w-full mt-6 bg-[#3EA63B] hover:bg-[#2e7d2c] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                Boost Profile <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsVisible(false)}
                className="w-full mt-2 text-center text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest"
              >
                Skip for now
              </button>
            </div>
          )}
          <div className="h-1 w-full bg-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: isCompleted ? '100%' : '30%' }}
               className="h-full bg-blue-500"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
