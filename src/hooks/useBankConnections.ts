import { useCallback, useEffect, useState } from 'react';

interface BankConnection {
  bridgeItemId: string;
  bankName: string;
  connectedAt: string;
  accounts: {
    id: string;
    bridgeAccountId: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    iban?: string;
  }[];
}

interface UseBankConnectionsReturn {
  connections: BankConnection[];
  isLoading: boolean;
  error: string | null;
  refreshConnections: () => Promise<void>;
  disconnectConnection: (bridgeItemId: string) => Promise<boolean>;
}

export function useBankConnections(): UseBankConnectionsReturn {
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/bridge/connections');

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des connexions');
      }

      const data = await response.json();

      if (data.success) {
        const connections = data.data?.connections || [];
        setConnections(connections);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur fetch connections:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshConnections = useCallback(async () => {
    await fetchConnections();
  }, [fetchConnections]);

  const disconnectConnection = useCallback(
    async (bridgeItemId: string): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(
          `/api/bridge/connections?itemId=${bridgeItemId}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la déconnexion');
        }

        const data = await response.json();

        if (data.success) {
          // Mettre à jour la liste des connexions
          await refreshConnections();
          return true;
        } else {
          throw new Error(data.error || 'Erreur lors de la déconnexion');
        }
      } catch (err) {
        console.error('Erreur disconnect connection:', err);
        setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
        return false;
      }
    },
    [refreshConnections]
  );

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections,
    isLoading,
    error,
    refreshConnections,
    disconnectConnection,
  };
}
