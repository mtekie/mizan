import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { context } = await request.json();

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are Mizan AI, an Ethiopian financial advisor. The user has ${context}. Give a short, 1-2 sentence actionable financial tip. Use Ethiopian context (e.g., mention Awash Bank, Telebirr, or ESX). Do not use markdown formatting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return NextResponse.json({ tip: response.text });
    } catch (error) {
        console.error('AI Route Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate financial tip.' },
            { status: 500 }
        );
    }
}
