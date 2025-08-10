import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BankingDashboardWrapper from '@/components/BankingDashboardWrapper';

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 h-8 w-64 rounded bg-gray-200"></div>
          <div className="h-4 w-48 rounded bg-gray-200"></div>
        </div>
        <div className="h-10 w-32 rounded bg-gray-200"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
              <div>
                <div className="mb-1 h-4 w-16 rounded bg-gray-200"></div>
                <div className="h-6 w-20 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[400px] rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gray-200"></div>
              <div>
                <div className="mb-1 h-5 w-32 rounded bg-gray-200"></div>
                <div className="h-4 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-16 rounded-xl bg-gray-200"></div>
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
