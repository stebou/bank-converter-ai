// Hook personnalisé pour gérer la logique de rejet de documents
import { useState } from 'react';

export interface RejectionDetails {
  message: string;
  documentType?: string;
}

export interface DocumentRejectionState {
  showRejectionModal: boolean;
  rejectionDetails: RejectionDetails | null;
}

export interface DocumentRejectionActions {
  setRejectionDetails: (details: RejectionDetails) => void;
  showRejection: (message: string, documentType?: string) => void;
  closeRejection: () => void;
  handleApiError: (errorData: any) => boolean; // Retourne true si c'est un rejet de document
}

/**
 * Hook pour gérer la logique de rejet de documents de manière unifiée
 */
export function useDocumentRejection(): [
  DocumentRejectionState,
  DocumentRejectionActions
] {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionDetails, setRejectionDetailsState] = useState<RejectionDetails | null>(null);

  const setRejectionDetails = (details: RejectionDetails) => {
    setRejectionDetailsState(details);
    setShowRejectionModal(true);
  };

  const showRejection = (message: string, documentType?: string) => {
    setRejectionDetails({ message, documentType });
  };

  const closeRejection = () => {
    setShowRejectionModal(false);
    setRejectionDetailsState(null);
  };

  const handleApiError = (errorData: any): boolean => {
    // Vérifie si c'est une erreur de document rejeté
    if (errorData.error === 'DOCUMENT_REJECTED') {
      setRejectionDetails({
        message: errorData.message,
        documentType: errorData.documentType,
      });
      return true; // Indique que l'erreur a été gérée
    }
    return false; // Indique que ce n'est pas un rejet de document
  };

  const state: DocumentRejectionState = {
    showRejectionModal,
    rejectionDetails,
  };

  const actions: DocumentRejectionActions = {
    setRejectionDetails,
    showRejection,
    closeRejection,
    handleApiError,
  };

  return [state, actions];
}