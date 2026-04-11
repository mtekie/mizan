import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import TransferClient from './TransferClient';

export default async function TransferPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Find transfers (we assume transfers have 'Transfer' as category or we check all transactions)
  // Since db schema doesn't have 'toAccount', we will treat any transaction with a title matching a transfer pattern or category 'Transfer' as a transfer
  const transactions = await prisma.transaction.findMany({
    where: { 
      userId: user.id,
      category: 'Transfer'
    },
    orderBy: { date: 'desc' }
  });

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });

  return <TransferClient initialTransfers={transactions} initialAccounts={accounts} />;
}
