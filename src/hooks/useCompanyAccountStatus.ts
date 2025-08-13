'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface CompanyAccountStatus {
  hasConnectedAccount: boolean;
  accountsCount: number;
  lastSyncAt: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useCompanyAccountStatus() {
  const { user } = useUser();
  const [status, setStatus] = useState<CompanyAccountStatus>({
    hasConnectedAccount: false,
    accountsCount: 0,
    lastSyncAt: null,
    isLoading: true,
    error: null,
  });

  const checkAccountStatus = async () => {
    if (!user) {
      setStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await fetch('/api/bridge/status');
      const result = await response.json();

      if (result.success) {
        setStatus({
          hasConnectedAccount: result.data.hasConnectedAccount,
          accountsCount: result.data.accountsCount,
          lastSyncAt: result.data.lastSyncAt,
          isLoading: false,
          error: null,
        });
      } else {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Erreur lors de la vérification du statut',
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut du compte:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur de connexion',
      }));
    }
  };

  const refreshStatus = () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    checkAccountStatus();
  };

  useEffect(() => {
    checkAccountStatus();
  }, [user]);

  // Vérifier les paramètres URL pour une connexion réussie
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bridgeConnect = urlParams.get('bridge_connect');
    
    if (bridgeConnect === 'success') {
      // Supprimer le paramètre de l'URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('bridge_connect');
      newUrl.searchParams.delete('demo');
      newUrl.searchParams.delete('status');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Rafraîchir le statut après une connexion réussie
      setTimeout(() => {
        refreshStatus();
      }, 1000);
    }
  }, []);

  return { ...status, refreshStatus };
}
