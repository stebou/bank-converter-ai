'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProBankingDashboard from './ProBankingDashboard';
import AuthTransition from './AuthTransition';

// Types pour les données d'abonnement
type SubscriptionData = {
  currentPlan: string;
  subscriptionStatus: string | null;
  documentsLimit: number;
  documentsUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

interface BankingDashboardWrapperProps {
  userName: string;
  subscriptionData: SubscriptionData;
}

export default function BankingDashboardWrapper(
  props: BankingDashboardWrapperProps
) {
  const searchParams = useSearchParams();
  const fromAuth = searchParams.get('from_auth');
  const paymentStatus = searchParams.get('payment');

  // Initialiser showTransition à true si on vient d'une authentification
  const [showTransition, setShowTransition] = useState(
    fromAuth === 'true' || paymentStatus === 'success'
  );

  useEffect(() => {
    // Nettoyer l'URL si on vient d'une authentification
    if (fromAuth === 'true' || paymentStatus === 'success') {
      const url = new URL(window.location.href);
      url.searchParams.delete('from_auth');
      if (paymentStatus !== 'success') {
        url.searchParams.delete('payment');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [fromAuth, paymentStatus]);

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  if (showTransition) {
    return (
      <AuthTransition
        userFirstName={props.userName}
        onComplete={handleTransitionComplete}
      />
    );
  }

  return (
    <ProBankingDashboard
      userName={props.userName}
      subscriptionData={props.subscriptionData}
    />
  );
}
