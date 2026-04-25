import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public APIs that don't need session refresh overhead
  const publicApiPaths = [
    '/api/v1/products',
    '/api/v1/providers',
    '/api/v1/product-types',
    '/api/v1/catalogue/bootstrap',
    '/api/v1/tags'
  ]

  if (publicApiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
