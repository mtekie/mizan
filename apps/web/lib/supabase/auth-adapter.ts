import { createClient } from './server';
// Assuming you have a way to create a generic client or use standard supabase-js for JWT.
// Since `@supabase/ssr` creates read-only clients based on cookies, for JWT we can use the default `createBrowserClient` or just the pure `@supabase/supabase-js`.
import { createClient as createBaseClient } from '@supabase/supabase-js';

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
