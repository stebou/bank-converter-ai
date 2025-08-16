'use client';

import { useCallback, useEffect, useRef } from 'react';

interface RefreshCallbacks {
  refreshAccounts?: () => void;
  refreshTransactions?: () => void;
  refreshAnalytics?: () => void;
  refreshStatus?: () => void;
}

class BankingRefreshManager {
  private callbacks: RefreshCallbacks = {};
  private refreshTimeout: NodeJS.Timeout | null = null;

  register(type: keyof RefreshCallbacks, callback: () => void) {
    this.callbacks[type] = callback;
    console.log(`[RefreshManager] Registered ${type} callback`);
  }

  unregister(type: keyof RefreshCallbacks) {
    delete this.callbacks[type];
    console.log(`[RefreshManager] Unregistered ${type} callback`);
  }

  triggerRefresh(delay: number = 0) {
    console.log(`[RefreshManager] Déclenchement refresh global dans ${delay}ms`);
    
    // Annuler le refresh précédent s'il existe
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    this.refreshTimeout = setTimeout(() => {
      console.log('[RefreshManager] Exécution refresh global');
      
      // Exécuter tous les callbacks
      Object.entries(this.callbacks).forEach(([type, callback]) => {
        if (callback) {
          console.log(`[RefreshManager] Refresh ${type}`);
          try {
            callback();
          } catch (error) {
            console.error(`[RefreshManager] Erreur refresh ${type}:`, error);
          }
        }
      });
    }, delay);
  }
}

// Instance globale du manager
const refreshManager = new BankingRefreshManager();

export function useBankingRefresh(
  type: keyof RefreshCallbacks,
  refreshCallback: () => void
) {
  const callbackRef = useRef(refreshCallback);
  callbackRef.current = refreshCallback;

  // Fonction de refresh wrapper
  const wrappedCallback = useCallback(() => {
    callbackRef.current();
  }, []);

  useEffect(() => {
    // Enregistrer le callback
    refreshManager.register(type, wrappedCallback);

    // Écouter les événements de mise à jour globaux
    const handleBankingDataUpdate = () => {
      console.log(`[useBankingRefresh] Événement reçu pour ${type}`);
      refreshManager.triggerRefresh(500);
    };

    window.addEventListener('banking-data-updated', handleBankingDataUpdate);

    return () => {
      refreshManager.unregister(type);
      window.removeEventListener('banking-data-updated', handleBankingDataUpdate);
    };
  }, [type, wrappedCallback]);

  // Fonction pour déclencher un refresh manuel
  const triggerRefresh = useCallback(() => {
    refreshManager.triggerRefresh();
  }, []);

  return { triggerRefresh };
}