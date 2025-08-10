// Fichier : src/components/CookieBanner.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, CheckCircle, X } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          {/* Container principal avec design professionnel */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {/* Bouton de fermeture */}
            <button
              onClick={handleDecline}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header avec icône */}
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-600 p-3 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Respect de votre vie privée
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Sécurisé & Transparent</span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Nous utilisons des cookies essentiels pour optimiser votre
                expérience sur{' '}
                <span className="font-medium text-blue-600">Bank-IA</span>. Pour
                en savoir plus, consultez notre{' '}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-blue-600 underline decoration-blue-600/50 transition-colors hover:text-blue-700 hover:decoration-blue-700"
                >
                  politique de confidentialité
                </Link>
                .
              </p>

              {/* Boutons d'action */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDecline}
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-200"
                >
                  Refuser
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAccept}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accepter
                </motion.button>
              </div>

              {/* Footer info */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Cookie className="h-3 w-3" />
                  <span>Cookies essentiels uniquement</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
