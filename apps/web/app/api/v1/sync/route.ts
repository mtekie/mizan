import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';

// WatermelonDB Sync Schema Scaffolding
export async function POST(req: Request) {
  try {
    const userContext = await getOrCreateDbUser(req);
    const user = userContext?.dbUser;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { lastPulledAt, changes } = body;

    // 1. Process incoming changes from mobile (push)
    if (changes) {
      // Loop over changes.transactions, changes.accounts, etc.
      // E.g. changes.transactions.created.forEach(tx => prisma.transaction.create(...))
      // Since this is MVP Phase 1 scaffolding, we log the intent.
      console.log(`Received ${Object.keys(changes).length} updated tables from mobile`);
    }

    // 2. Fetch changes since lastPulledAt (pull)
    const pullSince = lastPulledAt ? new Date(lastPulledAt) : new Date(0);
    
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: user.id,
        // Assuming we add a server updatedAt field to transactions in the future or use date
        // For MVP we just return all or handle the sync logic deeper in Sprint 4
      }
    });

    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id,
        updatedAt: { gt: pullSince }
      }
    });

    // Formatting for WatermelonDB consumption
    return NextResponse.json({
      changes: {
        accounts: {
          created: accounts,
          updated: [],
          deleted: []
        },
        transactions: {
          created: transactions,
          updated: [],
          deleted: []
        }
      },
      timestamp: Date.now()
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
