// src/components/DocumentRejectionModal.tsx
'use client';

import React from 'react';
import { X, AlertTriangle, FileText, CreditCard, Receipt } from 'lucide-react';

type DocumentRejectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  documentType?: string;
};

export const DocumentRejectionModal = ({ isOpen, onClose, message, documentType }: DocumentRejectionModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Document non valide</h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Documents acceptés :</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>Relevés bancaires</strong> (tous formats)</span>
              </li>
              <li className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>Factures</strong> (électricité, téléphone, etc.)</span>
              </li>
              <li className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>Documents financiers</strong> (épargne, prêts)</span>
              </li>
            </ul>
          </div>

          {documentType && documentType !== 'autre' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-orange-800">
                <strong>Type détecté :</strong> {documentType}
              </p>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Compris, réessayer</span>
          </button>
        </div>
      </div>
    </div>
  );
};