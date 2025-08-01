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
  Sparkles
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
  isDeleting 
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-6 relative overflow-hidden shadow-2xl border border-[#bdc3c7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-600 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-montserrat text-[#2c3e50]">
              Supprimer le document
            </h3>
            <p className="text-sm text-[#34495e] font-open-sans">
              Cette action est irréversible
            </p>
          </div>
        </div>

        {/* Document info */}
        <div className="bg-[#ecf0f1] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#2c3e50]" />
            <div>
              <p className="font-medium font-montserrat text-[#2c3e50]">
                {document.originalName}
              </p>
              <p className="text-sm text-[#34495e] font-open-sans">
                {document.bankDetected} • {document.totalTransactions} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-6">
          <p className="text-sm text-orange-800 font-open-sans">
            ⚠️ Ce document et toutes ses données d'analyse seront définitivement supprimés.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium font-open-sans py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium font-open-sans py-2 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BankingDocumentsBox = ({ onViewAnalysis }: BankingDocumentsBoxProps = {}) => {
  const { user } = useUser();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedDocumentForViewer, setSelectedDocumentForViewer] = useState<Document | null>(null);

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
        const bankingDocs = allDocuments.filter((doc: Document) => 
          doc.status.toLowerCase() === 'completed' && doc.bankDetected
        );
        
        console.log('[BANKING_DOCS] Filtered banking docs:', bankingDocs.length);
        setDocuments(bankingDocs.slice(0, 5)); // Limiter à 5 documents
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('[BANKING_DOCS] API Error:', response.status, errorData);
        setError(`Erreur ${response.status}: ${errorData.error || 'Chargement impossible'}`);
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
      year: 'numeric'
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
        setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
        console.log('[BANKING_DOCS] Document deleted successfully:', documentToDelete.id);
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      } else {
        const errorData = await response.json();
        setError(`Erreur lors de la suppression: ${errorData.error || 'Erreur inconnue'}`);
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
      <div className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#2c3e50]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-[#34495e] font-open-sans">{error}</p>
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
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#2c3e50] rounded-xl">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold font-montserrat tracking-tight text-[#2c3e50]">
            Documents Financiers
          </h3>
          <p className="text-sm text-[#34495e] font-open-sans">
            Relevés bancaires analysés
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {documents.length === 0 ? (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <FileText className="w-12 h-12 text-[#bdc3c7] mx-auto mb-4" />
            <h4 className="text-[#2c3e50] font-semibold font-montserrat mb-2">
              Aucun document financier
            </h4>
            <p className="text-sm text-[#34495e] font-open-sans">
              Uploadez vos relevés bancaires pour commencer l'analyse
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-[#ecf0f1] rounded-xl hover:bg-white transition-colors border border-transparent hover:border-[#bdc3c7]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-[#2c3e50] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium font-montserrat text-[#2c3e50] truncate">
                    {doc.originalName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#34495e] font-open-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(doc.createdAt)}
                    </span>
                    {doc.bankDetected && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {doc.bankDetected}
                      </span>
                    )}
                    {doc.totalTransactions && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {doc.totalTransactions} trans.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onViewAnalysis?.(doc)}
                  className="p-2 text-[#34495e] hover:text-[#2c3e50] hover:bg-white rounded-lg transition-colors"
                  title="Voir l'analyse IA"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleView(doc)}
                  className="p-2 text-[#34495e] hover:text-[#2c3e50] hover:bg-white rounded-lg transition-colors"
                  title="Voir le document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(doc.id, doc.originalName)}
                  className="p-2 text-[#34495e] hover:text-[#2c3e50] hover:bg-white rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(doc, e)}
                  className="p-2 text-[#34495e] hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#bdc3c7] flex-shrink-0">
        {documents.length > 0 ? (
          <button className="w-full text-center text-sm font-medium font-open-sans text-[#2c3e50] hover:text-[#34495e] transition-colors">
            Voir tous les documents →
          </button>
        ) : (
          <button 
            onClick={() => {
              setLoading(true);
              fetchDocuments();
            }}
            className="w-full text-center text-sm font-medium font-open-sans text-[#2c3e50] hover:text-[#34495e] transition-colors"
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