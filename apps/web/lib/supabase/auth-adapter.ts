import { createClient } from './server';
import { createClient as createBaseClient } from '@supabase/supabase-js';
import prisma from '@/lib/db';

export async function getAuthUser(req?: Request) {
  // 1. Try Bearer token (mobile)
  const authHeader = req?.headers.get('Authorization') || req?.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const supabase = createBaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    const { data: { user } } = await supabase.auth.getUser(token);
    return user;
  }
  
  // 2. Fall back to cookies (web SSR)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Gets the authenticated user and ensures a corresponding record exists in the Prisma database.
 */
export async function getOrCreateDbUser(req?: Request) {
  const authUser = await getAuthUser(req);
  if (!authUser) return null;

  try {
    // Upsert to ensure user exists. Using email as fallback if id mismatch, 
    // but usually id (Supabase UID) is the primary key in our Prisma User model.
    const user = await prisma.user.upsert({
      where: { id: authUser.id },
      update: { email: authUser.email || '' },
      create: {
        id: authUser.id,
        email: authUser.email || '',
        // Initialize other required fields if any. 
        // Based on the audit, we just need the row to exist for FKs.
      },
    });

    return { authUser, dbUser: user };
  } catch (error) {
    console.error('Error in getOrCreateDbUser:', error);
    return null;
  }
}
