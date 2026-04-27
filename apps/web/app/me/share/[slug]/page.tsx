import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { ShieldCheck, CheckCircle2, QrCode, Sparkles, TrendingUp, User as UserIcon, Target, CreditCard, CheckCircle, ShieldCheck as ShieldIcon } from 'lucide-react';
import { calculateMizanScore } from '@/lib/engine/mizan-score';

const getFactorIcon = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('profile')) return UserIcon;
  if (lower.includes('savings')) return Target;
  if (lower.includes('budget')) return CreditCard;
  if (lower.includes('bill')) return CheckCircle;
  if (lower.includes('verification')) return ShieldIcon;
  return TrendingUp;
};

export default async function TrustCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await prisma.user.findUnique({
    where: { shareSlug: slug },
    include: {
      accountLinks: true,
      goals: true,
      budgets: true,
      bills: true,
    }
  });

  if (!user || user.cardPrivacy === 'PRIVATE') {
    notFound();
  }

  const scoreData = await calculateMizanScore(user.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* The Card */}
        <div className="relative aspect-[1.6/1] bg-[#0F172A] rounded-[32px] p-8 shadow-2xl overflow-hidden mb-8 group">
          {/* Background effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3EA63B] opacity-20 rounded-full blur-[100px] group-hover:opacity-30 transition-opacity" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-[100px]" />
          
          <div className="relative h-full flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3EA63B] rounded-xl flex items-center justify-center shadow-lg shadow-[#3EA63B]/20">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-white tracking-[0.2em] text-sm">MIZAN TRUST</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                 <CheckCircle2 className="w-3.5 h-3.5 text-[#3EA63B]" />
                 <span className="text-[10px] font-black text-white">LEVEL {user.accountLinks.some(l => l.level === 'PHOTO_VERIFIED') ? '3' : '2'}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Mizan Score</p>
                <h2 className="text-7xl font-black text-white leading-none tracking-tighter">{scoreData.score}</h2>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white tracking-tight">{user.name?.toUpperCase()}</p>
                <p className="text-[10px] font-bold text-white/40 tracking-widest">MEMBER SINCE 2026</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-6">
              <div className="flex gap-4">
                {user.accountLinks.slice(0, 2).map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#3EA63B]" />
                    <span className="text-[10px] font-bold text-white/60">{link.level === 'PHOTO_VERIFIED' ? 'ID VERIFIED' : 'BANK LINKED'}</span>
                  </div>
                ))}
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                 <QrCode className="w-8 h-8 text-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Factors list */}
        <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.1em] mb-6">Verified Trust Factors</h3>
          <div className="space-y-4">
            {scoreData.factors.filter(f => f.impact === 'positive').map((factor, i) => {
              const Icon = getFactorIcon(factor.label);
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">{factor.label}</p>
                    <p className="text-[11px] text-slate-500">{factor.message}</p>
                  </div>
                  <div className="text-[#3EA63B] font-bold text-sm">+{factor.score}%</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
             <p className="text-[11px] text-slate-400 font-medium">
               This Trust Card is a verified Mizan AI snapshot.{"\n"}
               Valid as of {new Date().toLocaleDateString()}.
             </p>
             <div className="mt-6">
               <span className="bg-[#3EA63B] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-[#3EA63B]/20">
                 Join Mizan Trust
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
