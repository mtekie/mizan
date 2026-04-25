import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    allocated: z.number().min(0),
    spent: z.number().min(0).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
});

const budgetSchema = z.object({
    month: z.number().min(1).max(12).optional(),
    year: z.number().min(2020).optional(),
    totalLimit: z.number().min(0).optional(),
    categories: z.array(categorySchema).optional(),
});

export async function GET(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        const whereClause: any = { userId: user.id };
        if (month && year) {
            whereClause.month = parseInt(month, 10);
            whereClause.year = parseInt(year, 10);
        }

        const budgets = await prisma.budget.findMany({
            where: whereClause,
            include: { categories: true },
            orderBy: [{ year: 'desc' }, { month: 'desc' }]
        });

        return NextResponse.json(budgets);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = budgetSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        if (!result.data.month || !result.data.year || !result.data.totalLimit) {
             return NextResponse.json({ error: 'Month, year, and totalLimit are required for new budgets' }, { status: 400 });
        }

        const budget = await prisma.budget.create({
            data: {
                userId: user.id,
                month: result.data.month,
                year: result.data.year,
                totalLimit: result.data.totalLimit,
                categories: {
                    create: result.data.categories?.map((c) => ({
                        name: c.name,
                        allocated: c.allocated,
                        icon: c.icon,
                        color: c.color,
                        spent: c.spent || 0
                    })) || []
                }
            },
            include: { categories: true }
        });

        return NextResponse.json(budget, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...rest } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing budget ID' }, { status: 400 });
        }

        const result = budgetSchema.safeParse(rest);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const { categories, ...budgetData } = result.data;

        // Use a transaction for updating budget and its categories
        const updatedBudget = await prisma.$transaction(async (tx) => {
            // 1. Update main budget fields
            const b = await tx.budget.update({
                where: { id, userId: user.id },
                data: budgetData
            });

            // 2. Update categories if provided
            if (categories) {
                for (const cat of categories) {
                    if (cat.id) {
                        await tx.budgetCategory.update({
                            where: { id: cat.id, budgetId: id },
                            data: {
                                name: cat.name,
                                allocated: cat.allocated,
                                icon: cat.icon,
                                color: cat.color,
                                spent: cat.spent
                            }
                        });
                    } else {
                        await tx.budgetCategory.create({
                            data: {
                                budgetId: id,
                                name: cat.name,
                                allocated: cat.allocated,
                                icon: cat.icon,
                                color: cat.color,
                                spent: cat.spent || 0
                            }
                        });
                    }
                }
            }
            return b;
        });

        const finalBudget = await prisma.budget.findUnique({
            where: { id },
            include: { categories: true }
        });

        return NextResponse.json(finalBudget);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing budget ID' }, { status: 400 });
        }

        await prisma.budget.delete({
            where: { id, userId: user.id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
