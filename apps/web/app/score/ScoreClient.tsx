'use client';

import { ArrowLeft, MoreHorizontal, Lightbulb, CheckCircle2, TrendingUp, CheckCircle, User as UserIcon, Target, CreditCard, ShieldCheck, X, Info } from 'lucide-react';
import Link from 'next/link';
import { LeaderboardWidget } from '@/components/LeaderboardWidget';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { PersonaStep } from '@/components/onboarding/PersonaStep';
import { performUpdateOnboardingPhase } from '@/app/onboarding/actions';
import { toast } from 'sonner';
import { AppPageShell } from '@/components/AppPageShell';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const getFactorIcon = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('profile')) return UserIcon;
  if (lower.includes('savings')) return Target;
  if (lower.includes('budget')) return CreditCard;
  if (lower.includes('bill')) return CheckCircle;
  if (lower.includes('verification')) return ShieldCheck;
  return TrendingUp;
};

export default function ScoreClient({ initialScore = 60, initialProfile = {} }: { initialScore: number, initialProfile?: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    gender: initialProfile.gender || 'Male',
    monthlyIncomeRange: initialProfile.monthlyIncomeRange || '',
    educationLevel: initialProfile.educationLevel || '',
    employmentStatus: initialProfile.employmentStatus || '',
    employmentSector: initialProfile.employmentSector || '',
    residencyStatus: initialProfile.residencyStatus || 'RESIDENT',
    financialPriority: initialProfile.financialPriority || '',
    riskAppetite: initialProfile.riskAppetite || '',
    interestFree: initialProfile.interestFree || false,
    dependents: initialProfile.dependents || 0,
    housingStatus: initialProfile.housingStatus || '',
    incomeStability: initialProfile.incomeStability || '',
    digitalAdoption: initialProfile.digitalAdoption || '',
    behavioralStyle: initialProfile.behavioralStyle || '',
  });
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(initialScore);
  const [factors, setFactors] = useState<any[]>([]);
  const [tip, setTip] = useState('Generating your financial recommendation...');
  const [tipLoading, setTipLoading] = useState(true);

  const isProfileOnboarding = searchParams.get('action') === 'complete-profile';
  const profileOverlayRef = useFocusTrap(isProfileOnboarding, () => router.push('/score'));

  const handleProfileComplete = async () => {
    setLoading(true);
    try {
      const res = await performUpdateOnboardingPhase('profile', profileData);
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
      if (data.score?.score !== undefined) setScore(data.score.score);
      if (data.score?.factors) setFactors(data.score.factors);
    } catch (e) {
      toast.error('Failed to update score');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshScore();
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
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3EA63B" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={`${251.2 - (251.2 * (score/100))}`}></circle>
            </svg>
            <div className="flex flex-col items-center justify-center text-center z-10 bg-white w-48 h-48 rounded-full shadow-inner cursor-pointer active:scale-95 transition-transform" onClick={refreshScore}>
              <span className="text-5xl font-bold text-slate-900 tracking-tighter">{score}</span>
              <span className="text-sm font-medium text-[#3EA63B] uppercase tracking-wider mt-1">{score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Fair'}</span>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">{loading ? 'Updating...' : 'Tap to Refresh'}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-600 px-8">
            Your Mizan Score is a reflection of your financial trust and readiness in the Ethiopian ecosystem.
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
          </div>
          <div className="flex flex-col gap-3">
            {factors.map((factor, idx) => {
              const Icon = getFactorIcon(factor.label);
              return (
                <div key={idx} className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 ${
                    factor.impact === 'positive' ? 'bg-green-100 text-[#3EA63B]' : 
                    factor.impact === 'negative' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{factor.label}</h4>
                    <p className="text-xs text-slate-500 truncate">{factor.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      factor.impact === 'positive' ? 'text-[#3EA63B] bg-[#6ED063]/10' : 
                      factor.impact === 'negative' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'
                    }`}>{factor.score}%</span>
                  </div>
                </div>
              );
            })}
            {factors.length === 0 && !loading && (
              <p className="text-center text-sm text-slate-500 py-4">No data available yet to calculate factors.</p>
            )}
          </div>
        </section>

        {/* How You Compare */}
        <LeaderboardWidget mizanScore={score} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#3EA63B]" />
                    What this score is NOT
                </h2>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        <span>This is <strong>not</strong> a CBE or Bank Credit Score. It is an independent trust indicator.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        <span>It does <strong>not</strong> guarantee loan approval from any financial institution.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        <span>It is an AI-driven behavioral score based only on your activity within Mizan.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-[#3EA63B]/5 border border-[#3EA63B]/20 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Our Methodology</h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Mizan uses a proprietary algorithm (v0.1.0) to analyze your financial health across 5 dimensions: Profile, Savings, Budget, Bills, and Verification. 
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">Frequency</p>
                        <p className="text-xs text-slate-700 text-left">Updated every 24h</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">Engine</p>
                        <p className="text-xs text-slate-700 text-left">Mizan Trust v0.1.0</p>
                    </div>
                </div>
            </div>
        </div>
      </>
  );

  return (
    <>
      <AppPageShell
        title="Me"
        subtitle="Your financial health and profile"
        variant="hero"
        actions={
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white transition-transform active:scale-95">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        }
      >
        {content}
      </AppPageShell>

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
