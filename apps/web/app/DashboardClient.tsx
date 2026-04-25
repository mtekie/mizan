'use client';

import { SimpleDashboard } from '@/components/SimpleDashboard';

export default function DashboardClient({ user, accounts, transactions, summary, featuredProducts }: { user: any, accounts: any[], transactions: any[], summary: any, featuredProducts: any[] }) {
  return <SimpleDashboard user={user} accounts={accounts} transactions={transactions} summary={summary} featuredProducts={featuredProducts} />;
}
