import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // TODO: Implémenter la vérification d'authentification
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Ne pas traiter les requêtes pour :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (fichier favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 