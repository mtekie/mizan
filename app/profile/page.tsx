import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ShieldCheck, GraduationCap, Briefcase, Banknote, Users, Sparkles, Activity, Edit3, ArrowRight, Target, TrendingUp, CreditCard, Wallet, Book } from 'lucide-react';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    let user = null;
    if (session?.user?.email) {
        user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    if (!user) user = await prisma.user.findFirst();
    if (!user) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Please log in</div>;

    const completionFactors = [
        { label: 'Identity', done: !!(user.gender && user.dateOfBirth), pts: 10 },
        { label: 'Education', done: !!user.educationLevel, pts: 10 },
        { label: 'Employment', done: !!user.employmentStatus, pts: 15 },
        { label: 'Income', done: !!user.monthlyIncomeRange, pts: 15 },
        { label: 'Family', done: !!user.familyStatus, pts: 10 },
    ];
    const completedCount = completionFactors.filter(f => f.done).length;
    const completionPct = Math.round((completedCount / completionFactors.length) * 100);

    const accounts = [
        { name: 'CBE', value: 25400, color: '#68246D', type: 'Bank Book', number: '1000 **** **** 8472' },
        { name: 'Telebirr', value: 12500, color: '#00ADEF', type: 'Mobile Wallet', number: '+251 *** *** 119' },
        { name: 'Awash', value: 4600, color: '#F15A22', type: 'Debit Card', number: '4452 **** **** 5133' },
        { name: 'Tsehay', value: 18500, color: '#eab308', type: 'Credit Card', number: '5543 **** **** 9012', limit: 50000 },
    ];
    const totalBalance = accounts.reduce((s, a) => s + a.value, 0);

    return (
        <div className="flex flex-col min-h-screen bg-slate-100/50">
            <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full pb-24 md:pb-6">

                {/* ── Row 1: Hero + Score + Completion ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

                    {/* Identity Hero */}
                    <div className="lg:col-span-4 bg-[#0F172A] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col">
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#3EA63B]/10 rounded-full blur-3xl" />
                        <div className="flex items-start justify-between relative z-10 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6ED063] to-[#3EA63B] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                    {user.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-white leading-tight">{user.name || 'User'}</h1>
                                    <p className="text-xs text-slate-400 font-semibold">{user.email}</p>
                                </div>
                            </div>
                            <Link href="/onboarding" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-slate-400">
                                <Edit3 className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="relative z-10 flex-1 flex flex-col justify-end gap-3">
                            {user.isProfileComplete ? (
                                <span className="inline-flex items-center gap-1.5 bg-[#3EA63B]/20 text-[#6ED063] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit">
                                    <ShieldCheck className="w-3 h-3" /> Fully Verified
                                </span>
                            ) : (
                                <Link href="/onboarding" className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit hover:bg-amber-500/30 transition">
                                    <Sparkles className="w-3 h-3" /> Complete Profile → +50pts
                                </Link>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                {user.employmentStatus && (
                                    <div className="bg-white/5 rounded-lg p-2.5">
                                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Employment</p>
                                        <p className="text-xs font-bold text-white truncate">{user.employmentStatus}</p>
                                    </div>
                                )}
                                {user.familyStatus && (
                                    <div className="bg-white/5 rounded-lg p-2.5">
                                        <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Household</p>
                                        <p className="text-xs font-bold text-white truncate">{user.familyStatus}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mizan Score */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mizan Score</h3>
                            <Activity className="w-4 h-4 text-[#3EA63B]" />
                        </div>
                        <div className="flex-1 flex items-center justify-center py-4">
                            <div className="relative flex items-center justify-center">
                                <svg viewBox="0 0 100 60" className="w-40 h-24">
                                    <path d="M10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                                    <path d="M10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#3EA63B" strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={`${(user.mizanScore / 850) * 125} 125`} />
                                </svg>
                                <div className="absolute bottom-0 text-center">
                                    <span className="text-3xl font-black text-slate-900">{user.mizanScore}</span>
                                    <p className="text-[10px] font-bold text-[#3EA63B] uppercase tracking-widest">Excellent</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">
                            <span>300</span><span>Top 5%</span><span>850</span>
                        </div>
                    </div>

                    {/* Profile Completion */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Completion</h3>
                            <span className="text-xl font-black text-[#0F172A]">{completionPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                            <div className="h-full bg-gradient-to-r from-[#3EA63B] to-[#6ED063] transition-all duration-700 rounded-full" style={{ width: `${completionPct}%` }} />
                        </div>
                        <div className="space-y-2.5">
                            {completionFactors.map(f => (
                                <div key={f.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${f.done ? 'bg-[#3EA63B]' : 'bg-slate-200'}`} />
                                        <span className={`text-xs font-bold ${f.done ? 'text-slate-700' : 'text-slate-400'}`}>{f.label}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${f.done ? 'bg-[#3EA63B]/10 text-[#3EA63B]' : 'bg-slate-100 text-slate-400'}`}>
                                        +{f.pts}pts
                                    </span>
                                </div>
                            ))}
                        </div>
                        {!user.isProfileComplete && (
                            <Link href="/onboarding" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                                <Sparkles className="w-3.5 h-3.5 text-[#6ED063]" /> Complete Now <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Row 2: Wealth Summary + Demographics ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

                    {/* Net Worth */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Balance</h3>
                            <Wallet className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-5">
                            <span className="text-3xl font-black text-[#0F172A]">{totalBalance.toLocaleString()}</span>
                            <span className="text-sm font-bold text-slate-400">ETB</span>
                        </div>
                        <div className="space-y-2">
                            {accounts.map(a => (
                                <div key={a.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                                    <span className="text-[10px] font-bold text-slate-500 flex-1 truncate">{a.name}</span>
                                    <span className="text-[10px] font-black text-slate-800">{a.value.toLocaleString()}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{a.type.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Demographics Grid */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demographics</h3>
                            <Link href="/onboarding" className="text-[10px] font-bold text-[#3EA63B] hover:underline flex items-center gap-1">Edit <Edit3 className="w-3 h-3" /></Link>
                        </div>
                        {!user.isProfileComplete ? (
                            <div className="h-32 flex flex-col items-center justify-center text-center gap-3">
                                <p className="text-sm font-bold text-slate-400">Profile incomplete</p>
                                <Link href="/onboarding" className="bg-[#3EA63B] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-lg shadow-[#3EA63B]/20 hover:bg-[#328a2f] transition">
                                    Start Onboarding
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { icon: Briefcase, label: 'Employment', value: user.employmentStatus, color: 'bg-orange-50 text-orange-600' },
                                    { icon: GraduationCap, label: 'Education', value: user.educationLevel, color: 'bg-blue-50 text-blue-600' },
                                    { icon: Banknote, label: 'Income Range', value: user.monthlyIncomeRange, color: 'bg-emerald-50 text-emerald-600' },
                                    { icon: Users, label: 'Household', value: user.familyStatus, color: 'bg-purple-50 text-purple-600' },
                                ].map(item => (
                                    <div key={item.label} className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-xs font-black text-slate-800 leading-tight">{item.value || '—'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Row 3: Score Factors + Quick Links ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Score Impact Factors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { label: 'Profile Completeness', value: `${completionPct}%`, pct: completionPct, color: '#3EA63B' },
                                { label: 'Transaction History', value: 'Good', pct: 72, color: '#6366f1' },
                                { label: 'Savings Consistency', value: '65%', pct: 65, color: '#f59e0b' },
                                { label: 'Debt-to-Income Ratio', value: 'Low', pct: 85, color: '#06b6d4' },
                            ].map(f => (
                                <div key={f.label} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-600">{f.label}</span>
                                        <span className="text-[10px] font-black text-slate-900">{f.value}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-3">
                        <Link href="/score" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 hover:border-[#3EA63B] transition group">
                            <div className="w-10 h-10 rounded-xl bg-[#3EA63B]/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#3EA63B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Score Breakdown</p>
                                <p className="text-[10px] text-slate-400">See full analysis</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#3EA63B] transition" />
                        </Link>
                        <Link href="/dreams" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 hover:border-[#3EA63B] transition group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Goals & Dreams</p>
                                <p className="text-[10px] text-slate-400">Track your progress</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#3EA63B] transition" />
                        </Link>
                        <Link href="/settings" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 hover:border-[#3EA63B] transition group">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Account Settings</p>
                                <p className="text-[10px] text-slate-400">Security & preferences</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#3EA63B] transition" />
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
}
