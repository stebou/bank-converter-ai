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
  planName = "Plan Pro",
  amount 
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône de succès */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Titre */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement réussi !
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Merci pour votre achat ! Votre abonnement au{' '}
            <span className="font-semibold text-blue-600">{planName}</span> a été activé avec succès.
          </p>

          {/* Détails */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan souscrit :</span>
              <span className="font-semibold">{planName}</span>
            </div>
            {amount && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Montant :</span>
                <span className="font-semibold">{amount}€</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Statut :</span>
              <span className="text-green-600 font-semibold">✓ Actif</span>
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Continuer vers le dashboard
          </button>
        </div>
      </div>
    </div>
  );
}