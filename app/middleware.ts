import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSupabaseConnection } from './lib/supabase';

export async function middleware(request: NextRequest) {
  // Vérifier la configuration Supabase uniquement sur les routes API
  if (request.nextUrl.pathname.startsWith('/api')) {
    const isSupabaseConfigured = await checkSupabaseConnection();
    
    if (!isSupabaseConfigured) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Database configuration error' 
        }),
        { 
          status: 500, 
          headers: { 'content-type': 'application/json' }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 