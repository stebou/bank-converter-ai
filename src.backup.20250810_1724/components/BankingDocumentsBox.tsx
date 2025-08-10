'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Building2,
  Loader2,
  AlertCircle,
  TrendingUp,
  Trash2,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import DocumentViewerModal from './DocumentViewerModal';
import '../styles/fonts.css';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  status: string;
  createdAt: string;
  bankDetected?: string;
  totalTransactions?: number;
  aiConfidence?: number;
  fileSize: number;
}

interface BankingDocumentsBoxProps {
  onViewAnalysis?: (document: Document) => void;
}

// Modal de confirmation de suppression
const DeleteConfirmationModal = ({
  isOpen,
  document,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  isOpen: boolean;
  document: Document | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) => {
  if (!isOpen || !document) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-red-600 p-2">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-montserrat text-lg font-bold text-[#2c3e50]">
              Supprimer le document
            </h3>
            <p className="font-open-sans text-sm text-[#34495e]">
              Cette action est irréversible
            </p>
          </div>
        </div>

        {/* Document info */}
        <div className="mb-4 rounded-xl bg-[#ecf0f1] p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#2c3e50]" />
            <div>
              <p className="font-montserrat font-medium text-[#2c3e50]">
                {document.originalName}
              </p>
              <p className="font-open-sans text-sm text-[#34495e]">
                {document.bankDetected} • {document.totalTransactions}{' '}
                transactions
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-3">
          <p className="font-open-sans text-sm text-orange-800">
            ⚠️ Ce document et toutes ses données d'analyse seront définitivement
            supprimés.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="font-open-sans flex-1 rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-open-sans flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BankingDocumentsBox = ({
  onViewAnalysis,
}: BankingDocumentsBoxProps = {}) => {
  const { user } = useUser();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedDocumentForViewer, setSelectedDocumentForViewer] =
    useState<Document | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchDocuments();
    }
  }, [user?.id]);

  const fetchDocuments = async () => {
    try {
      console.log('[BANKING_DOCS] Fetching documents for user:', user?.id);
      const response = await fetch('/api/documents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies Clerk
      });

      console.log('[BANKING_DOCS] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[BANKING_DOCS] Received data:', data);

        // L'API retourne directement un array de documents
        const allDocuments = Array.isArray(data) ? data : [];

        // Filtrer seulement les documents liés aux finances/banque
        const bankingDocs = allDocuments.filter(
          (doc: Document) =>
            doc.status.toLowerCase() === 'completed' && doc.bankDetected
        );

        console.log(
          '[BANKING_DOCS] Filtered banking docs:',
          bankingDocs.length
        );
        setDocuments(bankingDocs.slice(0, 5)); // Limiter à 5 documents
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Erreur inconnue' }));
        console.error('[BANKING_DOCS] API Error:', response.status, errorData);
        setError(
          `Erreur ${response.status}: ${errorData.error || 'Chargement impossible'}`
        );
      }
    } catch (err) {
      console.error('[BANKING_DOCS] Fetch error:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleView = (document: Document) => {
    setSelectedDocumentForViewer(document);
    setShowViewerModal(true);
  };

  // Fonction pour ouvrir la popup de suppression
  const handleDeleteClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  // Fonction pour confirmer la suppression
  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/documents/${documentToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Supprimer de la liste locale
        setDocuments(prev =>
          prev.filter(doc => doc.id !== documentToDelete.id)
        );
        console.log(
          '[BANKING_DOCS] Document deleted successfully:',
          documentToDelete.id
        );
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      } else {
        const errorData = await response.json();
        setError(
          `Erreur lors de la suppression: ${errorData.error || 'Erreur inconnue'}`
        );
      }
    } catch (error) {
      console.error('[BANKING_DOCS] Error deleting document:', error);
      setError('Erreur de connexion lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour annuler la suppression
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2c3e50]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
        <div className="flex h-64 items-center justify-center text-center">
          <div>
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <p className="font-open-sans text-[#34495e]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex h-full flex-col rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#2c3e50] p-2">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-montserrat text-lg font-semibold tracking-tight text-[#2c3e50]">
            Documents Financiers
          </h3>
          <p className="font-open-sans text-sm text-[#34495e]">
            Relevés bancaires analysés
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {documents.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center py-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
            <h4 className="font-montserrat mb-2 font-semibold text-[#2c3e50]">
              Aucun document financier
            </h4>
            <p className="font-open-sans text-sm text-[#34495e]">
              Uploadez vos relevés bancaires pour commencer l'analyse
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-transparent bg-[#ecf0f1] p-4 transition-colors hover:border-[#bdc3c7] hover:bg-white"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2c3e50]">
                    <FileText className="h-5 w-5 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-montserrat truncate font-medium text-[#2c3e50]">
                      {doc.originalName}
                    </p>
                    <div className="font-open-sans flex items-center gap-4 text-xs text-[#34495e]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(doc.createdAt)}
                      </span>
                      {doc.bankDetected && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {doc.bankDetected}
                        </span>
                      )}
                      {doc.totalTransactions && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {doc.totalTransactions} trans.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() => onViewAnalysis?.(doc)}
                    className="rounded-lg p-2 text-[#34495e] transition-colors hover:bg-white hover:text-[#2c3e50]"
                    title="Voir l'analyse IA"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleView(doc)}
                    className="rounded-lg p-2 text-[#34495e] transition-colors hover:bg-white hover:text-[#2c3e50]"
                    title="Voir le document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc.id, doc.originalName)}
                    className="rounded-lg p-2 text-[#34495e] transition-colors hover:bg-white hover:text-[#2c3e50]"
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={e => handleDeleteClick(doc, e)}
                    className="rounded-lg p-2 text-[#34495e] transition-colors hover:bg-white hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex-shrink-0 border-t border-[#bdc3c7] pt-4">
        {documents.length > 0 ? (
          <button className="font-open-sans w-full text-center text-sm font-medium text-[#2c3e50] transition-colors hover:text-[#34495e]">
            Voir tous les documents →
          </button>
        ) : (
          <button
            onClick={() => {
              setLoading(true);
              fetchDocuments();
            }}
            className="font-open-sans w-full text-center text-sm font-medium text-[#2c3e50] transition-colors hover:text-[#34495e]"
          >
            🔄 Actualiser
          </button>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        document={documentToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />

      {/* Modal de visualisation de document */}
      <DocumentViewerModal
        isOpen={showViewerModal}
        document={selectedDocumentForViewer}
        onClose={() => {
          setShowViewerModal(false);
          setSelectedDocumentForViewer(null);
        }}
      />
    </motion.div>
  );
};

export default BankingDocumentsBox;
