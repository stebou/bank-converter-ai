'use client';

import { useState } from 'react';
import BankingDocumentUpload from '@/components/BankingDocumentUpload';
import BankingDocumentsBox from '@/components/BankingDocumentsBox';
import DocumentAnalysisModal from '@/components/DocumentAnalysisModal';

interface ComptabiliteClientProps {
  userName: string;
  showDocumentsList?: boolean;
}

export default function ComptabiliteClient({ userName, showDocumentsList = false }: ComptabiliteClientProps) {
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const handleDocumentUploaded = (document: any) => {
    console.log('Document uploaded in comptabilité:', document);
    // Ouvrir automatiquement l'analyse pour la comptabilité
    setSelectedDocument(document);
    setShowAnalysisModal(true);
  };

  const handleDocumentAnalysis = (document: any) => {
    setSelectedDocument(document);
    setShowAnalysisModal(true);
  };

  if (showDocumentsList) {
    // Mode liste complète des documents
    return (
      <BankingDocumentsBox
        onViewAnalysis={handleDocumentAnalysis}
      />
    );
  }

  // Mode upload uniquement
  return (
    <>
      <div className="space-y-6">
        <BankingDocumentUpload
          onDocumentUploaded={handleDocumentUploaded}
        />
      </div>

      {/* Modal d'analyse réutilisée */}
      {showAnalysisModal && selectedDocument && (
        <DocumentAnalysisModal
          isOpen={showAnalysisModal}
          onClose={() => {
            setShowAnalysisModal(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
        />
      )}
    </>
  );
}