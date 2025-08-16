'use client';

import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, Loader2, Brain, FileText } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { DocumentRejectionModal } from '@/components/DocumentRejectionModal';
import { useDocumentRejection } from '@/hooks/useDocumentRejection';

interface TransactionData {
  id: number;
  date: string;
  description: string;
  originalDesc: string;
  amount: number;
  category: string;
  subcategory: string;
  confidence: number;
  anomalyScore: number;
}

interface DocumentUploadProps {
  // Props pour le mode homepage
  credits?: number;
  onCreditsChange?: (newCredits: number) => void;
  onShowSignUpModal?: () => void;
  onProcessingStart?: () => void;
  onProcessingUpdate?: (step: string) => void;

  // Props pour le mode dashboard
  onDocumentUploaded?: (document: {
    bankDetected?: string;
    aiConfidence?: number;
    totalTransactions?: number;
    anomaliesDetected?: number;
    transactions?: TransactionData[];
    processingTime?: number;
    aiCost?: number;
    [key: string]: unknown;
  }) => void;
  onCreditsDecrement?: () => void;

  // Props communes
  className?: string;
  title?: string;
  description?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  credits,
  onCreditsChange,
  onShowSignUpModal,
  onProcessingStart,
  onProcessingUpdate,
  onDocumentUploaded,
  onCreditsDecrement,
  className = '',
  title = 'Téléverser un relevé bancaire',
  description = 'Notre IA supporte automatiquement toutes les banques.',
}) => {
  const { isSignedIn } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Utiliser le hook de gestion des rejets
  const [rejectionState, rejectionActions] = useDocumentRejection();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile && selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      }
    },
    []
  );

  const processDocument = async () => {
    if (!file) return;

    // Vérification des crédits pour homepage (utilisateurs non connectés)
    if (!isSignedIn && credits !== undefined && credits <= 0) {
      onShowSignUpModal?.();
      return;
    }

    setProcessing(true);
    setProcessingStep('Envoi du document pour analyse IA...');

    // Déclencher le début du processing dans la colonne 2 (homepage uniquement)
    if (!isSignedIn) {
      onProcessingStart?.();
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Choisir l'API selon l'authentification
      const apiEndpoint = isSignedIn
        ? '/api/documents'
        : '/api/validate-document';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Échec du téléversement.' }));

        // Gestion spéciale pour les documents rejetés avec le hook
        if (rejectionActions.handleApiError(errorData)) {
          setProcessing(false);
          setProcessingStep('');
          return; // Ne pas décrémenter les crédits car ils ont été remboursés par l'API
        }

        throw new Error(errorData.error);
      }

      const newDocument = await response.json();

      // Gestion des crédits et callbacks selon le mode
      if (isSignedIn) {
        // Mode dashboard - callback avec le document
        onDocumentUploaded?.(newDocument);
        onCreditsDecrement?.();
      } else {
        // Mode homepage - gestion localStorage et callback
        if (credits !== undefined && onCreditsChange) {
          const newCredits = credits - 1;
          onCreditsChange(newCredits);
          localStorage.setItem('anonymousUserCredits', newCredits.toString());
        }
        // Callback pour homepage aussi
        onDocumentUploaded?.(newDocument);
      }

      // Reset l'état
      setFile(null);
      setProcessing(false);
      setProcessingStep('');
    } catch (error) {
      alert(
        `Une erreur est survenue lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`
      );
      setProcessing(false);
      setProcessingStep('');
    }
  };

  // Déterminer s'il faut montrer les crédits et leur état
  const showCredits = !isSignedIn && credits !== undefined;
  const hasCredits = showCredits ? credits > 0 : true;

  return (
    <>
      <div
        className={`rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur-sm ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
            <Upload className="h-8 w-8 text-white" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>

          {showCredits && (
            <p className="mb-8 text-gray-600">
              Il vous reste{' '}
              <span className="font-bold text-blue-600">{credits}</span> analyse
              {credits > 1 ? 's' : ''} gratuite{credits > 1 ? 's' : ''}.
            </p>
          )}

          {!showCredits && <p className="mb-8 text-gray-600">{description}</p>}

          <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              className="hidden"
              id="documentUpload"
            />
            <label htmlFor="documentUpload" className="block cursor-pointer">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-lg font-medium text-gray-700">
                Cliquez pour sélectionner un document
              </p>
              <p className="text-sm text-gray-500">
                Formats supportés : PDF, JPG, PNG, WebP • Taille max : 10MB
              </p>
            </label>
          </div>

          {file && (
            <div className="mt-6 flex items-center justify-center space-x-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">{file.name}</span>
              <span className="text-sm text-green-600">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          <button
            onClick={() => {
              // Vérification supplémentaire au clic pour UX immédiate
              if (!isSignedIn && credits !== undefined && credits <= 0) {
                onShowSignUpModal?.();
                return;
              }
              processDocument();
            }}
            disabled={!file || processing}
            className={`mt-6 flex w-full transform items-center justify-center space-x-2 rounded-xl px-6 py-4 font-semibold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
              !hasCredits && file
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyse IA en cours...</span>
              </>
            ) : !hasCredits && file ? (
              <>
                <Brain className="h-5 w-5" />
                <span>Se connecter pour plus d&apos;analyses</span>
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                <span>Analyser avec l&apos;IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de rejet de document */}
      {rejectionState.showRejectionModal && rejectionState.rejectionDetails && (
        <DocumentRejectionModal
          isOpen={rejectionState.showRejectionModal}
          onClose={rejectionActions.closeRejection}
          message={rejectionState.rejectionDetails.message}
          documentType={rejectionState.rejectionDetails.documentType}
        />
      )}
    </>
  );
};
