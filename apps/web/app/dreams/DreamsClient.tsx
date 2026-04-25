'use client';

import { useState } from 'react';
import { Bell, Stars, PlusCircle, Wallet, ShoppingBasket, Home, Car, X, Target, Calendar, TrendingUp, Lightbulb, Plus, ReceiptText, Coffee, Smartphone, Heart, GraduationCap, Zap, CheckCircle2, LayoutTemplate, Camera } from 'lucide-react';
import { AIBudgetForecast } from '@/components/AIBudgetForecast';
import { motion, AnimatePresence } from 'framer-motion';
import { budgetTemplates } from '@/lib/data/budgetTemplates';
import { BillReminders } from '@/components/BillReminders';
import { ReceiptScanner } from '@/components/ReceiptScanner';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoalStep } from '@/components/onboarding/GoalStep';
import { performUpdateOnboardingPhase } from '@/app/onboarding/actions';
import { toast } from 'sonner';
import { SimplePageShell } from '@/components/SimplePageShell';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const mockBudgets = [
  { id: 1, name: 'Food & Groceries', spent: 3800, total: 5000, icon: ShoppingBasket, color: 'text-orange-600', bg: 'bg-orange-100', progressColor: 'bg-orange-500' },
  { id: 2, name: 'Rent & Housing', spent: 8000, total: 8000, icon: Home, color: 'text-blue-600', bg: 'bg-blue-100', progressColor: 'bg-blue-500' },
  { id: 3, name: 'Savings Target', spent: 4500, total: 10000, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100', progressColor: 'bg-[#3EA63B]' },
  { id: 4, name: 'Transport', spent: 850, total: 3000, icon: Car, color: 'text-purple-600', bg: 'bg-purple-100', progressColor: 'bg-purple-500' },
];

const mockGoals = [
  { id: 1, name: 'Emergency Fund', target: 100000, saved: 65000, deadline: 'Jun 2026', emoji: '🛡️' },
  { id: 2, name: 'Laptop for Work', target: 45000, saved: 28000, deadline: 'Apr 2026', emoji: '💻' },
  { id: 3, name: 'Vacation Trip', target: 30000, saved: 8500, deadline: 'Dec 2026', emoji: '✈️' },
];

export default function DreamsClient({ initialBudgets, initialGoals, initialBills }: { initialBudgets: any[], initialGoals: any[], initialBills: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goalData, setGoalData] = useState<any>(null);

  const isGoalOnboarding = searchParams.get('action') === 'set-budget';

  const handleGoalComplete = async () => {
    if (!goalData) return;
    setLoading(true);
    try {
      const res = await performUpdateOnboardingPhase('complete', { goal: goalData });
      if (res.error) throw new Error(res.error);
      
      toast.success('Awesome! Your first financial goal is set.');
      router.push('/dreams');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  const [budgets, setBudgets] = useState(() => {
     if (initialBudgets && initialBudgets.length > 0 && initialBudgets[0].categories) {
       return initialBudgets[0].categories.map((c: any) => ({
         id: c.id, 
         name: c.name, 
         spent: c.spent, 
         total: c.allocated, 
         icon: ShoppingBasket, 
         color: c.color || 'text-slate-600', 
         bg: 'bg-slate-100', 
         progressColor: c.color ? `bg-${c.color.split('-')[1]}-500` : 'bg-slate-500'
       }));
     }
     return mockBudgets;
  });
  
  const [goalsState, setGoals] = useState(() => {
     if (initialGoals && initialGoals.length > 0) return initialGoals;
     return mockGoals;
  });
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showExpenseLogger, setShowExpenseLogger] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [expense, setExpense] = useState({ amount: '', category: '', note: '' });
  const [expenseSuccess, setExpenseSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const totalBudget = budgets.reduce((s: number, b: any) => s + b.total, 0);
  const totalSpent = budgets.reduce((s: number, b: any) => s + b.spent, 0);
  const budgetPercent = Math.round((totalSpent / totalBudget) * 100);

  const addGoalRef = useFocusTrap(showNewGoal, () => setShowNewGoal(false));
  const loggerRef = useFocusTrap(showExpenseLogger, () => setShowExpenseLogger(false));
  const templatesRef = useFocusTrap(showTemplates, () => setShowTemplates(false));
  const goalStepRef = useFocusTrap(isGoalOnboarding, () => router.push('/dreams'));

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.name && newGoal.target) {
      try {
        const res = await fetch('/api/v1/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newGoal.name, target: Number(newGoal.target) })
        });
        if (!res.ok) throw new Error('Failed to create goal');
        const created = await res.json();
        setGoals((g: any[]) => [...g, created]);
        toast.success('Goal created!');
      } catch (err: any) {
        toast.error(err.message || 'Failed to create goal');
      }
      setShowNewGoal(false);
      setNewGoal({ name: '', target: '' });
    }
  };

  const content = (
    <div className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
        {/* Desktop: 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Budget Tracker (Left) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Monthly Overview */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">{new Date().toLocaleString('default', { month: 'long' })} Budget</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200 transition"
                  >
                    <LayoutTemplate className="w-3 h-3" /> Templates
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 3 days left
                  </span>
                </div>
              </div>
              {/* Overall progress ring */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={budgetPercent > 90 ? '#ef4444' : '#3EA63B'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${budgetPercent * 2.51} 251`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-slate-900">{budgetPercent}%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Used</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">ETB {totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 font-semibold">of ETB {totalBudget.toLocaleString()} budget</p>
                  <p className="text-xs text-[#3EA63B] font-bold mt-1">
                    ETB {(totalBudget - totalSpent).toLocaleString()} remaining
                  </p>
                </div>
              </div>

              {/* Category budgets */}
              <div className="space-y-4">
                {budgets.map((budget: any) => {
                  const Icon = budget.icon;
                  const pct = Math.min(100, Math.round((budget.spent / budget.total) * 100));
                  return (
                    <div key={budget.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${budget.bg} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${budget.color}`} />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{budget.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">{budget.spent.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-semibold"> / {budget.total.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : budget.progressColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bill Reminders */}
            <BillReminders initialBills={initialBills} />

            {/* AI Forecast */}
            <AIBudgetForecast />
          </div>

          {/* Goals & Tips (Right) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Savings Goals */}
            <section className="mb-6">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3EA63B]" /> Savings Goals
              </h2>
              <div className="space-y-3">
                {goalsState.map((goal: any) => {
                  const pct = Math.round((goal.saved / goal.target) * 100);
                  const remaining = goal.target - goal.saved;
                  return (
                    <div key={goal.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{goal.emoji}</span>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-slate-900">{goal.name}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">Target: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="relative w-12 h-12">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3EA63B" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${pct * 2.51} 251`} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900">{pct}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-black text-slate-900">ETB {goal.saved.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">of ETB {goal.target.toLocaleString()}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          ETB {remaining.toLocaleString()} to go
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* AI Tip */}
            <section className="bg-gradient-to-br from-[#6ED063]/10 to-[#3EA63B]/5 rounded-2xl p-5 border border-[#6ED063]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Lightbulb className="w-16 h-16 text-[#3EA63B]" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#3EA63B] text-white flex items-center justify-center shadow-lg shadow-[#3EA63B]/30 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1 text-slate-900">Mizan AI Insight</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    At your current saving rate, you&apos;ll hit your Emergency Fund goal by <span className="font-bold text-[#3EA63B]">May 2026</span> — one month early!
                    Consider redirecting the surplus to your Laptop Fund.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Avg. Monthly Save</p>
                <p className="text-xl font-black text-[#3EA63B]">ETB {totalBudget > 0 ? (totalBudget - totalSpent).toLocaleString() : '0'}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Goals On Track</p>
                <p className="text-xl font-black text-slate-900">{goalsState.filter((g: any) => g.saved / g.target >= 0.5).length} / {goalsState.length}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
  );

  return (
    <>
      <SimplePageShell
        title="Goals"
        description="Manage your financial life with ease"
        headerAction={
          <div className="flex gap-2">
           <button
              onClick={() => setShowExpenseLogger(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              title="Log Expense"
            >
              <ReceiptText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNewGoal(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-mint-primary)] text-white hover:opacity-90 transition-colors"
              title="Add Goal"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        }
      >
        {content}
      </SimplePageShell>

      {/* Add Goal Modal */}
      {showNewGoal && (
        <div ref={addGoalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">New Savings Goal</h3>
              <button onClick={() => setShowNewGoal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Goal Name</label>
                <input type="text" value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g. New Laptop" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30 focus:border-[#3EA63B]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Amount (ETB)</label>
                <input type="number" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="50000" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30 focus:border-[#3EA63B]" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#3EA63B] text-white font-bold hover:bg-[#339932] transition">
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Expense Logger Modal ── */}
      <AnimatePresence>
        {showExpenseLogger && (
          <motion.div
            ref={loggerRef as any}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowExpenseLogger(false); }}
          >
            <motion.div
              className="bg-white w-full sm:max-w-sm rounded-3xl shadow-2xl overflow-hidden"
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            >
              {expenseSuccess ? (
                <div className="p-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#3EA63B]/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-[#3EA63B]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Expense Logged!</h3>
                  <p className="text-sm text-slate-500">Your budget has been updated.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#0F172A] flex items-center justify-center">
                        <ReceiptText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-black text-sm text-slate-900">Log an Expense</h3>
                    </div>
                    <button onClick={() => setShowExpenseLogger(false)} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Amount */}
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Amount (ETB)</label>
                      <input
                        type="number" inputMode="numeric" placeholder="e.g. 250"
                        value={expense.amount}
                        onChange={e => setExpense(x => ({ ...x, amount: e.target.value }))}
                        className="w-full text-3xl font-black text-slate-900 border-b-2 border-slate-200 focus:border-[#3EA63B] outline-none py-2 bg-transparent transition-colors"
                      />
                    </div>
                    {/* Category */}
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Category</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Food', icon: Coffee, color: 'text-orange-500 bg-orange-50' },
                          { label: 'Transport', icon: Car, color: 'text-blue-500 bg-blue-50' },
                          { label: 'Shopping', icon: ShoppingBasket, color: 'text-purple-500 bg-purple-50' },
                          { label: 'Mobile', icon: Smartphone, color: 'text-sky-500 bg-sky-50' },
                          { label: 'Health', icon: Heart, color: 'text-red-500 bg-red-50' },
                          { label: 'Education', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50' },
                          { label: 'Utilities', icon: Zap, color: 'text-amber-500 bg-amber-50' },
                          { label: 'Other', icon: Wallet, color: 'text-slate-500 bg-slate-100' },
                        ].map(cat => (
                          <button
                            key={cat.label}
                            onClick={() => setExpense(x => ({ ...x, category: cat.label }))}
                            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-center ${expense.category === cat.label
                              ? 'border-[#3EA63B] bg-[#3EA63B]/5 shadow-sm'
                              : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                              <cat.icon className="w-4 h-4" />
                            </div>
                            <span className={`text-[9px] font-bold truncate w-full ${expense.category === cat.label ? 'text-[#3EA63B]' : 'text-slate-500'}`}>{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Note */}
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Note (optional)</label>
                      <input
                        type="text" placeholder="e.g. Kaldi coffee with team"
                        value={expense.note}
                        onChange={e => setExpense(x => ({ ...x, note: e.target.value }))}
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3EA63B] transition-colors"
                      />
                    </div>
                    {/* Submit */}
                    <button
                      onClick={async () => {
                        if (expense.amount && expense.category) {
                          try {
                            const res = await fetch('/api/v1/transactions', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: expense.note || expense.category,
                                amount: -Math.abs(Number(expense.amount)),
                                source: 'Manual',
                                category: expense.category,
                              })
                            });
                            if (!res.ok) throw new Error('Failed to log expense');
                            setExpenseSuccess(true);
                            toast.success('Expense logged!');
                            setTimeout(() => setShowExpenseLogger(false), 1800);
                          } catch (err: any) {
                            toast.error(err.message || 'Failed to log expense');
                          }
                        }
                      }}
                      disabled={!expense.amount || !expense.category}
                      className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${expense.amount && expense.category
                        ? 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      Log Expense
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Budget Templates Modal ── */}
      {showTemplates && (
        <div ref={templatesRef} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTemplates(false); }}
        >
          <div className="bg-white w-full sm:max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-slate-400" />
                <h3 className="font-black text-sm text-slate-900">Budget Templates</h3>
              </div>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-3 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-2">Choose a template to pre-fill your monthly budget categories.</p>
              {budgetTemplates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={async () => {
                    const totalIncome = 26000; // default monthly income for demo
                    const newBudgets = tmpl.categories.map((cat, i) => ({
                      id: i + 1,
                      name: cat.name,
                      spent: 0,
                      total: Math.round(totalIncome * (cat.pct / 100)),
                      icon: cat.icon,
                      color: cat.color,
                      bg: cat.bg,
                      progressColor: cat.progressColor,
                    }));
                    setBudgets(newBudgets);
                    setShowTemplates(false);
                    // Persist via API
                    try {
                      const now = new Date();
                      await fetch('/api/v1/budgets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          month: now.getMonth() + 1,
                          year: now.getFullYear(),
                          totalLimit: totalIncome,
                          categories: newBudgets.map(b => ({ name: b.name, allocated: b.total }))
                        })
                      });
                      toast.success('Budget template applied!');
                    } catch {
                      toast.error('Budget saved locally only');
                    }
                  }}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-[#3EA63B] hover:bg-[#3EA63B]/5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{tmpl.emoji}</span>
                    <div>
                      <p className="text-sm font-black text-slate-900">{tmpl.name}</p>
                      <p className="text-[10px] text-slate-400">{tmpl.description}</p>
                    </div>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    {tmpl.categories.map((cat: any, i: number) => (
                      <div key={i} className={cat.progressColor} style={{ width: `${cat.pct}%` }} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {tmpl.categories.map((cat: any, i: number) => (
                      <span key={i} className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.progressColor}`} />
                        {cat.name} {cat.pct}%
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* ── Contextual Goal Overlay ── */}
      <AnimatePresence>
        {isGoalOnboarding && (
          <motion.div
            ref={goalStepRef as any}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-xl p-4"
          >
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />
               <button 
                onClick={() => router.push('/dreams')} 
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
               >
                 <X className="w-6 h-6" />
               </button>
               
               <GoalStep 
                goal={goalData}
                setGoal={setGoalData}
                onNext={handleGoalComplete}
                onBack={() => router.push('/dreams')}
                loading={loading}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
