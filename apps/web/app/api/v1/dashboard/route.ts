import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get accounts for net worth
        const accounts = await prisma.account.findMany({ where: { userId: user.id } });
        const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);

        // Get transactions for the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id,
                date: { gte: startOfMonth }
            }
        });

        let monthlyIn = 0;
        let monthlyOut = 0;

        transactions.forEach(t => {
            if (t.amount > 0) monthlyIn += t.amount;
            else monthlyOut += Math.abs(t.amount);
        });

        // Calculate savings rate
        const savingsRate = monthlyIn > 0 
            ? Math.round(((monthlyIn - monthlyOut) / monthlyIn) * 100) 
            : 0;

        // Get budgets for the current month
        const budget = await prisma.budget.findUnique({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: now.getMonth() + 1,
                    year: now.getFullYear()
                }
            },
            include: {
                categories: true
            }
        });

        const budgets = budget?.categories.map(c => ({
            id: c.id,
            name: c.name,
            spent: c.spent,
            allocated: c.allocated
        })) || [];

        return NextResponse.json({
            netWorth,
            monthlyIn,
            monthlyOut,
            savingsRate,
            accountCount: accounts.length,
            transactionCount: transactions.length,
            budgets
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
