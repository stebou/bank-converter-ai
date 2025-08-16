'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    CreditCard,
    Crown,
    DollarSign,
    Download,
    Loader2,
    Settings,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../../styles/fonts.css';

interface SubscriptionData {
  currentPlan: string;
  subscriptionStatus: string | null;
  documentsLimit: number;
  documentsUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

// --- COMPOSANT : HEADER MODERNE ---
const BillingHeader = () => (
  <motion.header
    className="mb-8"
    initial={{ opacity: 0.3, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="mb-2 flex items-center gap-4">
      <div className="rounded-2xl bg-[#2c3e50] p-3 shadow-lg">
        <CreditCard className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="font-montserrat text-4xl font-bold tracking-tight text-[#2c3e50]">
          Abonnement
        </h1>
        <p className="font-open-sans text-lg text-[#34495e]">
          Gérez votre abonnement et vos paiements
        </p>
      </div>
    </div>
  </motion.header>
);

// --- COMPOSANT : CARTE DE PLAN ACTUEL ---
const CurrentPlanCard = ({
  subscriptionData,
}: {
  subscriptionData: SubscriptionData;
}) => {
  const hasActiveSubscription =
    subscriptionData.subscriptionStatus === 'active';
  const isFreePlan = subscriptionData.currentPlan === 'free';

  const getPlanInfo = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'starter':
      case 'pack 50 crédits':
        return {
          name: 'Starter',
          icon: <Building2 className="h-6 w-6 text-white" />,
          color: 'from-blue-500 to-blue-600',
          features: [
            '50 documents/mois',
            'Analyse IA avancée',
            'Support par email',
          ],
        };
      case 'pro':
      case 'abonnement pro':
      case 'abonnement smart':
        return {
          name: 'Professional',
          icon: <Crown className="h-6 w-6 text-white" />,
          color: 'from-purple-500 to-purple-600',
          features: [
            'Documents illimités',
            'Analyses IA premium',
            'Support prioritaire',
            'API access',
          ],
        };
      case 'enterprise':
        return {
          name: 'Enterprise',
          icon: <Crown className="h-6 w-6 text-white" />,
          color: 'from-gold-500 to-gold-600',
          features: [
            'Documents illimités',
            'IA personnalisée',
            'Support dédié',
            'Intégrations custom',
          ],
        };
      default:
        return {
          name: 'Gratuit',
          icon: <User className="h-6 w-6 text-white" />,
          color: 'from-gray-500 to-gray-600',
          features: [
            '5 documents/mois',
            'Analyses de base',
            'Support communautaire',
          ],
        };
    }
  };

  const planInfo = getPlanInfo(subscriptionData.currentPlan);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-8 shadow-xl"
      initial={{ opacity: 0.3, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Gradient background pour les plans premium */}
      {!isFreePlan && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${planInfo.color} opacity-5`}
        />
      )}

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`bg-gradient-to-br p-3 ${planInfo.color} rounded-xl shadow-lg`}
            >
              {planInfo.icon}
            </div>
            <div>
              <h3 className="font-montserrat text-2xl font-bold tracking-tight text-[#2c3e50]">
                Plan {planInfo.name}
              </h3>
              <p className="font-open-sans text-[#34495e]">
                {hasActiveSubscription ? 'Abonnement actif' : 'Plan gratuit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveSubscription ? (
              <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-open-sans text-sm font-medium text-green-700">
                  Actif
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-4 py-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="font-open-sans text-sm font-medium text-orange-700">
                  Gratuit
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques d'utilisation */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#bdc3c7] bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-[#2c3e50] p-2">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                  {subscriptionData.documentsUsed}
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Documents analysés ce mois
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#bdc3c7] bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-[#2c3e50] p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                  {hasActiveSubscription ? 'Illimité' : '5'}
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  {hasActiveSubscription
                    ? 'Analyses par mois'
                    : 'Limite gratuite'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fonctionnalités du plan */}
        <div className="mb-6 rounded-xl border border-[#bdc3c7] bg-white p-6 shadow-sm">
          <h4 className="font-montserrat mb-4 text-lg font-semibold text-[#2c3e50]">
            Fonctionnalités incluses
          </h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {planInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="font-open-sans text-[#34495e]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {hasActiveSubscription ? (
            <>
              <button className="font-open-sans flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2c3e50] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]">
                <Settings className="h-5 w-5" />
                Gérer l'abonnement
              </button>
              <button className="font-open-sans flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#bdc3c7] bg-white px-6 py-3 font-semibold text-[#2c3e50] transition-all duration-300 hover:bg-[#ecf0f1]">
                <Download className="h-5 w-5" />
                Télécharger factures
              </button>
            </>
          ) : (
            <button className="font-open-sans flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-purple-700">
              <Crown className="h-5 w-5" />
              Passer au plan Pro
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPOSANT : HISTORIQUE DES PAIEMENTS ---
const PaymentHistoryCard = () => {
  const [payments, setPayments] = useState<Array<{
    id: string;
    date: string;
    amount: number;
    plan: string;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des paiements
    setTimeout(() => {
      setPayments([
        {
          id: '1',
          date: '2024-01-15',
          amount: 29.99,
          plan: 'Plan Pro',
          status: 'paid',
        },
        {
          id: '2',
          date: '2023-12-15',
          amount: 29.99,
          plan: 'Plan Pro',
          status: 'paid',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <motion.div
      className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-8 shadow-xl"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#2c3e50] p-2">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-montserrat text-2xl font-bold tracking-tight text-[#2c3e50]">
            Historique des paiements
          </h3>
          <p className="font-open-sans text-[#34495e]">
            Vos dernières factures
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2c3e50]" />
        </div>
      ) : payments.length === 0 ? (
        <div className="py-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
          <p className="font-open-sans text-[#34495e]">
            Aucun paiement enregistré
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment: any) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-xl border border-[#bdc3c7] bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-[#2c3e50]">
                    {payment.plan}
                  </p>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    {new Date(payment.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-montserrat font-bold text-[#2c3e50]">
                  {payment.amount}€
                </p>
                <button className="font-open-sans flex items-center gap-1 text-sm text-[#2c3e50] hover:text-[#34495e]">
                  <Download className="h-4 w-4" />
                  Facture
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function BillingPage() {
  const { user } = useUser();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        } else {
          setError("Erreur lors du chargement des données d'abonnement");
        }
      } catch (err) {
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  const openStripePortal = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening Stripe portal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#bdc3c7] p-8">
        <div className="mx-auto max-w-6xl">
          <BillingHeader />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#2c3e50]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#bdc3c7] p-8">
        <div className="mx-auto max-w-6xl">
          <BillingHeader />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
              <p className="font-open-sans text-[#34495e]">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#bdc3c7] p-8">
      <div className="mx-auto max-w-6xl">
        <BillingHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {subscriptionData && (
            <CurrentPlanCard subscriptionData={subscriptionData} />
          )}
          <PaymentHistoryCard />
        </div>
      </div>
    </div>
  );
}
