'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2, BarChart2, Plus, Download, Brain, X, Settings } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { DocumentType } from '@/types';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import SubscriptionBadge from '@/components/SubscriptionBadge';
import AIChat from '@/components/AIChat';
import { DocumentUpload } from '@/components/DocumentUpload';
import { TransactionsList } from '@/components/TransactionsList';

// Types spécifiques à ce composant client
type SubscriptionData = {
  currentPlan: string;
  subscriptionStatus: string | null;
  documentsLimit: number;
  documentsUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

type DashboardClientPageProps = {
  userName: string;
  initialDocuments: DocumentType[];
  initialCredits: number;
  subscriptionData: SubscriptionData;
};

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

// --- COMPOSANT : VUE DÉTAILLÉE DU DOCUMENT ---
const DocumentDetailView = ({ documentData, onClose, transactions = [] }: { 
  documentData: DocumentType;
  onClose: () => void;
  transactions?: TransactionData[];
}) => {
  
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
      console.error('Erreur lors de l&apos;export CSV:', error);
      alert('Erreur lors de l&apos;export CSV');
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
      console.error('Erreur lors de l&apos;export Excel:', error);
      alert('Erreur lors de l&apos;export Excel');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/10 to-transparent"></div>
    <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors duration-200 z-20">
      <X className="w-6 h-6" />
    </button>
    <div className="flex items-center space-x-3 mb-6 relative z-10">
      <CheckCircle className="w-6 h-6 text-green-400" />
      <h3 className="text-xl font-bold text-white">Analyse IA Terminée</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-400/30 backdrop-blur-sm">
        <div className="text-2xl font-bold text-green-300">{documentData.aiConfidence?.toFixed(1) ?? 'N/A'}%</div>
        <div className="text-sm text-green-200">Confiance IA</div>
      </div>
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-400/30 backdrop-blur-sm">
        <div className="text-2xl font-bold text-orange-300">{documentData.anomaliesDetected ?? 0}</div>
        <div className="text-sm text-orange-200">Anomalies détectées</div>
      </div>
      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-400/30 backdrop-blur-sm">
        <div className="text-2xl font-bold text-blue-300">{documentData.totalTransactions ?? 0}</div>
        <div className="text-sm text-blue-200">Transactions</div>
      </div>
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-400/30 backdrop-blur-sm">
        <div className="text-2xl font-bold text-purple-300">~€0.04</div>
        <div className="text-sm text-purple-200">Coût IA (simulé)</div>
      </div>
    </div>
    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 relative z-10">
      <div>
        <div className="font-semibold text-white">Banque détectée: {documentData.bankDetected ?? 'Non identifiée'}</div>
        <div className="text-sm text-gray-300">{documentData.filename}</div>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={exportToCSV}
          disabled={transactions.length === 0}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 text-sm shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>CSV</span>
        </button>
        <button 
          onClick={exportToExcel}
          disabled={transactions.length === 0}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 text-sm shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Excel</span>
        </button>
        {transactions.length === 0 && (
          <span className="text-sm text-gray-400">Aucune transaction</span>
        )}
      </div>
    </div>
  </div>
  );
};


