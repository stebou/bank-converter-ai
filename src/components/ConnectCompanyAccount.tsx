'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Building2, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ConnectCompanyAccountProps {
  onSuccess?: () => void;
  className?: string;
}

export default function ConnectCompanyAccount({ onSuccess, className = '' }: ConnectCompanyAccountProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setStatus('connecting');
    setErrorMessage(null);

    try {
      // Au lieu de rediriger vers Bridge Connect, 
      // on peut directement synchroniser les données de test
      const syncResponse = await fetch('/api/bridge/sync', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        console.log('[CONNECT_COMPANY] Données synchronisées:', syncData);
        
        setStatus('success');
        
        // Appeler le callback si fourni
        if (onSuccess) {
          onSuccess();
        }
        
        // Rediriger vers le dashboard
        setTimeout(() => {
          window.location.href = '/dashboard?connected=true';
        }, 1500);
      } else {
        throw new Error('Erreur lors de la synchronisation');
      }

    } catch (err) {
      console.error('[CONNECT_COMPANY] Erreur:', err);
      setStatus('error');
      setErrorMessage('Erreur lors de la connexion du compte. Veuillez réessayer.');
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'connecting':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Connexion en cours...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-5 w-5" />
            Compte connecté
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-5 w-5" />
            Réessayer
          </>
        );
      default:
        return (
          <>
            <Building2 className="h-5 w-5" />
            Connecter le compte de ma société
          </>
        );
    }
  };

  const getButtonStyle = () => {
    switch (status) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <motion.button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`flex items-center gap-3 px-6 py-4 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
        whileHover={{ scale: status !== 'connecting' ? 1.02 : 1 }}
        whileTap={{ scale: status !== 'connecting' ? 0.98 : 1 }}
      >
        {getButtonContent()}
      </motion.button>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600">{errorMessage}</p>
          <p className="text-xs text-red-500 mt-1">
            En mode démo, cette fonctionnalité simule la connexion d'un compte.
          </p>
        </motion.div>
      )}

      <div className="text-sm text-[#7f8c8d]">
        <p>🔒 Connexion sécurisée via Bridge API</p>
        <p>• Synchronisation automatique des transactions</p>
        <p>• Données chiffrées et conformes RGPD</p>
        <p>• Compatible avec +300 banques françaises</p>
      </div>
    </div>
  );
}
