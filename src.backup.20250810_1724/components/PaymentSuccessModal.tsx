'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  amount?: number;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  planName = 'Plan Pro',
  amount,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-8">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône de succès */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Titre */}
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Paiement réussi !
          </h3>

          {/* Message */}
          <p className="mb-6 text-gray-600">
            Merci pour votre achat ! Votre abonnement au{' '}
            <span className="font-semibold text-blue-600">{planName}</span> a
            été activé avec succès.
          </p>

          {/* Détails */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan souscrit :</span>
              <span className="font-semibold">{planName}</span>
            </div>
            {amount && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-gray-600">Montant :</span>
                <span className="font-semibold">{amount}€</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-600">Statut :</span>
              <span className="font-semibold text-green-600">✓ Actif</span>
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700"
          >
            Continuer vers le dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
