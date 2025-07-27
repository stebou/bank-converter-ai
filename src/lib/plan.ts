// src/lib/plans.ts
export const PLANS = {
    free: {
      name: 'Free',
      description: 'Pour tester notre IA',
      price: 0,
      documentsLimit: 5,
      stripePriceId: '', // Pas de Stripe pour le plan gratuit
      features: [
        '5 documents par mois',
        'IA parsing 90% précision',
        'Export CSV/JSON',
        'Support email'
      ]
    },
    smart: {
      name: 'Smart',
      description: 'IA Basique pour PME',
      price: 49,
      documentsLimit: 100,
      stripePriceId: 'price_test_smart', // ID de test temporaire
      features: [
        '100 documents par mois',
        'IA parsing 95%+ précision',
        'Auto-catégorisation',
        'Détection anomalies',
        'Export avancé',
        'Support prioritaire'
      ]
    },
    professional: {
      name: 'Professional',
      description: 'IA Avancée pour entreprises',
      price: 149,
      documentsLimit: 500,
      stripePriceId: 'price_test_professional', // ID de test temporaire
      features: [
        '500 documents par mois',
        'IA parsing 95%+ précision',
        'Détection anomalies avancée',
        'API access complet',
        'Réconciliation bancaire IA',
        '10 utilisateurs inclus',
        'Support phone'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      description: 'IA Custom pour grandes entreprises',
      price: 399,
      documentsLimit: -1, // Illimité
      stripePriceId: 'price_test_enterprise', // ID de test temporaire
      features: [
        'Documents illimités',
        'IA fine-tuned sur vos données',
        'Custom categorization rules',
        'White-label options',
        'Utilisateurs illimités',
        'SLA 99.9%',
        'Support dédié + CSM'
      ]
    }
  } as const;
  
  export type PlanType = keyof typeof PLANS;
  
  // Helper pour obtenir un plan
  export function getPlan(planId: string): typeof PLANS[PlanType] | null {
    if (planId in PLANS) {
      return PLANS[planId as PlanType];
    }
    return null;
  }
  
  // Helper pour vérifier si un utilisateur peut traiter un document
  export function canProcessDocument(documentsUsed: number, documentsLimit: number): boolean {
    if (documentsLimit === -1) return true; // Illimité
    return documentsUsed < documentsLimit;
  }
  
  // Helper pour calculer le pourcentage d'utilisation
  export function getUsagePercentage(documentsUsed: number, documentsLimit: number): number {
    if (documentsLimit === -1) return 0; // Illimité
    return Math.round((documentsUsed / documentsLimit) * 100);
  }