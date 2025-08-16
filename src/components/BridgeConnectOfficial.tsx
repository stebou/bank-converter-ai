'use client';

import { useState } from 'react';

interface BridgeConnectOfficialProps {
  children?: React.ReactNode;
  className?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  providerId?: string;
}

export function BridgeConnectOfficial({ 
  children, 
  className = '',
  onSuccess,
  onError,
  onClose,
  providerId
}: BridgeConnectOfficialProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Trigger Bridge demo connection
      const response = await fetch('/api/bridge/demo-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          providerId 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Bridge connection successful:', data);
        onSuccess?.(data);
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error) {
      console.error('❌ Bridge connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      onError?.(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connexion...
        </>
      ) : (
        children || 'Connecter un compte bancaire'
      )}
    </button>
  );
}

export default BridgeConnectOfficial;
