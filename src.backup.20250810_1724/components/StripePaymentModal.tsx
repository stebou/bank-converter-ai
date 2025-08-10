'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Charger Stripe avec votre clé publique
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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
const PaymentForm: React.FC<PaymentFormProps> = ({
  plan,
  onSuccess,
  onError,
}) => {
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
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

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
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors du paiement';
      setPaymentError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations du plan */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-white">{plan.name}</h3>
        <p className="mb-3 text-sm text-gray-300">{plan.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">{plan.price}€</span>
          <span className="text-sm text-gray-300">
            {plan.documentsLimit} crédits
          </span>
        </div>
      </div>

      {/* Formulaire de carte */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-200">
          Informations de carte bancaire
        </label>
        <div className="rounded-xl border border-white/20 bg-white/5 p-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Erreur de paiement */}
      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-red-300"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{paymentError}</span>
        </motion.div>
      )}

      {/* Fonctionnalités incluses */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-200">
          Inclus dans ce plan :
        </h4>
        <ul className="space-y-1">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-gray-300"
            >
              <CheckCircle className="h-3 w-3 text-green-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton de paiement */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Payer {plan.price}€
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Paiement sécurisé par Stripe. Vos données de carte ne sont pas stockées
        sur nos serveurs.
      </p>
    </form>
  );
};

// Composant principal de la modal
const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess,
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <CreditCard className="h-5 w-5" />
                Finaliser l&apos;achat
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Paiement réussi !
                  </h3>
                  <p className="text-gray-300">
                    Votre plan a été activé avec succès.
                  </p>
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
