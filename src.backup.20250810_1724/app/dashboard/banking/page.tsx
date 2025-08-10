import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BankingDashboardWrapper from '@/components/BankingDashboardWrapper';

function BankingDashboardSkeleton() {
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

      {/* Accounts skeleton */}
      <section>
        <div className="mb-6 h-6 w-32 rounded bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
                  <div className="mb-1 h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-3 w-20 rounded bg-gray-200"></div>
                </div>
                <div className="h-3 w-3 rounded-full bg-gray-200"></div>
              </div>
              <div className="text-right">
                <div className="mb-2 ml-auto h-8 w-24 rounded bg-gray-200"></div>
                <div className="ml-auto h-3 w-32 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transactions skeleton */}
      <section>
        <div className="mb-6 h-6 w-40 rounded bg-gray-200"></div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-100 p-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                <div>
                  <div className="mb-1 h-4 w-48 rounded bg-gray-200"></div>
                  <div className="h-3 w-32 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="h-5 w-20 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function BankingPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const firstName = user.firstName || user.fullName || 'Utilisateur';

  // Récupération des données utilisateur et abonnement
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // Données d'abonnement pour les badges
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
        <Suspense fallback={<BankingDashboardSkeleton />}>
          <BankingDashboardWrapper
            userName={firstName}
            subscriptionData={subscriptionData}
          />
        </Suspense>
      </div>
    </div>
  );
}
