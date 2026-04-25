import { NextResponse } from 'next/server';
import { z } from 'zod';

const trackSchema = z.object({
    action: z.enum(['VIEW', 'CLICK']),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await params;
        const result = trackSchema.safeParse(await req.json());
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        return NextResponse.json({ success: true, tracked: false });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
