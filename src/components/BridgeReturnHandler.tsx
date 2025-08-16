'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BridgeReturnHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Traitement de la connexion...');

  useEffect(() => {
    const handleBridgeReturn = async () => {
      try {
        // Récupérer les paramètres de retour de Bridge
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Erreur lors de la connexion: ${error}`);
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
          return;
        }

        if (code) {
          // Traiter la connexion réussie
          console.log('✅ Code de connexion Bridge reçu:', code);
          
          // Ici vous pourriez faire un appel API pour traiter le code
          // const response = await fetch('/api/bridge/process-connection', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ code, state })
          // });

          setStatus('success');
          setMessage('Connexion établie avec succès !');
          
          setTimeout(() => {
            router.push('/dashboard?connected=true');
          }, 2000);
        } else {
          // Pas de code, probablement une connexion demo
          setStatus('success');
          setMessage('Connexion demo établie !');
          
          setTimeout(() => {
            router.push('/dashboard?demo=true');
          }, 2000);
        }

      } catch (error) {
        console.error('Erreur traitement retour Bridge:', error);
        setStatus('error');
        setMessage('Erreur lors du traitement de la connexion');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    };

    handleBridgeReturn();
  }, [searchParams, router]);

  return (
    <div className="text-center p-6">
      {status === 'processing' && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 font-medium">{message}</p>
          <p className="text-sm text-gray-500 mt-2">Redirection vers le dashboard...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{message}</p>
          <p className="text-sm text-gray-500 mt-2">Redirection vers le dashboard...</p>
        </div>
      )}
    </div>
  );
}