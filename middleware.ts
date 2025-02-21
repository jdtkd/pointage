import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  // Vérifier l'authentification
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Voir "Matching Paths" ci-dessous pour en savoir plus
export const config = {
  matcher: ['/pointer/:path*', '/historique/:path*']
} 