import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        onboardingPhase: 'signup',
        isProfileComplete: false,
        mizanScore: 600,
      }
    });
  }

  if (dbUser.onboardingPhase !== 'complete') {
    redirect('/onboarding');
  }

  // Fetch real data for dashboard
  const accounts = await prisma.account.findMany({ where: { userId: user.id } });
  const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTxs = transactions.filter(t => new Date(t.date) >= startOfMonth);
  const thirtyDayTxs = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);

  let monthlyIn = 0;
  let monthlyOut = 0;
  monthTxs.forEach(t => {
      if (t.amount > 0) monthlyIn += t.amount;
      else monthlyOut += Math.abs(t.amount);
  });
  
  const savingsRate = monthlyIn > 0 
      ? Math.round(((monthlyIn - monthlyOut) / monthlyIn) * 100) 
      : 0;

  const userData = {
    name: dbUser.name,
    email: dbUser.email,
    score: dbUser.mizanScore,
    onboardingPhase: dbUser.onboardingPhase,
    isProfileComplete: dbUser.isProfileComplete,
  };

  // 1. Calculate Historical Cash Flow (30 days)
  const cashFlowData: any[] = [];
  const points = [30, 20, 10, 0];
  points.forEach(days => {
      const dateLimit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const balanceAtTime = accounts.reduce((s, a) => s + a.balance, 0) - 
          transactions.filter(t => new Date(t.date) > dateLimit).reduce((s, t) => s + t.amount, 0);
      cashFlowData.push({ 
          day: days === 0 ? 'Today' : `${days}D Ago`, 
          amount: Math.max(0, balanceAtTime) 
      });
  });

  // 2. Simple Projection (Next 30 days)
  const averageDailyOut = monthlyOut / 30;
  const currentBalance = accounts.reduce((s, a) => s + a.balance, 0);
  [10, 20, 30].forEach(days => {
      cashFlowData.push({
          day: `+${days}D`,
          amount: Math.max(0, currentBalance - (averageDailyOut * days)),
          isProjection: true
      });
  });

  // 3. Fetch Top Goal
  const topGoal = await prisma.goal.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
  });

  // 4. Fetch Targeted Products
  const featuredProducts = await prisma.product.findMany({
      orderBy: { matchScore: 'desc' },
      take: 2
  });

  // 5. Compute spending data
  const spendingMap: Record<string, number> = {};
  monthTxs.filter(t => t.amount < 0).forEach(t => {
    const cat = t.category || 'Uncategorized';
    spendingMap[cat] = (spendingMap[cat] || 0) + Math.abs(t.amount);
  });

  const colors = ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E', '#8B5CF6'];
  const spendingData = Object.entries(spendingMap)
      .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
      .sort((a, b) => b.value - a.value);

  // 6. Fetch Budgets
  const budgets = await prisma.budget.findMany({
      where: { userId: user.id, month: now.getMonth() + 1, year: now.getFullYear() },
      include: { categories: true }
  });

  const summary = { netWorth, monthlyIn, monthlyOut, savingsRate, cashFlowData, topGoal, spendingData, budgets };

  return <DashboardClient user={userData} accounts={accounts} transactions={transactions.slice(0, 5)} summary={summary} featuredProducts={featuredProducts} />;
}
