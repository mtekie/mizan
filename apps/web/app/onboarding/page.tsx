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
  const [accounts, setAccounts] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    gender: '',
    monthlyIncomeRange: '',
    educationLevel: '',
    employmentStatus: '',
  });
  const [goal, setGoal] = useState<any>(null);

  const handleNextStep = async (currentPhase: 'identity' | 'accounts' | 'profile' | 'goal', data: any, nextStep: Step | 'done', isSkip = false) => {
    setLoading(true);
    setError(null);
    try {
      // If skip is true and it's not the final step, we just move state without saving to DB
      // But we map our local phase name to the API phase names ('identity', 'accounts', 'goals', 'complete')
      const apiPhase = nextStep === 'done' ? 'complete' :
                       currentPhase === 'goal' ? 'goals' :
                       currentPhase;

      if (!isSkip || nextStep === 'done') {
        const payload = {
            name,
            ...profile,
            ...(currentPhase === 'accounts' ? { accounts: data.accounts } : {}),
            ...(currentPhase === 'goal' ? { goal: data.goal } : {})
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
            {(['identity', 'accounts', 'profile', 'goal'] as Step[]).map((s, idx) => {
                const steps = ['identity', 'accounts', 'profile', 'goal'];
                const currentIdx = steps.indexOf(step);
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
              onNext={() => handleNextStep('identity', { name }, 'accounts')} 
            />
          )}
          {step === 'accounts' && (
            <AccountStep 
              key="accounts"
              accounts={accounts} 
              setAccounts={setAccounts} 
              onNext={() => handleNextStep('accounts', { accounts }, 'profile')} 
              onSkip={() => handleNextStep('accounts', {}, 'profile', true)}
              onBack={() => setStep('identity')}
            />
          )}
          {step === 'profile' && (
            <ProfileStep 
              key="profile"
              data={profile} 
              setData={setProfile} 
              onNext={() => handleNextStep('profile', profile, 'goal')} 
              onSkip={() => handleNextStep('profile', {}, 'goal', true)}
              onBack={() => setStep('accounts')}
            />
          )}
          {step === 'goal' && (
            <GoalStep 
              key="goal"
              goal={goal} 
              setGoal={setGoal} 
              onNext={() => handleNextStep('goal', { goal }, 'done')} 
              onSkip={() => handleNextStep('goal', {}, 'done', true)}
              onBack={() => setStep('profile')}
              loading={loading}
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
