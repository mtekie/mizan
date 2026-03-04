import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Force dynamic to avoid caching demo state
export const dynamic = 'force-dynamic';

async function getDemoUserId() {
    let user = await prisma.user.findFirst({
        where: { email: 'demo@mizan.et' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Dawit Demo',
                email: 'demo@mizan.et',
                mizanScore: 720
            }
        });
    }
    return user.id;
}

export async function GET() {
    try {
        const userId = await getDemoUserId();
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getDemoUserId();
        const data = await request.json();

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                title: data.title,
                titleAmh: data.titleAmh || '',
                amount: data.amount,
                source: data.source || data.account || 'CBE',
                category: data.category || 'Uncategorized',
            }
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Failed to create transaction:', error);
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const userId = await getDemoUserId();
        // Resetting demo: delete all and recreate defaults
        await prisma.transaction.deleteMany({
            where: { userId }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { mizanScore: 720 }
        });

        const demoTx = [
            { userId, title: "Kaldi's Coffee", titleAmh: 'ካፌና ሻይ', amount: -450.00, source: 'telebirr', category: 'Food & Drink' },
            { userId, title: 'Deposit from Abebe', titleAmh: 'Transfer', amount: 5000.00, source: 'CBE', category: 'Income' },
            { userId, title: 'Shoa Supermarket', titleAmh: 'ሸቀጣሸቀጥ', amount: -2340.50, source: 'CBE', category: 'Groceries' },
            { userId, title: 'Canal+ Subscription', titleAmh: 'Utilities', amount: -600.00, source: 'telebirr', category: 'Entertainment' },
            { userId, title: 'Salary — October', titleAmh: 'Income', amount: 28000.00, source: 'CBE', category: 'Income' },
        ];

        await prisma.transaction.createMany({
            data: demoTx
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to reset demo:', error);
        return NextResponse.json({ error: 'Failed to reset' }, { status: 500 });
    }
}
