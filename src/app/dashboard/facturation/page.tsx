'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ExternalLink, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Calendar, 
  DollarSign, 
  Crown,
  Settings,
  User,
  Building2
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
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
    <div className="flex items-center gap-4 mb-2">
      <div className="p-3 bg-[#2c3e50] rounded-2xl shadow-lg">
        <CreditCard className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-[#2c3e50] font-montserrat tracking-tight">
          Abonnement
        </h1>
        <p className="text-[#34495e] text-lg font-open-sans">Gérez votre abonnement et vos paiements</p>
      </div>
    </div>
  </motion.header>
);

// --- COMPOSANT : CARTE DE PLAN ACTUEL ---
const CurrentPlanCard = ({ subscriptionData }: { subscriptionData: SubscriptionData }) => {
  const hasActiveSubscription = subscriptionData.subscriptionStatus === 'active';
  const isFreePlan = subscriptionData.currentPlan === 'free';
  
  const getPlanInfo = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'starter':
      case 'pack 50 crédits':
        return {
          name: 'Starter',
          icon: <Building2 className="w-6 h-6 text-white" />,
          color: 'from-blue-500 to-blue-600',
          features: ['50 documents/mois', 'Analyse IA avancée', 'Support par email']
        };
      case 'pro':
      case 'abonnement pro':
      case 'abonnement smart':
        return {
          name: 'Professional',
          icon: <Crown className="w-6 h-6 text-white" />,
          color: 'from-purple-500 to-purple-600',
          features: ['Documents illimités', 'Analyses IA premium', 'Support prioritaire', 'API access']
        };
      case 'enterprise':
        return {
          name: 'Enterprise',
          icon: <Crown className="w-6 h-6 text-white" />,
          color: 'from-gold-500 to-gold-600',
          features: ['Documents illimités', 'IA personnalisée', 'Support dédié', 'Intégrations custom']
        };
      default:
        return {
          name: 'Gratuit',
          icon: <User className="w-6 h-6 text-white" />,
          color: 'from-gray-500 to-gray-600',
          features: ['5 documents/mois', 'Analyses de base', 'Support communautaire']
        };
    }
  };

  const planInfo = getPlanInfo(subscriptionData.currentPlan);

  return (
    <motion.div 
      className="bg-[#ecf0f1] rounded-2xl shadow-xl border border-[#bdc3c7] p-8 relative overflow-hidden"
      initial={{ opacity: 0.3, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Gradient background pour les plans premium */}
      {!isFreePlan && (
        <div className={`absolute inset-0 bg-gradient-to-br ${planInfo.color} opacity-5`} />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-br ${planInfo.color} rounded-xl shadow-lg`}>
              {planInfo.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2c3e50] font-montserrat tracking-tight">
                Plan {planInfo.name}
              </h3>
              <p className="text-[#34495e] font-open-sans">
                {hasActiveSubscription ? 'Abonnement actif' : 'Plan gratuit'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasActiveSubscription ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium font-open-sans">Actif</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 text-sm font-medium font-open-sans">Gratuit</span>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques d'utilisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#bdc3c7] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#2c3e50] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2c3e50] font-montserrat">
                  {subscriptionData.documentsUsed}
                </div>
                <div className="text-[#34495e] text-sm font-open-sans">Documents analysés ce mois</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-[#bdc3c7] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#2c3e50] rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2c3e50] font-montserrat">
                  {hasActiveSubscription ? 'Illimité' : '5'}
                </div>
                <div className="text-[#34495e] text-sm font-open-sans">
                  {hasActiveSubscription ? 'Analyses par mois' : 'Limite gratuite'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fonctionnalités du plan */}
        <div className="bg-white p-6 rounded-xl border border-[#bdc3c7] shadow-sm mb-6">
          <h4 className="text-lg font-semibold text-[#2c3e50] mb-4 font-montserrat">
            Fonctionnalités incluses
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-[#34495e] font-open-sans">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {hasActiveSubscription ? (
            <>
              <button className="flex-1 bg-[#2c3e50] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#34495e] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105 font-open-sans">
                <Settings className="w-5 h-5" />
                Gérer l'abonnement
              </button>
              <button className="flex-1 bg-white text-[#2c3e50] font-semibold py-3 px-6 rounded-xl hover:bg-[#ecf0f1] transition-all duration-300 border border-[#bdc3c7] flex items-center justify-center gap-2 font-open-sans">
                <Download className="w-5 h-5" />
                Télécharger factures
              </button>
            </>
          ) : (
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105 font-open-sans">
              <Crown className="w-5 h-5" />
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
  const [payments, setPayments] = useState([]);
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
          status: 'paid'
        },
        {
          id: '2', 
          date: '2023-12-15',
          amount: 29.99,
          plan: 'Plan Pro',
          status: 'paid'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <motion.div 
      className="bg-[#ecf0f1] rounded-2xl shadow-xl border border-[#bdc3c7] p-8"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#2c3e50] rounded-xl">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#2c3e50] font-montserrat tracking-tight">
            Historique des paiements
          </h3>
          <p className="text-[#34495e] font-open-sans">Vos dernières factures</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2c3e50]" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-[#bdc3c7] mx-auto mb-4" />
          <p className="text-[#34495e] font-open-sans">Aucun paiement enregistré</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment: any) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#bdc3c7] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#2c3e50] font-montserrat">{payment.plan}</p>
                  <p className="text-sm text-[#34495e] font-open-sans">
                    {new Date(payment.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#2c3e50] font-montserrat">
                  {payment.amount}€
                </p>
                <button className="text-sm text-[#2c3e50] hover:text-[#34495e] flex items-center gap-1 font-open-sans">
                  <Download className="w-4 h-4" />
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
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
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
          setError('Erreur lors du chargement des données d\'abonnement');
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
        <div className="max-w-6xl mx-auto">
          <BillingHeader />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#2c3e50]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#bdc3c7] p-8">
        <div className="max-w-6xl mx-auto">
          <BillingHeader />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-[#34495e] font-open-sans">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#bdc3c7] p-8">
      <div className="max-w-6xl mx-auto">
        <BillingHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {subscriptionData && <CurrentPlanCard subscriptionData={subscriptionData} />}
          <PaymentHistoryCard />
        </div>
      </div>
    </div>
  );
}