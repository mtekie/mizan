import { NextResponse } from 'next/server';
import { createClient as createBaseClient } from '@supabase/supabase-js';

// This endpoint is an explicit proxy for the mobile app to ensure token refreshes
// can be validated server-side if additional blacklist/logic checks are added.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 });
    }

    // Use admin role or base client to exchange token
    const supabase = createBaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) {
       return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ 
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
