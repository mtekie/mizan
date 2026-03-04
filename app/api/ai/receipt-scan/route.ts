import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { base64Data, mimeType } = await request.json();

        if (!base64Data || !mimeType) {
            return NextResponse.json({ error: 'Missing image data.' }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
                { text: 'Extract the merchant name, total amount (as a number), and date from this receipt. Return only JSON.' },
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        merchant: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        date: { type: Type.STRING },
                    },
                },
            },
        });

        if (!response.text) {
            return NextResponse.json({ error: 'Could not parse receipt.' }, { status: 422 });
        }

        return NextResponse.json(JSON.parse(response.text));
    } catch (error) {
        console.error('Receipt scan error:', error);
        return NextResponse.json({ error: 'Failed to analyze receipt.' }, { status: 500 });
    }
}
