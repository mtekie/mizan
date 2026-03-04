import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { categories } = await request.json();

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const categoryText = categories
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
