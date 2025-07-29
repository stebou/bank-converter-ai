'use client'

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Download, Loader2, Zap, Check, Crown, Sparkles, ArrowRight, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link'; 
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { SignUpModal } from '@/components/SignUpModal';
import { Navigation } from '@/components/Navigation'; // CORRECTION : On importe le composant Navigation

// --- TYPES (inchangés) ---
interface Transaction {
  id: number;
  date: string;
  description: string;
  originalDesc: string;
  amount: number;
  category: string;
  subcategory: string;
  confidence: number;
  anomalyScore: number;
}

interface AnalysisResults {
  bankDetected: string;
  confidence: number;
  processingTime: number;
  aiCost: number;
  transactions: Transaction[];
  summary: {
    totalTransactions: number;
    totalDebits: number;
    totalCredits: number;
    netFlow: number;
    avgConfidence: number;
    anomaliesDetected: number;
  };
}


// --- SOUS-COMPOSANTS DE LA PAGE (Navigation a été déplacé) ---

const PricingSection = () => {
  // ... (Le code de PricingSection ne change pas)
  const plans = [
    { name: "Gratuit", price: "0€", period: "/mois", description: "Parfait pour tester notre IA", features: ["5 documents/mois", "Analyse IA 85%+ précision", "Export CSV basique", "Support communauté", "Toutes banques françaises"], buttonText: "Commencer gratuitement", buttonStyle: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-105", cardStyle: "border-gray-200 hover:border-gray-300 hover:shadow-lg", popular: false, icon: <FileText className="w-8 h-8 text-gray-600" /> },
    { name: "Intelligent", price: "49€", period: "/mois", description: "IA avancée pour les PME", features: ["100 documents/mois", "Analyse IA 95%+ précision", "Auto-catégorisation intelligente", "Détection d'anomalies basique", "Exports multiples (CSV, JSON, Excel)", "Support email prioritaire", "Accès API basique"], buttonText: "Démarrer avec Smart", buttonStyle: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl", cardStyle: "border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2", popular: true, icon: <Brain className="w-8 h-8 text-blue-600" /> },
    { name: "Professionnel", price: "149€", period: "/mois", description: "IA premium pour les cabinets", features: ["500 documents/mois", "Analyse IA 97%+ précision", "Détection d'anomalies avancée", "Rapprochement bancaire IA", "API complète + webhooks", "10 utilisateurs inclus", "Options marque blanche", "Support téléphone prioritaire", "SLA 99.5%"], buttonText: "Passer Pro", buttonStyle: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl", cardStyle: "border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:-translate-y-2", popular: false, icon: <Crown className="w-8 h-8 text-purple-600" /> },
    { name: "Entreprise", price: "399€", period: "/mois", description: "IA sur-mesure + CSM dédié", features: ["Documents illimités", "IA affinée sur vos données", "Règles de catégorisation personnalisées", "Utilisateurs illimités", "Intégrations ERP personnalisées", "CSM dédié + formation", "SLA 99.9% + support 24/7", "Déploiement sur site en option", "Audit de conformité inclus"], buttonText: "Contacter l'équipe", buttonStyle: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:scale-105 hover:shadow-xl", cardStyle: "border-yellow-200 hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2", popular: false, icon: <Sparkles className="w-8 h-8 text-yellow-600" /> }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <Zap className="w-6 h-6 text-blue-600" /><span className="text-sm font-semibold uppercase tracking-wide">Tarifs boostés à l IA</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Choisissez votre puissance <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IA</span></h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">De l analyse basique à l IA sur-mesure, trouvez le plan parfait pour automatiser vos relevés bancaires avec une précision révolutionnaire.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const cardClasses = `relative bg-white rounded-2xl border-2 p-8 transition-all duration-500 ease-out transform ${plan.cardStyle} ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} group cursor-pointer`;
            return (
              <div key={plan.name} className={cardClasses}>
                {plan.popular && (<div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">⭐ Plus populaire</div></div>)}
                <div className="flex justify-center mb-6"><div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">{plan.icon}</div></div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
                <div className="text-center mb-4"><div className="flex items-baseline justify-center"><span className="text-5xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{plan.price}</span><span className="text-xl text-gray-500 ml-1">{plan.period}</span></div></div>
                <p className="text-gray-600 text-center mb-8 min-h-[48px] flex items-center justify-center">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${featureIndex * 50}ms` }}>
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition-colors duration-300"><Check className="w-3 h-3 text-green-600" /></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform ${plan.buttonStyle} flex items-center justify-center space-x-2 relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700`}>
                  <span>{plan.buttonText}</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"><div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div></div>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-green-50 border border-green-200 rounded-full px-6 py-3 hover:bg-green-100 transition-colors duration-300">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>
            <span className="text-green-800 font-medium">Garantie 30 jours satisfait ou remboursé • Annulation en 1 clic</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  // ... (Le code du Footer ne change pas)
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"><Brain className="w-6 h-6 text-white" /></div>
              <div><h3 className="text-xl font-bold">Bank Statement Converter IA</h3></div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">La première solution qui utilise l IA pour convertir vos relevés bancaires avec 99%+ de précision. Automatisez votre comptabilité en quelques clics.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
          <div><h4 className="text-lg font-semibold mb-6">Produit</h4><ul className="space-y-4"><li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li><li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Tarifs</a></li><li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Démo en direct</a></li></ul></div>
          <div><h4 className="text-lg font-semibold mb-6">Support</h4><ul className="space-y-4"><li><a href="#help" className="text-gray-400 hover:text-white transition-colors">Centre d aide</a></li><li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Nous contacter</a></li><li><a href="#status" className="text-gray-400 hover:text-white transition-colors">Statut du service</a></li></ul></div>
          <div><h4 className="text-lg font-semibold mb-6">Légal</h4><ul className="space-y-4"><li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li><li><a href="#terms" className="text-gray-400 hover:text-white transition-colors">Conditions d utilisation</a></li><li><a href="#cookies" className="text-gray-400 hover:text-white transition-colors">Politique des cookies</a></li><li><a href="#gdpr" className="text-gray-400 hover:text-white transition-colors">Conformité RGPD</a></li><li><a href="#refund" className="text-gray-400 hover:text-white transition-colors">Politique de remboursement</a></li></ul></div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8"><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="flex items-center space-x-3"><Mail className="w-5 h-5 text-blue-400" /><span className="text-gray-400">contact@bankstatement-ai.fr</span></div></div></div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center"><p className="text-gray-400">© 2024 Bank Statement Converter IA. Tous droits réservés.</p></div>
      </div>
    </footer>
  );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const BankStatementConverter = () => {
  // ... (Toute la logique de BankStatementConverter reste ici et ne change pas)
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [confidence, setConfidence] = useState(0);

  const [credits, setCredits] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('anonymousUserCredits');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      }
    }
  }, []);

  const simulateAIProcessing = async () => {
    const steps = [
      { step: 'Analyse OCR avec Google Vision...', duration: 2000, confidence: 25 },
      { step: 'Détection de la banque par IA...', duration: 1500, confidence: 45 },
      { step: 'Analyse intelligente par GPT-4...', duration: 3000, confidence: 75 },
      { step: 'Catégorisation automatique...', duration: 1000, confidence: 85 },
      { step: 'Détection des anomalies...', duration: 800, confidence: 92 },
      { step: 'Validation finale...', duration: 500, confidence: 97 }
    ];
    for (const { step, duration, confidence: conf } of steps) {
      setProcessingStep(step);
      setConfidence(conf);
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    const mockResults: AnalysisResults = {
      bankDetected: "BNP Paribas", confidence: 97.3, processingTime: 8.2, aiCost: 0.041,
      transactions: [
        { id: 1, date: "2024-01-15", description: "VIREMENT SALAIRE ENTREPRISE XYZ", originalDesc: "VIR SALAIRE ENTREPRISE XYZ REF:SAL240115", amount: 3250.00, category: "Revenus", subcategory: "Salaire", confidence: 98.5, anomalyScore: 0.1 },
        { id: 2, date: "2024-01-16", description: "CARTE LECLERC PONTAULT", originalDesc: "CB LECLERC PONTAULT 15/01/24", amount: -87.45, category: "Alimentation", subcategory: "Supermarché", confidence: 95.2, anomalyScore: 0.0 },
        { id: 3, date: "2024-01-17", description: "PRELEVEMENT EDF", originalDesc: "PREL EDF REF:FAC123456", amount: -142.30, category: "Charges", subcategory: "Électricité", confidence: 97.8, anomalyScore: 0.2 },
        { id: 4, date: "2024-01-18", description: "VIREMENT SUSPECT MONTANT ÉLEVÉ", originalDesc: "VIR EXTERNE BENEFICIAIRE INCONNU", amount: -15000.00, category: "Virements", subcategory: "Externe", confidence: 89.1, anomalyScore: 9.7 },
        { id: 5, date: "2024-01-19", description: "REMBOURSEMENT ASSURANCE SANTE", originalDesc: "VIR CPAM REMB SOINS", amount: 67.80, category: "Remboursements", subcategory: "Santé", confidence: 96.4, anomalyScore: 0.1 }
      ],
      summary: { totalTransactions: 5, totalDebits: -15229.75, totalCredits: 3317.80, netFlow: -11911.95, avgConfidence: 95.4, anomaliesDetected: 1 }
    };
    setResults(mockResults);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResults(null);
    }
  }, []);

  const processDocument = async () => {
    if (credits <= 0) {
      setIsModalOpen(true);
      return;
    }

    if (!file) return;

    const newCredits = credits - 1;
    setCredits(newCredits);
    localStorage.setItem('anonymousUserCredits', newCredits.toString());

    setProcessing(true);
    setResults(null);
    setConfidence(0);
    await simulateAIProcessing();
    setProcessing(false);
    setProcessingStep('');
  };

  const exportToCSV = () => {
    if (!results) return;
    const csvContent = [
      ['Date', 'Description', 'Montant', 'Catégorie', 'Sous-catégorie', 'Confiance IA', 'Score Anomalie'],
      ...results.transactions.map((t: Transaction) => [t.date, t.description, t.amount, t.category, t.subcategory, `${t.confidence}%`, t.anomalyScore])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${results.bankDetected.replace(' ', '_')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div id="features" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6"><Upload className="w-8 h-8 text-white" /></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Téléversez votre relevé bancaire</h2>
                  
                  <SignedOut>
                    <p className="text-gray-600 mb-8">
                      Il vous reste <span className="font-bold text-blue-600">{credits}</span> analyse{credits > 1 ? 's' : ''} gratuite{credits > 1 ? 's' : ''}.
                    </p>
                  </SignedOut>
                  <SignedIn>
                    <p className="text-gray-600 mb-8">Notre IA supporte automatiquement toutes les banques.</p>
                  </SignedIn>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="fileInput" />
                    <label htmlFor="fileInput" className="cursor-pointer block">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">Cliquez pour sélectionner un PDF</p>
                      <p className="text-sm text-gray-500">Formats supportés : PDF • Taille max : 10MB</p>
                    </label>
                  </div>
                  {file && (<div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"><div className="flex items-center justify-center space-x-3"><CheckCircle className="w-5 h-5 text-green-600" /><span className="text-green-800 font-medium">{file.name}</span><span className="text-green-600 text-sm">({(file.size / 1024 / 1024).toFixed(2)} MB)</span></div></div>)}
                  
                  <button 
                    onClick={processDocument} 
                    disabled={!file || processing} 
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {processing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>Analyse IA en cours...</span></>
                    ) : (credits <= 0 && file) ? (
                      <span>Limite de crédits atteinte</span>
                    ) : (
                      <><Brain className="w-5 h-5" /><span>Analyser avec l IA</span></>
                    )}
                  </button>
                </div>
              </div>
              {processing && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-4"><div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div><h3 className="text-lg font-semibold text-gray-900">Analyse IA en cours...</h3></div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">{processingStep}</span><span className="text-blue-600 font-medium">{confidence}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${confidence}%` }}></div></div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {results && (
                <>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-6"><CheckCircle className="w-6 h-6 text-green-600" /><h3 className="text-xl font-bold text-gray-900">Analyse IA Terminée</h3></div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"><div className="text-2xl font-bold text-green-700">{results.confidence}%</div><div className="text-sm text-green-600">Confiance IA</div></div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200"><div className="text-2xl font-bold text-blue-700">{results.processingTime}s</div><div className="text-sm text-blue-600">Temps d analyse</div></div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"><div className="text-2xl font-bold text-purple-700">€{results.aiCost}</div><div className="text-sm text-purple-600">Coût IA</div></div>
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200"><div className="text-2xl font-bold text-orange-700">{results.summary.anomaliesDetected}</div><div className="text-sm text-orange-600">Anomalies détectées</div></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div><div className="font-semibold text-gray-900">Banque détectée: {results.bankDetected}</div><div className="text-sm text-gray-600">{results.summary.totalTransactions} transactions • Flux net: €{results.summary.netFlow}</div></div>
                      <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><Download className="w-4 h-4" /><span>Export CSV</span></button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Transactions extraites</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th><th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Description</th><th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Montant</th><th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Catégorie</th><th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Score IA</th></tr></thead>
                        <tbody>
                          {results.transactions.map((transaction: Transaction) => {
                            const rowClasses = `border-b border-gray-100 hover:bg-gray-50 ${transaction.anomalyScore > 5 ? 'bg-red-50 border-red-200' : ''}`;
                            const amountClasses = `py-3 px-2 text-sm font-semibold text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`;
                            const confidenceClasses = `text-sm font-medium ${transaction.confidence > 95 ? 'text-green-600' : transaction.confidence > 90 ? 'text-yellow-600' : 'text-red-600'}`;
                            return (
                              <tr key={transaction.id} className={rowClasses}>
                                <td className="py-3 px-2 text-sm text-gray-900">{transaction.date}</td>
                                <td className="py-3 px-2"><div className="text-sm font-medium text-gray-900">{transaction.description}</div><div className="text-xs text-gray-500">{transaction.originalDesc}</div></td>
                                <td className={amountClasses}>€{transaction.amount.toFixed(2)}</td>
                                <td className="py-3 px-2"><div className="text-sm font-medium text-gray-900">{transaction.category}</div><div className="text-xs text-gray-500">{transaction.subcategory}</div></td>
                                <td className="py-3 px-2 text-center"><div className="flex items-center justify-center space-x-1"><span className={confidenceClasses}>{transaction.confidence.toFixed(1)}%</span>{transaction.anomalyScore > 5 && (<AlertCircle className="w-4 h-4 text-red-500" />)}</div></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              {!results && !processing && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">En attente d une analyse</h3>
                  <p className="text-gray-400">Téléversez un relevé bancaire PDF pour commencer.</p>
                </div>
              )}
            </div>
          </div>
          <PricingSection />
          <div id="demo" className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 BankStatement - Mon Banquier IA</h2>
            <p className="text-blue-100 max-w-3xl mx-auto">Pipeline IA complet : OCR → Détection banque → Analyse GPT-4 → Catégorisation → Détection d anomalies. Dans la version de production, une intégration réelle avec OpenAI + Google Cloud Vision est utilisée.</p>
            <div className="mt-6 flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Pipeline IA complet</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Score de confiance</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Détection d anomalies</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Export structuré</span></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BankStatementConverter;