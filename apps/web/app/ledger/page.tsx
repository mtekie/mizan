import { redirect } from 'next/navigation';
import LedgerClient from './LedgerClient';
import { isParityDemo } from '@/lib/parity-demo';
import { buildMoneyScreenDataContract, demoAccounts, demoTransactions } from '@mizan/shared';
import { getMoneyScreenApiResponse } from '@/lib/server/money-contract';

export default async function LedgerPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  if (await isParityDemo(searchParams)) {
    const money = buildMoneyScreenDataContract({
      accounts: demoAccounts,
      transactions: demoTransactions,
      recentTransactionLimit: 50,
    });

    return (
      <LedgerClient
        accounts={demoAccounts}
        initialTransactions={demoTransactions}
        money={money}
      />
    );
  }

  const payload = await getMoneyScreenApiResponse();
  if (!payload) {
    redirect('/login');
  }

  return <LedgerClient accounts={payload.accounts} initialTransactions={payload.transactions} money={payload.money} />;
}
