import { redirect } from 'next/navigation';
import DreamsClient from './DreamsClient';
import { isParityDemo } from '@/lib/parity-demo';
import { buildGoalsScreenDataContract, demoBills, demoBudgets, demoGoals } from '@mizan/shared';
import { getGoalsScreenApiResponse } from '@/lib/server/goals-contract';

export default async function DreamsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  if (await isParityDemo(searchParams)) {
    const goalsScreen = buildGoalsScreenDataContract({ budgets: demoBudgets, goals: demoGoals, bills: demoBills });
    return <DreamsClient initialBudgets={demoBudgets} initialGoals={demoGoals} initialBills={demoBills} goalsScreen={goalsScreen} />;
  }

  const payload = await getGoalsScreenApiResponse();
  if (!payload) {
    redirect('/login');
  }

  return <DreamsClient initialBudgets={payload.budgets} initialGoals={payload.goals} initialBills={payload.bills} goalsScreen={payload.goalsScreen} />;
}
