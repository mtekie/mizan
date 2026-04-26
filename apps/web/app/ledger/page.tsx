import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import LedgerClient from './LedgerClient';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';

export default async function LedgerPage() {
  const userContext = await getOrCreateDbUser();
  const user = userContext?.dbUser;

  if (!user) {
    redirect('/login');
  }

  const accounts = await prisma.account.findMany({ 
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });

  const transactions = await prisma.transaction.findMany({ 
    where: { userId: user.id },
    orderBy: { date: 'desc' }
  });

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthTxs = transactions.filter(t => t.date >= startOfMonth);

  let monthlyIn = 0;
  let monthlyOut = 0;

  thisMonthTxs.forEach(t => {
      if (t.amount > 0) monthlyIn += t.amount;
      else monthlyOut += Math.abs(t.amount);
  });

  const savingsRate = monthlyIn > 0 
      ? Math.round(((monthlyIn - monthlyOut) / monthlyIn) * 100) 
      : 0;

  // Compute spending data
  const spendingMap: Record<string, number> = {};
  thisMonthTxs.filter(t => t.amount < 0).forEach(t => {
    const cat = t.category || 'Other';
    spendingMap[cat] = (spendingMap[cat] || 0) + Math.abs(t.amount);
  });

  const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#6366f1', '#10b981'];
  const spendingData = Object.entries(spendingMap).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length]
  }));
  const totalSpending = spendingData.reduce((s, d) => s + d.value, 0);

  // Compute trend (last 6 months)
  const monthlyTrend = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    
    const monthTxs = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === m && txDate.getFullYear() === y;
    });

    let inc = 0;
    let exp = 0;
    monthTxs.forEach(t => {
      if (t.amount > 0) inc += t.amount;
      else exp += Math.abs(t.amount);
    });

    monthlyTrend.push({ 
      month: monthNames[m], 
      income: inc, 
      expense: exp 
    });
  }

  const summary = { totalBalance, monthlyIn, monthlyOut, savingsRate, totalSpending, monthlyTrend, spendingData };

  return <LedgerClient accounts={accounts} initialTransactions={transactions} summary={summary} />;
}
