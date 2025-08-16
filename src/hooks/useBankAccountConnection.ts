'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useBankingRefresh } from './useBankingRefresh';

interface CompanyAccountState {
  hasConnectedAccount: boolean;
  accountsCount: number;
  lastSyncAt: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useBankAccountConnection() {
  const { user } = useUser();

  // État du localStorage - uniquement boolean pour éviter les problèmes de sérialisation
  const storageKey = user
    ? `bank_connected_${user.id}`
    : 'bank_connected_guest';
  const [hasEverConnected, setHasEverConnected, , isClient] = useLocalStorage(
    storageKey,
    false
  );

  // État du backend
  const [state, setState] = useState<CompanyAccountState>({
    hasConnectedAccount: false,
    accountsCount: 0,
    lastSyncAt: null,
    isLoading: true,
    error: null,
  });

  // Référence pour éviter les appels multiples
  const isCheckingRef = useRef(false);

  // Fonction pour vérifier le statut - pas dans useCallback pour éviter les dépendances
  const checkStatus = async () => {
    console.log('[useBankAccountConnection] 🔄 Début checkStatus');
    console.log('[useBankAccountConnection] 🔍 Conditions:', { 
      hasUser: !!user, 
      isClient, 
      isChecking: isCheckingRef.current 
    });

    if (!user || !isClient || isCheckingRef.current) {
      console.log('[useBankAccountConnection] ⏭️ Skipped checkStatus - conditions non remplies');
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    isCheckingRef.current = true;

    try {
      console.log('[useBankAccountConnection] 📡 Appel API /api/bridge/status');
      const response = await fetch('/api/bridge/status');
      const result = await response.json();

      console.log('[useBankAccountConnection] 📋 Réponse status API:', result);

      if (result.success) {
        const hasAccount = result.data.hasConnectedAccount;
        console.log('[useBankAccountConnection] 💳 État des comptes:', {
          hasAccount,
          accountsCount: result.data.accountsCount,
          lastSyncAt: result.data.lastSyncAt
        });

        setState({
          hasConnectedAccount: hasAccount,
          accountsCount: result.data.accountsCount,
          lastSyncAt: result.data.lastSyncAt,
          isLoading: false,
          error: null,
        });

        // Mettre à jour la persistence si nécessaire
        if (hasAccount && !hasEverConnected) {
          console.log('[useBankAccountConnection] 🔄 Mise à jour persistence: hasEverConnected = true');
          setHasEverConnected(true);
        }
      } else {
        console.error('[useBankAccountConnection] ❌ Erreur API status:', result.error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Erreur lors de la vérification du statut',
        }));
      }
    } catch (error) {
      console.error('[useBankAccountConnection] ❌ Erreur lors de la vérification du statut:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur de connexion',
      }));
    } finally {
      isCheckingRef.current = false;
      console.log('[useBankAccountConnection] ✅ checkStatus terminé');
    }
  };

  // Effet pour le chargement initial - seulement quand le client est prêt
  useEffect(() => {
    if (isClient && user) {
      checkStatus();
    }
  }, [isClient, user?.id]); // Utiliser user.id au lieu de user complet

  // Effet pour gérer les paramètres URL - séparé pour éviter les conflits
  useEffect(() => {
    if (!isClient) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bridgeConnect = urlParams.get('bridge_connect');
    const connected = urlParams.get('connected');

    if (bridgeConnect === 'success' || connected === 'true') {
      // Nettoyer l'URL immédiatement
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('bridge_connect');
      newUrl.searchParams.delete('connected');
      newUrl.searchParams.delete('demo');
      newUrl.searchParams.delete('status');
      window.history.replaceState({}, '', newUrl.toString());

      // Marquer comme connecté et recharger le statut après un délai
      setHasEverConnected(true);
      setTimeout(() => {
        checkStatus();
      }, 1500);
    }
  }, [isClient]); // Pas de dépendances sur les fonctions

  // Utiliser le système de refresh centralisé
  useBankingRefresh('refreshStatus', () => {
    console.log('[useBankAccountConnection] Rafraîchissement du statut via RefreshManager');
    setTimeout(() => checkStatus(), 500);
  });

  // Fonction pour rafraîchir manuellement
  const refreshStatus = () => {
    setState(prev => ({ ...prev, isLoading: true }));
    checkStatus();
  };

  // Fonction pour réinitialiser la connexion
  const resetConnection = () => {
    setHasEverConnected(false);
    setState(prev => ({
      ...prev,
      hasConnectedAccount: false,
      accountsCount: 0,
      lastSyncAt: null,
    }));
  };

  // Fonction pour marquer comme connecté (utilisée après une connexion réussie)
  const markAsConnected = () => {
    setHasEverConnected(true);
    setTimeout(() => refreshStatus(), 500);
  };

  // Logique pour déterminer si on doit afficher la modale de connexion
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
