'use client';

import { useEffect, useState } from 'react';
import { useBankingRefresh } from './useBankingRefresh';

interface BankingKPIs {
  totalBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  transactionCount: number;
  accountsCount: number;
  revenueChange: number;
  expensesChange: number;
  balanceChange: number;
  transactionsChange: number;
  cashFlow: number;
  averageTransactionAmount: number;
  topCategories: Array<{
    name: string;
    amount: number;
    transactionCount: number;
    percentage: number;
  }>;
  lastUpdateAt: string;
}

interface UseBankingKPIsResult {
  kpis: BankingKPIs | null;
  loading: boolean;
  error: string | null;
  refreshKPIs: () => Promise<void>;
}

export function useBankingKPIs(): UseBankingKPIsResult {
  const [kpis, setKPIs] = useState<BankingKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useBankingKPIs] 📊 Récupération des KPIs bancaires...');

      const response = await fetch('/api/banking/kpis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Ne pas mettre en cache pour avoir des données en temps réel
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la récupération des KPIs');
      }

      setKPIs(data.kpis);
      console.log('[useBankingKPIs] ✅ KPIs récupérés:', {
        totalBalance: data.kpis.totalBalance,
        monthlyRevenue: data.kpis.monthlyRevenue,
        monthlyExpenses: data.kpis.monthlyExpenses,
        accountsCount: data.kpis.accountsCount,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('[useBankingKPIs] ❌ Erreur:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Charger les KPIs au montage du composant
  useEffect(() => {
    fetchKPIs();
  }, []);

  // S'abonner aux rafraîchissements centralisés
  useBankingRefresh('refreshKPIs', () => {
    console.log('[useBankingKPIs] 🔄 Rafraîchissement des KPIs via RefreshManager');
    fetchKPIs();
  });

  return {
    kpis,
    loading,
    error,
    refreshKPIs: fetchKPIs,
  };
}