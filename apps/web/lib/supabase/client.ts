import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! Authentication is unavailable.')
    // This is better than a hard crash on initial page load
    // so we can still show a friendly empty dashboard or login prompt
    return null as any 
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
