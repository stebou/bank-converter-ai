'use client';

import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface CompanyAccountState {
  hasConnectedAccount: boolean;
  accountsCount: number;
  lastSyncAt: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useCompanyAccountPersistence() {
  const { user } = useUser();

  // Utilisation du localStorage avec le nouveau hook sécurisé
  const storageKey = user
    ? `bank_connection_${user.id}`
    : 'bank_connection_guest';
  const [hasEverConnected, setHasEverConnected, removeConnection, isClient] =
    useLocalStorage(storageKey, false);

  const [state, setState] = useState<CompanyAccountState>({
    hasConnectedAccount: false,
    accountsCount: 0,
    lastSyncAt: null,
    isLoading: true,
    error: null,
  });

  // Fonction pour vérifier le statut du compte - mémorisée pour éviter les boucles
  const checkAccountStatus = useCallback(async () => {
    if (!user || !isClient) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await fetch('/api/bridge/status');
      const result = await response.json();

      if (result.success) {
        const hasAccount = result.data.hasConnectedAccount;

        // Mettre à jour la persistence seulement si nécessaire
        if (hasAccount && !hasEverConnected) {
          setHasEverConnected(true);
        }

        setState({
          hasConnectedAccount: hasAccount,
          accountsCount: result.data.accountsCount,
          lastSyncAt: result.data.lastSyncAt,
          isLoading: false,
          error: null,
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Erreur lors de la vérification du statut',
        }));
      }
    } catch (error) {
      console.error(
        'Erreur lors de la vérification du statut du compte:',
        error
      );
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur de connexion',
      }));
    }
  }, [user, isClient, hasEverConnected, setHasEverConnected]); // Dépendances stables

  // Fonction pour rafraîchir le statut
  const refreshStatus = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
    checkAccountStatus();
  }, [checkAccountStatus]);

  // Fonction pour réinitialiser la connexion
  const resetConnection = useCallback(() => {
    removeConnection();
    setState(prev => ({
      ...prev,
      hasConnectedAccount: false,
      accountsCount: 0,
      lastSyncAt: null,
    }));
  }, [removeConnection]);

  // Fonction pour marquer comme connecté (après une connexion réussie)
  const markAsConnected = useCallback(() => {
    setHasEverConnected(true);
    refreshStatus();
  }, [setHasEverConnected, refreshStatus]);

  // Charger le statut initial seulement une fois quand le client est prêt
  useEffect(() => {
    if (isClient && user) {
      checkAccountStatus();
    }
  }, [isClient, user]); // Ne pas inclure checkAccountStatus pour éviter la boucle

  // Vérifier les paramètres URL pour une connexion réussie
  useEffect(() => {
    if (!isClient) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bridgeConnect = urlParams.get('bridge_connect');
    const connected = urlParams.get('connected');

    if (bridgeConnect === 'success' || connected === 'true') {
      // Nettoyer l'URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('bridge_connect');
      newUrl.searchParams.delete('connected');
      newUrl.searchParams.delete('demo');
      newUrl.searchParams.delete('status');
      window.history.replaceState({}, '', newUrl.toString());

      // Marquer comme connecté et rafraîchir après un délai
      setTimeout(() => {
        setHasEverConnected(true);
        checkAccountStatus();
      }, 1000);
    }
  }, [isClient]); // Supprimer markAsConnected des dépendances

  // Calculer si on doit afficher la modale
  const shouldShowConnectionModal =
    isClient && !hasEverConnected && !state.isLoading;

  return {
    ...state,
    hasEverConnected,
    shouldShowConnectionModal,
    isClient,
    refreshStatus,
    resetConnection,
    markAsConnected,
  };
}
