import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { image, mimeType } = await request.json();

        if (!image) {
            return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Fallback: return demo data
            return NextResponse.json({
                amount: '450',
                merchant: 'Unknown Merchant',
                date: new Date().toISOString().split('T')[0],
                category: 'Other',
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: 'Extract the following from this receipt image and return ONLY a JSON object with these fields: amount (number as string), merchant (string), date (YYYY-MM-DD string), category (one of: Food, Transport, Shopping, Health, Education, Utilities, Mobile, Other). If you cannot extract a field, use a reasonable default. Return ONLY valid JSON, no markdown or explanation.',
                            },
                            {
                                inline_data: {
                                    mime_type: mimeType || 'image/jpeg',
                                    data: image,
                                },
                            },
                        ],
                    }],
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Gemini API error');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        // Parse the JSON from the response (handle markdown code blocks)
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        return NextResponse.json({
            amount: String(parsed.amount || '0'),
            merchant: parsed.merchant || 'Unknown',
            date: parsed.date || new Date().toISOString().split('T')[0],
            category: parsed.category || 'Other',
        });
    } catch {
        return NextResponse.json({
            amount: '0',
            merchant: 'Unknown',
            date: new Date().toISOString().split('T')[0],
            category: 'Other',
        });
    }
}
