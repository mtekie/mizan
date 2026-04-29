import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { demoWebUser, isParityDemo } from '@/lib/parity-demo';
import { getHomeScreenApiResponse } from '@/lib/server/home-contract';
import { buildHomeScreenDataContract, demoAccounts, demoBudgets, demoGoals, demoTransactions } from '@mizan/shared';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  if (await isParityDemo(searchParams)) {
    const home = buildHomeScreenDataContract({
      user: demoWebUser,
      accounts: demoAccounts,
      transactions: demoTransactions,
      budgets: demoBudgets,
      goals: demoGoals,
    });

    return (
      <DashboardClient
        user={demoWebUser}
        accounts={demoAccounts}
        home={home}
      />
    );
  }

  const payload = await getHomeScreenApiResponse();
  if (!payload) {
    redirect('/login');
  }

  if (payload.user.onboardingPhase !== 'complete') {
    redirect('/onboarding');
  }

  return (
    <DashboardClient
      user={payload.user}
      accounts={payload.accounts}
      home={payload.home}
    />
  );
}
