// Performance Optimizer - Optimiseur de performances et ajustement des seuils

import { BaseAgent } from './base-agent';
import type { 
  AgentConfig, 
  AgentExecutionResult, 
  StockAnalysisState,
  Alert
} from '@/types/ai-agents';

interface PerformanceOptimizationInput {
  historical_performance: any[];
  current_alerts: Alert[];
  agent_performance_metrics: { [agentId: string]: any };
  system_load: {
    cpu_usage: number;
    memory_usage: number;
    execution_times: { [agentId: string]: number[] };
  };
  optimization_targets: {
    max_execution_time_ms: number;
    min_accuracy_threshold: number;
    max_false_positive_rate: number;
    target_alert_volume: number;
  };
}

interface OptimizationRecommendation {
  component: string;
  recommendation_type: 'THRESHOLD_ADJUSTMENT' | 'ALGORITHM_OPTIMIZATION' | 'RESOURCE_ALLOCATION' | 'PARAMETER_TUNING';
  current_value: number;
  recommended_value: number;
  expected_improvement: {
    performance_gain: number;
    accuracy_impact: number;
    resource_savings: number;
  };
  implementation_priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
}

interface ThresholdOptimization {
  parameter_name: string;
  current_threshold: number;
  optimal_threshold: number;
  confidence_score: number;
  impact_analysis: {
    alert_volume_change: number;
    false_positive_reduction: number;
    false_negative_risk: number;
  };
}

interface SystemPerformanceMetrics {
  overall_health_score: number;
  bottleneck_analysis: string[];
  resource_utilization: {
    cpu_efficiency: number;
    memory_efficiency: number;
    execution_efficiency: number;
  };
  prediction_quality: {
    accuracy_score: number;
    precision_score: number;
    recall_score: number;
    f1_score: number;
  };
}

export class PerformanceOptimizer extends BaseAgent {
  private optimizationHistory: OptimizationRecommendation[] = [];
  private performanceBaseline: SystemPerformanceMetrics | null = null;

  constructor() {
    const config: AgentConfig = {
      id: 'performance-optimizer',
      name: 'Performance Optimization Agent',
      version: '1.0.0',
      capabilities: [
        'threshold_optimization',
        'performance_tuning',
        'bottleneck_identification',
        'resource_optimization',
        'alert_calibration',
        'model_performance_enhancement'
      ],
      dependencies: ['anomaly-detection', 'kpi-metrics'],
      performance_targets: {
        max_execution_time_ms: 5000,
        min_accuracy_score: 0.90,
        max_error_rate: 0.03
      }
    };

    super(config);
  }

  async execute(input: PerformanceOptimizationInput, state: StockAnalysisState): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      this.log('info', 'Starting performance optimization analysis', {
        alertsCount: input.current_alerts.length,
        agentsCount: Object.keys(input.agent_performance_metrics).length,
        targetExecutionTime: input.optimization_targets.max_execution_time_ms
      });

      // 1. Analyse des performances actuelles
      const performanceMetrics = await this.analyzeCurrentPerformance(input, state);

      // 2. Identification des goulots d'étranglement
      const bottlenecks = await this.identifyBottlenecks(input, performanceMetrics);

      // 3. Optimisation des seuils d'alerte
      const thresholdOptimizations = await this.optimizeAlertThresholds(input, state);

      // 4. Optimisation des performances des agents
      const agentOptimizations = await this.optimizeAgentPerformance(input, state);

      // 5. Optimisation de l'allocation des ressources
      const resourceOptimizations = await this.optimizeResourceAllocation(input, performanceMetrics);

      // 6. Calibrage des modèles de prédiction
      const modelOptimizations = await this.optimizeModelParameters(input, state);

      // 7. Consolidation des recommandations
      const allRecommendations = [
        ...thresholdOptimizations,
        ...agentOptimizations,
        ...resourceOptimizations,
        ...modelOptimizations
      ];

      const prioritizedRecommendations = this.prioritizeRecommendations(allRecommendations);

      // 8. Simulation de l'impact des optimisations
      const impactSimulation = await this.simulateOptimizationImpact(prioritizedRecommendations, performanceMetrics);