// --- COMPOSANT : HISTORIQUE DES DOCUMENTS ---
const DocumentHistoryTable = ({ documents, onSelectDocument }: { documents: DocumentType[], onSelectDocument: (doc: DocumentType) => void }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-indigo-400/10 to-transparent"></div>
    <h3 className="text-lg font-semibold text-white p-6 border-b border-white/20 relative z-10">Historique des analyses</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm relative z-10">
        <thead className="bg-white/5 backdrop-blur-sm">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-200">Nom du fichier</th>
            <th className="px-6 py-3 text-left font-medium text-gray-200">Date</th>
            <th className="px-6 py-3 text-left font-medium text-gray-200">Transactions</th>
            <th className="px-6 py-3 text-left font-medium text-gray-200">Anomalies</th>
            <th className="px-6 py-3 text-left font-medium text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {documents.length > 0 ? documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-white/5 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{doc.filename}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{doc.totalTransactions}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${doc.anomaliesDetected > 0 ? 'text-red-400' : 'text-green-400'}`}>{doc.anomaliesDetected}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onSelectDocument(doc)} className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors duration-200">Voir les détails</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center py-16 text-gray-300">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Aucune analyse pour le moment</h3>
                  <p className="text-gray-400">Utilisez le module de téléversement pour commencer.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// --- COMPOSANT : ABONNEMENT COMPACT ---
const CompactSubscription = ({ credits, subscriptionData }: { credits: number, subscriptionData: SubscriptionData }) => {
  const [loading, setLoading] = useState(false);
  const hasActiveSubscription = subscriptionData.subscriptionStatus === 'active';

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: '1' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'La requête a échoué.' }));
        throw new Error(errorData.error || 'Erreur inconnue');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Erreur lors de l&apos;achat:", error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: subscriptionData.stripeCustomerId,
          returnUrl: window.location.href 
        }),
      });

      if (!response.ok) {
        throw new Error('Impossible d&apos;accéder au portail de gestion');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent"></div>
      {/* Header avec crédits intégrés */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-semibold text-white">Mon Abonnement</h3>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            {credits}
          </div>
          <div className="text-xs text-gray-300">crédits</div>
        </div>
      </div>
      
      {/* Infos abonnement */}
      {hasActiveSubscription && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30 backdrop-blur-sm relative z-10">
          <p className="text-sm font-medium text-green-200">
            Plan {subscriptionData.currentPlan}
          </p>
          <p className="text-xs text-green-300">
            {subscriptionData.documentsUsed}/{subscriptionData.documentsLimit} analyses utilisées
          </p>
        </div>
      )}

      {/* Bouton d'action compact */}
      {hasActiveSubscription ? (
        <button 
          onClick={handleManageSubscription} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm relative z-10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
          Gérer
        </button>
      ) : (
        <button 
          onClick={handlePurchase} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm relative z-10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Souscrire
        </button>
      )}
    </div>
  );
};


