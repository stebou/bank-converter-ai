// src/app/dashboard/page.tsx

// 'use client'; // On peut maintenant retirer 'use client' si le reste de la page n'est pas interactif,
// ou le laisser si d'autres composants en ont besoin.
// Pour cet exemple, nous allons le structurer pour que la page soit un Server Component.

import { currentUser } from '@clerk/nextjs/server'; // Importe la fonction serveur
import DashboardClientPage from './DashboardClientPage'; // Nous allons créer ce composant

// Cette fonction s'exécute sur le serveur
export default async function DashboardPage() {
  // Récupère l'utilisateur connecté. C'est asynchrone !
  const user = await currentUser();

  // On passe le prénom de l'utilisateur au composant client
  // On prévoit un fallback si le prénom n'est pas défini
  const firstName = user?.firstName || 'Utilisateur';

  return (
    // On passe les données au composant qui gère l'état et l'interactivité
    <DashboardClientPage userName={firstName} />
  );
}
