'use client';

import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, Loader2, Brain, FileText } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { DocumentRejectionModal } from '@/components/DocumentRejectionModal';

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
  
  // Props pour le mode dashboard
  onDocumentUploaded?: (document: { 
    bankDetected?: string; 
    aiConfidence?: number; 
    totalTransactions?: number; 
    anomaliesDetected?: number;
    transactions?: TransactionData[];
    processingTime?: number;
    aiCost?: number;
    [key: string]: unknown 
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
  onDocumentUploaded,
  onCreditsDecrement,
  className = '',
  title = 'Téléverser un relevé bancaire',
  description = 'Notre IA supporte automatiquement toutes les banques.'
}) => {
  const { isSignedIn } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionDetails, setRejectionDetails] = useState<{message: string; documentType?: string} | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  }, []);

  const processDocument = async () => {
    if (!file) return;

    // Vérification des crédits pour homepage (utilisateurs non connectés)
    if (!isSignedIn && credits !== undefined && credits <= 0) {
      onShowSignUpModal?.();
      return;
    }

    setProcessing(true);
    setProcessingStep('Envoi du document pour analyse IA...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Choisir l'API selon l'authentification
      const apiEndpoint = isSignedIn ? '/api/documents' : '/api/validate-document';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Échec du téléversement.' }));
        
        // Gestion spéciale pour les documents rejetés
        if (errorData.error === 'DOCUMENT_REJECTED') {
          setRejectionDetails({
            message: errorData.message,
            documentType: errorData.documentType
          });
          setShowRejectionModal(true);
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
      alert(`Une erreur est survenue lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`);
      setProcessing(false);
      setProcessingStep('');
    }
  };

  // Déterminer s'il faut montrer les crédits et leur état
  const showCredits = !isSignedIn && credits !== undefined;
  const hasCredits = showCredits ? credits > 0 : true;

  return (
    <>
      <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 ${className}`}>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          
          {showCredits && (
            <p className="text-gray-600 mb-8">
              Il vous reste <span className="font-bold text-blue-600">{credits}</span> analyse{credits > 1 ? 's' : ''} gratuite{credits > 1 ? 's' : ''}.
            </p>
          )}
          
          {!showCredits && (
            <p className="text-gray-600 mb-8">{description}</p>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
            <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png,.webp" 
              onChange={handleFileUpload} 
              className="hidden" 
              id="documentUpload" 
            />
            <label htmlFor="documentUpload" className="cursor-pointer block">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Cliquez pour sélectionner un document</p>
              <p className="text-sm text-gray-500">Formats supportés : PDF, JPG, PNG, WebP • Taille max : 10MB</p>
            </label>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">{file.name}</span>
              <span className="text-green-600 text-sm">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
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
            className={`mt-6 w-full font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
              !hasCredits && file ? 
                'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700' : 
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyse IA en cours...</span>
              </>
            ) : (!hasCredits && file) ? (
              <>
                <Brain className="w-5 h-5" />
                <span>Se connecter pour plus d&apos;analyses</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Analyser avec l&apos;IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {processing && (
        <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gray-900">Analyse IA en cours...</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{processingStep}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rejet de document */}
      {showRejectionModal && rejectionDetails && (
        <DocumentRejectionModal
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          message={rejectionDetails.message}
          documentType={rejectionDetails.documentType}
        />
      )}
    </>
  );
};