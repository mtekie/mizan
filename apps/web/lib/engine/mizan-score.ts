import prisma from '@/lib/db';
import { calculateMizanScore as calculateSharedScore, ScoreResult } from '@mizan/shared';

export async function calculateMizanScore(userId: string): Promise<ScoreResult> {
    try {
        // 1. Fetch all relevant data
        const [user, accounts, transactions, goals, budgets, bills, accountLinks] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.account.findMany({ where: { userId } }),
            prisma.transaction.findMany({ where: { userId } }),
            prisma.goal.findMany({ where: { userId } }),
            prisma.budget.findMany({ where: { userId } }),
            prisma.bill.findMany({ where: { userId } }),
            prisma.accountLink.findMany({ where: { userId } }),
        ]);

        if (!user) {
            throw new Error('User not found');
        }

        // 2. Use the shared deterministic scoring engine
        const result = calculateSharedScore(
            user as any,
            accounts as any,
            transactions as any,
            goals as any,
            budgets as any,
            bills as any,
            accountLinks
        );

        // 3. Persist the latest score to the database
        await prisma.user.update({
            where: { id: userId },
            data: { mizanScore: result.score }
        });

        return result;
    } catch (error) {
        console.error('Failed to calculate Mizan Score:', error);
        return {
            score: 0,
            factors: [],
            version: '0.1.0',
            lastUpdated: new Date().toISOString(),
        };
    }
}
