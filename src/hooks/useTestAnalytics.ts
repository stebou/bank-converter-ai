import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

// Hook de test simplifié
export function useTestAnalytics() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        console.log('[TEST] Fetching analytics...');
        const response = await fetch('/api/banking/analytics?timeframe=1y');
        console.log('[TEST] Response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('[TEST] Success:', result);
          setData(result);
        } else {
          console.log('[TEST] Error:', response.statusText);
        }
      } catch (error) {
        console.error('[TEST] Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading };
}
