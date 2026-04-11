import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import DreamsClient from './DreamsClient';

export default async function DreamsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
