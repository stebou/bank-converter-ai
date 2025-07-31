// Fichier : src/middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// 1. Définir les routes que vous souhaitez protéger
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protège le dashboard et toutes ses sous-pages
  '/profil(.*)',      // Protège le profil
  '/reglages(.*)',    // Protège les réglages
]);

// 2. Définir les routes API publiques (non protégées)
const isPublicApiRoute = createRouteMatcher([]);

// 3. Exporter le middleware. Notez que la fonction est maintenant `async`
export default clerkMiddleware(async (auth, req) => {
  
  // Si c'est une route API publique, passer sans authentification
  if (isPublicApiRoute(req)) {
    console.log('[MIDDLEWARE] Route API publique autorisée:', req.url);
    return NextResponse.next();
  }

  // Si la route est une route protégée...
  if (isProtectedRoute(req)) {
    // ✅ CORRECTION APPLIQUÉE ICI
    // On utilise `await` pour attendre le résultat de l'authentification
    const { userId } = await auth();

    // ...et que l'utilisateur n'est PAS connecté...
    if (!userId) {
      // ...alors on le redirige vers la page de connexion.
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Si la route n'est pas protégée, ou si l'utilisateur est connecté,
  // on laisse la requête se poursuivre normalement.
  return NextResponse.next();
});

export const config = {
  // Ce matcher exécute le middleware sur toutes les routes sauf les fichiers statiques de Next.js.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