// --- COMPOSANT DE PAGE PRINCIPAL ---
export default function DashboardClientPage({ userName, initialDocuments, initialCredits, subscriptionData }: DashboardClientPageProps) {
  const [documents, setDocuments] = useState<DocumentType[]>(initialDocuments);
  const [credits, setCredits] = useState(initialCredits);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{planName: string; amount: number} | null>(null);
  const [selectedDocumentIdForTransactions, setSelectedDocumentIdForTransactions] = useState<string>('all');
  const [selectedDocumentTransactions, setSelectedDocumentTransactions] = useState<TransactionData[]>([]);
  
  const searchParams = useSearchParams();

  // Fonction pour récupérer les transactions d'un document
  const fetchDocumentTransactions = async (documentId: string) => {
    try {
      console.log('[DASHBOARD] Fetching transactions for document:', documentId);
      const response = await fetch(`/api/documents/${documentId}/transactions`);
      if (response.ok) {
        const data = await response.json();
        console.log('[DASHBOARD] Received transactions:', data.transactions?.length || 0);
        setSelectedDocumentTransactions(data.transactions || []);
      } else {
        console.error('[DASHBOARD] Failed to fetch transactions');
        setSelectedDocumentTransactions([]);
      }
    } catch (error) {
      console.error('[DASHBOARD] Error fetching transactions:', error);
      setSelectedDocumentTransactions([]);
    }
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const userData = await response.json();
        // Mettre à jour les crédits et les données d'abonnement
        const newCredits = userData.documentsLimit - userData.documentsUsed;
        setCredits(newCredits);
        console.log('[REFRESH] Updated credits:', newCredits);
      }
    } catch (error) {
      console.error('[REFRESH] Error refreshing user data:', error);
    }
  };

  // Vérifier les paramètres de paiement au chargement
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // Récupérer les détails du paiement
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPaymentDetails({
              planName: data.plan.name,
              amount: data.plan.price
            });
            setShowPaymentSuccess(true);
            
            // IMPORTANT : Rafraîchir les données utilisateur après paiement
            setTimeout(() => {
              refreshUserData();
            }, 2000); // Attendre 2 secondes pour que le webhook se termine
            
            // Nettoyer l&apos;URL pour éviter de réafficher la modal au refresh
            window.history.replaceState({}, '', '/dashboard');
          }
        })
        .catch(error => {
          console.error('Error fetching payment details:', error);
          // Afficher quand même la modal avec des données par défaut
          setPaymentDetails({
            planName: 'Plan Souscrit',
            amount: 0
          });
          setShowPaymentSuccess(true);
          
          // Rafraîchir les données même en cas d'erreur
          setTimeout(() => {
            refreshUserData();
          }, 2000);
          
          window.history.replaceState({}, '', '/dashboard');
        });
    }
  }, [searchParams]);


  const stats = {
    total: documents.length,
    anomalies: documents.reduce((sum, doc) => sum + (doc.anomaliesDetected || 0), 0),
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
      {/* Effet glassmorphism moderne pour le dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
      <div className="relative z-10">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">Bonjour, {userName} !</h1>
          <SubscriptionBadge 
            currentPlan={subscriptionData.currentPlan} 
            subscriptionStatus={subscriptionData.subscriptionStatus} 
          />
        </div>
        <p className="text-gray-300 text-lg">Bienvenue sur votre tableau de bord d&apos;analyse IA moderne.</p>
      </header>
      
      {/* Niveau 1 : 3 colonnes - Stats + Abonnement avec animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 relative overflow-hidden"
          initial={{ opacity: 0.3, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent"></div>
          <div className="relative z-10 p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg"><BarChart2 className="w-6 h-6 text-white" /></div>
          <div className="relative z-10"><p className="text-sm text-gray-200">Documents traités</p><p className="text-2xl font-bold text-white">{stats.total}</p></div>
        </motion.div>
        <motion.div 
          className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 relative overflow-hidden"
          initial={{ opacity: 0.3, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-400/10 to-transparent"></div>
          <div className="relative z-10 p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg"><AlertCircle className="w-6 h-6 text-white" /></div>
          <div className="relative z-10"><p className="text-sm text-gray-200">Anomalies détectées</p><p className="text-2xl font-bold text-white">{stats.anomalies}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.3, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <CompactSubscription credits={credits} subscriptionData={subscriptionData} />
        </motion.div>
      </div>
      
      {/* Niveau 2 : 2 colonnes - Loader/Analyse + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Colonne Loader/Résultat d'analyse avec transition */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedDocument ? (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0.3, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0.3, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <DocumentDetailView 
                  documentData={selectedDocument} 
                  onClose={() => {
                    setSelectedDocument(null);
                    setSelectedDocumentTransactions([]);
                  }}
                  transactions={selectedDocumentTransactions}
                />
              </motion.div>
            ) : (
              <motion.div
                key="upload-form"
                initial={{ opacity: 0.3, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0.3, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <DocumentUpload 
                  onDocumentUploaded={(uploadedDocument) => {
                    // Convertir les dates string en objets Date
                    const processedDocument = {
                      ...uploadedDocument,
                      createdAt: typeof uploadedDocument.createdAt === 'string' ? new Date(uploadedDocument.createdAt) : new Date(),
                      lastAnalyzedAt: uploadedDocument.lastAnalyzedAt && typeof uploadedDocument.lastAnalyzedAt === 'string' ? new Date(uploadedDocument.lastAnalyzedAt) : null,
                    } as DocumentType;
                    
                    setDocuments((prev) => [processedDocument, ...prev]);
                    setSelectedDocument(processedDocument);
                    
                    // Auto-sélectionner le document dans TransactionsList et charger ses transactions
                    if (processedDocument.id) {
                      setSelectedDocumentIdForTransactions(processedDocument.id);
                      fetchDocumentTransactions(processedDocument.id);
                    }
                  }}
                  onCreditsDecrement={() => setCredits((prev) => prev - 1)}
                  className=""
                  title="Téléverser un relevé"
                  description="Utilisez un crédit pour analyser un document PDF."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Colonne Transactions avec animation */}
        <motion.div
          initial={{ opacity: 0.3, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <TransactionsList 
            documents={documents} 
            selectedDocumentId={selectedDocumentIdForTransactions}
            onDocumentSelect={setSelectedDocumentIdForTransactions}
          />
        </motion.div>
      </div>
      
      {/* Niveau 3 : 1 colonne - Historique avec animation */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0.3, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <DocumentHistoryTable 
          documents={documents} 
          onSelectDocument={(doc) => {
            setSelectedDocument(doc);
            if (doc.id) {
              fetchDocumentTransactions(doc.id);
            }
          }} 
        />
      </motion.div>

      {/* Modal de succès de paiement */}
      {showPaymentSuccess && paymentDetails && (
        <PaymentSuccessModal
          isOpen={showPaymentSuccess}
          onClose={() => setShowPaymentSuccess(false)}
          planName={paymentDetails.planName}
          amount={paymentDetails.amount}
        />
      )}


      {/* Assistant IA Chat */}
      <AIChat 
        documents={documents.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          originalName: doc.originalName,
          createdAt: doc.createdAt.toISOString(),
        }))}
        userId="current-user" // Authentication is handled server-side in the API
      />
      </div>
    </div>
  );
}