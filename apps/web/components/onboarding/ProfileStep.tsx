'use client';

import { UserCircle, ArrowRight, ArrowLeft, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileStep({ 
  data, 
  setData, 
  onNext,
  onBack,
  onSkip
}: { 
  data: any, 
  setData: (d: any) => void, 
  onNext: () => void,
  onBack: () => void,
  onSkip?: () => void
}) {
  const update = (key: string, val: string) => setData({ ...data, [key]: val });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
        <UserCircle className="w-8 h-8 text-purple-400" />
      </div>

      <h1 className="text-2xl font-black mb-2 text-center">Your Mizan Profile</h1>
      <p className="text-slate-400 mb-8 text-sm text-center">Help us calculate your financial score and give better insights.</p>

      <div className="w-full space-y-6">
        {/* Gender & Income */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {['Male', 'Female'].map(g => (
                        <button
                            key={g}
                            onClick={() => update('gender', g)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${data.gender === g ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-400'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Monthly Income</label>
                <select
                    value={data.monthlyIncomeRange || ''}
                    onChange={(e) => update('monthlyIncomeRange', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none"
                >
                    <option value="" disabled>Select range</option>
                    <option value="0-5k">0 - 5,000 ETB</option>
                    <option value="5k-15k">5k - 15,000 ETB</option>
                    <option value="15k-50k">15k - 50,000 ETB</option>
                    <option value="50k+">50,000+ ETB</option>
                </select>
            </div>
        </div>

        {/* Education & Employment */}
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3" /> Education Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['High School', 'Bachelor', 'Master', 'PhD+'].map(e => (
                        <button
                            key={e}
                            onClick={() => update('educationLevel', e)}
                            className={`py-2.5 px-3 rounded-xl border text-[10px] font-black transition-all ${data.educationLevel === e ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3" /> Employment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['Employed', 'Self-Employed', 'Student', 'Unemployed'].map(e => (
                        <button
                            key={e}
                            onClick={() => update('employmentStatus', e)}
                            className={`py-2.5 px-3 rounded-xl border text-[10px] font-black transition-all ${data.employmentStatus === e ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!data.gender || !data.monthlyIncomeRange}
            className="flex-[2] py-4 rounded-xl bg-[#3EA63B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2e7d2c] transition-colors shadow-lg disabled:opacity-50"
          >
            Almost there <ArrowRight className="w-5 h-5" />
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
