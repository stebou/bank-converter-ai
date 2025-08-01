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
  onClose 
}: DocumentAnalysisModalProps) => {
  if (!isOpen || !documentData) return null;

  // Fonction d'export CSV
  const exportToCSV = () => {
    try {
      // Préparer les données CSV
      const csvContent = [
        ['N°', 'Date', 'Description', 'Description originale', 'Montant (€)', 'Catégorie', 'Sous-catégorie', 'Confiance IA (%)', 'Score anomalie'],
        ...transactions.map((transaction, index) => [
          index + 1,
          transaction.date instanceof Date ? transaction.date.toLocaleDateString('fr-FR') : transaction.date,
          transaction.description,
          transaction.originalDesc,
          transaction.amount,
          transaction.category || 'Non catégorisé',
          transaction.subcategory || 'Divers',
          transaction.aiConfidence ? `${transaction.aiConfidence.toFixed(1)}%` : 'N/A',
          transaction.anomalyScore || 0
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      // Créer et télécharger le fichier CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${documentData.bankDetected?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      alert('Erreur lors de l\'export CSV');
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
        'Date': transaction.date instanceof Date ? transaction.date.toLocaleDateString('fr-FR') : transaction.date,
        'Description': transaction.description,
        'Description originale': transaction.originalDesc,
        'Montant (€)': transaction.amount,
        'Catégorie': transaction.category || 'Non catégorisé',
        'Sous-catégorie': transaction.subcategory || 'Divers',
        'Confiance IA (%)': transaction.aiConfidence ? `${transaction.aiConfidence.toFixed(1)}%` : 'N/A',
        'Score anomalie': transaction.anomalyScore || 0,
      }));

      // Créer le workbook et la worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Largeurs de colonnes optimisées
      const colWidths = [
        { wch: 5 },   // N°
        { wch: 12 },  // Date
        { wch: 30 },  // Description
        { wch: 35 },  // Description originale
        { wch: 15 },  // Montant
        { wch: 20 },  // Catégorie
        { wch: 20 },  // Sous-catégorie
        { wch: 15 },  // Confiance IA
        { wch: 15 },  // Score anomalie
      ];
      ws['!cols'] = colWidths;

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Générer le nom de fichier
      const fileName = `transactions_${documentData.bankDetected?.replace(/\s+/g, '_') || 'document'}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Télécharger le fichier
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      alert('Erreur lors de l\'export Excel');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 relative overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-[#34495e] hover:text-[#2c3e50] transition-colors duration-200 z-20">
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#2c3e50] rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold font-montserrat text-[#2c3e50]">Analyse IA Terminée</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#ecf0f1] p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
              <div className="text-2xl font-bold font-montserrat text-[#2c3e50]">{documentData.aiConfidence?.toFixed(1) ?? 'N/A'}%</div>
              <div className="text-sm text-[#34495e] font-open-sans">Confiance IA</div>
            </div>
            <div className="bg-[#ecf0f1] p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
              <div className="text-2xl font-bold font-montserrat text-red-600">{documentData.anomaliesDetected ?? 0}</div>
              <div className="text-sm text-[#34495e] font-open-sans">Anomalies détectées</div>
            </div>
            <div className="bg-[#ecf0f1] p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
              <div className="text-2xl font-bold font-montserrat text-[#2c3e50]">{documentData.totalTransactions ?? 0}</div>
              <div className="text-sm text-[#34495e] font-open-sans">Transactions</div>
            </div>
            <div className="bg-[#ecf0f1] p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
              <div className="text-2xl font-bold font-montserrat text-[#34495e]">~€0.04</div>
              <div className="text-sm text-[#34495e] font-open-sans">Coût IA (simulé)</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#ecf0f1] rounded-xl border border-[#bdc3c7]">
            <div>
              <div className="font-semibold font-montserrat text-[#2c3e50]">Banque détectée: {documentData.bankDetected ?? 'Non identifiée'}</div>
              <div className="text-sm text-[#34495e] font-open-sans">{documentData.originalName}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={exportToCSV}
                disabled={transactions.length === 0}
                className="bg-[#2c3e50] text-white px-3 py-2 rounded-xl hover:bg-[#34495e] disabled:bg-[#bdc3c7] disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 text-sm shadow-sm font-open-sans"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button 
                onClick={exportToExcel}
                disabled={transactions.length === 0}
                className="bg-[#2c3e50] text-white px-3 py-2 rounded-xl hover:bg-[#34495e] disabled:bg-[#bdc3c7] disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 text-sm shadow-sm font-open-sans"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
              {transactions.length === 0 && (
                <span className="text-sm text-[#34495e] font-open-sans">Aucune transaction</span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentAnalysisModal;