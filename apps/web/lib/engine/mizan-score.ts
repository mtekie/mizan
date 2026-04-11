import prisma from '@/lib/db';

export async function calculateMizanScore(userId: string): Promise<number> {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // 1. Fetch Data
        const accounts = await prisma.account.findMany({ where: { userId } });
        const transactions = await prisma.transaction.findMany({
            where: { userId, date: { gte: thirtyDaysAgo } }
        });
        const goals = await prisma.goal.findMany({ where: { userId } });

        const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

        // 2. Component: Savings Rate (35%) - Max 210 points
        let income = 0;
        let expense = 0;
        transactions.forEach(t => {
            if (t.amount > 0) income += t.amount;
            else expense += Math.abs(t.amount);
        });

        const savingsRate = income > 0 ? (income - expense) / income : 0;
        // 20% savings rate is considered perfect (1.0)
        const savingsScore = Math.min(1, Math.max(0, savingsRate / 0.20)) * 210;

        // 3. Component: Financial Buffer (25%) - Max 150 points
        // Goal: 3 months of expenses in balance
        const averageMonthlyExpense = expense > 0 ? expense : 10000; // Fallback to 10k
        const monthsBuffer = totalBalance / averageMonthlyExpense;
        const bufferScore = Math.min(1, Math.max(0, monthsBuffer / 3)) * 150;

        // 4. Component: Goal Progress (25%) - Max 150 points
        let totalGoalProgress = 0;
        if (goals.length > 0) {
            const sumProgress = goals.reduce((s, g) => s + (g.saved / g.target), 0);
            totalGoalProgress = sumProgress / goals.length;
        }
        const goalScore = Math.min(1, totalGoalProgress) * 150;

        // 5. Component: Consistency (15%) - Max 90 points
        // Days with transactions in last 30 days
        const uniqueDays = new Set(transactions.map(t => new Date(t.date).toDateString())).size;
        const consistencyScore = Math.min(1, uniqueDays / 10) * 90; // 10 active days = 100%

        // 6. Final Calculation (Scale: 300 - 900)
        const baseScore = 300;
        const earnedScore = savingsScore + bufferScore + goalScore + consistencyScore;
        const finalScore = Math.round(baseScore + earnedScore);

        // Update User in background (or return to be updated by caller)
        await prisma.user.update({
            where: { id: userId },
            data: { mizanScore: finalScore }
        });

        return finalScore;
    } catch (error) {
        console.error('Failed to calculate Mizan Score:', error);
        return 600; // Safe default
    }
}
