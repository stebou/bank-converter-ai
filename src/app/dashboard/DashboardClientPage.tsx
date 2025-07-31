'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, BarChart2, Plus, Download, Brain, FileText, X, Settings } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { DocumentType } from '@/types';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import SubscriptionBadge from '@/components/SubscriptionBadge';
import AIChat from '@/components/AIChat';
import { DocumentRejectionModal } from '@/components/DocumentRejectionModal';

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

// --- COMPOSANT : VUE DÉTAILLÉE DU DOCUMENT ---
const DocumentDetailView = ({ document, onClose }: { document: DocumentType, onClose: () => void }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
      <X className="w-6 h-6" />
    </button>
    <div className="flex items-center space-x-3 mb-6">
      <CheckCircle className="w-6 h-6 text-green-600" />
      <h3 className="text-xl font-bold text-gray-900">Analyse IA Terminée</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
        <div className="text-2xl font-bold text-green-700">{document.aiConfidence?.toFixed(1) ?? 'N/A'}%</div>
        <div className="text-sm text-green-600">Confiance IA</div>
      </div>
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
        <div className="text-2xl font-bold text-orange-700">{document.anomaliesDetected ?? 0}</div>
        <div className="text-sm text-orange-600">Anomalies détectées</div>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
        <div className="text-2xl font-bold text-blue-700">{document.totalTransactions ?? 0}</div>
        <div className="text-sm text-blue-600">Transactions</div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
        <div className="text-2xl font-bold text-purple-700">~€0.04</div>
        <div className="text-sm text-purple-600">Coût IA (simulé)</div>
      </div>
    </div>
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <div className="font-semibold text-gray-900">Banque détectée: {document.bankDetected ?? 'Non identifiée'}</div>
        <div className="text-sm text-gray-600">{document.filename}</div>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
        <Download className="w-4 h-4" /><span>Export (à venir)</span>
      </button>
    </div>
  </div>
);

// --- COMPOSANT : MODULE D'UPLOAD ---
const UploadModule = ({ onUpload, processing, file, setFile, credits }: { onUpload: () => void, processing: boolean, file: File | null, setFile: React.Dispatch<React.SetStateAction<File | null>>, credits: number }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') setFile(selectedFile);
  }, [setFile]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6"><Upload className="w-8 h-8 text-white" /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Téléverser un relevé</h2>
        <p className="text-gray-600 mb-8">Utilisez un crédit pour analyser un document PDF.</p>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="fileInputDashboard" />
          <label htmlFor="fileInputDashboard" className="cursor-pointer block">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Cliquez pour sélectionner un PDF</p>
          </label>
        </div>
        {file && (<div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-center space-x-3"><CheckCircle className="w-5 h-5 text-green-600" /><span className="text-green-800 font-medium">{file.name}</span></div>)}
        <button onClick={onUpload} disabled={!file || processing || credits <= 0} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
          {processing ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Analyse IA en cours...</span></>) : credits <= 0 ? (<span>Crédits insuffisants</span>) : (<><Brain className="w-5 h-5" /><span>Analyser (1 crédit)</span></>)}
        </button>
      </div>
    </div>
  );
};

// --- COMPOSANT : HISTORIQUE DES DOCUMENTS ---
const DocumentHistoryTable = ({ documents, onSelectDocument }: { documents: DocumentType[], onSelectDocument: (doc: DocumentType) => void }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-200">Historique des analyses</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Nom du fichier</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Transactions</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Anomalies</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documents.length > 0 ? documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{doc.filename}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{doc.totalTransactions}</td>
              <td className={`px-6 py-4 whitespace-nowrap font-bold ${doc.anomaliesDetected > 0 ? 'text-red-600' : 'text-green-600'}`}>{doc.anomaliesDetected}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onSelectDocument(doc)} className="text-blue-600 hover:underline font-medium">Voir les détails</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center py-16 text-gray-500">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Aucune analyse pour le moment</h3>
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

