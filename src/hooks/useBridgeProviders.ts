import { bridgeClient } from '@/lib/bridge';

// Type for Bridge Provider
export interface BridgeProvider {
  id: number;
  name: string;
  logo: string;
  country: string;
  supported: boolean;
}
import { useCallback, useEffect, useState } from 'react';

interface UseBridgeProvidersReturn {
  providers: BridgeProvider[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache global partagé entre toutes les instances du hook
let globalProvidersCache: BridgeProvider[] | null = null;
let globalCacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook personnalisé pour gérer les providers Bridge de manière optimisée
 * Évite les appels API redondants avec un cache partagé
 */
export function useBridgeProviders(): UseBridgeProvidersReturn {
  const [providers, setProviders] = useState<BridgeProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    // Vérifier le cache global
    const now = Date.now();
    if (globalProvidersCache && (now - globalCacheTimestamp) < CACHE_DURATION) {
      console.log('[HOOK] Utilisation du cache global des providers');
      setProviders(globalProvidersCache);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('[HOOK] Fetch providers depuis l\'API');
      const fetchedProviders = await bridgeClient.getProviders();
      
      // Transform data to match expected format
      const transformedProviders: BridgeProvider[] = fetchedProviders.map(provider => ({
        id: provider.id || 0,
        name: provider.name || 'Unknown Provider',
        logo: provider.logo_url || 'https://via.placeholder.com/40x40/667eea/white?text=' + (provider.name?.[0] || 'P'),
        country: provider.country || 'FR',
        supported: provider.status === 'supported' || true,
      }));
      
      // Mettre à jour le cache global
      globalProvidersCache = transformedProviders;
      globalCacheTimestamp = now;
      
      setProviders(transformedProviders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('[HOOK] Erreur fetch providers:', errorMessage);
      setError(errorMessage);
      
      // En cas d'erreur, utiliser des données de fallback
      const fallbackProviders = [
        {
          id: 574,
          name: 'Demo Bank',
          logo: 'https://via.placeholder.com/40x40/667eea/white?text=DB',
          country: 'FR',
          supported: true,
        },
      ];
      setProviders(fallbackProviders);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    // Forcer le rechargement en vidant le cache
    globalProvidersCache = null;
    globalCacheTimestamp = 0;
    await fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return {
    providers,
    loading,
    error,
    refetch,
  };
}

// Fonction utilitaire pour vider manuellement le cache
export function clearBridgeProvidersCache(): void {
  globalProvidersCache = null;
  globalCacheTimestamp = 0;
  console.log('[HOOK] Cache des providers vidé');
}
