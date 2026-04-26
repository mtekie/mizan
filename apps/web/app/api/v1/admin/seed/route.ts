import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { products } from '@/lib/data/products';

export async function POST(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Check if user is ADMIN
        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const seedProducts = searchParams.get('products') === 'true';
        const targetUserId = searchParams.get('userId');

        // 2. Seed Products Catalog
        if (seedProducts) {
            console.log(`Seeding ${products.length} products...`);
            // We use upsert to avoid duplicates and allow updates
            for (const p of products) {
                await prisma.product.upsert({
                    where: { id: p.id },
                    update: {
                        category: p.category || 'Other',
                        bankId: p.bankId || (p as any).instituteId || '',
                        bankName: p.bankName || 'Unknown Bank',
                        bankLogo: p.bankLogo,
                        bankIconBg: (p as any).bankIconBg,
                        title: p.title || (p as any).name || 'Untitled Product',
                        matchScore: p.matchScore || 0,
                        highlight: (p as any).highlight,
                        description: p.description || 'No description available',
                        interestRate: p.interestRate,
                        interestMax: (p as any).interestMax,
                        features: (p as any).features || [],
                        eligibility: (p as any).eligibility || [],
                        requirements: (p as any).requirements || [],
                        maxAmount: (p as any).maxAmount,
                        term: (p as any).term,
                        fees: (p as any).fees,
                        loanCategory: (p as any).loanCategory,
                        minBalance: p.minBalance,
                        digital: (p as any).digital,
                        interestFree: (p as any).interestFree,
                        genderBased: (p as any).genderBased,
                        currency: p.currency || 'ETB',
                        sourceName: (p as any).sourceName || 'bankProductData.csv initial import',
                        sourceType: (p as any).sourceType || 'spreadsheet',
                        lastReviewedAt: (p as any).lastReviewedAt ? new Date((p as any).lastReviewedAt) : new Date(),
                        reviewedBy: (p as any).reviewedBy || 'Mizan data import',
                        dataConfidence: (p as any).dataConfidence || (p.isVerified === false ? 40 : 70),
                    },
                    create: {
                        id: p.id,
                        category: p.category || 'Other',
                        bankId: p.bankId || (p as any).instituteId || '',
                        bankName: p.bankName || 'Unknown Bank',
                        bankLogo: p.bankLogo,
                        bankIconBg: (p as any).bankIconBg,
                        title: p.title || (p as any).name || 'Untitled Product',
                        matchScore: p.matchScore || 0,
                        highlight: (p as any).highlight,
                        description: p.description || 'No description available',
                        interestRate: p.interestRate,
                        interestMax: (p as any).interestMax,
                        features: (p as any).features || [],
                        eligibility: (p as any).eligibility || [],
                        requirements: (p as any).requirements || [],
                        maxAmount: (p as any).maxAmount,
                        term: (p as any).term,
                        fees: (p as any).fees,
                        loanCategory: (p as any).loanCategory,
                        minBalance: p.minBalance,
                        digital: (p as any).digital,
                        interestFree: (p as any).interestFree,
                        genderBased: (p as any).genderBased,
                        currency: p.currency || 'ETB',
                        sourceName: (p as any).sourceName || 'bankProductData.csv initial import',
                        sourceType: (p as any).sourceType || 'spreadsheet',
                        lastReviewedAt: (p as any).lastReviewedAt ? new Date((p as any).lastReviewedAt) : new Date(),
                        reviewedBy: (p as any).reviewedBy || 'Mizan data import',
                        dataConfidence: (p as any).dataConfidence || (p.isVerified === false ? 40 : 70),
                    }
                });
            }
        }

        // 3. Seed User Demo Data
        if (targetUserId) {
            await seedUserDemoData(targetUserId);
        }

        return NextResponse.json({ 
            success: true, 
            productsSeeded: seedProducts ? products.length : 0,
            userSeeded: !!targetUserId
        });
    } catch (e: any) {
        console.error('Seed error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

async function seedUserDemoData(userId: string) {
    // Clear existing data to avoid mess
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.goal.deleteMany({ where: { userId } });
    await prisma.budget.deleteMany({ where: { userId } });
    await prisma.bill.deleteMany({ where: { userId } });

    // 1. Create Accounts
    const cbe = await prisma.account.create({
        data: {
            userId,
            name: 'CBE Birr',
            type: 'Savings',
            balance: 45200.50,
            color: '#1e3a8a',
            number: '1000123456789'
        }
    });

    const telebirr = await prisma.account.create({
        data: {
            userId,
            name: 'telebirr',
            type: 'Wallet',
            balance: 1240.00,
            color: '#3b82f6',
        }
    });

    // 2. Create Transactions
    await prisma.transaction.createMany({
        data: [
            { userId, accountId: cbe.id, title: 'Salary - October', amount: 28000, category: 'Income', source: 'CBE Birr' },
            { userId, accountId: telebirr.id, title: "Kaldi's Coffee", amount: -450, category: 'Food & Drink', source: 'telebirr' },
            { userId, accountId: cbe.id, title: 'Rent Payment', amount: -12000, category: 'Housing', source: 'CBE Birr' },
            { userId, accountId: cbe.id, title: 'Groceries - Shoa', amount: -3200.75, category: 'Groceries', source: 'CBE Birr' },
            { userId, accountId: telebirr.id, title: 'Ride - Office', amount: -350, category: 'Transport', source: 'telebirr' },
        ]
    });

    // 3. Create Goals
    await prisma.goal.create({
        data: {
            userId,
            name: 'Emergency Fund',
            emoji: '🚨',
            target: 100000,
            saved: 45000,
        }
    });

    // 4. Create Budgets
    await prisma.budget.create({
        data: {
            userId,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            totalLimit: 15000,
            categories: {
                create: [
                    { name: 'Food', allocated: 5000, spent: 2450, color: '#f59e0b' },
                    { name: 'Transport', allocated: 3000, spent: 1200, color: '#10b981' },
                    { name: 'Utilities', allocated: 2000, spent: 600, color: '#3b82f6' },
                ]
            }
        }
    });

    // 5. Create Bills
    await prisma.bill.createMany({
        data: [
            { userId, name: 'Canal+', amount: 600, dueDay: 15, category: 'Utilities' },
            { userId, name: 'Ethio Telecom', amount: 450, dueDay: 20, category: 'Utilities' },
        ]
    });
}
