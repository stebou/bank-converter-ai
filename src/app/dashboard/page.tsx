import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BankingDashboardWrapper from '@/components/BankingDashboardWrapper';

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cette page remplace l'ancien dashboard et devient le dashboard principal
export default async function DashboardPage() {
  try {
    const user = await currentUser();

    if (!user) {
      redirect('/sign-in');
    }

    const firstName = user.firstName || user.fullName || 'Utilisateur';

    // Récupération des données utilisateur et abonnement
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    // Données d'abonnement (sans système de crédits)
    const subscriptionData = {
      currentPlan: dbUser?.currentPlan || 'free',
      subscriptionStatus: dbUser?.subscriptionStatus || null,
      documentsLimit: dbUser?.documentsLimit || 5,
      documentsUsed: dbUser?.documentsUsed || 0,
      stripeCustomerId: dbUser?.stripeCustomerId || null,
      stripeSubscriptionId: dbUser?.stripeSubscriptionId || null,
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <Suspense fallback={<DashboardSkeleton />}>
            <BankingDashboardWrapper 
              userName={firstName}
              subscriptionData={subscriptionData}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/sign-in');
  }
}