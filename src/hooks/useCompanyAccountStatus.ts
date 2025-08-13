'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useClientOnly } from './useClientOnly';

interface CompanyAccountStatus {
  hasConnectedAccount: boolean;
  accountsCount: number;
  lastSyncAt: string | null;
  isLoading: boolean;
  error: string | null;
  hasEverConnected: boolean; // Nouvel état pour la persistence
  isClientReady: boolean; // État pour la compatibilité SSR/CSR
}

export function useCompanyAccountStatus() {
  const { user } = useUser();
  const isClientReady = useClientOnly();
  const hasInitializedRef = useRef(false);
  
  const [hasEverConnected, setHasEverConnected] = useState(false);
  const [status, setStatus] = useState<Omit<CompanyAccountStatus, 'hasEverConnected' | 'isClientReady'>>({
    hasConnectedAccount: false,
    accountsCount: 0,
    lastSyncAt: null,
    isLoading: true,
    error: null,
  });

  // Charger l'état depuis localStorage seulement côté client
  useEffect(() => {
    if (!isClientReady || !user) return;
    
    const storageKey = `bank_connection_status_${user.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setHasEverConnected(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état de connexion:', error);
    }
  }, [isClientReady, user]);

  const checkAccountStatus = useCallback(async () => {
    if (!isClientReady || !user) {
      setStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await fetch('/api/bridge/status');
      const result = await response.json();

      if (result.success) {
        const hasConnectedAccount = result.data.hasConnectedAccount;
        
        // Sauvegarder dans localStorage seulement côté client
        const storageKey = `bank_connection_status_${user.id}`;
        try {
          if (hasConnectedAccount) {
            localStorage.setItem(storageKey, JSON.stringify(true));
            setHasEverConnected(true);
          } else {
            localStorage.setItem(storageKey, JSON.stringify(false));
            setHasEverConnected(false);
          }
        } catch (error) {
          console.error('Erreur lors de la sauvegarde dans localStorage:', error);
        }

        setStatus({
          hasConnectedAccount,
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
  }, [isClientReady, user]);

  const refreshStatus = useCallback(() => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    checkAccountStatus();
  }, [checkAccountStatus]);

  const resetConnectionStatus = useCallback(() => {
    if (!isClientReady || !user) return;
    
    setHasEverConnected(false);
    const storageKey = `bank_connection_status_${user.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(false));
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du localStorage:', error);
    }
  }, [isClientReady, user]);

  // Charger l'état depuis localStorage et initialiser une seule fois
  useEffect(() => {
    if (!isClientReady || !user || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    const storageKey = `bank_connection_status_${user.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setHasEverConnected(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état de connexion:', error);
    }
    
    // Vérifier le statut une seule fois après l'initialisation
    checkAccountStatus();
  }, [isClientReady, user]); // Retirer checkAccountStatus des dépendances

  // Vérifier les paramètres URL pour une connexion réussie - une seule fois
  useEffect(() => {
    if (!isClientReady) return;
    
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
  }, [isClientReady]); // Retirer refreshStatus des dépendances pour éviter la boucle

  return { 
    ...status, 
    hasEverConnected, 
    isClientReady,
    refreshStatus, 
    resetConnectionStatus 
  };
}
