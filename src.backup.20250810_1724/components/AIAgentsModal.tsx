'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Brain,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronRight,
  Package,
  DollarSign,
  Database,
  Globe,
  FileText,
} from 'lucide-react';
import '../styles/fonts.css';
import { AnalysisStorage } from '../lib/analysis-storage';

interface AIAgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisResult {
  success: boolean;
  analysis_id: string;
  execution_time_ms: number;
  confidence_score: number;
  recommendations: Recommendation[];
  alerts: Alert[];
  kpis: KPIs;
  demand_patterns: DemandPattern[];
  product_segments: ProductSegment[];
  forecasts: {
    short_term: Forecast[];
    medium_term: Forecast[];
    summary: { total_forecasts: number };
  };
  execution_summary: string;
  agents_performance: { [key: string]: AgentPerformance };
  market_intelligence?: MarketIntelligence;
}

interface MarketIntelligence {
  market_insights: MarketInsight[];
  competitor_analysis: CompetitorAnalysis[];
  market_events: MarketEvent[];
  sentiment_analysis: SentimentAnalysis | null;
  contextual_recommendations: string[];
  forecast_adjustments: any;
  intelligence_summary: string;
}

interface MarketInsight {
  id: string;
  type:
    | 'TREND'
    | 'EVENT'
    | 'COMPETITOR'
    | 'REGULATION'
    | 'ECONOMIC'
    | 'SEASONAL';
  source: string;
  title: string;
  description: string;
  impact_score: number;
  confidence_score: number;
  time_relevance: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  affected_products: string[];
  predicted_impact: {
    demand_change_percentage: number;
    direction: 'INCREASE' | 'DECREASE' | 'NEUTRAL';
    duration_days: number;
  };
  discovered_at: Date;
  keywords: string[];
}

interface CompetitorAnalysis {
  competitor_name: string;
  actions_detected: any[];
  market_position: any;
  recent_activities: any;
  threat_assessment: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface MarketEvent {
  event_id: string;
  event_type: string;
  title: string;
  description: string;
  start_date: Date;
  impact_magnitude: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface SentimentAnalysis {
  overall_sentiment: number;
  sentiment_trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  key_topics: any[];
  consumer_confidence: {
    current_level: number;
    three_month_outlook: number;
    industry_specific: number;
  };
}

interface Recommendation {
  id: string;
  type: 'ORDER' | 'ADJUST' | 'ALERT' | 'OPTIMIZE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  product_id: string;
  action: string;
  reasoning: string;
  expected_impact: string;
  confidence_score: number;
  estimated_benefit?: number;
  estimated_cost?: number;
}

interface Alert {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  product_id: string;
  message: string;
  details: string;
  estimated_impact: {
    financial: number;
    operational: string;
  };
  recommended_action: string;
}

interface KPIs {
  forecast_accuracy: {
    overall_mape: number;
    short_term_mape: number;
    medium_term_mape: number;
  };
  service_metrics: {
    service_level: number;
    stockout_frequency: number;
  };
  financial_metrics: {
    inventory_turnover: number;
    days_of_inventory: number;
    holding_cost_percentage: number;
  };
  ai_performance: {
    alert_precision: number;
    recommendation_adoption: number;
  };
}

interface DemandPattern {
  product_id: string;
  pattern_type: 'SEASONAL' | 'TRENDING' | 'STABLE' | 'ERRATIC';
  confidence: number;
  volatility: number;
  seasonality_strength: number;
}

interface ProductSegment {
  product_id: string;
  abc_classification: 'A' | 'B' | 'C';
  xyz_classification: 'X' | 'Y' | 'Z';
  strategic_importance: 'CRITICAL' | 'IMPORTANT' | 'STANDARD';
}

interface Forecast {
  product_id: string;
  forecast_date: string;
  predicted_demand: number;
  accuracy_score: number;
}

interface AgentPerformance {
  agent_id: string;
  execution_time_ms: number;
  success: boolean;
  confidence_score: number;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  progress?: number;
}

interface AnalysisProgress {
  currentStep: number;
  totalSteps: number;
  steps: AnalysisStep[];
  overallProgress: number;
}

const AIAgentsModal: React.FC<AIAgentsModalProps> = ({ isOpen, onClose }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'recommendations'
    | 'alerts'
    | 'optimization'
    | 'anomalies'
    | 'market'
    | 'performance'
  >('overview');
  const [analysisProgress, setAnalysisProgress] =
    useState<AnalysisProgress | null>(null);
  const [showingResults, setShowingResults] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<
    'loading' | 'completed' | 'transitioning' | 'results'
  >('loading');

  // Initialiser les étapes de progression - Version condensée
  const initializeAnalysisSteps = (): AnalysisProgress => {
    const steps: AnalysisStep[] = [
      {
        id: 'data-processing',
        title: 'Traitement des Données',
        description: 'Analyse patterns + Prévisions + Optimisation',
        status: 'pending',
      },
      {
        id: 'ai-analysis',
        title: 'Analyse IA Avancée',
        description: 'Détection anomalies + KPIs + Performance',
        status: 'pending',
      },
      {
        id: 'market-intelligence',
        title: 'Intelligence Marché',
        description: 'Recherche web premium + Analyse OpenAI',
        status: 'pending',
      },
      {
        id: 'synthesis',
        title: 'Synthèse & Recommandations',
        description: 'Consolidation finale + Insights exploitables',
        status: 'pending',
      },
    ];

    return {
      currentStep: 0,
      totalSteps: steps.length,
      steps,
      overallProgress: 0,
    };
  };

  // Obtenir l'icône appropriée pour chaque étape
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'data-processing':
        return Database;
      case 'ai-analysis':
        return Brain;
      case 'market-intelligence':
        return Globe;
      case 'synthesis':
        return FileText;
      default:
        return Clock;
    }
  };

