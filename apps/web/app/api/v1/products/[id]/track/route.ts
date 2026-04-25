import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { action } = body; // 'VIEW' or 'CLICK'

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Increment counts in Product model (using the legacy or new fields)
        // For now, we'll just track it in a simple way. 
        // In a real app, this would go to an analytics table.
        
        await prisma.product.update({
            where: { id },
            data: {
                matchScore: { increment: action === 'CLICK' ? 1 : 0 } // Mocking popularity boost
            }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