      // 9. Plan d'implémentation
      const implementationPlan = this.createImplementationPlan(prioritizedRecommendations);

      // 10. Mise à jour de l'historique
      this.updateOptimizationHistory(prioritizedRecommendations);

      const executionTime = Date.now() - startTime;

      this.log('info', 'Performance optimization completed', {
        recommendationsCount: prioritizedRecommendations.length,
        criticalRecommendations: prioritizedRecommendations.filter(r => r.implementation_priority === 'CRITICAL').length,
        expectedImprovement: impactSimulation.overall_improvement,
        executionTimeMs: executionTime
      });

      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: true,
        confidence_score: this.calculateOptimizationConfidence(prioritizedRecommendations),
        output: {
          performance_metrics: performanceMetrics,
          bottleneck_analysis: bottlenecks,
          optimization_recommendations: prioritizedRecommendations,
          impact_simulation: impactSimulation,
          implementation_plan: implementationPlan,
          threshold_optimizations: thresholdOptimizations.filter(opt => 
            opt.recommendation_type === 'THRESHOLD_ADJUSTMENT'
          ),
          optimization_summary: this.generateOptimizationSummary(prioritizedRecommendations)
        },
        metrics: {
          accuracy: this.calculateOptimizationAccuracy(prioritizedRecommendations),
          processing_speed: prioritizedRecommendations.length / executionTime * 1000,
          resource_usage: executionTime
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', 'Performance optimization failed', { 
        error: error instanceof Error ? error.message : error 
      });
      
      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: false,
        confidence_score: 0,
        output: {},
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: {
          accuracy: 0,
          processing_speed: 0,
          resource_usage: executionTime
        }
      };
    }
  }

  // Analyse des performances actuelles
  private async analyzeCurrentPerformance(input: PerformanceOptimizationInput, state: StockAnalysisState): Promise<SystemPerformanceMetrics> {
    const cpuEfficiency = Math.max(0, 100 - input.system_load.cpu_usage);
    const memoryEfficiency = Math.max(0, 100 - input.system_load.memory_usage);
    
    // Calcul de l'efficacité d'exécution
    const executionTimes = Object.values(input.system_load.execution_times).flat();
    const avgExecutionTime = executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length;
    const executionEfficiency = Math.max(0, 100 - (avgExecutionTime / input.optimization_targets.max_execution_time_ms) * 100);

    // Calcul des métriques de qualité de prédiction
    const alertAccuracy = this.calculateAlertAccuracy(input.current_alerts);
    const predictionQuality = this.calculatePredictionQuality(input.current_alerts, state);

    const performanceMetrics: SystemPerformanceMetrics = {
      overall_health_score: (cpuEfficiency + memoryEfficiency + executionEfficiency + alertAccuracy) / 4,
      bottleneck_analysis: [],
      resource_utilization: {
        cpu_efficiency: cpuEfficiency,
        memory_efficiency: memoryEfficiency,
        execution_efficiency: executionEfficiency
      },
      prediction_quality: predictionQuality
    };

    // Mise à jour de la baseline si nécessaire
    if (!this.performanceBaseline) {
      this.performanceBaseline = performanceMetrics;
    }

    return performanceMetrics;
  }

  // Identification des goulots d'étranglement
  private async identifyBottlenecks(input: PerformanceOptimizationInput, metrics: SystemPerformanceMetrics): Promise<string[]> {
    const bottlenecks: string[] = [];

    // Goulots d'étranglement des ressources
    if (metrics.resource_utilization.cpu_efficiency < 70) {
      bottlenecks.push('Utilisation CPU excessive - optimisation des algorithmes requise');
    }

    if (metrics.resource_utilization.memory_efficiency < 70) {
      bottlenecks.push('Consommation mémoire élevée - révision de la gestion des données');
    }

    if (metrics.resource_utilization.execution_efficiency < 60) {
      bottlenecks.push('Temps d\'exécution trop élevés - parallélisation ou optimisation nécessaire');
    }

    // Goulots d'étranglement de qualité
    if (metrics.prediction_quality.precision_score < 0.8) {
      bottlenecks.push('Trop de faux positifs - calibrage des seuils d\'alerte nécessaire');
    }

    if (metrics.prediction_quality.recall_score < 0.8) {
      bottlenecks.push('Détection insuffisante - sensibilité des modèles à augmenter');
    }

    // Goulots d'étranglement par agent
    for (const [agentId, performance] of Object.entries(input.agent_performance_metrics)) {
      if (performance.execution_time_ms > input.optimization_targets.max_execution_time_ms * 0.8) {
        bottlenecks.push(`Agent ${agentId}: temps d'exécution critique`);
      }
      
      if (performance.accuracy < input.optimization_targets.min_accuracy_threshold) {
        bottlenecks.push(`Agent ${agentId}: précision insuffisante`);
      }
    }

    return bottlenecks;
  }

  // Optimisation des seuils d'alerte
  private async optimizeAlertThresholds(input: PerformanceOptimizationInput, state: StockAnalysisState): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    // Analyse du volume d'alertes
    const currentAlertVolume = input.current_alerts.length;
    const targetAlertVolume = input.optimization_targets.target_alert_volume;

    if (currentAlertVolume > targetAlertVolume * 1.5) {
      // Trop d'alertes - augmenter les seuils
      recommendations.push({
        component: 'anomaly_detection_threshold',
        recommendation_type: 'THRESHOLD_ADJUSTMENT',
        current_value: 2.0, // Seuil actuel (écarts-types)
        recommended_value: 2.5, // Seuil recommandé
        expected_improvement: {
          performance_gain: 15, // 15% moins d'alertes
          accuracy_impact: -2, // Légère baisse de sensibilité
          resource_savings: 10 // 10% économie de ressources
        },
        implementation_priority: 'HIGH',
        rationale: `Volume d'alertes excessif (${currentAlertVolume} vs cible ${targetAlertVolume}). Augmentation du seuil pour réduire les faux positifs.`
      });
    }

    // Analyse des faux positifs
    const falsePositiveRate = this.calculateFalsePositiveRate(input.current_alerts);
    if (falsePositiveRate > input.optimization_targets.max_false_positive_rate) {
      recommendations.push({
        component: 'forecast_deviation_threshold',
        recommendation_type: 'THRESHOLD_ADJUSTMENT',
        current_value: 0.3, // 30% d'écart
        recommended_value: 0.4, // 40% d'écart
        expected_improvement: {
          performance_gain: 20,
          accuracy_impact: 5,
          resource_savings: 8
        },
        implementation_priority: 'MEDIUM',
        rationale: `Taux de faux positifs élevé (${(falsePositiveRate * 100).toFixed(1)}%). Ajustement du seuil de déviation des prévisions.`
      });
    }

    // Optimisation des seuils de stock
    const stockoutAlerts = input.current_alerts.filter(a => a.type === 'STOCKOUT_RISK');
    if (stockoutAlerts.length > 0) {
      recommendations.push({
        component: 'safety_stock_multiplier',
        recommendation_type: 'PARAMETER_TUNING',
        current_value: 1.0,
        recommended_value: 1.2,
        expected_improvement: {
          performance_gain: 25, // Réduction des ruptures
          accuracy_impact: 0,
          resource_savings: -5 // Coût supplémentaire du stock
        },
        implementation_priority: 'HIGH',
        rationale: `${stockoutAlerts.length} alertes de rupture détectées. Augmentation du multiplicateur de stock de sécurité.`
      });
    }

    return recommendations;
  }

  // Optimisation des performances des agents
  private async optimizeAgentPerformance(input: PerformanceOptimizationInput, state: StockAnalysisState): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    for (const [agentId, performance] of Object.entries(input.agent_performance_metrics)) {
      // Optimisation du temps d'exécution
      if (performance.execution_time_ms > input.optimization_targets.max_execution_time_ms * 0.7) {
        recommendations.push({
          component: `${agentId}_execution_optimization`,
          recommendation_type: 'ALGORITHM_OPTIMIZATION',
          current_value: performance.execution_time_ms,
          recommended_value: performance.execution_time_ms * 0.8,
          expected_improvement: {
            performance_gain: 20,
            accuracy_impact: 0,
            resource_savings: 15
          },
          implementation_priority: 'MEDIUM',
          rationale: `Temps d'exécution élevé pour ${agentId}. Optimisation algorithmique recommandée.`
        });
      }

      // Optimisation de la précision
      if (performance.accuracy < input.optimization_targets.min_accuracy_threshold) {
        recommendations.push({
          component: `${agentId}_accuracy_improvement`,
          recommendation_type: 'PARAMETER_TUNING',
          current_value: performance.accuracy,
          recommended_value: input.optimization_targets.min_accuracy_threshold,
          expected_improvement: {
            performance_gain: 0,
            accuracy_impact: 15,
            resource_savings: 0
          },
          implementation_priority: 'HIGH',
          rationale: `Précision insuffisante pour ${agentId} (${(performance.accuracy * 100).toFixed(1)}%). Recalibrage nécessaire.`
        });
      }
    }

    return recommendations;
  }

  // Optimisation de l'allocation des ressources
  private async optimizeResourceAllocation(input: PerformanceOptimizationInput, metrics: SystemPerformanceMetrics): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    // Optimisation CPU
    if (input.system_load.cpu_usage > 80) {
      recommendations.push({
        component: 'cpu_utilization',
        recommendation_type: 'RESOURCE_ALLOCATION',
        current_value: input.system_load.cpu_usage,
        recommended_value: 70,
        expected_improvement: {
          performance_gain: 25,
          accuracy_impact: 0,
          resource_savings: 20
        },
        implementation_priority: 'CRITICAL',
        rationale: 'Utilisation CPU critique. Parallélisation ou réduction de la charge de travail nécessaire.'
      });
    }

    // Optimisation mémoire
    if (input.system_load.memory_usage > 85) {
      recommendations.push({
        component: 'memory_management',
        recommendation_type: 'RESOURCE_ALLOCATION',
        current_value: input.system_load.memory_usage,
        recommended_value: 75,
        expected_improvement: {
          performance_gain: 15,
          accuracy_impact: 0,
          resource_savings: 10
        },
        implementation_priority: 'HIGH',
        rationale: 'Consommation mémoire élevée. Optimisation de la gestion des données recommandée.'
      });
    }

    return recommendations;
  }

  // Optimisation des paramètres des modèles
  private async optimizeModelParameters(input: PerformanceOptimizationInput, state: StockAnalysisState): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    // Optimisation des fenêtres d'analyse
    if (state.processed_insights.demand_patterns.length > 0) {
      const avgConfidence = state.processed_insights.demand_patterns
        .reduce((sum, pattern) => sum + pattern.confidence, 0) / state.processed_insights.demand_patterns.length;

      if (avgConfidence < 0.8) {
        recommendations.push({
          component: 'analysis_window_size',
          recommendation_type: 'PARAMETER_TUNING',
          current_value: 90, // 90 jours actuellement
          recommended_value: 120, // Augmenter à 120 jours
          expected_improvement: {
            performance_gain: 0,
            accuracy_impact: 12,
            resource_savings: -5
          },
          implementation_priority: 'MEDIUM',
          rationale: `Confiance moyenne des patterns faible (${(avgConfidence * 100).toFixed(1)}%). Augmentation de la fenêtre d'analyse recommandée.`
        });
      }
    }

    // Optimisation des modèles de prévision
    const forecastAccuracy = state.forecasts.short_term.length > 0 
      ? state.forecasts.short_term.reduce((sum, f) => sum + f.accuracy_score, 0) / state.forecasts.short_term.length
      : 0;

    if (forecastAccuracy < 0.85) {
      recommendations.push({
        component: 'forecast_model_ensemble',
        recommendation_type: 'ALGORITHM_OPTIMIZATION',
        current_value: 1, // Un seul modèle
        recommended_value: 3, // Ensemble de 3 modèles
        expected_improvement: {
          performance_gain: 0,
          accuracy_impact: 18,
          resource_savings: -10
        },
        implementation_priority: 'HIGH',
        rationale: `Précision des prévisions insuffisante (${(forecastAccuracy * 100).toFixed(1)}%). Implémentation d'un ensemble de modèles recommandée.`
      });
    }

    return recommendations;
  }

  // Priorisation des recommandations
  private prioritizeRecommendations(recommendations: OptimizationRecommendation[]): OptimizationRecommendation[] {
    return recommendations.sort((a, b) => {
      // Tri par priorité d'implémentation
      const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const priorityDiff = priorityOrder[b.implementation_priority] - priorityOrder[a.implementation_priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Puis par gain de performance
      return b.expected_improvement.performance_gain - a.expected_improvement.performance_gain;
    });
  }

  // Simulation de l'impact des optimisations
  private async simulateOptimizationImpact(recommendations: OptimizationRecommendation[], currentMetrics: SystemPerformanceMetrics): Promise<any> {
    let totalPerformanceGain = 0;
    let totalAccuracyImpact = 0;
    let totalResourceSavings = 0;

    for (const recommendation of recommendations.slice(0, 5)) { // Top 5 recommandations
      totalPerformanceGain += recommendation.expected_improvement.performance_gain;
      totalAccuracyImpact += recommendation.expected_improvement.accuracy_impact;
      totalResourceSavings += recommendation.expected_improvement.resource_savings;
    }

    const projectedHealthScore = Math.min(100, currentMetrics.overall_health_score + (totalPerformanceGain / 4));
    
    return {
      overall_improvement: totalPerformanceGain,
      accuracy_improvement: totalAccuracyImpact,
      resource_optimization: totalResourceSavings,
      projected_health_score: projectedHealthScore,
      implementation_effort: this.calculateImplementationEffort(recommendations.slice(0, 5)),
      roi_estimation: this.calculateROI(recommendations.slice(0, 5))
    };
  }

  // Plan d'implémentation
  private createImplementationPlan(recommendations: OptimizationRecommendation[]): any {
    const phases = {
      immediate: recommendations.filter(r => r.implementation_priority === 'CRITICAL'),
      short_term: recommendations.filter(r => r.implementation_priority === 'HIGH'),
      medium_term: recommendations.filter(r => r.implementation_priority === 'MEDIUM'),
      long_term: recommendations.filter(r => r.implementation_priority === 'LOW')
    };

    return {
      phases,
      timeline: {
        immediate: '0-24h',
        short_term: '1-7 jours',
        medium_term: '1-4 semaines',
        long_term: '1-3 mois'
      },
      dependencies: this.identifyDependencies(recommendations),
      resource_requirements: this.calculateResourceRequirements(recommendations)
    };
  }

  // Méthodes utilitaires

  private calculateAlertAccuracy(alerts: Alert[]): number {
    // Simulation de la précision des alertes basée sur la sévérité
    const highPriorityAlerts = alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;
    return alerts.length > 0 ? (highPriorityAlerts / alerts.length) * 100 : 85;
  }

  private calculatePredictionQuality(alerts: Alert[], state: StockAnalysisState): SystemPerformanceMetrics['prediction_quality'] {
    // Simulation des métriques de qualité
    const precision = Math.max(0.7, 1 - this.calculateFalsePositiveRate(alerts));
    const recall = 0.82; // Simulation
    const accuracy = (precision + recall) / 2;
    const f1Score = (2 * precision * recall) / (precision + recall);

    return {
      accuracy_score: accuracy,
      precision_score: precision,
      recall_score: recall,
      f1_score: f1Score
    };
  }

  private calculateFalsePositiveRate(alerts: Alert[]): number {
    // Simulation: 15% de faux positifs
    const lowSeverityAlerts = alerts.filter(a => a.severity === 'LOW' || a.severity === 'MEDIUM').length;
    return alerts.length > 0 ? lowSeverityAlerts / alerts.length : 0.15;
  }

  private calculateImplementationEffort(recommendations: OptimizationRecommendation[]): string {
    const totalRecommendations = recommendations.length;
    const complexRecommendations = recommendations.filter(r => 
      r.recommendation_type === 'ALGORITHM_OPTIMIZATION' || r.recommendation_type === 'RESOURCE_ALLOCATION'
    ).length;

    if (complexRecommendations / totalRecommendations > 0.5) {
      return 'HIGH';
    } else if (complexRecommendations / totalRecommendations > 0.2) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  private calculateROI(recommendations: OptimizationRecommendation[]): number {
    const totalBenefit = recommendations.reduce((sum, rec) => 
      sum + rec.expected_improvement.performance_gain + rec.expected_improvement.resource_savings, 0
    );
    const implementationCost = recommendations.length * 10; // Coût simulé par recommandation
    
    return implementationCost > 0 ? (totalBenefit / implementationCost) * 100 : 0;
  }

  private identifyDependencies(recommendations: OptimizationRecommendation[]): string[] {
    const dependencies = [];
    
    const hasThresholdChanges = recommendations.some(r => r.recommendation_type === 'THRESHOLD_ADJUSTMENT');
    const hasAlgorithmChanges = recommendations.some(r => r.recommendation_type === 'ALGORITHM_OPTIMIZATION');
    
    if (hasThresholdChanges && hasAlgorithmChanges) {
      dependencies.push('Les ajustements de seuils doivent être appliqués après les optimisations algorithmiques');
    }

    return dependencies;
  }

  private calculateResourceRequirements(recommendations: OptimizationRecommendation[]): any {
    return {
      development_hours: recommendations.length * 8,
      testing_hours: recommendations.length * 4,
      deployment_complexity: this.calculateImplementationEffort(recommendations)
    };
  }

  private updateOptimizationHistory(recommendations: OptimizationRecommendation[]): void {
    this.optimizationHistory.push(...recommendations);
    
    // Garder seulement les 100 dernières optimisations
    if (this.optimizationHistory.length > 100) {
      this.optimizationHistory = this.optimizationHistory.slice(-100);
    }
  }

  private calculateOptimizationConfidence(recommendations: OptimizationRecommendation[]): number {
    if (recommendations.length === 0) return 0.8;
    
    // Confiance basée sur la qualité et la cohérence des recommandations
    const criticalRecommendations = recommendations.filter(r => r.implementation_priority === 'CRITICAL').length;
    const highImpactRecommendations = recommendations.filter(r => r.expected_improvement.performance_gain > 15).length;
    
    const confidenceScore = 0.7 + (criticalRecommendations * 0.1) + (highImpactRecommendations * 0.05);
    return Math.min(0.95, confidenceScore);
  }

  private calculateOptimizationAccuracy(recommendations: OptimizationRecommendation[]): number {
    // Précision basée sur la validité et la faisabilité des recommandations
    const validRecommendations = recommendations.filter(r => 
      r.expected_improvement.performance_gain > 0 && r.recommended_value !== r.current_value
    ).length;
    
    return recommendations.length > 0 ? validRecommendations / recommendations.length : 0.9;
  }

  private generateOptimizationSummary(recommendations: OptimizationRecommendation[]): string {
    const total = recommendations.length;
    const critical = recommendations.filter(r => r.implementation_priority === 'CRITICAL').length;
    const avgPerformanceGain = recommendations.reduce((sum, r) => sum + r.expected_improvement.performance_gain, 0) / total;
    
    return `${total} optimisations identifiées: ${critical} critiques. ` +
           `Gain de performance moyen: ${avgPerformanceGain.toFixed(1)}%. ` +
           `Focus: ${this.getOptimizationFocus(recommendations)}.`;
  }

  private getOptimizationFocus(recommendations: OptimizationRecommendation[]): string {
    const typeCounts = recommendations.reduce((counts, rec) => {
      counts[rec.recommendation_type] = (counts[rec.recommendation_type] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });

    const mostFrequentType = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    switch (mostFrequentType) {
      case 'THRESHOLD_ADJUSTMENT': return 'Calibrage des seuils';
      case 'ALGORITHM_OPTIMIZATION': return 'Optimisation algorithmique';
      case 'RESOURCE_ALLOCATION': return 'Allocation des ressources';
      case 'PARAMETER_TUNING': return 'Ajustement des paramètres';
      default: return 'Optimisation générale';
    }
  }
}