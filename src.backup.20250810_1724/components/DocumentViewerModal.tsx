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

const DocumentViewerModal = ({
  isOpen,
  document,
  onClose,
}: DocumentViewerModalProps) => {
  const [documentContent, setDocumentContent] =
    useState<DocumentContent | null>(null);
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
      console.log(
        '[DOCUMENT_VIEWER] Loading content for document:',
        documentId
      );
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('[DOCUMENT_VIEWER] Document content loaded:', data);
        setDocumentContent({
          extractedText: data.extractedText || 'Contenu non disponible',
          transactions: data.transactions || [],
        });
      } else {
        console.error(
          '[DOCUMENT_VIEWER] Failed to load document content:',
          response.status
        );
        setDocumentContent({
          extractedText: 'Erreur lors du chargement du document',
          transactions: [],
        });
      }
    } catch (error) {
      console.error('[DOCUMENT_VIEWER] Error loading document content:', error);
      setDocumentContent({
        extractedText: 'Erreur lors du chargement du document',
        transactions: [],
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header de la popup */}
          <div className="flex items-center justify-between border-b border-[#bdc3c7] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#2c3e50] p-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
                  {document.originalName}
                </h3>
                <p className="font-open-sans text-sm text-[#34495e]">
                  {document.bankDetected && `${document.bankDetected} • `}
                  {document.totalTransactions &&
                    `${document.totalTransactions} transactions • `}
                  {document.aiConfidence &&
                    `${document.aiConfidence}% confiance`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 transition-colors hover:bg-white"
            >
              <X className="h-6 w-6 text-[#34495e] hover:text-[#2c3e50]" />
            </button>
          </div>

          {/* Contenu de la popup */}
          <div className="flex h-[calc(90vh-140px)] flex-col">
            {isLoadingDocument ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2c3e50]" />
                <span className="font-open-sans ml-3 text-[#34495e]">
                  Chargement du document...
                </span>
              </div>
            ) : (
              <>
                {/* Onglets */}
                <div className="flex border-b border-[#bdc3c7] px-6">
                  <button
                    onClick={() => setActiveTab('pdf')}
                    className={`font-open-sans border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'pdf'
                        ? 'border-[#2c3e50] text-[#2c3e50]'
                        : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                    }`}
                  >
                    PDF Original
                  </button>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`font-open-sans border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
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
                        className="h-full w-full rounded-xl border border-[#bdc3c7]"
                        title={`PDF - ${document.originalName}`}
                      />
                    </div>
                  )}

                  {activeTab === 'transactions' && documentContent && (
                    <div className="h-full overflow-y-auto p-6">
                      {documentContent.transactions.length > 0 ? (
                        <div className="space-y-2">
                          {documentContent.transactions.map(
                            (transaction, index) => (
                              <div
                                key={transaction.id || index}
                                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors hover:bg-[#bdc3c7]"
                              >
                                <div className="flex-1">
                                  <p className="font-open-sans text-sm font-medium text-[#2c3e50]">
                                    {transaction.description}
                                  </p>
                                  <p className="font-ibm-plex-mono text-xs tracking-wider text-[#34495e]">
                                    {new Date(
                                      transaction.date
                                    ).toLocaleDateString('fr-FR')}
                                    {transaction.category &&
                                      ` • ${transaction.category}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`font-montserrat text-sm font-semibold ${
                                      transaction.amount >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}
                                  >
                                    {transaction.amount >= 0 ? '+' : ''}
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'EUR',
                                      minimumFractionDigits: 2,
                                    }).format(Math.abs(transaction.amount))}
                                  </p>
                                  {transaction.aiConfidence && (
                                    <p className="font-ibm-plex-mono text-xs tracking-wider text-[#34495e]">
                                      {transaction.aiConfidence}% confiance
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <FileText className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
                          <h4 className="font-montserrat mb-2 text-lg font-semibold tracking-tight text-[#2c3e50]">
                            Aucune transaction trouvée
                          </h4>
                          <p className="font-open-sans text-[#34495e]">
                            Ce document ne contient pas de transactions
                            analysées.
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
