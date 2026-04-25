import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const user = await getAuthUser(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch real-time context
        const accounts = await prisma.account.findMany({ where: { userId: user.id } });
        const netWorth = accounts.reduce((s, a) => s + a.balance, 0);
        
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
        recentTxs.forEach(t => { if (t.amount < 0) spending += Math.abs(t.amount); });

        // Check for Low Balance Alert
        const lowBalanceAccount = accounts.find(a => a.balance < 500);
        const lowBalanceContext = lowBalanceAccount ? `Warning: ${lowBalanceAccount.name} is low (${lowBalanceAccount.balance} ETB).` : '';

        const dynamicContext = `${lowBalanceContext} ${netWorth.toLocaleString()} ETB across ${accounts.length} accounts. Spending: ${spending.toLocaleString()} ETB/mo. ${topGoal ? `Top goal: ${topGoal.name} (${Math.round(topGoal.saved/topGoal.target*100)}% complete).` : 'No active goals.'}`;

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return NextResponse.json({ tip: `Your net worth is ${netWorth.toLocaleString()} ETB. Consider moving idle funds to a high-interest savings account to maximize returns.` });
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
