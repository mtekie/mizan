'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { performUpdateOnboardingPhase } from './actions';
import { IdentityStep } from '@/components/onboarding/IdentityStep';
import { AccountStep } from '@/components/onboarding/AccountStep';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { GoalStep } from '@/components/onboarding/GoalStep';

type Step = 'identity' | 'accounts' | 'profile' | 'goal';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('identity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for all steps
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    gender: '',
    monthlyIncomeRange: '',
    educationLevel: '',
    employmentStatus: '',
    employmentSector: '',
    residencyStatus: 'RESIDENT',
  });
  const [goals, setGoals] = useState<any[]>([]);

  const handleNextStep = async (currentPhase: 'identity' | 'accounts' | 'profile' | 'goals', data: any, nextStep: Step | 'done', isSkip = false) => {
    setLoading(true);
    setError(null);
    try {
      // If skip is true and it's not the final step, we just move state without saving to DB
      // But we map our local phase name to the API phase names ('identity', 'accounts', 'goals', 'complete')
      const apiPhase = nextStep === 'done' ? 'complete' :
                       currentPhase === 'goals' ? 'goals' :
                       currentPhase;

      if (!isSkip || nextStep === 'done') {
        const payload = {
            name,
            username,
            ...profile,
            ...(currentPhase === 'accounts' ? { accounts: data.accounts } : {}),
            ...(currentPhase === 'goals' ? { goals: data.goals } : {})
        };
        const res = await performUpdateOnboardingPhase(apiPhase, payload);
        if (res.error) throw new Error(res.error);
      }

      if (nextStep === 'done') {
        router.push('/');
        router.refresh();
      } else {
        setStep(nextStep);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#3EA63B] rounded-full blur-[120px] opacity-10 pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none transition-all duration-1000" />
      
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold w-full text-center">
                {error}
            </div>
        )}

        {/* Multi-step progress indicator */}
        <div className="flex gap-2 mb-12 w-full max-w-xs">
            {(['identity', 'goals', 'accounts'] as Step[]).map((s, idx) => {
                const steps = ['identity', 'goals', 'accounts'];
                const currentIdx = steps.indexOf(step as any);
                const isPast = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                
                return (
                    <div 
                        key={s} 
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${isPast || isCurrent ? 'bg-[#3EA63B]' : 'bg-white/10'}`} 
                    />
                );
            })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'identity' && (
            <IdentityStep 
              key="identity"
              name={name} 
              setName={setName} 
              username={username}
              setUsername={setUsername}
              onNext={() => handleNextStep('identity', { name, username }, 'goals' as any)} 
            />
          )}
          {step === ('goals' as any) && (
            <GoalStep 
              key="goals"
              goals={goals} 
              setGoals={setGoals} 
              onNext={() => handleNextStep('goals', { goals }, 'accounts')} 
              onSkip={() => handleNextStep('goals', {}, 'accounts', true)}
              onBack={() => setStep('identity')}
              loading={loading}
            />
          )}
          {step === 'accounts' && (
            <AccountStep 
              key="accounts"
              accounts={accounts} 
              setAccounts={setAccounts} 
              onNext={() => handleNextStep('accounts', { accounts }, 'done')} 
              onSkip={() => handleNextStep('accounts', {}, 'done', true)}
              onBack={() => setStep('goals' as any)}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
          Secure Infrastructure · Mizan v1.0
      </div>
    </div>
  );
}
