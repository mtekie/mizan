'use client';

import { ArrowLeft, MoreHorizontal, Lightbulb, CheckCircle2, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { LeaderboardWidget } from '@/components/LeaderboardWidget';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { PersonaStep } from '@/components/onboarding/PersonaStep';
import { performUpdateOnboardingPhase } from '@/app/onboarding/actions';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { SimplePageShell } from '@/components/SimplePageShell';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export default function ScoreClient({ initialScore = 600 }: { initialScore: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    gender: 'Male',
    monthlyIncomeRange: '',
    educationLevel: '',
    employmentStatus: '',
    financialPriority: '',
    riskAppetite: '',
    interestFree: false,
    dependents: 0,
    housingStatus: '',
  });
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(initialScore);
  const [tip, setTip] = useState('Generating your financial recommendation...');
  const [tipLoading, setTipLoading] = useState(true);

  const isProfileOnboarding = searchParams.get('action') === 'complete-profile';
  const profileOverlayRef = useFocusTrap(isProfileOnboarding, () => router.push('/score'));

  const handleProfileComplete = async () => {
    setLoading(true);
    try {
      const res = await performUpdateOnboardingPhase('goals', profileData);
      if (res.error) throw new Error(res.error);
      
      toast.success('Profile updated! Your Mizan Score is more accurate now.');
      await refreshScore();
      router.push('/score');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const refreshScore = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/score');
      const data = await res.json();
      if (data.score) setScore(data.score);
    } catch (e) {
      toast.error('Failed to update score');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchTip() {
      try {
        const res = await fetch('/api/v1/ai/tip', { method: 'POST' });
        const data = await res.json();
        setTip(data.tip);
      } catch (e) {
        setTip("Increase your monthly savings to boost your resilience.");
      } finally {
        setTipLoading(false);
      }
    }
    fetchTip();
  }, []);

  const content = (
      <>
        <section className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center w-64 h-64">
            <div className="absolute inset-0 rounded-full border-[20px] border-[#6ED063]/20"></div>
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full drop-shadow-lg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3EA63B" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={`${251.2 - (251.2 * (initialScore/1000))}`}></circle>
            </svg>
            <div className="flex flex-col items-center justify-center text-center z-10 bg-white w-48 h-48 rounded-full shadow-inner cursor-pointer active:scale-95 transition-transform" onClick={refreshScore}>
              <span className="text-5xl font-bold text-slate-900 tracking-tighter">{score}</span>
              <span className="text-sm font-medium text-[#3EA63B] uppercase tracking-wider mt-1">{score > 750 ? 'Excellent' : score > 600 ? 'Good' : 'Fair'}</span>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Tap to Refresh</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-600 px-8">
            Your financial health is strong. Keep up the consistency with your Equb contributions.
          </p>
        </section>

        <section className="rounded-xl bg-gradient-to-br from-[#6ED063]/10 to-[#3EA63B]/5 p-5 border border-[#6ED063]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Lightbulb className="w-16 h-16 text-[#3EA63B]" />
          </div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#3EA63B] text-white flex items-center justify-center shadow-lg shadow-[#3EA63B]/30">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 text-slate-900">Mizan AI Tip</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {tipLoading ? 'Analyzing your patterns...' : tip}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Impact Factors</h2>
            <button className="text-xs font-semibold text-[#3EA63B] hover:underline transition-colors">View All</button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-[#3EA63B] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">Equb Consistency</h4>
                <p className="text-xs text-slate-500 truncate">On time for 6 cycles</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-[#3EA63B] bg-[#6ED063]/10 px-2 py-1 rounded-full">+15 pts</span>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">Savings Growth</h4>
                <p className="text-xs text-slate-500 truncate">Growing, but below target</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Stable</span>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-[#3EA63B] shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">Utility Payments</h4>
                <p className="text-xs text-slate-500 truncate">All bills paid on time</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-[#3EA63B] bg-[#6ED063]/10 px-2 py-1 rounded-full">+5 pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* How You Compare */}
        <LeaderboardWidget mizanScore={720} />
      </>
  );

  return (
    <>
      <SimplePageShell
        title="Mizan Score"
        headerAction={
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white transition-transform active:scale-95">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        }
      >
        {content}
      </SimplePageShell>

      {/* ── Contextual Profile Overlay ── */}
      <AnimatePresence>
        {isProfileOnboarding && (
          <motion.div
            ref={profileOverlayRef as any}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-xl p-4"
          >
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10" />
               <button 
                onClick={() => router.push('/score')} 
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
               >
                 <X className="w-6 h-6" />
               </button>
               
               {step === 1 ? (
                 <ProfileStep 
                  data={profileData}
                  setData={setProfileData}
                  onNext={() => setStep(2)}
                  onBack={() => router.push('/score')}
                 />
               ) : (
                 <PersonaStep
                  data={profileData}
                  setData={setProfileData}
                  onNext={handleProfileComplete}
                  onBack={() => setStep(1)}
                 />
               )}

               {loading && (
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-3xl z-10">
                   <div className="flex flex-col items-center gap-3">
                     <div className="w-10 h-10 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin" />
                     <p className="text-xs font-bold text-white uppercase tracking-widest">Optimizing Score...</p>
                   </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
