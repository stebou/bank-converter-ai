import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BankingDashboardWrapper from '@/components/BankingDashboardWrapper';

function BankingDashboardSkeleton() {
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

      {/* Accounts skeleton */}
      <section>
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
              <div className="text-right">
                <div className="h-8 bg-gray-200 rounded w-24 ml-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transactions skeleton */}
      <section>
        <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
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