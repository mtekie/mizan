import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import prisma from '@/lib/db';
import { formatMoney, safePercent, toFiniteNumber } from '@mizan/shared';

export async function POST(request: Request) {
    try {
        const userContext = await getOrCreateDbUser(request);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch real-time context
        const accounts = await prisma.account.findMany({ where: { userId: user.id } });
        const netWorth = accounts.reduce((s, a) => s + toFiniteNumber(a.balance), 0);
        
        const topGoal = await prisma.goal.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentTxs = await prisma.transaction.findMany({
            where: { userId: user.id, date: { gte: thirtyDaysAgo } }
        });

        let spending = 0;
        recentTxs.forEach(t => {
            const amount = toFiniteNumber(t.amount);
            if (amount < 0) spending += Math.abs(amount);
        });

        // Check for Low Balance Alert
        const lowBalanceAccount = accounts.find(a => toFiniteNumber(a.balance) < 500);
        const lowBalanceContext = lowBalanceAccount ? `Warning: ${lowBalanceAccount.name} is low (${formatMoney(lowBalanceAccount.balance)}).` : '';

        const dynamicContext = `${lowBalanceContext} ${formatMoney(netWorth)} across ${accounts.length} accounts. Spending: ${formatMoney(spending)}/mo. ${topGoal ? `Top goal: ${topGoal.name} (${Math.round(safePercent(topGoal.saved, topGoal.target))}% complete).` : 'No active goals.'}`;

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return NextResponse.json({ tip: `Your net worth is ${formatMoney(netWorth)}. Consider moving idle funds to a high-interest savings account to maximize returns.` });
        }

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are Mizan AI, an Ethiopian financial advisor. The user's portfolio context: ${dynamicContext}. Give a short, 1-2 sentence actionable financial tip. Use Ethiopian context (e.g., mention Awash Bank, Telebirr, or ESX). Do not use markdown formatting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp', // Updated model to latest flash
            contents: prompt,
        });

        return NextResponse.json({ tip: response.text });
    } catch (error) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ tip: "Identify small leaks in your budget by tracking your Telebirr history every weekend." });
    }
}
