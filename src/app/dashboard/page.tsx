// Dans : /src/app/dashboard/page.tsx

import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import DashboardClientPage from './DashboardClientPage';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Cette page est un Composant Serveur
export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const firstName = user.firstName || user.fullName || 'Utilisateur';

  // --- CORRECTION APPLIQUÉE ICI ---
  // On fait une requête relationnelle pour trouver les documents.
  const documents = await prisma.document.findMany({
    where: {
      // On dit à Prisma : "trouve les documents où l'utilisateur associé (user)
      // a un clerkId qui correspond à l'ID de l'utilisateur connecté".
      user: {
        clerkId: user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  const credits = dbUser ? (dbUser.documentsLimit - dbUser.documentsUsed) : 5;
  
  // Données d'abonnement
  const subscriptionData = {
    currentPlan: dbUser?.currentPlan || 'free',
    subscriptionStatus: dbUser?.subscriptionStatus || null,
    documentsLimit: dbUser?.documentsLimit || 5,
    documentsUsed: dbUser?.documentsUsed || 0,
    stripeCustomerId: dbUser?.stripeCustomerId || null,
    stripeSubscriptionId: dbUser?.stripeSubscriptionId || null,
  };

  return (
    <DashboardClientPage 
      userName={firstName} 
      initialDocuments={documents}
      initialCredits={credits}
      subscriptionData={subscriptionData}
    />
  );
}