import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const receiptScanSchema = z.object({
    base64Data: z.string().min(1),
    mimeType: z.string().regex(/^image\/[a-z0-9.+-]+$/i),
});

export async function POST(request: Request) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = receiptScanSchema.safeParse(await request.json());
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Receipt scanning is not configured.' }, { status: 503 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                {
                    inlineData: {
                        data: result.data.base64Data,
                        mimeType: result.data.mimeType,
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
