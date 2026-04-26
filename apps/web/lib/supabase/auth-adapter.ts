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
    const existingById = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (existingById) {
      const user = await prisma.user.update({
        where: { id: existingById.id },
        data: {
          email: authUser.email || existingById.email,
          name: existingById.name || authUser.user_metadata?.name || authUser.user_metadata?.full_name || null,
          image: existingById.image || authUser.user_metadata?.avatar_url || null,
        },
      });

      return { authUser, dbUser: user };
    }

    if (authUser.email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: authUser.email },
      });

      if (existingByEmail) {
        return { authUser, dbUser: existingByEmail };
      }
    }

    const user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email || null,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || null,
        image: authUser.user_metadata?.avatar_url || null,
      },
    });

    return { authUser, dbUser: user };
  } catch (error) {
    console.error('Error in getOrCreateDbUser:', error);
    return null;
  }
}