// --- COMPOSANT : STATUT DES CRÉDITS ET ABONNEMENT ---
const CreditsStatus = ({ credits, subscriptionData }: { credits: number, subscriptionData: SubscriptionData }) => {
  const [loading, setLoading] = useState(false);
  const hasActiveSubscription = subscriptionData.subscriptionStatus === 'active';

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // L'ID réel de votre plan a été inséré ici
        body: JSON.stringify({ planId: 'cmdozsf4f0001s6otqbuk575x' }),
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
      console.error("Erreur lors de l'achat:", error);
      alert(`Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      // Créer un lien vers le portail client Stripe
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerId: subscriptionData.stripeCustomerId,
          returnUrl: window.location.href 
        }),
      });

      if (!response.ok) {
        throw new Error('Impossible d\'accéder au portail de gestion');
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {hasActiveSubscription ? 'Mon Abonnement' : 'Gérer l&apos;abonnement'}
      </h3>
      
      {/* Affichage des crédits */}
      <div className="text-center mb-6">
        <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {credits}
        </p>
        <p className="text-sm text-gray-500 mt-1">crédits d&apos;analyse restants</p>
        
        {hasActiveSubscription && (
          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">
              Plan {subscriptionData.currentPlan}
            </p>
            <p className="text-xs text-green-600">
              {subscriptionData.documentsUsed}/{subscriptionData.documentsLimit} analyses utilisées
            </p>
          </div>
        )}
      </div>

      {/* Bouton d'action */}
      {hasActiveSubscription ? (
        <button 
          onClick={handleManageSubscription} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
          Gérer mon abonnement
        </button>
      ) : (
        <button 
          onClick={handlePurchase} 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Souscrire à l&apos;abonnement Smart
        </button>
      )}
    </div>
  );
};


// --- COMPOSANT DE PAGE PRINCIPAL ---
export default function DashboardClientPage({ userName, initialDocuments, initialCredits, subscriptionData }: DashboardClientPageProps) {
  const [documents, setDocuments] = useState<DocumentType[]>(initialDocuments);
  const [credits, setCredits] = useState(initialCredits);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{planName: string; amount: number} | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionDetails, setRejectionDetails] = useState<{message: string; documentType?: string} | null>(null);
  
  const searchParams = useSearchParams();

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
            
            // Nettoyer l'URL pour éviter de réafficher la modal au refresh
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

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/documents', {
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
          return; // Ne pas décrémenter les crédits car ils ont été remboursés
        }
        
        throw new Error(errorData.error);
      }

      const newDocument = await response.json();
      
      // Convertir les dates string en objets Date
      const processedDocument = {
        ...newDocument,
        createdAt: new Date(newDocument.createdAt),
        lastAnalyzedAt: newDocument.lastAnalyzedAt ? new Date(newDocument.lastAnalyzedAt) : null,
      };
      
      setDocuments((prev) => [processedDocument, ...prev]);
      setCredits((prev) => prev - 1); 
      setFile(null);
      setSelectedDocument(processedDocument);

    } catch (error) {
      console.error("Erreur d'upload:", error);
      alert(`Une erreur est survenue lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setProcessing(false);
    }
  };

  const stats = {
    total: documents.length,
    anomalies: documents.reduce((sum, doc) => sum + (doc.anomaliesDetected || 0), 0),
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-full">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Bonjour, {userName} !</h1>
          <SubscriptionBadge 
            currentPlan={subscriptionData.currentPlan} 
            subscriptionStatus={subscriptionData.subscriptionStatus} 
          />
        </div>
        <p className="text-gray-600">Bienvenue sur votre tableau de bord d&apos;analyse IA.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg"><BarChart2 className="w-6 h-6 text-blue-600" /></div>
          <div><p className="text-sm text-gray-600">Documents traités</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
          <div><p className="text-sm text-gray-600">Anomalies détectées</p><p className="text-2xl font-bold text-gray-900">{stats.anomalies}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-sm text-gray-600">Crédits restants</p><p className="text-2xl font-bold text-gray-900">{credits}</p></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {selectedDocument ? (
            <DocumentDetailView document={selectedDocument} onClose={() => setSelectedDocument(null)} />
          ) : (
            <UploadModule onUpload={handleUpload} processing={processing} file={file} setFile={setFile} credits={credits} />
          )}
          <DocumentHistoryTable documents={documents} onSelectDocument={setSelectedDocument} />
        </div>
        <div className="lg:col-span-1">
          <CreditsStatus credits={credits} subscriptionData={subscriptionData} />
        </div>
      </div>

      {/* Modal de succès de paiement */}
      {showPaymentSuccess && paymentDetails && (
        <PaymentSuccessModal
          isOpen={showPaymentSuccess}
          onClose={() => setShowPaymentSuccess(false)}
          planName={paymentDetails.planName}
          amount={paymentDetails.amount}
        />
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

      {/* Assistant IA Chat */}
      <AIChat 
        documents={documents.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          originalName: doc.originalName,
          createdAt: doc.createdAt.toISOString(),
        }))}
        userId="current-user" // L'authentification se fait côté serveur dans l'API
      />
    </div>
  );
}