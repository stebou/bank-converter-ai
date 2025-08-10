'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Download } from 'lucide-react';
import type { DocumentType } from '@/types';

// Interface pour les transactions
interface TransactionData {
  id: string;
  date: Date;
  amount: number;
  description: string;
  originalDesc: string;
  category: string | null;
  subcategory: string | null;
  aiConfidence: number | null;
  anomalyScore: number | null;
}

interface DocumentAnalysisModalProps {
  isOpen: boolean;
  documentData: DocumentType | null;
  transactions?: TransactionData[];
  onClose: () => void;
}

const DocumentAnalysisModal = ({
  isOpen,
  documentData,
  transactions = [],
  onClose,
}: DocumentAnalysisModalProps) => {
  if (!isOpen || !documentData) return null;

  // Fonction d'export CSV
  const exportToCSV = () => {
    try {
      // Préparer les données CSV
      const csvContent = [
        [
          'N°',
          'Date',
          'Description',
          'Description originale',
          'Montant (€)',
          'Catégorie',
          'Sous-catégorie',
          'Confiance IA (%)',
          'Score anomalie',
        ],
        ...transactions.map((transaction, index) => [
          index + 1,
          transaction.date instanceof Date
            ? transaction.date.toLocaleDateString('fr-FR')
            : transaction.date,
          transaction.description,
          transaction.originalDesc,
          transaction.amount,
          transaction.category || 'Non catégorisé',
          transaction.subcategory || 'Divers',
          transaction.aiConfidence
            ? `${transaction.aiConfidence.toFixed(1)}%`
            : 'N/A',
          transaction.anomalyScore || 0,
        ]),
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Créer et télécharger le fichier CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${documentData.bankDetected?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      alert("Erreur lors de l'export CSV");
    }
  };

  // Fonction d'export Excel
  const exportToExcel = async () => {
    try {
      // Import dynamique pour éviter les erreurs SSR
      const XLSX = await import('xlsx');

      // Préparer les données pour l'export
      const exportData = transactions.map((transaction, index) => ({
        'N°': index + 1,
        Date:
          transaction.date instanceof Date
            ? transaction.date.toLocaleDateString('fr-FR')
            : transaction.date,
        Description: transaction.description,
        'Description originale': transaction.originalDesc,
        'Montant (€)': transaction.amount,
        Catégorie: transaction.category || 'Non catégorisé',
        'Sous-catégorie': transaction.subcategory || 'Divers',
        'Confiance IA (%)': transaction.aiConfidence
          ? `${transaction.aiConfidence.toFixed(1)}%`
          : 'N/A',
        'Score anomalie': transaction.anomalyScore || 0,
      }));

      // Créer le workbook et la worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Largeurs de colonnes optimisées
      const colWidths = [
        { wch: 5 }, // N°
        { wch: 12 }, // Date
        { wch: 30 }, // Description
        { wch: 35 }, // Description originale
        { wch: 15 }, // Montant
        { wch: 20 }, // Catégorie
        { wch: 20 }, // Sous-catégorie
        { wch: 15 }, // Confiance IA
        { wch: 15 }, // Score anomalie
      ];
      ws['!cols'] = colWidths;

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Générer le nom de fichier
      const fileName = `transactions_${documentData.bankDetected?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Télécharger le fichier
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      alert("Erreur lors de l'export Excel");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden overflow-y-auto rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 text-[#34495e] transition-colors duration-200 hover:text-[#2c3e50]"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mb-6 flex items-center space-x-3">
            <div className="rounded-xl bg-[#2c3e50] p-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-montserrat text-xl font-bold text-[#2c3e50]">
              Analyse IA Terminée
            </h3>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-sm">
              <div className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                {documentData.aiConfidence?.toFixed(1) ?? 'N/A'}%
              </div>
              <div className="font-open-sans text-sm text-[#34495e]">
                Confiance IA
              </div>
            </div>
            <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-sm">
              <div className="font-montserrat text-2xl font-bold text-red-600">
                {documentData.anomaliesDetected ?? 0}
              </div>
              <div className="font-open-sans text-sm text-[#34495e]">
                Anomalies détectées
              </div>
            </div>
            <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-sm">
              <div className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                {documentData.totalTransactions ?? 0}
              </div>
              <div className="font-open-sans text-sm text-[#34495e]">
                Transactions
              </div>
            </div>
            <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-sm">
              <div className="font-montserrat text-2xl font-bold text-[#34495e]">
                ~€0.04
              </div>
              <div className="font-open-sans text-sm text-[#34495e]">
                Coût IA (simulé)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4">
            <div>
              <div className="font-montserrat font-semibold text-[#2c3e50]">
                Banque détectée: {documentData.bankDetected ?? 'Non identifiée'}
              </div>
              <div className="font-open-sans text-sm text-[#34495e]">
                {documentData.originalName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportToCSV}
                disabled={transactions.length === 0}
                className="font-open-sans flex items-center space-x-2 rounded-xl bg-[#2c3e50] px-3 py-2 text-sm text-white shadow-sm transition-all duration-300 hover:bg-[#34495e] disabled:cursor-not-allowed disabled:bg-[#bdc3c7]"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={exportToExcel}
                disabled={transactions.length === 0}
                className="font-open-sans flex items-center space-x-2 rounded-xl bg-[#2c3e50] px-3 py-2 text-sm text-white shadow-sm transition-all duration-300 hover:bg-[#34495e] disabled:cursor-not-allowed disabled:bg-[#bdc3c7]"
              >
                <Download className="h-4 w-4" />
                <span>Excel</span>
              </button>
              {transactions.length === 0 && (
                <span className="font-open-sans text-sm text-[#34495e]">
                  Aucune transaction
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentAnalysisModal;
