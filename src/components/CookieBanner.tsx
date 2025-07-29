// Fichier : src/components/CookieBanner.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

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

  if (!isVisible) {
    return null;
  }

  return (
    // --- Modifications pour le Glassmorphism ---
    // Ajout de : bg-white/60 backdrop-blur-xl border-white/30
    <div className="fixed bottom-4 right-4 z-50 max-w-md p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 animate-fade-in-up">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-3 bg-white/50 rounded-full">
          {/* L'icône reprend les couleurs du site */}
          <Cookie className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Votre vie privée nous importe
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Nous utilisons des cookies pour optimiser votre expérience sur notre site. Pour en savoir plus, consultez notre{' '}
            <Link href="/privacy-policy" className="underline text-blue-600 hover:text-blue-700 font-medium">
              politique de confidentialité
            </Link>.
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end space-x-3">
        {/* Bouton de refus avec un style plus léger */}
        <button
          onClick={handleDecline}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 bg-white/40 hover:bg-white/60 transition-colors"
        >
          Refuser
        </button>
        {/* Bouton Accepter avec le dégradé du site */}
        <button
          onClick={handleAccept}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Accepter
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
