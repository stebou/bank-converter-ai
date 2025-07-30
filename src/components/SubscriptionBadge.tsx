'use client';

import React from 'react';
import { Crown, Zap, Shield } from 'lucide-react';

interface SubscriptionBadgeProps {
  currentPlan: string;
  subscriptionStatus: string | null;
}

export default function SubscriptionBadge({ currentPlan, subscriptionStatus }: SubscriptionBadgeProps) {
  // Ne pas afficher de badge pour les utilisateurs gratuits
  if (currentPlan === 'free' || !subscriptionStatus || subscriptionStatus !== 'active') {
    return null;
  }

  // Configuration des badges selon le plan
  const getBadgeConfig = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'starter':
      case 'pack 50 crédits':
        return {
          icon: <Zap className="w-3 h-3" />,
          text: 'Starter',
          className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
        };
      case 'pro':
      case 'abonnement pro':
      case 'abonnement smart':
        return {
          icon: <Crown className="w-3 h-3" />,
          text: 'Pro',
          className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
        };
      case 'enterprise':
        return {
          icon: <Shield className="w-3 h-3" />,
          text: 'Enterprise',
          className: 'bg-gradient-to-r from-gold-500 to-gold-600 text-white',
        };
      default:
        return {
          icon: <Crown className="w-3 h-3" />,
          text: 'Premium',
          className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
        };
    }
  };

  const { icon, text, className } = getBadgeConfig(currentPlan);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className} shadow-sm`}>
      {icon}
      {text}
    </span>
  );
}