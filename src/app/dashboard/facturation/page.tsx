'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ExternalLink, Loader2, CheckCircle, AlertCircle, Download, HelpCircle, Calendar, DollarSign, Zap } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

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
      <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
        <CreditCard className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
          Facturation
        </h1>
        <p className="text-gray-300 text-lg">Gérez votre abonnement et vos paiements</p>
      </div>
    </div>
  </motion.header>
);

// --- COMPOSANT : CARTE DE PLAN ACTUEL ---
const CurrentPlanCard = ({ subscriptionData }: { subscriptionData: SubscriptionData }) => {
  const hasActiveSubscription = subscriptionData.subscriptionStatus === 'active';
  const remainingCredits = subscriptionData.documentsLimit - subscriptionData.documentsUsed;
  const usagePercentage = (subscriptionData.documentsUsed / subscriptionData.documentsLimit) * 100;

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
      initial={{ opacity: 0.3, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Plan {subscriptionData.currentPlan}</h3>
              <p className="text-gray-300">Votre abonnement actuel</p>
            </div>
          </div>
          {hasActiveSubscription && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-200 text-sm font-medium">Actif</span>
            </div>
          )}
        </div>

        {/* Statistiques d'utilisation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{remainingCredits}</div>
            <div className="text-gray-300 text-sm">Crédits restants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{subscriptionData.documentsUsed}</div>
            <div className="text-gray-300 text-sm">Documents analysés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{subscriptionData.documentsLimit}</div>
            <div className="text-gray-300 text-sm">Limite mensuelle</div>
          </div>
        </div>

        {/* Barre de progression moderne */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">Utilisation ce mois-ci</span>
            <span className="text-white font-semibold">{usagePercentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>

        {/* Alerte si usage élevé */}
        {usagePercentage > 80 && (
          <motion.div 
            className="flex items-center gap-3 p-4 bg-orange-500/20 border border-orange-400/30 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <AlertCircle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-orange-200 font-medium">Attention à votre usage</p>
              <p className="text-orange-300 text-sm">
                Vous avez utilisé {usagePercentage.toFixed(0)}% de vos crédits ce mois-ci
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// --- COMPOSANT : PORTAIL DE GESTION ---
const ManagementPortal = ({ subscriptionData, onPortalOpen }: { 
  subscriptionData: SubscriptionData; 
  onPortalOpen: () => void;
}) => {
  const hasActiveSubscription = subscriptionData.subscriptionStatus === 'active';
  
  if (!hasActiveSubscription || !subscriptionData.stripeCustomerId) {
    return null;
  }

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-indigo-500/20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Portail de gestion Stripe</h3>
            <p className="text-gray-300">Gérez tous vos paramètres de facturation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <Download className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">Télécharger les factures</p>
              <p className="text-gray-400 text-sm">Historique complet</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">Moyens de paiement</p>
              <p className="text-gray-400 text-sm">Cartes et méthodes</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onPortalOpen}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <ExternalLink className="w-5 h-5" />
          Ouvrir le portail de gestion
        </button>
      </div>
    </motion.div>
  );
};

// --- COMPOSANT : PROCHAINE FACTURATION ---
const NextBillingCard = ({ subscriptionData }: { subscriptionData: SubscriptionData }) => {
  const hasActiveSubscription = subscriptionData.subscriptionStatus === 'active';
  
  if (!hasActiveSubscription) {
    return null;
  }

  // Simulation - dans un vrai cas, ces données viendraient de Stripe
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
      initial={{ opacity: 0.3, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-cyan-500/20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Prochaine facturation</h3>
            <p className="text-gray-300">Détails de votre prochain paiement</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <span className="text-gray-300">Date de facturation</span>
            <span className="text-white font-semibold">
              {nextBillingDate.toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <span className="text-gray-300">Montant</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-white font-semibold">29,99 €</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <span className="text-gray-300">Renouvellement automatique</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Activé</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPOSANT : AIDE ET SUPPORT ---
const SupportCard = () => (
  <motion.div 
    className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
    initial={{ opacity: 0.3, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {/* Effet glassmorphism */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Besoin d&apos;aide ?</h3>
          <p className="text-gray-300">Notre équipe est là pour vous accompagner</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
          <p className="text-white font-medium mb-2">Questions sur votre facturation ?</p>
          <p className="text-gray-400 text-sm">
            Contactez notre équipe support pour toute question concernant votre abonnement, 
            vos factures ou vos paiements.
          </p>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
        Contacter le support
      </button>
    </div>
  </motion.div>
);

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function BillingPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const handleManageSubscription = async () => {
    if (!subscriptionData?.stripeCustomerId) return;
    
    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: subscriptionData.stripeCustomerId,
          returnUrl: window.location.href 
        }),
      });

      if (!response.ok) {
        throw new Error('Impossible d&apos;accéder au portail de gestion');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10"></div>
        <div className="relative z-10 flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">Chargement de vos informations de facturation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10"></div>
        <div className="relative z-10">
          <BillingHeader />
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Impossible de charger les données</h3>
            <p className="text-gray-400">Veuillez réessayer plus tard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
      {/* Effet glassmorphism moderne pour la page facturation */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <BillingHeader />
        
        <div className="space-y-8">
          {/* Plan actuel - pleine largeur */}
          <CurrentPlanCard subscriptionData={subscriptionData} />
          
          {/* Grille 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ManagementPortal 
              subscriptionData={subscriptionData} 
              onPortalOpen={handleManageSubscription}
            />
            <NextBillingCard subscriptionData={subscriptionData} />
          </div>
          
          {/* Support - pleine largeur */}
          <SupportCard />
        </div>

        {/* Loading overlay pour le portail */}
        {portalLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-white text-lg font-medium">Ouverture du portail de gestion...</p>
              <p className="text-gray-300 text-sm mt-2">Vous allez être redirigé vers Stripe</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}