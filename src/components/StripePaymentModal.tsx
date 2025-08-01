'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Charger Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Styles pour CardElement
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#9ca3af',
      },
      backgroundColor: 'transparent',
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

// Types
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  documentsLimit: number;
  features: string[];
};

type StripePaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onSuccess: () => void;
};

type PaymentFormProps = {
  plan: Plan;
  onSuccess: () => void;
  onError: (error: string) => void;
};

// Composant formulaire de paiement
const PaymentForm: React.FC<PaymentFormProps> = ({ plan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Erreur lors du chargement du formulaire de paiement');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Créer le payment intent côté serveur
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: Math.round(plan.price * 100), // Convertir en centimes
        }),
      });

      const { clientSecret, error: serverError } = await response.json();

      if (serverError) {
        throw new Error(serverError);
      }

      // 2. Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Erreur de paiement');
      }

      if (paymentIntent?.status === 'succeeded') {
        // 3. Mettre à jour les données utilisateur côté serveur
        await fetch('/api/stripe/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            planId: plan.id,
          }),
        });

        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du paiement';
      setPaymentError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations du plan */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-300 text-sm mb-3">{plan.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-white">{plan.price}€</span>
          <span className="text-sm text-gray-300">{plan.documentsLimit} crédits</span>
        </div>
      </div>

      {/* Formulaire de carte */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-200 block">
          Informations de carte bancaire
        </label>
        <div className="p-4 bg-white/5 border border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Erreur de paiement */}
      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{paymentError}</span>
        </motion.div>
      )}

      {/* Fonctionnalités incluses */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-200">Inclus dans ce plan :</h4>
        <ul className="space-y-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-3 h-3 text-green-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton de paiement */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Payer {plan.price}€
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Paiement sécurisé par Stripe. Vos données de carte ne sont pas stockées sur nos serveurs.
      </p>
    </form>
  );
};

// Composant principal de la modal
const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setIsSuccess(false);
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Finaliser l&apos;achat
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Paiement réussi !</h3>
                  <p className="text-gray-300">Votre plan a été activé avec succès.</p>
                </motion.div>
              ) : (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    plan={plan}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </Elements>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StripePaymentModal;