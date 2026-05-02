'use client';

import { useState } from 'react';
import { Bell, Stars, PlusCircle, Wallet, ShoppingBasket, Home, Car, X, Target, Calendar, TrendingUp, Lightbulb, Plus, ReceiptText, Coffee, Smartphone, Heart, GraduationCap, Zap, CheckCircle2, LayoutTemplate, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { budgetTemplates } from '@/lib/data/budgetTemplates';
import { BillReminders } from '@/components/BillReminders';
import { ReceiptScanner } from '@/components/ReceiptScanner';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoalStep } from '@/components/onboarding/GoalStep';
import { performUpdateOnboardingPhase } from '@/app/onboarding/actions';
import { toast } from 'sonner';
import { AppPageShell } from '@/components/AppPageShell';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { formatMoney, safePercent, toFiniteNumber, buildBudgetOverviewVM, buildGoalsVM, buildQuickStatsVM, buildForecastText, type GoalsScreenDataContract } from '@mizan/shared';

export default function DreamsClient({ initialBudgets, initialGoals, initialBills, goalsScreen }: { initialBudgets: any[], initialGoals: any[], initialBills: any[], goalsScreen?: GoalsScreenDataContract }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goalData, setGoalData] = useState<any[]>([]);

  const isGoalOnboarding = searchParams.get('action') === 'set-budget';

  const handleGoalComplete = async () => {
    if (goalData.length === 0) return;
    setLoading(true);
    try {
      const res = await performUpdateOnboardingPhase('complete', { goals: goalData });
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

  const mapBudgetCategories = (budget: any) => {
     if (!budget?.categories) return [];
     return budget.categories.map((c: any) => ({
       id: c.id,
       name: c.name,
       spent: toFiniteNumber(c.spent),
       total: toFiniteNumber(c.allocated),
       icon: ShoppingBasket,
       color: c.color || 'text-slate-600',
       bg: 'bg-slate-100',
       progressColor: c.color ? `bg-${c.color.split('-')[1]}-500` : 'bg-slate-500',
     }));
  };

  const [currentBudgetId, setCurrentBudgetId] = useState<string | null>(() => initialBudgets?.[0]?.id ?? null);
  const [budgets, setBudgets] = useState(() => mapBudgetCategories(initialBudgets?.[0]));
  
  const [goalsState, setGoals] = useState(() => {
     if (initialGoals && initialGoals.length > 0) return initialGoals;
     return [];
  });
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [showExpenseLogger, setShowExpenseLogger] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBudgetCategory, setShowBudgetCategory] = useState(false);
  const [editingBudgetCategoryId, setEditingBudgetCategoryId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [budgetCategoryForm, setBudgetCategoryForm] = useState({ name: '', allocated: '', spent: '' });
  const [expense, setExpense] = useState({ amount: '', category: '', note: '' });
  const [expenseSuccess, setExpenseSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const budgetVM = buildBudgetOverviewVM([{
    id: currentBudgetId || 'local',
    categories: budgets.map((b: any) => ({
      id: b.id,
      name: b.name,
      allocated: b.total,
      spent: b.spent,
    }))
  } as any]);
  
  const goalsVMData = buildGoalsVM(goalsState);
  const quickStatsVM = buildQuickStatsVM(budgetVM, goalsVMData);
  const forecastText = goalsScreen?.forecastText ?? buildForecastText(goalsVMData, budgetVM);

  const addGoalRef = useFocusTrap(showNewGoal, () => setShowNewGoal(false));
  const loggerRef = useFocusTrap(showExpenseLogger, () => setShowExpenseLogger(false));
  const templatesRef = useFocusTrap(showTemplates, () => setShowTemplates(false));
  const budgetCategoryRef = useFocusTrap(showBudgetCategory, () => setShowBudgetCategory(false));
  const goalStepRef = useFocusTrap(isGoalOnboarding, () => router.push('/dreams'));

  const persistBudgetCategories = async (nextCategories: any[]) => {
    const totalLimit = nextCategories.reduce((sum, category) => sum + toFiniteNumber(category.total), 0);
    const payloadCategories = nextCategories.map((category) => ({
      ...(typeof category.id === 'string' ? { id: category.id } : {}),
      name: category.name,
      allocated: toFiniteNumber(category.total),
      spent: toFiniteNumber(category.spent),
      color: category.color,
    }));

    const now = new Date();
    const response = await fetch('/api/v1/budgets', {
      method: currentBudgetId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentBudgetId
        ? { id: currentBudgetId, totalLimit, categories: payloadCategories }
        : {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            totalLimit,
            categories: payloadCategories,
          }),
    });

    if (!response.ok) throw new Error('Failed to save budget');
    const savedBudget = await response.json();
    setCurrentBudgetId(savedBudget.id);
    setBudgets(mapBudgetCategories(savedBudget));
    router.refresh();
  };

  const openCreateBudgetCategory = () => {
    setEditingBudgetCategoryId(null);
    setBudgetCategoryForm({ name: '', allocated: '', spent: '0' });
    setShowBudgetCategory(true);
  };

  const handleSaveBudgetCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    const allocated = Number(budgetCategoryForm.allocated);
    const spent = Number(budgetCategoryForm.spent || 0);

    if (!budgetCategoryForm.name.trim() || !Number.isFinite(allocated) || allocated < 0 || !Number.isFinite(spent) || spent < 0) {
      toast.error('Enter a valid category name and amounts');
      return;
    }

    const nextCategory = {
      id: editingBudgetCategoryId ?? `new-${Date.now()}`,
      name: budgetCategoryForm.name.trim(),
      total: allocated,
      spent,
      icon: ShoppingBasket,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      progressColor: 'bg-slate-500',
    };

    const previousCategories = budgets;
    const nextCategories = editingBudgetCategoryId
      ? budgets.map((category: any) => category.id === editingBudgetCategoryId ? { ...category, ...nextCategory, id: category.id } : category)
      : [...budgets, nextCategory];

    setBudgets(nextCategories);
    setShowBudgetCategory(false);
    try {
      await persistBudgetCategories(nextCategories);
      toast.success(editingBudgetCategoryId ? 'Budget category updated' : 'Budget category added');
    } catch (err: any) {
      setBudgets(previousCategories);
      toast.error(err.message || 'Failed to save budget category');
    } finally {
      setEditingBudgetCategoryId(null);
      setBudgetCategoryForm({ name: '', allocated: '', spent: '' });
    }
  };

  const openCreateGoal = () => {
    setEditingGoalId(null);
    setNewGoal({ name: '', target: '' });
    setShowNewGoal(true);
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.name && newGoal.target) {
      try {
        const res = await fetch('/api/v1/goals', {
          method: editingGoalId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(editingGoalId ? { id: editingGoalId } : {}),
            name: newGoal.name,
            target: Number(newGoal.target),
          })
        });
        if (!res.ok) throw new Error(editingGoalId ? 'Failed to update goal' : 'Failed to create goal');
        const saved = await res.json();
        setGoals((goals: any[]) => editingGoalId
          ? goals.map(goal => goal.id === saved.id ? saved : goal)
          : [...goals, saved]
        );
        toast.success(editingGoalId ? 'Goal updated!' : 'Goal created!');
      } catch (err: any) {
        toast.error(err.message || 'Failed to save goal');
      }
      setShowNewGoal(false);
      setEditingGoalId(null);
      setNewGoal({ name: '', target: '' });
    }
  };

  const handleContributeGoal = async (goal: any) => {
    const rawAmount = window.prompt(`Add contribution to ${goal.name}`, '1000');
    if (!rawAmount) return;

    const amount = Number(rawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid contribution amount');
      return;
    }

    const nextSaved = toFiniteNumber(goal.saved) + amount;
    try {
      const res = await fetch('/api/v1/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: goal.id, saved: nextSaved }),
      });
      if (!res.ok) throw new Error('Failed to add contribution');
      const savedGoal = await res.json();
      setGoals((goals: any[]) => goals.map(item => item.id === savedGoal.id ? savedGoal : item));
      toast.success(`Added ${formatMoney(amount)} to ${goal.name}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add contribution');
    }
  };

  const content = (
    <div className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-12 max-w-3xl mx-auto w-full">
        <div className="space-y-8">
            {/* Monthly Overview */}
            {/* SECTION: budget_overview */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-[#3EA63B] uppercase tracking-widest mb-1">This Month</p>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">{new Date().toLocaleString('default', { month: 'long' })} Budget</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200 transition"
                  >
                    <LayoutTemplate className="w-3 h-3" /> Templates
                  </button>
                  <button
                    onClick={openCreateBudgetCategory}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-1 rounded-lg hover:bg-[#3EA63B]/15 transition"
                  >
                    <Plus className="w-3 h-3" /> Category
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 whitespace-nowrap">
                    <Calendar className="w-3 h-3" /> 3 days left
                  </span>
                </div>
              </div>
              {/* Overall progress ring */}
              <div className="flex items-center gap-4 sm:gap-6 mb-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={budgetVM.percent > 90 ? '#ef4444' : '#3EA63B'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${budgetVM.percent * 2.51} 251`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-slate-900">{budgetVM.percent}%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Used</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">{budgetVM.totalSpentFormatted}</p>
                  <p className="text-xs text-slate-400 font-semibold leading-snug">of {budgetVM.totalBudgetFormatted} budget</p>
                  <p className="text-xs text-[#3EA63B] font-bold mt-1 leading-snug">
                    {budgetVM.remainingFormatted} remaining
                  </p>
                </div>
              </div>

              {/* Category budgets */}
              {budgets.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Wallet className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">No budget yet</p>
                  <p className="mt-1 text-xs text-slate-400">Choose a template to create your first monthly budget.</p>
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-2 text-xs font-bold text-white"
                  >
                    <LayoutTemplate className="h-3.5 w-3.5" /> Pick Template
                  </button>
                </div>
              ) : (
              <div className="space-y-4">
                {budgetVM.categories.map((budget: any) => {
                  const originalBudget = budgets.find((b: any) => b.id === budget.id) || {};
                  const Icon = originalBudget.icon || ShoppingBasket;
                  return (
                    <div key={budget.id} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${originalBudget.bg || 'bg-slate-100'} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${originalBudget.color || 'text-slate-600'}`} />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{budget.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">{budget.spentFormatted}</span>
                          <span className="text-[10px] text-slate-400 font-semibold"> / {budget.allocatedFormatted}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${budget.isOverBudget ? 'bg-red-500' : (originalBudget.progressColor || 'bg-slate-500')}`} style={{ width: `${budget.percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </section>

            {/* Bill Reminders */}
            <BillReminders initialBills={initialBills} />

            {/* Insight */}
            <section className="bg-[#F0FDF4] rounded-2xl p-5 border border-[#BBF7D0] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Lightbulb className="w-16 h-16 text-[#3EA63B]" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#3EA63B] text-white flex items-center justify-center shadow-lg shadow-[#3EA63B]/30 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Mizan Insight</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {forecastText}
                  </p>
                </div>
              </div>
            </section>

            {/* Savings Goals */}
            <section className="mb-6">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                Savings Goals
              </h2>
              <div className="space-y-3">
                {goalsState.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
                    <Target className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">{goalsScreen?.states.goalsEmpty.title ?? 'No savings goals yet'}</p>
                    <p className="mt-1 text-xs text-slate-400">{goalsScreen?.states.goalsEmpty.description ?? 'Create one simple target to make this screen useful.'}</p>
                    <button
                      onClick={openCreateGoal}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-2 text-xs font-bold text-white"
                    >
                      <Plus className="h-3.5 w-3.5" /> {goalsScreen?.states.goalsEmpty.actionLabel ?? 'Add Goal'}
                    </button>
                  </div>
                ) : goalsVMData.goals.map((goal: any) => {
                  return (
                    <div key={goal.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] text-3xl">{goal.emoji}</span>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-slate-900">{goal.name}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">Target: {goal.deadline}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleContributeGoal(goal)}
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#3EA63B]/10 px-2 text-[10px] font-black text-[#3EA63B] hover:bg-[#3EA63B]/15"
                            title="Add contribution"
                          >
                            Add
                          </button>
                        </div>
                        <div className="relative hidden sm:block w-12 h-12">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3EA63B" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${goal.percent * 2.51} 251`} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900">{goal.percent}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-black text-slate-900">{goal.savedFormatted}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">of {goal.targetFormatted}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {goal.remainingFormatted} to go
                        </p>
                      </div>
                      <div className="mt-3 h-2 bg-[#ECFDF5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#00C2A8] transition-all" style={{ width: `${goal.percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Avg. Monthly Save</p>
                <p className="text-xl font-black text-[#3EA63B]">{quickStatsVM.avgMonthlySaveFormatted}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Goals On Track</p>
                <p className="text-xl font-black text-slate-900">{quickStatsVM.goalsOnTrack}</p>
              </div>
            </section>
        </div>
      </div>
  );

  return (
    <>
      <AppPageShell
        title="Goals"
        subtitle="Budgets, bills, and savings goals in one place"
        variant="plain"
        actions={
          <div className="flex gap-2">
           <button
              onClick={() => setShowExpenseLogger(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              title="Log Expense"
            >
              <ReceiptText className="w-4 h-4" />
            </button>
            <button
              onClick={openCreateGoal}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-mint-primary)] text-white hover:opacity-90 transition-colors"
              title="Add Goal"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        }
      >
        {content}
      </AppPageShell>

      {/* Add Goal Modal */}
      {showNewGoal && (
        <div ref={addGoalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">{editingGoalId ? 'Edit Savings Goal' : 'New Savings Goal'}</h3>
              <button onClick={() => { setShowNewGoal(false); setEditingGoalId(null); }} className="p-1 rounded-full hover:bg-slate-100">
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
                {editingGoalId ? 'Save Goal' : 'Create Goal'}
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

      {/* Budget Category Modal */}
      {showBudgetCategory && (
        <div ref={budgetCategoryRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">{editingBudgetCategoryId ? 'Edit Budget Category' : 'New Budget Category'}</h3>
              <button onClick={() => { setShowBudgetCategory(false); setEditingBudgetCategoryId(null); }} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSaveBudgetCategory} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  value={budgetCategoryForm.name}
                  onChange={e => setBudgetCategoryForm({ ...budgetCategoryForm, name: e.target.value })}
                  placeholder="e.g. Groceries"
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30 focus:border-[#3EA63B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Allocated (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={budgetCategoryForm.allocated}
                    onChange={e => setBudgetCategoryForm({ ...budgetCategoryForm, allocated: e.target.value })}
                    placeholder="5000"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30 focus:border-[#3EA63B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Spent (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={budgetCategoryForm.spent}
                    onChange={e => setBudgetCategoryForm({ ...budgetCategoryForm, spent: e.target.value })}
                    placeholder="0"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30 focus:border-[#3EA63B]"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#3EA63B] text-white font-bold hover:bg-[#339932] transition">
                {editingBudgetCategoryId ? 'Save Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

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
                      const response = await fetch('/api/v1/budgets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          month: now.getMonth() + 1,
                          year: now.getFullYear(),
                          totalLimit: totalIncome,
                          categories: newBudgets.map(b => ({ name: b.name, allocated: b.total }))
                        })
                      });
                      if (!response.ok) throw new Error('Failed to apply budget template');
                      const savedBudget = await response.json();
                      setCurrentBudgetId(savedBudget.id);
                      setBudgets(mapBudgetCategories(savedBudget));
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
                goals={goalData}
                setGoals={setGoalData}
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
