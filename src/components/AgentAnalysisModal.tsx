'use client';

import { BusinessInsightReport } from '@/lib/agents/banking';
import { AnalysisStorage } from '@/lib/analysis-storage';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle,
  Clock,
  DollarSign,
  Lightbulb,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AgentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: BusinessInsightReport | null;
  isLoading: boolean;
  onStartAnalysis?: () => Promise<void>;
}

const AgentAnalysisModal: React.FC<AgentAnalysisModalProps> = ({
  isOpen,
  onClose,
  report,
  isLoading,
  onStartAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'metrics' | 'insights' | 'recommendations'
  >('overview');
  const [analyzing, setAnalyzing] = useState(false);

  // Sauvegarder automatiquement l'analyse dans l'historique quand un nouveau rapport arrive
  useEffect(() => {
    if (report && !isLoading) {
      const saveAnalysisToHistory = async () => {
        try {
          await AnalysisStorage.saveFinancialAnalysis({
            documents_analyzed: 1, // Par défaut, on analyse au moins 1 document
            total_transactions: 0, // Information non disponible dans BusinessInsightReport
            amount_processed: Math.abs(report.financialMetrics?.cashFlow || 0),
            categories: ['Analyse Bancaire Globale'],
            insights: [
              ...report.insights.strengths,
              ...report.insights.concerns,
              ...report.insights.opportunities,
            ],
            confidence_score: report.companyHealth?.score / 10 || 0.85, // Convertir score sur 10 en score sur 1
            execution_time_ms: 5000, // Valeur par défaut
            recommendations: report.recommendations || [],
          });
          console.log(
            "✅ Rapport automatiquement sauvegardé dans l'historique"
          );
        } catch (error) {
          console.error(
            "❌ Erreur lors de la sauvegarde automatique dans l'historique:",
            error
          );
        }
      };

      saveAnalysisToHistory();
    }
  }, [report, isLoading]);

  const startBankingAnalysis = async () => {
    try {
      setAnalyzing(true);

      // Appeler la nouvelle API d'analyse globale
      const analysisResponse = await fetch('/api/banking/global-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType: 'comprehensive',
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        if (errorData.needsDocuments) {
          alert(
            "Aucun document trouvé. Veuillez d'abord uploader des relevés bancaires dans la section Documents."
          );
          return;
        }
        throw new Error(
          errorData.message || "Erreur lors de l'analyse bancaire"
        );
      }

      const result = await analysisResponse.json();
      console.log('Analyse bancaire globale terminée:', result);

      // Fermer le modal et le rouvrir avec les résultats
      // (Le parent ProBankingDashboard devra gérer cela)
      if (result.success && result.report) {
        // Sauvegarder l'analyse dans l'historique
        try {
          const report = result.report;
          await AnalysisStorage.saveFinancialAnalysis({
            documents_analyzed: result.documentsAnalyzed || 1,
            total_transactions: result.totalTransactions || 0,
            amount_processed: Math.abs(report.financialMetrics?.cashFlow || 0),
            categories: ['Analyse Bancaire Globale'],
            insights: [
              ...report.insights.strengths,
              ...report.insights.concerns,
              ...report.insights.opportunities,
            ],
            confidence_score: report.companyHealth?.score / 10 || 0.85,
            execution_time_ms: result.executionTime || 5000,
            recommendations: report.recommendations || [],
          });
          console.log("✅ Analyse sauvegardée dans l'historique");
        } catch (storageError) {
          console.error(
            "❌ Erreur lors de la sauvegarde dans l'historique:",
            storageError
          );
        }

        // Trigger un re-render avec les nouvelles données
        alert(
          "Analyse bancaire terminée ! Les résultats vont s'afficher dans le modal."
        );
        window.location.reload(); // Solution temporaire - idéalement on passerait les données au parent
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse bancaire:", error);
      alert(
        "Erreur lors de l'analyse bancaire: " +
          (error instanceof Error ? error.message : 'Erreur inconnue')
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <Bot className="mb-4 h-16 w-16 text-[#2c3e50]" />
        <motion.div
          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-blue-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <h3 className="font-montserrat mb-2 text-xl font-semibold text-[#2c3e50]">
        Analyse en cours...
      </h3>
      <p className="font-open-sans max-w-md text-center text-[#34495e]">
        Nos agents IA analysent vos données financières pour générer des
        insights personnalisés.
      </p>
      <div className="mt-6 flex space-x-2">
        {[1, 2, 3, 4].map(step => (
          <motion.div
            key={step}
            className="h-3 w-3 rounded-full bg-blue-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: step * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-[#bdc3c7] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#2c3e50] p-2">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                    Analyse Agentique
                  </h2>
                  <p className="font-open-sans text-[#34495e]">
                    Insights générés par intelligence artificielle
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#34495e] transition-colors duration-200 hover:text-[#2c3e50]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : report ? (
            <>
              {/* Navigation Tabs */}
              <div className="border-b border-[#bdc3c7]">
                <nav className="flex space-x-8 px-6">
                  {[
                    {
                      id: 'overview',
                      label: "Vue d'ensemble",
                      icon: BarChart3,
                    },
                    { id: 'metrics', label: 'Métriques', icon: DollarSign },
                    { id: 'insights', label: 'Insights', icon: Lightbulb },
                    {
                      id: 'recommendations',
                      label: 'Recommandations',
                      icon: Target,
                    },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`font-open-sans flex items-center gap-2 border-b-2 px-2 py-4 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#2c3e50] text-[#2c3e50]'
                          : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto bg-[#bdc3c7] p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Company Health Score */}
                    <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-montserrat text-xl font-semibold text-[#2c3e50]">
                          Santé Financière
                        </h3>
                        <div
                          className={`font-montserrat rounded-xl border px-4 py-2 font-semibold ${getHealthColor(report.companyHealth.score)}`}
                        >
                          {report.companyHealth.score}/100
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2">
                            {getTrendIcon(report.companyHealth.trend)}
                            <span className="font-montserrat font-medium text-[#2c3e50]">
                              Tendance
                            </span>
                          </div>
                          <p className="font-open-sans capitalize text-[#34495e]">
                            {report.companyHealth.trend}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-orange-500" />
                            <span className="font-montserrat font-medium text-[#2c3e50]">
                              Niveau de Risque
                            </span>
                          </div>
                          <span
                            className={`font-open-sans rounded-xl px-2 py-1 text-sm font-medium capitalize ${getRiskColor(report.companyHealth.riskLevel)}`}
                          >
                            {report.companyHealth.riskLevel}
                          </span>
                        </div>

                        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <span className="font-montserrat font-medium text-[#2c3e50]">
                              Cash Flow
                            </span>
                          </div>
                          <p className="font-open-sans text-[#34495e]">
                            {report.financialMetrics.cashFlow > 0 ? '+' : ''}
                            {report.financialMetrics.cashFlow.toLocaleString()}€
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="rounded-xl border border-[#bdc3c7] bg-white p-6 shadow-sm">
                      <h3 className="font-montserrat mb-3 text-lg font-semibold text-[#2c3e50]">
                        Résumé Exécutif
                      </h3>
                      <p className="font-open-sans leading-relaxed text-[#34495e]">
                        {report.summary}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      {
                        label: 'Cash Flow',
                        value: `${report.financialMetrics.cashFlow.toLocaleString()}€`,
                        icon: DollarSign,
                        color:
                          report.financialMetrics.cashFlow >= 0
                            ? 'text-green-600'
                            : 'text-red-600',
                      },
                      {
                        label: 'Croissance Mensuelle',
                        value: `${report.financialMetrics.monthlyGrowth.toFixed(1)}%`,
                        icon: TrendingUp,
                        color:
                          report.financialMetrics.monthlyGrowth >= 0
                            ? 'text-green-600'
                            : 'text-red-600',
                      },
                      {
                        label: 'Ratio de Dépenses',
                        value: `${report.financialMetrics.expenseRatio.toFixed(1)}%`,
                        icon: BarChart3,
                        color: 'text-blue-600',
                      },
                      {
                        label: 'Marge Bénéficiaire',
                        value: `${report.financialMetrics.profitMargin.toFixed(1)}%`,
                        icon: Target,
                        color:
                          report.financialMetrics.profitMargin >= 0
                            ? 'text-green-600'
                            : 'text-red-600',
                      },
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        className="rounded-xl border border-[#bdc3c7] bg-white p-6 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="mb-2 flex items-center gap-3">
                          <metric.icon className={`h-5 w-5 ${metric.color}`} />
                          <h3 className="font-montserrat font-semibold text-[#2c3e50]">
                            {metric.label}
                          </h3>
                        </div>
                        <p
                          className={`text-2xl font-bold ${metric.color} font-montserrat`}
                        >
                          {metric.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    {/* Strengths */}
                    <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h3 className="font-montserrat text-lg font-semibold text-[#2c3e50]">
                          Points Forts
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {report.insights.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="font-open-sans flex items-start gap-2 text-[#34495e]"
                          >
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Concerns */}
                    <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <h3 className="font-montserrat text-lg font-semibold text-[#2c3e50]">
                          Points d'Attention
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {report.insights.concerns.map((concern, index) => (
                          <li
                            key={index}
                            className="font-open-sans flex items-start gap-2 text-[#34495e]"
                          >
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-blue-600" />
                        <h3 className="font-montserrat text-lg font-semibold text-[#2c3e50]">
                          Opportunités
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {report.insights.opportunities.map(
                          (opportunity, index) => (
                            <li
                              key={index}
                              className="font-open-sans flex items-start gap-2 text-[#34495e]"
                            >
                              <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                              {opportunity}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div className="space-y-4">
                    {report.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        className="rounded-xl border border-[#bdc3c7] bg-white p-6 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-open-sans rounded-xl border px-3 py-1 text-xs font-medium ${getPriorityColor(rec.priority)}`}
                            >
                              {rec.priority.toUpperCase()}
                            </span>
                            <Clock className="h-4 w-4 text-[#34495e]" />
                            <span className="font-open-sans text-sm text-[#34495e]">
                              {rec.timeline}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-montserrat mb-2 font-semibold text-[#2c3e50]">
                          {rec.action}
                        </h4>

                        <p className="font-open-sans mb-3 text-[#34495e]">
                          <strong>Impact attendu:</strong> {rec.impact}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <Bot className="mx-auto mb-4 h-16 w-16 text-[#2c3e50]" />
              <h3 className="font-montserrat mb-2 text-xl font-semibold text-[#34495e]">
                Agent IA Bancaire
              </h3>
              <p className="font-open-sans mb-6 text-[#34495e]">
                Lancez une analyse complète de vos documents bancaires avec
                notre agent IA spécialisé.
              </p>
              <motion.button
                onClick={onStartAnalysis || startBankingAnalysis}
                disabled={analyzing || isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2c3e50] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#34495e] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: analyzing || isLoading ? 1 : 1.05 }}
                whileTap={{ scale: analyzing || isLoading ? 1 : 0.95 }}
              >
                {analyzing || isLoading ? (
                  <>
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Lancer l'analyse bancaire
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentAnalysisModal;
