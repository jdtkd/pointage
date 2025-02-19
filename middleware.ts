import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Votre logique de middleware ici si nécessaire
  return NextResponse.next()
}

// Voir "Matching Paths" ci-dessous pour en savoir plus
export const config = {
  matcher: [
    // Ajoutez ici les routes qui nécessitent un middleware
    // '/pointer/:path*',
    // '/historique/:path*',
  ]
} 