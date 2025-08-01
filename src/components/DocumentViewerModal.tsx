'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Loader2 } from 'lucide-react';
import '../styles/fonts.css';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category?: string;
  aiConfidence?: number;
}

interface DocumentContent {
  extractedText: string;
  transactions: Transaction[];
}

interface Document {
  id: string;
  filename: string;
  originalName: string;
  createdAt: string;
  bankDetected?: string;
  totalTransactions?: number;
  aiConfidence?: number;
  status: string;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
}

const DocumentViewerModal = ({ isOpen, document, onClose }: DocumentViewerModalProps) => {
  const [documentContent, setDocumentContent] = useState<DocumentContent | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [activeTab, setActiveTab] = useState<'pdf' | 'transactions'>('pdf');

  // Charger le contenu du document à chaque fois qu'un nouveau document est sélectionné
  useEffect(() => {
    if (document && isOpen) {
      loadDocumentContent(document.id);
    }
  }, [document, isOpen]);

  // Réinitialiser l'onglet actif quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setActiveTab('pdf');
    }
  }, [isOpen]);

  const loadDocumentContent = async (documentId: string) => {
    setIsLoadingDocument(true);
    try {
      console.log('[DOCUMENT_VIEWER] Loading content for document:', documentId);
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('[DOCUMENT_VIEWER] Document content loaded:', data);
        setDocumentContent({
          extractedText: data.extractedText || 'Contenu non disponible',
          transactions: data.transactions || []
        });
      } else {
        console.error('[DOCUMENT_VIEWER] Failed to load document content:', response.status);
        setDocumentContent({
          extractedText: 'Erreur lors du chargement du document',
          transactions: []
        });
      }
    } catch (error) {
      console.error('[DOCUMENT_VIEWER] Error loading document content:', error);
      setDocumentContent({
        extractedText: 'Erreur lors du chargement du document',
        transactions: []
      });
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleClose = () => {
    setDocumentContent(null);
    setActiveTab('pdf');
    onClose();
  };

  if (!isOpen || !document) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#ecf0f1] border border-[#bdc3c7] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header de la popup */}
          <div className="p-6 border-b border-[#bdc3c7] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2c3e50] rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat tracking-tight">
                  {document.originalName}
                </h3>
                <p className="text-sm text-[#34495e] font-open-sans">
                  {document.bankDetected && `${document.bankDetected} • `}
                  {document.totalTransactions && `${document.totalTransactions} transactions • `}
                  {document.aiConfidence && `${document.aiConfidence}% confiance`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-[#34495e] hover:text-[#2c3e50]" />
            </button>
          </div>

          {/* Contenu de la popup */}
          <div className="flex flex-col h-[calc(90vh-140px)]">
            {isLoadingDocument ? (
              <div className="flex items-center justify-center flex-1">
                <Loader2 className="w-8 h-8 animate-spin text-[#2c3e50]" />
                <span className="ml-3 text-[#34495e] font-open-sans">Chargement du document...</span>
              </div>
            ) : (
              <>
                {/* Onglets */}
                <div className="flex border-b border-[#bdc3c7] px-6">
                  <button
                    onClick={() => setActiveTab('pdf')}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors font-open-sans ${
                      activeTab === 'pdf'
                        ? 'border-[#2c3e50] text-[#2c3e50]'
                        : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                    }`}
                  >
                    PDF Original
                  </button>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors font-open-sans ${
                      activeTab === 'transactions'
                        ? 'border-[#2c3e50] text-[#2c3e50]'
                        : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                    }`}
                  >
                    Transactions ({documentContent?.transactions.length || 0})
                  </button>
                </div>

                {/* Contenu des onglets */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'pdf' && (
                    <div className="h-full p-6">
                      <iframe
                        src={`/api/documents/${document.id}/pdf`}
                        className="w-full h-full rounded-xl border border-[#bdc3c7]"
                        title={`PDF - ${document.originalName}`}
                      />
                    </div>
                  )}

                  {activeTab === 'transactions' && documentContent && (
                    <div className="h-full p-6 overflow-y-auto">
                      {documentContent.transactions.length > 0 ? (
                        <div className="space-y-2">
                          {documentContent.transactions.map((transaction, index) => (
                            <div
                              key={transaction.id || index}
                              className="flex items-center justify-between py-3 px-4 bg-white rounded-lg hover:bg-[#bdc3c7] transition-colors"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#2c3e50] font-open-sans">
                                  {transaction.description}
                                </p>
                                <p className="text-xs text-[#34495e] font-ibm-plex-mono tracking-wider">
                                  {new Date(transaction.date).toLocaleDateString('fr-FR')}
                                  {transaction.category && ` • ${transaction.category}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-semibold font-montserrat ${
                                  transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.amount >= 0 ? '+' : ''}
                                  {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 2,
                                  }).format(Math.abs(transaction.amount))}
                                </p>
                                {transaction.aiConfidence && (
                                  <p className="text-xs text-[#34495e] font-ibm-plex-mono tracking-wider">
                                    {transaction.aiConfidence}% confiance
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-[#bdc3c7] mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-[#2c3e50] mb-2 font-montserrat tracking-tight">
                            Aucune transaction trouvée
                          </h4>
                          <p className="text-[#34495e] font-open-sans">
                            Ce document ne contient pas de transactions analysées.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentViewerModal;