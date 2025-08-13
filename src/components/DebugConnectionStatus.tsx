import { useEffect, useState } from 'react';

export function DebugConnectionStatus() {
  const [storageState, setStorageState] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      // Écouter les changements dans localStorage
      const checkStorage = () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('bank_connection_status_'));
        setStorageState(keys.length > 0 ? `Found: ${keys.join(', ')}` : 'No connection status found');
      };

      checkStorage();
      
      // Mettre à jour toutes les secondes pour le debug
      const interval = setInterval(checkStorage, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  if (!isClient || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Debug localStorage:</div>
      <div>{storageState || 'Loading...'}</div>
    </div>
  );
}
