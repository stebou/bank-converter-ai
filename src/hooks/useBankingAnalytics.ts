'use client';

import { useEffect, useState } from 'react';

interface MonthlyTrend {
  [monthKey: string]: {
    income: number;
    expenses: number;
  };
}

interface BankingAnalytics {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: MonthlyTrend;
  transactionCount: number;
}

interface UseBankingAnalyticsResult {
  analytics: BankingAnalytics | null;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => void;
}

export function useBankingAnalytics(timeframe: string = '30d'): UseBankingAnalyticsResult {
  const [analytics, setAnalytics] = useState<BankingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/banking/analytics?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  };
}
