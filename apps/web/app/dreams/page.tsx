import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import DreamsClient from './DreamsClient';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';

export default async function DreamsPage() {
  const userContext = await getOrCreateDbUser();
  const user = userContext?.dbUser;

  if (!user) {
    redirect('/login');
  }

  const budgets = await prisma.budget.findMany({ 
    where: { userId: user.id },
    include: { categories: true },
    orderBy: { createdAt: 'asc' }
  });

  const goals = await prisma.goal.findMany({ 
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });

  const bills = await prisma.bill.findMany({
    where: { userId: user.id },
    orderBy: { dueDay: 'asc' }
  });

  return <DreamsClient initialBudgets={budgets} initialGoals={goals} initialBills={bills} />;
}
