'use client';

import { Sparkles, ArrowRight, ArrowLeft, Shield, Landmark, Home, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function PersonaStep({ 
  data, 
  setData, 
  onNext,
  onBack
}: { 
  data: any, 
  setData: (d: any) => void, 
  onNext: () => void,
  onBack: () => void
}) {
  const update = (key: string, val: any) => setData({ ...data, [key]: val });

  const priorities = [
    { id: 'SAVE', label: 'Saving', icon: '💰' },
    { id: 'INVEST', label: 'Investing', icon: '📈' },
    { id: 'DEBT', label: 'Pay Debt', icon: '💸' },
    { id: 'TRACK', label: 'Tracking', icon: '🔍' },
  ];

  const risks = [
    { id: 'SAFE', label: 'Safe', desc: 'Secure' },
    { id: 'BALANCED', label: 'Balanced', desc: 'Mixed' },
    { id: 'AGGRESSIVE', label: 'Aggressive', desc: 'Growth' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-[#3EA63B]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#3EA63B]/20">
        <Sparkles className="w-8 h-8 text-[#3EA63B]" />
      </div>

      <h1 className="text-2xl font-black mb-2 text-center">Financial Persona</h1>
      <p className="text-slate-400 mb-8 text-sm text-center">Let&apos;s tailor Mizan to your specific needs.</p>

      <div className="w-full space-y-6">
        {/* Priority & Risk */}
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> Main Priority
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {priorities.map(p => (
                        <button
                            key={p.id}
                            onClick={() => update('financialPriority', p.id)}
                            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${data.financialPriority === p.id ? 'bg-[#3EA63B] border-[#3EA63B] text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                        >
                            <span className="text-lg">{p.icon}</span>
                            <span className="text-[9px] font-bold uppercase">{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Shield className="w-3 h-3" /> Risk Appetite
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                        {risks.map(r => (
                            <button
                                key={r.id}
                                onClick={() => update('riskAppetite', r.id)}
                                title={r.desc}
                                className={`py-2 text-[9px] font-black rounded-lg transition-all ${data.riskAppetite === r.id ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Landmark className="w-3 h-3" /> Interest-Free?
                    </label>
                    <button
                        onClick={() => update('interestFree', !data.interestFree)}
                        className={`w-full py-2.5 px-3 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-2 ${data.interestFree ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                        {data.interestFree ? 'Yes, Preferred' : 'No Preference'}
                    </button>
                </div>
            </div>
        </div>

        {/* Housing & Dependents */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Home className="w-3 h-3" /> Housing
                </label>
                <select
                    value={data.housingStatus || ''}
                    onChange={(e) => update('housingStatus', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#3EA63B]"
                >
                    <option value="" disabled className="bg-slate-900">Select...</option>
                    <option value="RENT" className="bg-slate-900">Renting</option>
                    <option value="OWN_MORTGAGE" className="bg-slate-900">Own (Mortgage)</option>
                    <option value="OWN_OUTRIGHT" className="bg-slate-900">Own (Full)</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Dependents
                </label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                    <button onClick={() => update('dependents', Math.max(0, (data.dependents || 0) - 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center">-</button>
                    <span className="flex-1 text-center text-xs font-bold text-white">{data.dependents || 0}</span>
                    <button onClick={() => update('dependents', (data.dependents || 0) + 1)} className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center">+</button>
                </div>
            </div>
        </div>

        {/* Income Stability & Tech Savviness */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Income Style</label>
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {['STABLE', 'VARIABLE'].map(s => (
                        <button
                            key={s}
                            onClick={() => update('incomeStability', s)}
                            className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${data.incomeStability === s ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tech Skill</label>
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    {['NOVICE', 'ADVANCED'].map(s => (
                        <button
                            key={s}
                            onClick={() => update('digitalAdoption', s)}
                            className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${data.digitalAdoption === s ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                        >
                            {s}
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
            className="flex-[2] py-4 rounded-xl bg-[#3EA63B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2e7d2c] transition-colors shadow-lg"
          >
            Complete Onboarding <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
