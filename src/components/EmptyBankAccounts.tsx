'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2, Check, CreditCard, Shield } from 'lucide-react';
import BridgeConnectOfficial from './BridgeConnectOfficial';

interface EmptyBankAccountsProps {
  onAccountConnected?: () => void;
}

export default function EmptyBankAccounts({
  onAccountConnected,
}: EmptyBankAccountsProps) {
  const handleConnectSuccess = async (data: any) => {
    console.log('[EmptyBankAccounts] Connexion réussie:', data);
    
    // Attendre un moment pour que la synchronisation se termine
    setTimeout(() => {
      if (onAccountConnected) {
        onAccountConnected();
      }
    }, 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-12 text-center"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
          <Building2 className="h-12 w-12 text-blue-600" />
        </div>

        {/* Title & Description */}
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          Connectez votre premier compte bancaire
        </h2>
        <p className="mx-auto mb-8 max-w-md text-gray-600">
          Commencez à analyser vos finances en connectant votre banque. C'est
          sécurisé, rapide et conforme aux normes PSD2.
        </p>

        {/* Features */}
        <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">100% Sécurisé</h3>
            <p className="text-sm text-gray-600">
              Connexion chiffrée directement avec votre banque
            </p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">Automatique</h3>
            <p className="text-sm text-gray-600">
              Synchronisation en temps réel de vos comptes
            </p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Check className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">300+ Banques</h3>
            <p className="text-sm text-gray-600">
              Compatible avec toutes les banques françaises
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <BridgeConnectOfficial
          onSuccess={handleConnectSuccess}
          onError={(error) => {
            console.error('Erreur Bridge Connect:', error);
            // Optionnel : afficher une notification d'erreur
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 transition-colors"
        >
          <CreditCard className="h-5 w-5" />
          Connecter ma banque
          <ArrowRight className="h-5 w-5" />
        </BridgeConnectOfficial>

        {/* Trust indicators */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="mb-4 text-xs text-gray-500">
            Nous utilisons Bridge, certifié ACPR et conforme PSD2
          </p>
          <div className="flex items-center justify-center space-x-6 opacity-60">
            <div className="text-xs font-medium text-gray-400">ACPR</div>
            <div className="text-xs font-medium text-gray-400">PSD2</div>
            <div className="text-xs font-medium text-gray-400">GDPR</div>
            <div className="text-xs font-medium text-gray-400">ISO 27001</div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
