'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Building2, Smartphone, Users, Filter, Coffee, ArrowDownToLine, ShoppingCart, Tv, X, ChevronDown, CircleDollarSign, Download, PieChart as PieChartIcon, Calendar, Plus, ArrowRight, ArrowLeft, Send, Wallet, Sparkles, ArrowUpRight, ArrowDownRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SimpleLedger } from '@/components/SimpleLedger';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSearchParams, useRouter } from 'next/navigation';
import { AccountStep } from '@/components/onboarding/AccountStep';
import { performUpdateOnboardingPhase } from '@/app/onboarding/actions';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';
import { AppPageShell } from '@/components/AppPageShell';

type AddMode = 'transaction' | 'transfer' | null;
type TxType = 'expense' | 'income';

const ETB_TO_USD = 0.0071;

const txCategories = ['Income', 'Food & Drink', 'Groceries', 'Entertainment', 'Transport', 'Utilities', 'Healthcare', 'Transfer'];
const filterCategories = ['All', 'Income', 'Food & Drink', 'Groceries', 'Entertainment'];

export default function LedgerClient({ accounts, initialTransactions, summary }: { accounts: any[], initialTransactions: any[], summary: any }) {
  // Derive source accounts from real data
  const sourceAccounts = ['All', ...accounts.map(a => a.name)];
  
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [showUSD, setShowUSD] = useState(false);
  const [transactions, setTransactions] = useState<any[]>(initialTransactions);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Add flow state
  const [addMode, setAddMode] = useState<AddMode>(null);
  const [addStep, setAddStep] = useState(0);
  const [txType, setTxType] = useState<TxType>('expense');
  const [txData, setTxData] = useState({ title: '', amount: '', category: '', source: accounts[0]?.id, targetAccount: accounts[1]?.id });
  const [success, setSuccess] = useState(false);
  
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isOnboarding = searchParams.get('action') === 'add-account';
  const [onboardingAccounts, setOnboardingAccounts] = useState<any[]>([]);

  const fmt = (amount: number) => {
    if (showUSD) return `$${(Math.abs(amount) * ETB_TO_USD).toFixed(2)}`;
    return `${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB`;
  };

  const filtered = transactions.filter((tx) => {
    const catMatch = selectedCategory === 'All' || tx.category === selectedCategory;
    const srcMatch = selectedSource === 'All' || tx.source === selectedSource;
    return catMatch && srcMatch;
  });

  const getFormatDate = (dateStr: string) => {
    if (!dateStr) return 'Past';
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const grouped = filtered.reduce((acc, tx) => {
    const formattedDate = getFormatDate(tx.date);
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(tx);
    return acc;
  }, {} as Record<string, any[]>);

  const activeFilters = (selectedCategory !== 'All' ? 1 : 0) + (selectedSource !== 'All' ? 1 : 0);

  const openAdd = (mode: AddMode) => {
    setAddMode(mode);
    setAddStep(0);
    setSuccess(false);
    setTxData({ title: '', amount: '', category: '', source: accounts[0]?.id, targetAccount: accounts[1]?.id });
  };

  const closeAdd = () => { setAddMode(null); setAddStep(0); setSuccess(false); };

  const handleAddSubmit = async () => {
    // For demo, just show success
    setSuccess(true);
    setTimeout(() => closeAdd(), 1800);
  };

  const handleOnboardingComplete = async () => {
    setLoading(true);
    try {
      const res = await performUpdateOnboardingPhase('profile', { accounts: onboardingAccounts });
      if (res.error) throw new Error(res.error);
      
      toast.success('Accounts added successfully!');
      router.push('/ledger'); // Clear query param
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save accounts');
    } finally {
      setLoading(false);
    }
  };

  // TransactionAdd steps logic
  const txSteps = addMode === 'transfer' ? [
    { id: 'from', label: 'From Account' },
    { id: 'to', label: 'To Account' },
    { id: 'amount', label: 'Amount' },
  ] : [
    { id: 'type', label: 'Type' },
    { id: 'category', label: 'Category' },
    { id: 'amount', label: 'Amount & Details' },
  ];

  const isStepValid = () => {
    if (addMode === 'transfer') {
      if (addStep === 0) return !!txData.source;
      if (addStep === 1) return !!txData.targetAccount && txData.targetAccount !== txData.source;
      if (addStep === 2) return !!txData.amount && !isNaN(Number(txData.amount));
    } else {
      if (addStep === 0) return true; // type is always set
      if (addStep === 1) return !!txData.category;
      if (addStep === 2) return !!txData.amount && !!txData.title;
    }
    return false;
  };

  return (
    <AppPageShell
      title="Money"
      subtitle="Track your spending and manage your accounts"
      variant="hero"
      actions={
        <div className="flex items-center gap-3">
          <button className="hidden md:flex text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition items-center gap-1">
            <Download className="w-3 h-3" /> Export
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/60">ETB</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={showUSD} onChange={() => setShowUSD(v => !v)} />
              <div className="w-9 h-5 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3EA63B]"></div>
            </label>
            <span className="text-xs font-semibold text-white/60">USD</span>
          </div>
        </div>
      }
    >

      <main className="flex-1 px-8 py-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">

        {/* ── Stat Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Balance</span>
            <span className="text-xl font-black text-[#0F172A]">{(summary.totalBalance / 1000).toFixed(0)}K ETB</span>
            <span className="text-[10px] text-[#3EA63B] font-bold ml-1">+12%</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Monthly In</span>
            <span className="text-xl font-black text-[#3EA63B]">+{summary.monthlyIn.toLocaleString()} ETB</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Monthly Out</span>
            <span className="text-xl font-black text-amber-600">-{summary.monthlyOut.toLocaleString()} ETB</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Savings Rate</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-[#0F172A]">{summary.savingsRate}%</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-[#3EA63B]" style={{ width: `${summary.savingsRate}%`, height: '100%' }} /></div>
            </div>
          </div>
        </div>

        {/* ── Accounts Strip ── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">My Accounts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => openAdd('transaction')}
                className="flex items-center gap-1.5 bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Transaction
              </button>
              <button
                onClick={() => openAdd('transfer')}
                className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
              >
                <Send className="w-3.5 h-3.5" /> Transfer
              </button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="min-w-[220px] h-[130px] rounded-2xl p-4 text-white shadow-lg relative snap-center flex flex-col justify-between overflow-hidden shrink-0"
                style={{ backgroundColor: account.color }}
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[10px] opacity-80 font-semibold uppercase tracking-widest">{account.type}</p>
                    <p className="text-sm font-black">{account.name}</p>
                  </div>
                  {account.type === 'Credit Card' ? <CreditCard className="w-4 h-4 opacity-50" /> : <Wallet className="w-4 h-4 opacity-50" />}
                </div>
                <div className="z-10">
                  <p className="text-xl font-black">{showUSD ? `$${(account.balance * ETB_TO_USD).toFixed(0)}` : `${account.balance.toLocaleString()} ETB`}</p>
                  {account.type === 'Credit Card' && account.limit && (
                    <p className="text-[9px] opacity-60 font-bold">/ {account.limit.toLocaleString()} Limit</p>
                  )}
                  <p className="text-[9px] opacity-60 mt-0.5">{account.number}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Transaction List */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
              <button
                onClick={() => setShowFilter(true)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors relative ${activeFilters > 0 ? 'bg-[#3EA63B] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                <Filter className="w-4 h-4" />
                {activeFilters > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{activeFilters}</span>
                )}
              </button>
            </div>

            {loading && (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="h-2 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <div className="col-span-2">Date</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              <div className="divide-y divide-slate-100">
                {(Object.entries(grouped) as [string, any[]][]).map(([date, txs]) => (
                  <div key={date}>
                    {/* On mobile we might show the date header, on desktop the date is in the row */}
                    {txs.map((tx) => {
                      return (
                        <div key={tx.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors items-center text-sm">
                          <div className="md:col-span-2 text-slate-500">
                            {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="md:col-span-5 font-medium text-slate-800">
                            {tx.title}
                          </div>
                          <div className="md:col-span-3">
                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                              {tx.category}
                            </span>
                          </div>
                          <div className={`md:col-span-2 text-right font-semibold ${tx.amount > 0 ? 'text-[#3EA63B]' : 'text-slate-700'}`}>
                            {tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {filtered.length === 0 && !loading && (
                <div className="text-center text-slate-400 py-12">
                  <CircleDollarSign className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                  <p className="font-bold text-slate-500 mb-2">No transactions yet.</p>
                  <button onClick={() => openAdd('transaction')} className="text-[#3EA63B] text-sm font-bold flex items-center gap-1.5 mx-auto">
                    <Plus className="w-4 h-4" /> Log your first transaction
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              {/* Spending Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-3.5 h-3.5" /> Monthly Spending
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-24 shrink-0">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={summary.spendingData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={2}>
                            {summary.spendingData.map((entry: any, i: number) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900">{(summary.totalSpending / 1000).toFixed(0)}K ETB</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">This Month</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {summary.spendingData.map((cat: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] text-slate-600 flex-1">{cat.name}</span>
                      <span className="text-[10px] font-bold text-slate-900">{(cat.value / 1000).toFixed(1)}K</span>
                      <span className="text-[10px] text-slate-400 w-8 text-right">{summary.totalSpending ? Math.round(cat.value / summary.totalSpending * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> 6-Month Trend
                </h3>
                <div className="space-y-2.5">
                  {summary.monthlyTrend.map((m: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase w-8">{m.month}</span>
                        <div className="flex gap-3 text-[10px]">
                          <span className="text-[#3EA63B] font-bold">+{(m.income / 1000).toFixed(0)}K</span>
                          <span className="text-red-500 font-bold">-{(m.expense / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-1.5">
                        <div className="bg-[#3EA63B] rounded-full transition-all" style={{ width: `${(m.income / 35000) * 100}%` }} />
                        <div className="bg-red-400 rounded-full transition-all" style={{ width: `${(m.expense / 35000) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3EA63B]" /> Income</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Spending</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Filter Sheet ── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">Filter</h3>
              <button onClick={() => setShowFilter(false)} className="p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="mb-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {filterCategories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >{cat}</button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Account</p>
              <div className="flex flex-wrap gap-2">
                {sourceAccounts.map(src => (
                  <button key={src} onClick={() => setSelectedSource(src)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedSource === src ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >{src}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSelectedCategory('All'); setSelectedSource('All'); }}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition">Clear</button>
              <button onClick={() => setShowFilter(false)}
                className="flex-1 py-3 rounded-xl bg-[#0F172A] text-white font-bold text-sm hover:bg-slate-800 transition">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Progressive Add / Transfer Flow ── */}
      <AnimatePresence>
        {addMode && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) closeAdd(); }}
          >
            <motion.div
              className="bg-white w-full sm:max-w-md rounded-3xl shadow-2xl overflow-hidden"
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            >
              {success ? (
                <div className="p-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#3EA63B]/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#3EA63B]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{addMode === 'transfer' ? 'Transfer Sent!' : 'Transaction Logged!'}</h3>
                  <p className="text-sm text-slate-500">Your Ledger has been updated.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center">
                        {addMode === 'transfer' ? <Send className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-slate-900">{addMode === 'transfer' ? 'Transfer Money' : 'Log Transaction'}</h3>
                        <p className="text-[10px] text-slate-400">Step {addStep + 1} of {txSteps.length}</p>
                      </div>
                    </div>
                    <button onClick={closeAdd} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button>
                  </div>

                  {/* Progress */}
                  <div className="h-1 w-full bg-slate-100">
                    <div
                      className="h-full bg-[#3EA63B] transition-all duration-400"
                      style={{ width: `${((addStep + 1) / txSteps.length) * 100}%` }}
                    />
                  </div>

                  {/* Step Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={addStep}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{txSteps[addStep].label}</p>

                      {/* Transaction – Step 0: Type */}
                      {addMode === 'transaction' && addStep === 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {(['expense', 'income'] as TxType[]).map(t => (
                            <button key={t} onClick={() => setTxType(t)}
                              className={`p-5 rounded-2xl border flex flex-col items-center gap-2 font-bold text-sm transition-all ${txType === t ? 'border-[#3EA63B] bg-[#3EA63B]/5 text-[#3EA63B]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              {t === 'expense' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                              {t === 'expense' ? 'Expense' : 'Income'}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Transaction – Step 1: Category */}
                      {addMode === 'transaction' && addStep === 1 && (
                        <div className="flex flex-wrap gap-2">
                          {txCategories.map(cat => (
                            <button key={cat} onClick={() => setTxData(f => ({ ...f, category: cat }))}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${txData.category === cat ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Transaction – Step 2: Amount & Title */}
                      {addMode === 'transaction' && addStep === 2 && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Amount (ETB)</label>
                            <input
                              type="number"
                              inputMode="numeric"
                              placeholder="e.g. 500"
                              value={txData.amount}
                              onChange={e => setTxData(f => ({ ...f, amount: e.target.value }))}
                              className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-200 focus:border-[#3EA63B] outline-none py-2 bg-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Note</label>
                            <input
                              type="text"
                              placeholder={`e.g. ${txType === 'income' ? 'Salary' : "Lunch at Kaldi's"}`}
                              value={txData.title}
                              onChange={e => setTxData(f => ({ ...f, title: e.target.value }))}
                              className="w-full text-sm text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:border-[#3EA63B] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">From Account</label>
                            <div className="grid grid-cols-2 gap-2">
                              {accounts.map(a => (
                                <button key={a.id} onClick={() => setTxData(f => ({ ...f, source: a.id }))}
                                  className={`px-3 py-2 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition-all ${txData.source === a.id ? 'border-[#3EA63B] bg-[#3EA63B]/5 text-[#3EA63B]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                                  <span className="truncate">{a.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transfer – Step 0: From account */}
                      {addMode === 'transfer' && addStep === 0 && (
                        <div className="space-y-2">
                          {accounts.map(a => (
                            <button key={a.id} onClick={() => setTxData(f => ({ ...f, source: a.id }))}
                              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${txData.source === a.id ? 'border-[#3EA63B] bg-[#3EA63B]/5' : 'border-slate-200 hover:bg-slate-50'}`}
                            >
                              <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: a.color }} />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-bold text-slate-900">{a.name}</p>
                                <p className="text-[10px] text-slate-400">{a.balance.toLocaleString()} ETB</p>
                              </div>
                              {txData.source === a.id && <CheckCircle2 className="w-4 h-4 text-[#3EA63B]" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Transfer – Step 1: To account */}
                      {addMode === 'transfer' && addStep === 1 && (
                        <div className="space-y-2">
                          {accounts.filter(a => a.id !== txData.source).map(a => (
                            <button key={a.id} onClick={() => setTxData(f => ({ ...f, targetAccount: a.id }))}
                              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${txData.targetAccount === a.id ? 'border-[#3EA63B] bg-[#3EA63B]/5' : 'border-slate-200 hover:bg-slate-50'}`}
                            >
                              <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: a.color }} />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-bold text-slate-900">{a.name}</p>
                                <p className="text-[10px] text-slate-400">{a.balance.toLocaleString()} ETB</p>
                              </div>
                              {txData.targetAccount === a.id && <CheckCircle2 className="w-4 h-4 text-[#3EA63B]" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Transfer – Step 2: Amount */}
                      {addMode === 'transfer' && addStep === 2 && (
                        <div>
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4">
                            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: accounts.find(a => a.id === txData.source)?.color }} />
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold text-slate-700">{accounts.find(a => a.id === txData.source)?.name}</p>
                              <p className="text-[9px] text-slate-400">{accounts.find(a => a.id === txData.source)?.balance.toLocaleString()} ETB</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: accounts.find(a => a.id === txData.targetAccount)?.color }} />
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold text-slate-700">{accounts.find(a => a.id === txData.targetAccount)?.name}</p>
                            </div>
                          </div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Amount (ETB)</label>
                          <input
                            type="number" inputMode="numeric" placeholder="e.g. 5000"
                            value={txData.amount}
                            onChange={e => setTxData(f => ({ ...f, amount: e.target.value }))}
                            className="w-full text-3xl font-black text-slate-900 border-b-2 border-slate-200 focus:border-[#3EA63B] outline-none py-2 bg-transparent"
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Footer actions */}
                  <div className="flex gap-3 px-6 pb-6">
                    <button
                      onClick={() => addStep > 0 ? setAddStep(s => s - 1) : closeAdd()}
                      className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addStep < txSteps.length - 1 ? setAddStep(s => s + 1) : handleAddSubmit()}
                      disabled={!isStepValid()}
                      className={`flex-1 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${!isStepValid() ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg'}`}
                    >
                      {addStep < txSteps.length - 1 ? 'Continue' : addMode === 'transfer' ? 'Send Transfer' : 'Log Transaction'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contextual Onboarding Overlay ── */}
      <AnimatePresence>
        {isOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-xl p-4"
          >
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#3EA63B]/10 rounded-full blur-[100px] -z-10" />
               <button 
                onClick={() => router.push('/ledger')} 
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
               >
                 <X className="w-6 h-6" />
               </button>
               
               <AccountStep 
                accounts={onboardingAccounts}
                setAccounts={setOnboardingAccounts}
                onNext={handleOnboardingComplete}
                onBack={() => router.push('/')}
               />

               {loading && (
                 <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-3xl z-10">
                   <div className="flex flex-col items-center gap-3">
                     <div className="w-10 h-10 border-4 border-white/20 border-t-[#3EA63B] rounded-full animate-spin" />
                     <p className="text-xs font-bold text-white uppercase tracking-widest">Updating Mizan...</p>
                   </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </AppPageShell>
    );
}
