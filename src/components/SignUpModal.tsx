// src/components/SignUpModal.tsx
'use client';

import React from 'react';
import { X, Check, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 fade-in-0"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur la modale
      >
        <div className="p-8 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Crédits gratuits épuisés !</h2>
            <p className="text-gray-600 mb-6">
              Passez au niveau supérieur. Créez un compte pour débloquer plus d analyses chaque mois.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>5 crédits gratuits</strong> chaque mois</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Historique de vos analyses sauvegardé</span>
              </li>
               <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Accès aux fonctionnalités avancées</span>
              </li>
            </ul>
          </div>
          
          <Link href="/sign-up">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 group">
              <span>S inscrire gratuitement</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};