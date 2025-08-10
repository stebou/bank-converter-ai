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

export const DocumentRejectionModal = ({
  isOpen,
  onClose,
  message,
  documentType,
}: DocumentRejectionModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md scale-95 transform animate-fade-in-scale rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-300 ease-out"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Document non valide
            </h2>
            <p className="mb-6 text-gray-600">{message}</p>
          </div>

          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Documents acceptés :
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 flex-shrink-0 text-blue-500" />
                <span className="text-gray-700">
                  <strong>Relevés bancaires</strong> (tous formats)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Receipt className="h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-gray-700">
                  <strong>Factures</strong> (électricité, téléphone, etc.)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FileText className="h-5 w-5 flex-shrink-0 text-purple-500" />
                <span className="text-gray-700">
                  <strong>Documents financiers</strong> (épargne, prêts)
                </span>
              </li>
            </ul>
          </div>

          {documentType && documentType !== 'autre' && (
            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm text-orange-800">
                <strong>Type détecté :</strong> {documentType}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-gray-700 hover:to-gray-800"
          >
            <span>Compris, réessayer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
