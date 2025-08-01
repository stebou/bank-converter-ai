import { useState, useEffect } from 'react';
import type { BankAccountType, BankTransactionType, FinancialAnalyticsType } from '@/types';

export function useBankingData(userId?: string) {
  const [accounts, setAccounts] = useState<BankAccountType[]>([]);
  const [transactions, setTransactions] = useState<BankTransactionType[]>([]);
  const [analytics, setAnalytics] = useState<FinancialAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/banking/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    }
  };

  const fetchTransactions = async (accountId?: string, limit: number = 50) => {
    try {
      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/banking/transactions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    }
  };

  const fetchAnalytics = async (timeframe: string = '30d') => {
    try {
      const response = await fetch(`/api/banking/analytics?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    }
  };

  const syncData = async () => {
    setSyncing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/banking/sync', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync data');
      }
      
      const data = await response.json();
      console.log('Sync result:', data.syncResult);
      
      // Rafraîchir les données après la synchronisation
      await Promise.all([
        fetchAccounts(),
        fetchTransactions(),
        fetchAnalytics(),
      ]);
      
      return data.syncResult;
    } catch (err) {
      console.error('Error syncing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync data');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchAccounts(),
        fetchTransactions(),
        fetchAnalytics(),
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    accounts,
    transactions,
    analytics,
    loading,
    error,
    syncing,
    syncData,
    refreshData,
    fetchTransactions,
    fetchAnalytics,
  };
}