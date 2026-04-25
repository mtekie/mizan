import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1).max(80),
    spent: z.number().finite(),
    total: z.number().finite(),
});

export async function POST(request: Request) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = z.object({
            categories: z.array(categorySchema).min(1).max(20),
        }).safeParse(await request.json());

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ forecast: 'Your budget is ready for review. Keep high-spend categories visible and move any surplus toward your next priority goal.' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const categoryText = result.data.categories
            .map((c: { name: string; spent: number; total: number }) =>
                `${c.name}: ${c.spent}/${c.total} ETB${c.spent > c.total ? ' (over budget)' : ''}`
            )
            .join(', ');

        const prompt = `You are Mizan AI. The user's budget this month: ${categoryText}. Give a 2 sentence forecast and actionable advice. Mention any surplus or deficit. Do not use markdown formatting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        return NextResponse.json({ forecast: response.text });
    } catch (error) {
        console.error('Budget forecast error:', error);
        return NextResponse.json({ error: 'Failed to generate forecast.' }, { status: 500 });
    }
}
