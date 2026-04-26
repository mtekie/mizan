import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existingApplication = await prisma.productApplication.findFirst({
            where: { userId: user.id, productId: id },
            orderBy: { createdAt: 'desc' },
        });

        const application = existingApplication
            ? await prisma.productApplication.update({
                where: { id: existingApplication.id },
                data: { status: 'PENDING' },
            })
            : await prisma.productApplication.create({
                data: {
                    userId: user.id,
                    productId: id,
                    status: 'PENDING',
                },
            });

        // Trigger notification logic here if needed

        return NextResponse.json(application, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const application = await prisma.productApplication.findFirst({
            where: { userId: user.id, productId: id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(application);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
