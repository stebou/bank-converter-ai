'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  TrendingUp,
  DollarSign,
  BarChart3,
  Package,
  Calendar,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Brain,
  Globe,
} from 'lucide-react';
import '../styles/fonts.css';
import {
  AnalysisStorage,
  type StockAnalysis,
  type FinancialAnalysis,
  type Analysis,
} from '../lib/analysis-storage';

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Types importés depuis analysis-storage.ts

const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeModule, setActiveModule] = useState<'stock' | 'financial'>(
    'stock'
  );
  const [stockAnalyses, setStockAnalyses] = useState<StockAnalysis[]>([]);
  const [financialAnalyses, setFinancialAnalyses] = useState<
    FinancialAnalysis[]
  >([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null
  );

  // Charger les analyses depuis localStorage
  useEffect(() => {
    if (isOpen) {
      loadAnalysesFromStorage();
    }
  }, [isOpen]);

  const loadAnalysesFromStorage = () => {
    try {
      // Charger analyses de stock
      const existingStock = AnalysisStorage.getStockAnalyses();
      if (existingStock.length > 0) {
        setStockAnalyses(existingStock);
      } else {
        // Données de démonstration pour les analyses de stock
        setStockAnalyses(generateMockStockAnalyses());
      }

      // Charger analyses financières
      const existingFinancial = AnalysisStorage.getFinancialAnalyses();
      if (existingFinancial.length > 0) {
        setFinancialAnalyses(existingFinancial);
      } else {
        // Données de démonstration pour les analyses financières
        setFinancialAnalyses(generateMockFinancialAnalyses());
      }
    } catch (error) {
      console.error('Error loading analyses from storage:', error);
    }
  };

  const generateMockStockAnalyses = (): StockAnalysis[] => {
    return [
      {
        id: 'stock_' + Date.now() + '_1',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
        type: 'stock',
        title: 'Analyse Prédictive Complète',
        summary: 'Analyse de 23 produits avec intelligence marché OpenAI',
        confidence: 87.5,
        recommendations: 185,
        alerts: 12,
        kpiScore: 8.4,
        duration: 6.8,
        insights: [
          'Détection de 3 anomalies critiques nécessitant action immédiate',
          'Prévisions ajustées par intelligence marché (+15% précision)',
          "Optimisation EOQ générant 22% d'économies potentielles",
          '4 sources premium analysées (McKinsey, Deloitte, PwC, BCG)',
        ],
      },
      {
        id: 'stock_' + Date.now() + '_2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
        type: 'stock',
        title: 'Analyse Saisonnière Q4',
        summary:
          "Focus sur les tendances de fin d'année et optimisation stocks",
        confidence: 92.1,
        recommendations: 156,
        alerts: 8,
        kpiScore: 9.1,
        duration: 5.2,
        insights: [
          'Anticipation hausse demande +35% catégorie électronique',
          'Ajustements stocks de sécurité pour période Black Friday',
          'Identification de 2 produits en surstockage critique',
          'Recommandations de réapprovisionnement pour 18 références',
        ],
      },
      {
        id: 'stock_' + Date.now() + '_3',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
        type: 'stock',
        title: 'Audit Performance Agents IA',
        summary: 'Évaluation performance des 5 agents et optimisations',
        confidence: 89.3,
        recommendations: 203,
        alerts: 15,
        kpiScore: 8.7,
        duration: 7.4,
        insights: [
          'Agent External Context atteignant 94% de précision',
          'Optimisations seuils réduisant faux positifs de 28%',
          'Performance globale système en hausse de 12%',
          'Détection précoce de 5 ruptures de stock évitées',
        ],
      },
    ];
  };

  const generateMockFinancialAnalyses = (): FinancialAnalysis[] => {
    return [
      {
        id: 'financial_' + Date.now() + '_1',
        date: new Date(Date.now() - 1 * 60 * 60 * 1000), // Il y a 1h
        type: 'financial',
        title: 'Analyse Relevés Bancaires Octobre',
        summary: 'Traitement de 3 documents avec extraction IA GPT-4 Vision',
        documentsAnalyzed: 3,
        totalTransactions: 342,
        amountProcessed: 45670.23,
        categories: [
          'Frais bancaires',
          'Fournisseurs',
          'Salaires',
          'Charges',
          'Recettes',
        ],
        insights: [
          'Détection automatique de 342 transactions avec 98.5% précision',
          'Identification de 23 transactions nécessitant vérification',
          'Optimisation flux de trésorerie: économies potentielles 1,240€',
          'Analyse tendances: hausse charges de 8% vs mois précédent',
        ],
      },
      {
        id: 'financial_' + Date.now() + '_2',
        date: new Date(Date.now() - 6 * 60 * 60 * 1000), // Il y a 6h
        type: 'financial',
        title: 'Rapport Trimestriel Q3',
        summary: 'Consolidation de 12 relevés pour analyse trimestrielle',
        documentsAnalyzed: 12,
        totalTransactions: 1456,
        amountProcessed: 198430.56,
        categories: [
          'Investissements',
          'Opérationnel',
          'Marketing',
          'R&D',
          'Administratif',
        ],
        insights: [
          'Croissance CA de 23% vs Q3 année précédente',
          'Optimisation coûts opérationnels: -15% sur frais généraux',
          'Détection de 8 transactions suspectes nécessitant audit',
          'Prévisions Q4: objectif 220k€ CA basé sur tendances actuelles',
        ],
      },
      {
        id: 'financial_' + Date.now() + '_3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
        type: 'financial',
        title: 'Audit Conformité Fiscale',
        summary: 'Vérification conformité et préparation déclarations',
        documentsAnalyzed: 8,
        totalTransactions: 892,
        amountProcessed: 127845.78,
        categories: [
          'TVA',
          'Charges sociales',
          'Impôts',
          'Déductions',
          'Provisions',
        ],
        insights: [
          'Conformité fiscale: 97% des transactions correctement catégorisées',
          'Détection automatique des déductions fiscales: +3,450€ récupérés',
          'Alertes TVA: 12 transactions nécessitant ajustement',
          'Provisionnement automatique pour charges Q4: 15,200€',
        ],
      },
    ];
  };

  const deleteAnalysis = (id: string, type: 'stock' | 'financial') => {
    try {
      const success = AnalysisStorage.deleteAnalysis(id, type);
      if (success) {
        if (type === 'stock') {
          const updated = stockAnalyses.filter(analysis => analysis.id !== id);
          setStockAnalyses(updated);
        } else {
          const updated = financialAnalyses.filter(
            analysis => analysis.id !== id
          );
          setFinancialAnalyses(updated);
        }
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "À l'instant";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderAnalysisList = () => {
    const analyses =
      activeModule === 'stock' ? stockAnalyses : financialAnalyses;

    return (
      <div className="space-y-3">
        {analyses.length === 0 ? (
          <div className="py-8 text-center text-[#34495e]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecf0f1]">
              {activeModule === 'stock' ? (
                <Package className="h-6 w-6" />
              ) : (
                <DollarSign className="h-6 w-6" />
              )}
            </div>
            <p className="font-montserrat font-medium">
              Aucune analyse trouvée
            </p>
            <p className="font-open-sans text-sm">
              Les analyses apparaîtront ici après leur exécution
            </p>
          </div>
        ) : (
          analyses.map(analysis => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="cursor-pointer rounded-lg border border-[#bdc3c7] bg-white p-4 transition-all duration-200 hover:shadow-md"
              onClick={() => setSelectedAnalysis(analysis)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {activeModule === 'stock' ? (
                      <Package className="h-4 w-4 text-[#2c3e50]" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-[#2c3e50]" />
                    )}
                    <h3 className="font-montserrat text-sm font-medium text-[#2c3e50]">
                      {analysis.title}
                    </h3>
                  </div>

                  <p className="font-open-sans mb-2 text-xs text-[#34495e]">
                    {analysis.summary}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#34495e]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(analysis.date)}
                    </div>

                    {analysis.type === 'stock' && (
                      <>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {(analysis as StockAnalysis).confidence.toFixed(1)}%
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {(analysis as StockAnalysis).recommendations} rec.
                        </div>
                      </>
                    )}

                    {analysis.type === 'financial' && (
                      <>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {
                            (analysis as FinancialAnalysis).documentsAnalyzed
                          }{' '}
                          docs
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {
                            (analysis as FinancialAnalysis).totalTransactions
                          }{' '}
                          trans.
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedAnalysis(analysis);
                    }}
                    className="rounded p-1 text-[#34495e] transition-colors hover:bg-[#ecf0f1] hover:text-[#2c3e50]"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteAnalysis(analysis.id, analysis.type);
                    }}
                    className="rounded p-1 text-[#34495e] transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  const renderAnalysisDetail = () => {
    if (!selectedAnalysis) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-lg border border-[#bdc3c7] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {selectedAnalysis.type === 'stock' ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3498db]">
                <Package className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27ae60]">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-montserrat font-medium text-[#2c3e50]">
                {selectedAnalysis.title}
              </h3>
              <p className="font-open-sans text-sm text-[#34495e]">
                {formatDate(selectedAnalysis.date)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAnalysis(null)}
            className="rounded p-2 text-[#34495e] transition-colors hover:bg-[#ecf0f1] hover:text-[#2c3e50]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="font-open-sans mb-6 text-[#34495e]">
          {selectedAnalysis.summary}
        </p>

        {/* Métriques selon le type */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {selectedAnalysis.type === 'stock' && (
            <>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as StockAnalysis).confidence.toFixed(1)}%
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Confiance
                </div>
              </div>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as StockAnalysis).recommendations}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Recommandations
                </div>
              </div>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as StockAnalysis).alerts}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Alertes
                </div>
              </div>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as StockAnalysis).kpiScore.toFixed(1)}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Score KPI
                </div>
              </div>
            </>
          )}

          {selectedAnalysis.type === 'financial' && (
            <>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as FinancialAnalysis).documentsAnalyzed}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Documents
                </div>
              </div>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as FinancialAnalysis).totalTransactions}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Transactions
                </div>
              </div>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(
                    selectedAnalysis as FinancialAnalysis
                  ).amountProcessed.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Montant
                </div>
              </div>
              <div className="rounded-lg bg-[#ecf0f1] p-3 text-center">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {(selectedAnalysis as FinancialAnalysis).categories.length}
                </div>
                <div className="font-open-sans text-xs text-[#34495e]">
                  Catégories
                </div>
              </div>
            </>
          )}
        </div>

        {/* Insights */}
        <div>
          <h4 className="font-montserrat mb-3 flex items-center gap-2 font-medium text-[#2c3e50]">
            <Brain className="h-4 w-4" />
            Insights Clés
          </h4>
          <div className="space-y-2">
            {selectedAnalysis.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-[#ecf0f1] p-3"
              >
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#3498db]"></div>
                <p className="font-open-sans text-sm text-[#34495e]">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#bdc3c7]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#bdc3c7] bg-[#ecf0f1] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-montserrat text-2xl font-bold tracking-tight text-[#2c3e50]">
                    Historique des Analyses
                  </h2>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    Consultez vos analyses précédentes de stock et financières
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 text-[#34495e] transition-colors hover:bg-white hover:text-[#2c3e50]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex h-full">
              {/* Navigation modules */}
              <div className="w-48 border-r border-[#bdc3c7] bg-[#ecf0f1] p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveModule('stock')}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                      activeModule === 'stock'
                        ? 'bg-[#2c3e50] text-white shadow-lg'
                        : 'text-[#34495e] hover:bg-white hover:text-[#2c3e50]'
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    <div>
                      <div className="font-open-sans text-sm font-medium">
                        Analyses Stock
                      </div>
                      <div className="text-xs opacity-75">
                        {stockAnalyses.length} analyses
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveModule('financial')}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                      activeModule === 'financial'
                        ? 'bg-[#2c3e50] text-white shadow-lg'
                        : 'text-[#34495e] hover:bg-white hover:text-[#2c3e50]'
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    <div>
                      <div className="font-open-sans text-sm font-medium">
                        Analyses Financières
                      </div>
                      <div className="text-xs opacity-75">
                        {financialAnalyses.length} analyses
                      </div>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex flex-1">
                {/* Liste des analyses */}
                <div className="w-1/2 overflow-y-auto border-r border-[#bdc3c7] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-montserrat font-medium text-[#2c3e50]">
                      {activeModule === 'stock'
                        ? 'Analyses de Stock'
                        : 'Analyses Financières'}
                    </h3>
                    <button
                      onClick={loadAnalysesFromStorage}
                      className="rounded p-2 text-[#34495e] transition-colors hover:bg-[#ecf0f1] hover:text-[#2c3e50]"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  {renderAnalysisList()}
                </div>

                {/* Détail de l'analyse */}
                <div className="w-1/2 overflow-y-auto p-6">
                  {selectedAnalysis ? (
                    renderAnalysisDetail()
                  ) : (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ecf0f1]">
                          <Eye className="h-8 w-8 text-[#34495e]" />
                        </div>
                        <h3 className="font-montserrat mb-2 font-medium text-[#2c3e50]">
                          Sélectionnez une analyse
                        </h3>
                        <p className="font-open-sans text-sm text-[#34495e]">
                          Cliquez sur une analyse pour voir ses détails
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnalysisHistoryModal;