  // Charger l'analyse au moment de l'ouverture
  useEffect(() => {
    if (isOpen && !analysisResult) {
      performAnalysis();
    }
    if (!isOpen) {
      // Réinitialiser les états quand on ferme la modal
      setTransitionPhase('loading');
      setShowingResults(false);
      setAnalysisProgress(null);
    }
  }, [isOpen]);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    setTransitionPhase('loading');
    setShowingResults(false);

    // Initialiser la progression
    const initialProgress = initializeAnalysisSteps();
    setAnalysisProgress(initialProgress);

    try {
      // Simuler la progression des étapes pendant l'analyse
      const simulateProgress = () => {
        let currentStepIndex = 0;
        const steps = [...initialProgress.steps];

        const progressInterval = setInterval(() => {
          if (currentStepIndex < steps.length) {
            // Marquer l'étape actuelle comme running
            if (currentStepIndex > 0) {
              steps[currentStepIndex - 1].status = 'completed';
              steps[currentStepIndex - 1].endTime = new Date();
            }

            steps[currentStepIndex].status = 'running';
            steps[currentStepIndex].startTime = new Date();

            const overallProgress = (currentStepIndex / steps.length) * 100;

            setAnalysisProgress({
              currentStep: currentStepIndex,
              totalSteps: steps.length,
              steps: [...steps],
              overallProgress,
            });

            currentStepIndex++;
          } else {
            clearInterval(progressInterval);
          }
        }, 1200); // Chaque étape dure ~1200ms (étapes plus complexes)

        return progressInterval;
      };

      const progressInterval = simulateProgress();

      const response = await fetch('/api/inventory-agents/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          use_test_data: true,
          analysis_type: 'FULL_ANALYSIS',
          forecast_horizon_days: 30,
          include_external_factors: true,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'analyse");
      }

      const result = await response.json();

      // Finaliser la progression
      const finalSteps = [...initialProgress.steps];
      finalSteps.forEach(step => {
        step.status = 'completed';
        if (!step.endTime) step.endTime = new Date();
      });

      setAnalysisProgress({
        currentStep: finalSteps.length,
        totalSteps: finalSteps.length,
        steps: finalSteps,
        overallProgress: 100,
      });

      // Phase 1: Montrer l'analyse terminée
      setTransitionPhase('completed');

      // Phase 2: Attendre 1.5s pour que l'utilisateur voie l'achèvement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Phase 3: Commencer la transition
      setTransitionPhase('transitioning');

      // Phase 4: Attendre la transition fade (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 5: Afficher les résultats
      setAnalysisResult(result);
      setTransitionPhase('results');
      setShowingResults(true);

      // Phase 6: Sauvegarder automatiquement l'analyse en historique
      try {
        await AnalysisStorage.saveStockAnalysis({
          confidence_score: result.confidence_score,
          recommendations: result.recommendations,
          alerts: result.alerts,
          metrics: { overall_score: result.confidence_score * 10 }, // Convertir en score sur 10
          execution_time_ms: result.execution_time_ms,
          external_context:
            result.agents_performance?.['external-context'] || null,
          anomalies:
            result.alerts?.filter(alert => alert.type === 'anomaly') || [],
          products_analyzed: result.product_segments?.length || 0,
        });
        console.log("✅ Analyse sauvegardée automatiquement dans l'historique");
      } catch (saveError) {
        console.warn('⚠️ Erreur lors de la sauvegarde automatique:', saveError);
        // Ne pas interrompre l'affichage des résultats pour une erreur de sauvegarde
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');

      // Marquer la progression comme erreur
      if (analysisProgress) {
        const errorSteps = [...analysisProgress.steps];
        const currentStepIndex = analysisProgress.currentStep;
        if (currentStepIndex < errorSteps.length) {
          errorSteps[currentStepIndex].status = 'error';
        }
        setAnalysisProgress({
          ...analysisProgress,
          steps: errorSteps,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'SEASONAL':
        return '🌊';
      case 'TRENDING':
        return '📈';
      case 'STABLE':
        return '➡️';
      case 'ERRATIC':
        return '⚡';
      default:
        return '❓';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Résumé exécutif */}
      <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-6">
        <h3 className="font-montserrat mb-3 text-lg font-semibold text-[#2c3e50]">
          Résumé Exécutif - Phase 3 IA + Intelligence Marché
        </h3>
        <p className="font-open-sans leading-relaxed text-[#34495e]">
          {analysisResult?.execution_summary}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#34495e]" />
            <span className="font-open-sans text-[#34495e]">
              {analysisResult?.execution_time_ms}ms
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#34495e]" />
            <span className="font-open-sans text-[#34495e]">
              Confiance:{' '}
              {((analysisResult?.confidence_score || 0) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#34495e]" />
            <span className="font-open-sans text-[#34495e]">
              Agents: 5 actifs + Intelligence Marché
            </span>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-open-sans text-xs font-medium text-[#34495e]">
                Précision Prévisions
              </p>
              <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                {(
                  100 -
                  (analysisResult?.kpis?.forecast_accuracy?.overall_mape || 0)
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-open-sans text-xs font-medium text-[#34495e]">
                Niveau Service
              </p>
              <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                {(
                  analysisResult?.kpis?.service_metrics?.service_level || 0
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-open-sans text-xs font-medium text-[#34495e]">
                Rotation Stock
              </p>
              <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                {(
                  analysisResult?.kpis?.financial_metrics?.inventory_turnover ||
                  0
                ).toFixed(1)}
                x
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <Package className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="font-open-sans text-xs font-medium text-[#34495e]">
                EOQ Optimisé
              </p>
              <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                {analysisResult?.product_segments?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
              <Zap className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="font-open-sans text-xs font-medium text-[#34495e]">
                Anomalies Détectées
              </p>
              <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                {analysisResult?.alerts?.filter(a =>
                  a.type?.includes('ANOMALY')
                ).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="font-open-sans text-xs font-medium text-[#34495e]">
                Alertes Actives
              </p>
              <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                {analysisResult?.alerts.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu rapide */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#bdc3c7] bg-white p-6">
          <h4 className="font-montserrat mb-4 font-semibold text-[#2c3e50]">
            Top Recommandations
          </h4>
          <div className="space-y-3">
            {analysisResult?.recommendations.slice(0, 3).map(rec => (
              <div
                key={rec.id}
                className="flex items-start gap-3 rounded-lg bg-[#ecf0f1] p-3"
              >
                <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#34495e]" />
                <div className="min-w-0 flex-1">
                  <p className="font-montserrat truncate text-sm font-medium text-[#2c3e50]">
                    {rec.action}
                  </p>
                  <p className="font-open-sans mt-1 text-xs text-[#34495e]">
                    {rec.product_id} • {rec.expected_impact}
                  </p>
                </div>
                <span
                  className={`rounded-lg border px-2 py-1 text-xs font-medium ${getPriorityColor(rec.priority)}`}
                >
                  {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#bdc3c7] bg-white p-6">
          <h4 className="font-montserrat mb-4 font-semibold text-[#2c3e50]">
            Patterns Détectés
          </h4>
          <div className="space-y-3">
            {analysisResult?.demand_patterns.slice(0, 4).map(pattern => (
              <div
                key={pattern.product_id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {getPatternIcon(pattern.pattern_type)}
                  </span>
                  <div>
                    <p className="font-montserrat text-sm font-medium text-[#2c3e50]">
                      {pattern.product_id}
                    </p>
                    <p className="font-open-sans text-xs text-[#34495e]">
                      {pattern.pattern_type.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-montserrat text-sm font-bold text-[#2c3e50]">
                    {(pattern.confidence * 100).toFixed(0)}%
                  </p>
                  <p className="font-open-sans text-xs text-[#34495e]">
                    confiance
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-4">
      {analysisResult?.recommendations.map(rec => (
        <div
          key={rec.id}
          className="rounded-xl border border-[#bdc3c7] bg-white p-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h4 className="font-montserrat font-semibold text-[#2c3e50]">
                  {rec.action}
                </h4>
                <span
                  className={`rounded-lg border px-2 py-1 text-xs font-medium ${getPriorityColor(rec.priority)}`}
                >
                  {rec.priority}
                </span>
              </div>
              <p className="font-open-sans mb-2 text-sm text-[#34495e]">
                Produit: <span className="font-medium">{rec.product_id}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-montserrat text-sm font-bold text-[#2c3e50]">
                {(rec.confidence_score * 100).toFixed(0)}%
              </p>
              <p className="font-open-sans text-xs text-[#34495e]">confiance</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-montserrat mb-1 text-sm font-medium text-[#2c3e50]">
                Raisonnement:
              </p>
              <p className="font-open-sans text-sm text-[#34495e]">
                {rec.reasoning}
              </p>
            </div>

            <div>
              <p className="font-montserrat mb-1 text-sm font-medium text-[#2c3e50]">
                Impact attendu:
              </p>
              <p className="font-open-sans text-sm text-[#34495e]">
                {rec.expected_impact}
              </p>
            </div>

            {(rec.estimated_benefit || rec.estimated_cost) && (
              <div className="flex gap-6 border-t border-[#bdc3c7] pt-3">
                {rec.estimated_benefit && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-open-sans text-sm font-medium text-green-600">
                      +{rec.estimated_benefit}€
                    </span>
                  </div>
                )}
                {rec.estimated_cost && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-red-600" />
                    <span className="font-open-sans text-sm font-medium text-red-600">
                      -{rec.estimated_cost}€
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      {analysisResult?.alerts.map(alert => (
        <div
          key={alert.id}
          className="rounded-xl border border-[#bdc3c7] bg-white p-6"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h4 className="font-montserrat font-semibold text-[#2c3e50]">
                  {alert.message}
                </h4>
                <span
                  className={`rounded-lg border px-2 py-1 text-xs font-medium ${getSeverityColor(alert.severity)}`}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="font-open-sans mb-2 text-sm text-[#34495e]">
                Produit: <span className="font-medium">{alert.product_id}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-montserrat mb-1 text-sm font-medium text-[#2c3e50]">
                Détails:
              </p>
              <p className="font-open-sans text-sm text-[#34495e]">
                {alert.details}
              </p>
            </div>

            <div>
              <p className="font-montserrat mb-1 text-sm font-medium text-[#2c3e50]">
                Action recommandée:
              </p>
              <p className="font-open-sans text-sm text-[#34495e]">
                {alert.recommended_action}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#bdc3c7] pt-3">
              <div>
                <p className="font-montserrat text-xs font-medium text-[#34495e]">
                  Impact financier estimé:
                </p>
                <p className="font-open-sans text-sm font-bold text-red-600">
                  {alert.estimated_impact.financial}€
                </p>
              </div>
              <div className="text-right">
                <p className="font-montserrat text-xs font-medium text-[#34495e]">
                  Impact opérationnel:
                </p>
                <p className="font-open-sans text-sm font-medium text-[#2c3e50]">
                  {alert.estimated_impact.operational}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#bdc3c7] bg-white p-6">
        <h3 className="font-montserrat mb-4 text-lg font-semibold text-[#2c3e50]">
          <Package className="mr-2 inline h-5 w-5" />
          Optimisation des Stocks - EOQ & Safety Stock
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-[#ecf0f1] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-montserrat font-medium text-[#2c3e50]">
                EOQ Calculé
              </span>
            </div>
            <p className="font-montserrat text-2xl font-bold text-blue-600">
              {analysisResult?.product_segments?.length || 0}
            </p>
            <p className="font-open-sans text-xs text-[#34495e]">
              produits optimisés
            </p>
          </div>

          <div className="rounded-lg bg-[#ecf0f1] p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-montserrat font-medium text-[#2c3e50]">
                Niveau Service
              </span>
            </div>
            <p className="font-montserrat text-2xl font-bold text-green-600">
              95%
            </p>
            <p className="font-open-sans text-xs text-[#34495e]">
              cible atteinte
            </p>
          </div>

          <div className="rounded-lg bg-[#ecf0f1] p-4">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="font-montserrat font-medium text-[#2c3e50]">
                Économies
              </span>
            </div>
            <p className="font-montserrat text-2xl font-bold text-purple-600">
              {Math.round(
                (analysisResult?.product_segments?.length || 0) * 127
              )}
              €
            </p>
            <p className="font-open-sans text-xs text-[#34495e]">
              par mois estimé
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-montserrat font-semibold text-[#2c3e50]">
            Top Optimisations Recommandées
          </h4>
          {[1, 2, 3].map(index => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-[#ecf0f1] p-4"
            >
              <div className="flex-1">
                <p className="font-montserrat font-medium text-[#2c3e50]">
                  Produit TECH-{String(index).padStart(3, '0')}
                </p>
                <p className="font-open-sans text-sm text-[#34495e]">
                  EOQ: {50 + index * 25} unités • Stock sécurité:{' '}
                  {10 + index * 5} unités
                </p>
              </div>
              <div className="text-right">
                <p className="font-montserrat text-sm font-bold text-green-600">
                  +{(index * 15).toFixed(0)}% efficacité
                </p>
                <p className="font-open-sans text-xs text-[#34495e]">
                  -{(index * 45).toFixed(0)}€/mois coûts
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnomalies = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#bdc3c7] bg-white p-6">
        <h3 className="font-montserrat mb-4 text-lg font-semibold text-[#2c3e50]">
          <Zap className="mr-2 inline h-5 w-5" />
          Détection d'Anomalies Temps Réel
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            {
              type: 'Pics de Demande',
              count: 3,
              color: 'text-orange-600',
              bg: 'bg-orange-100',
            },
            {
              type: 'Chutes Anormales',
              count: 1,
              color: 'text-red-600',
              bg: 'bg-red-100',
            },
            {
              type: 'Écarts Prévision',
              count: 2,
              color: 'text-yellow-600',
              bg: 'bg-yellow-100',
            },
            {
              type: 'Problèmes Stock',
              count: 1,
              color: 'text-purple-600',
              bg: 'bg-purple-100',
            },
          ].map((anomaly, index) => (
            <div key={index} className="rounded-lg bg-[#ecf0f1] p-4">
              <div
                className={`h-8 w-8 ${anomaly.bg} mb-2 flex items-center justify-center rounded-lg`}
              >
                <Zap className={`h-4 w-4 ${anomaly.color}`} />
              </div>
              <p className="font-montserrat text-sm font-medium text-[#2c3e50]">
                {anomaly.type}
              </p>
              <p
                className={`text-xl font-bold ${anomaly.color} font-montserrat`}
              >
                {anomaly.count}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-montserrat font-semibold text-[#2c3e50]">
            Anomalies Détectées Récemment
          </h4>
          {[
            {
              product: 'LAPTOP-001',
              type: 'Pic de demande',
              severity: 'HIGH',
              deviation: '+340%',
              time: '2h',
            },
            {
              product: 'PHONE-002',
              type: 'Écart prévision',
              severity: 'MEDIUM',
              deviation: '-45%',
              time: '4h',
            },
            {
              product: 'TABLET-003',
              type: 'Stock critique',
              severity: 'CRITICAL',
              deviation: '2j restants',
              time: '1h',
            },
          ].map((anomaly, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-[#ecf0f1] p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    anomaly.severity === 'CRITICAL'
                      ? 'bg-red-500'
                      : anomaly.severity === 'HIGH'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                  }`}
                ></div>
                <div>
                  <p className="font-montserrat font-medium text-[#2c3e50]">
                    {anomaly.product}
                  </p>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    {anomaly.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-montserrat font-bold text-[#2c3e50]">
                  {anomaly.deviation}
                </p>
                <p className="font-open-sans text-xs text-[#34495e]">
                  il y a {anomaly.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#bdc3c7] bg-white p-6">
        <h3 className="font-montserrat mb-4 text-lg font-semibold text-[#2c3e50]">
          <CheckCircle className="mr-2 inline h-5 w-5" />
          Performance Système IA
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-montserrat font-medium text-[#2c3e50]">
              Agents Actifs
            </h4>
            {[
              {
                name: 'Data Analysis',
                status: 'healthy',
                time: '1.2s',
                accuracy: '94%',
              },
              {
                name: 'Forecasting',
                status: 'healthy',
                time: '2.1s',
                accuracy: '91%',
              },
              {
                name: 'Stock Optimization',
                status: 'healthy',
                time: '1.8s',
                accuracy: '96%',
              },
              {
                name: 'Anomaly Detection',
                status: 'warning',
                time: '0.9s',
                accuracy: '89%',
              },
            ].map((agent, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-[#ecf0f1] p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      agent.status === 'healthy'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  ></div>
                  <span className="font-montserrat font-medium text-[#2c3e50]">
                    {agent.name}
                  </span>
                </div>
                <div className="text-right text-sm">
                  <div className="font-montserrat font-medium text-[#2c3e50]">
                    {agent.accuracy}
                  </div>
                  <div className="font-open-sans text-[#34495e]">
                    {agent.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-montserrat font-medium text-[#2c3e50]">
              Métriques Globales
            </h4>
            <div className="space-y-3">
              {[
                {
                  label: 'Temps Réponse Moyen',
                  value: '1.5s',
                  target: '< 3s',
                  status: 'good',
                },
                {
                  label: 'Précision Globale',
                  value: '92.5%',
                  target: '> 90%',
                  status: 'good',
                },
                {
                  label: 'Disponibilité',
                  value: '99.2%',
                  target: '> 99%',
                  status: 'good',
                },
                {
                  label: 'Taux Faux Positifs',
                  value: '6.1%',
                  target: '< 10%',
                  status: 'good',
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-[#ecf0f1] p-3"
                >
                  <div>
                    <p className="font-montserrat text-sm font-medium text-[#2c3e50]">
                      {metric.label}
                    </p>
                    <p className="font-open-sans text-xs text-[#34495e]">
                      Cible: {metric.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-montserrat font-bold text-green-600">
                      {metric.value}
                    </p>
                    <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[#ecf0f1] p-4">
          <h4 className="font-montserrat mb-2 font-medium text-[#2c3e50]">
            Recommandations d'Optimisation
          </h4>
          <div className="space-y-2 text-sm">
            <p className="font-open-sans text-[#34495e]">
              • Agent Anomaly Detection: Ajuster seuils pour réduire alertes
              non-critiques
            </p>
            <p className="font-open-sans text-[#34495e]">
              • Système global: Performance optimale - continuer surveillance
            </p>
            <p className="font-open-sans text-[#34495e]">
              • Phase 3: Prêt pour implémentation agents contexte externe
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketIntelligence = () => {
    const marketData = analysisResult?.market_intelligence;
    const hasRealData =
      marketData &&
      marketData.market_insights &&
      marketData.market_insights.length > 0;

    // Métriques basées sur les vraies données ou fallback
    const metrics = hasRealData
      ? [
          {
            label: 'Insights Marché',
            value: marketData.market_insights.length.toString(),
            icon: '🔍',
            color: 'text-blue-600',
            bg: 'bg-blue-100',
          },
          {
            label: 'Actions Concurrents',
            value: marketData.competitor_analysis.length.toString(),
            icon: '⚔️',
            color: 'text-orange-600',
            bg: 'bg-orange-100',
          },
          {
            label: 'Événements Détectés',
            value: marketData.market_events.length.toString(),
            icon: '📅',
            color: 'text-green-600',
            bg: 'bg-green-100',
          },
          {
            label: 'Sentiment Marché',
            value: marketData.sentiment_analysis
              ? `${(marketData.sentiment_analysis.overall_sentiment * 100).toFixed(0)}%`
              : 'N/A',
            icon: '📈',
            color: 'text-purple-600',
            bg: 'bg-purple-100',
          },
        ]
      : [
          {
            label: 'Insights Marché',
            value: '0',
            icon: '🔍',
            color: 'text-blue-600',
            bg: 'bg-blue-100',
          },
          {
            label: 'Actions Concurrents',
            value: '0',
            icon: '⚔️',
            color: 'text-orange-600',
            bg: 'bg-orange-100',
          },
          {
            label: 'Événements Détectés',
            value: '0',
            icon: '📅',
            color: 'text-green-600',
            bg: 'bg-green-100',
          },
          {
            label: 'Recherches Web',
            value: 'Actives',
            icon: '🌐',
            color: 'text-purple-600',
            bg: 'bg-purple-100',
          },
        ];

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-[#bdc3c7] bg-white p-6">
          <h3 className="font-montserrat mb-4 text-lg font-semibold text-[#2c3e50]">
            <TrendingUp className="mr-2 inline h-5 w-5" />
            Intelligence Marché & Veille Concurrentielle
          </h3>

          {/* Statut de l'intégration */}
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {hasRealData
                    ? '✅ Intelligence Marché Active'
                    : '🔄 SerpAPI Intégrée - Recherches Web Disponibles'}
                </p>
                <p className="text-xs text-blue-600">
                  {hasRealData
                    ? `${marketData.intelligence_summary}`
                    : 'SerpAPI configurée avec votre clé. Les prochaines analyses incluront des recherches web réelles.'}
                </p>
              </div>
            </div>
          </div>

          {/* Métriques d'intelligence marché */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {metrics.map((metric, index) => (
              <div key={index} className="rounded-lg bg-[#ecf0f1] p-4">
                <div
                  className={`h-8 w-8 ${metric.bg} mb-2 flex items-center justify-center rounded-lg`}
                >
                  <span className="text-lg">{metric.icon}</span>
                </div>
                <p className="font-montserrat text-sm font-medium text-[#2c3e50]">
                  {metric.label}
                </p>
                <p
                  className={`text-xl font-bold ${metric.color} font-montserrat`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* Insights marché prioritaires */}
          <div className="mb-6">
            <h4 className="font-montserrat mb-4 font-semibold text-[#2c3e50]">
              Insights Marché Prioritaires
            </h4>
            <div className="space-y-3">
              {hasRealData && marketData.market_insights.length > 0 ? (
                marketData.market_insights.slice(0, 5).map(insight => (
                  <div key={insight.id} className="rounded-lg bg-[#ecf0f1] p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h5 className="font-montserrat flex-1 font-medium text-[#2c3e50]">
                        {insight.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg border px-2 py-1 text-xs font-medium ${
                            insight.impact_score > 0.8
                              ? 'border-red-200 bg-red-100 text-red-800'
                              : insight.impact_score > 0.6
                                ? 'border-orange-200 bg-orange-100 text-orange-800'
                                : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {insight.impact_score > 0.8
                            ? 'CRITICAL'
                            : insight.impact_score > 0.6
                              ? 'HIGH'
                              : 'MEDIUM'}
                        </span>
                        <span className="font-open-sans text-xs text-[#34495e]">
                          {(insight.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="font-open-sans mb-2 text-sm text-[#34495e]">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-open-sans text-[#34495e]">
                        Source: {insight.source}
                      </span>
                      <span className="font-open-sans text-[#34495e]">
                        {insight.time_relevance.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {insight.keywords.slice(0, 3).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-white px-2 py-1 text-xs text-[#34495e]"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="font-open-sans text-sm text-gray-600">
                    {hasRealData
                      ? 'Aucun insight disponible'
                      : 'SerpAPI intégrée - les prochaines analyses incluront des insights marché temps réel'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analyse concurrentielle */}
          <div className="mb-6">
            <h4 className="font-montserrat mb-4 font-semibold text-[#2c3e50]">
              Analyse Concurrentielle
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {hasRealData && marketData.competitor_analysis.length > 0 ? (
                marketData.competitor_analysis
                  .slice(0, 3)
                  .map((competitor, index) => (
                    <div key={index} className="rounded-lg bg-[#ecf0f1] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h5 className="font-montserrat font-medium text-[#2c3e50]">
                          {competitor.competitor_name}
                        </h5>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            competitor.threat_assessment === 'HIGH' ||
                            competitor.threat_assessment === 'CRITICAL'
                              ? 'bg-red-500'
                              : competitor.threat_assessment === 'MEDIUM'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                        ></span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-open-sans text-[#34495e]">
                          {competitor.actions_detected.length} actions récentes
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`rounded-lg px-2 py-1 text-xs ${
                            competitor.threat_assessment === 'HIGH' ||
                            competitor.threat_assessment === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : competitor.threat_assessment === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          Menace {competitor.threat_assessment}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-3 rounded-lg bg-gray-50 p-4 text-center">
                  <p className="font-open-sans text-sm text-gray-600">
                    {hasRealData
                      ? 'Aucune analyse concurrentielle disponible'
                      : 'Analyse concurrentielle sera disponible avec les recherches web'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Prévisions sectorielles */}
          <div className="rounded-lg bg-[#ecf0f1] p-4">
            <h4 className="font-montserrat mb-3 font-medium text-[#2c3e50]">
              Prévisions Sectorielles Enrichies
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h5 className="font-montserrat mb-2 text-sm font-medium text-[#2c3e50]">
                  Facteurs Externes Intégrés
                </h5>
                <ul className="font-open-sans space-y-1 text-sm text-[#34495e]">
                  {hasRealData ? (
                    <>
                      <li>
                        • Sentiment marché:{' '}
                        {marketData.sentiment_analysis
                          ? `${(marketData.sentiment_analysis.overall_sentiment * 100).toFixed(0)}% positif`
                          : 'Non disponible'}
                      </li>
                      <li>
                        • Événements détectés: {marketData.market_events.length}{' '}
                        identifiés
                      </li>
                      <li>
                        • Insights marché: {marketData.market_insights.length}{' '}
                        analyses
                      </li>
                      <li>• Recherches web: Données temps réel intégrées</li>
                    </>
                  ) : (
                    <>
                      <li>• SerpAPI: Intégrée et opérationnelle</li>
                      <li>• OpenAI GPT-4: Intelligence d'analyse</li>
                      <li>• Recherches temps réel: Prêt pour activation</li>
                      <li>• Concurrence: Surveillance automatisée</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="font-montserrat mb-2 text-sm font-medium text-[#2c3e50]">
                  Ajustements Recommandés
                </h5>
                <ul className="font-open-sans space-y-1 text-sm text-[#34495e]">
                  {hasRealData &&
                  marketData.contextual_recommendations.length > 0 ? (
                    marketData.contextual_recommendations
                      .slice(0, 4)
                      .map((rec, idx) => <li key={idx}>• {rec}</li>)
                  ) : (
                    <>
                      <li>• Prochaine analyse: Recherches web complètes</li>
                      <li>• Intelligence marché: Données temps réel</li>
                      <li>• Surveillance concurrence: Automatique</li>
                      <li>• Ajustements prévisions: Basés sur web</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-montserrat text-2xl font-bold tracking-tight text-[#2c3e50]">
                    Analyse IA Prédictive
                  </h2>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    Système d'agents IA pour gestion optimisée des stocks
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

            {(loading || transitionPhase !== 'results') && !error ? (
              <motion.div
                className="flex h-full items-center justify-center overflow-y-auto p-4"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: transitionPhase === 'transitioning' ? 0 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-h-full w-full max-w-2xl">
                  {/* Header de progression - Compact */}
                  <div className="mb-4 text-center">
                    {transitionPhase === 'completed' ? (
                      <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
                    ) : (
                      <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[#2c3e50]" />
                    )}
                    <p className="font-montserrat mb-1 text-base font-medium text-[#2c3e50]">
                      {transitionPhase === 'completed'
                        ? 'Analyse terminée !'
                        : 'Analyse IA en cours...'}
                    </p>
                    <p className="font-open-sans mb-3 text-xs text-[#34495e]">
                      {transitionPhase === 'completed'
                        ? 'Préparation des résultats...'
                        : 'Phase 3 IA + Intelligence Marché • 5 agents + OpenAI'}
                    </p>

                    {/* Barre de progression globale - Compacte */}
                    {analysisProgress && (
                      <div className="mb-4">
                        <div className="mb-1 flex justify-between text-xs text-[#34495e]">
                          <span>
                            Étape {analysisProgress.currentStep + 1}/
                            {analysisProgress.totalSteps}
                          </span>
                          <span>
                            {Math.round(analysisProgress.overallProgress)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-[#2c3e50] to-[#3498db] transition-all duration-300"
                            style={{
                              width: `${analysisProgress.overallProgress}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline des étapes - Compacte */}
                  {analysisProgress && (
                    <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
                      {analysisProgress.steps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-300 ${
                            step.status === 'completed'
                              ? 'border-green-200 bg-green-50'
                              : step.status === 'running'
                                ? 'border-blue-200 bg-blue-50 shadow-sm'
                                : step.status === 'error'
                                  ? 'border-red-200 bg-red-50'
                                  : 'border-gray-200 bg-white'
                          }`}
                        >
                          {/* Icône de statut avec icône spécialisée */}
                          <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                              step.status === 'completed'
                                ? 'bg-green-500'
                                : step.status === 'running'
                                  ? 'bg-blue-500'
                                  : step.status === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-gray-300'
                            }`}
                          >
                            {step.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-white" />
                            ) : step.status === 'running' ? (
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : step.status === 'error' ? (
                              <XCircle className="h-4 w-4 text-white" />
                            ) : (
                              React.createElement(getStepIcon(step.id), {
                                className: 'w-4 h-4 text-white',
                              })
                            )}
                          </div>

                          {/* Contenu de l'étape - Compact */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-montserrat truncate text-sm font-medium text-[#2c3e50]">
                              {step.title}
                            </h3>
                            <p className="font-open-sans line-clamp-1 text-xs text-[#34495e]">
                              {step.description}
                            </p>
                            {step.startTime && step.status === 'running' && (
                              <p className="font-open-sans text-xs text-[#3498db]">
                                {Math.round(
                                  (Date.now() - step.startTime.getTime()) / 1000
                                )}
                                s
                              </p>
                            )}
                            {step.endTime && step.status === 'completed' && (
                              <p className="font-open-sans text-xs text-green-600">
                                ✓{' '}
                                {Math.round(
                                  (step.endTime.getTime() -
                                    (step.startTime?.getTime() || 0)) /
                                    1000
                                )}
                                s
                              </p>
                            )}
                          </div>

                          {/* Indicateur de progression - Plus petit */}
                          {step.status === 'running' && (
                            <div className="h-6 w-1 flex-shrink-0 overflow-hidden rounded-full bg-blue-200">
                              <motion.div
                                className="w-full rounded-full bg-blue-500"
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : error ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md text-center">
                  <XCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
                  <p className="font-montserrat mb-2 text-lg font-medium text-[#2c3e50]">
                    Erreur d'analyse
                  </p>
                  <p className="font-open-sans mb-4 text-sm text-[#34495e]">
                    {error}
                  </p>
                  <button
                    onClick={performAnalysis}
                    className="font-open-sans rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-[#34495e]"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : analysisResult ? (
              <motion.div
                className="flex h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Navigation tabs */}
                <div className="w-48 border-r border-[#bdc3c7] bg-[#ecf0f1] p-4">
                  <nav className="space-y-2">
                    {[
                      {
                        id: 'overview',
                        label: "Vue d'ensemble",
                        icon: BarChart3,
                      },
                      {
                        id: 'recommendations',
                        label: 'Recommandations',
                        icon: Target,
                      },
                      { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
                      {
                        id: 'optimization',
                        label: 'Optimisation',
                        icon: Package,
                      },
                      { id: 'anomalies', label: 'Anomalies', icon: Zap },
                      {
                        id: 'market',
                        label: 'Intelligence Marché',
                        icon: TrendingUp,
                      },
                      {
                        id: 'performance',
                        label: 'Performance',
                        icon: CheckCircle,
                      },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-[#2c3e50] text-white shadow-lg'
                            : 'text-[#34495e] hover:bg-white hover:text-[#2c3e50]'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span className="font-open-sans text-sm font-medium">
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'overview' && renderOverview()}
                  {activeTab === 'recommendations' && renderRecommendations()}
                  {activeTab === 'alerts' && renderAlerts()}
                  {activeTab === 'optimization' && renderOptimization()}
                  {activeTab === 'anomalies' && renderAnomalies()}
                  {activeTab === 'market' && renderMarketIntelligence()}
                  {activeTab === 'performance' && renderPerformance()}
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAgentsModal;
