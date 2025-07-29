// Dans : /src/app/dashboard/page.tsx

import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import DashboardClientPage from './DashboardClientPage';
import { redirect } from 'next/navigation';
import type { DocumentType } from '@/types'; // <-- IMPORTATION DU TYPE ICI

// Cette page est un Composant Serveur
export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const firstName = user.firstName || user.fullName || 'Utilisateur';

  // LA CORRECTION EST APPLIQUÉE ICI :
  // On dit explicitement à TypeScript que cette variable est un tableau
  // d'objets de type DocumentType, même s'il est vide.
  const initialDocuments: DocumentType[] = [];

  return (
    <DashboardClientPage 
      userName={firstName} 
      initialDocuments={initialDocuments} 
    />
  );
}