// Master Coordinator Agent - Orchestrateur du système d'agents IA

import { BaseAgent } from './base-agent';
import { DataAnalysisAgent } from './data-analysis-agent';
import { ForecastingAgent } from './forecasting-agent';
import { StockOptimizationAgent } from './stock-optimization-agent';
import { AnomalyDetectionAgent } from './anomaly-detection-agent';
import { ExternalContextAgent } from './external-context-agent';
import type { 
  AgentConfig, 
  AgentExecutionResult, 
  StockAnalysisState,
  WorkflowResult,
  WorkflowPattern,
  AgentMessage,
  Alert,
  Recommendation,
  StockManagementKPIs,
  RealTimeMetrics
} from '@/types/ai-agents';

export class MasterCoordinatorAgent extends BaseAgent {
  private agents: Map<string, BaseAgent>;
  private messageQueue: AgentMessage[];
  private currentWorkflowId: string;

  constructor() {
    const config: AgentConfig = {
      id: 'master-coordinator',
      name: 'Master Coordinator Agent',
      version: '1.0.0',
      capabilities: [
        'workflow_orchestration',
        'agent_coordination',
        'decision_arbitration',
        'performance_monitoring',
        'emergency_handling',
        'insight_synthesis',
        'stock_optimization_orchestration',
        'anomaly_detection_coordination',
        'real_time_monitoring',
        'external_context_integration',
        'market_intelligence_orchestration'
      ],
      dependencies: [],
      performance_targets: {
        max_execution_time_ms: 30000,
        min_accuracy_score: 0.85,
        max_error_rate: 0.02
      }
    };
    
    super(config);
    this.agents = new Map();
    this.messageQueue = [];
    this.currentWorkflowId = '';
    
    this.initializeAgents();
  }

  private initializeAgents(): void {
    // Initialisation des agents spécialisés
    this.agents.set('data-analysis', new DataAnalysisAgent());
    this.agents.set('forecasting', new ForecastingAgent());
    this.agents.set('stock-optimization', new StockOptimizationAgent());
    this.agents.set('anomaly-detection', new AnomalyDetectionAgent());
    this.agents.set('external-context', new ExternalContextAgent());
    
    this.log('info', 'Master Coordinator initialized with agents', {
      agentCount: this.agents.size,
      agents: Array.from(this.agents.keys())
    });
  }

  async execute(input: any, state: StockAnalysisState): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    this.currentWorkflowId = this.generateWorkflowId();
    
    try {
      this.log('info', 'Starting coordinated workflow', { 
        workflowId: this.currentWorkflowId,
        inputDataSize: this.calculateInputSize(input)
      });

      // Exécution du workflow principal
      const workflowResult = await this.executeDailyAnalysisWorkflow(input, state);
      
      // Synthèse finale et génération des recommandations
      const finalRecommendations = await this.synthesizeInsights(workflowResult.final_state);
      
      // Mise à jour des métriques temps réel
      const realTimeMetrics = this.updateRealTimeMetrics(workflowResult.final_state);
      
      // Extraction de l'intelligence marché depuis le workflow
      const marketIntelligence = workflowResult.performance_summary.agents_performance['external-context']?.output || null;

      const executionTime = Date.now() - startTime;
      
      this.log('info', 'Coordinated workflow completed successfully', {
        workflowId: this.currentWorkflowId,
        agentsExecuted: workflowResult.agents_executed.length,
        recommendationsGenerated: finalRecommendations.length,
        executionTimeMs: executionTime
      });

      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: true,
        confidence_score: this.calculateOverallConfidence(workflowResult),
        output: {
          workflow_result: workflowResult,
          final_recommendations: finalRecommendations,
          real_time_metrics: realTimeMetrics,
          market_intelligence: marketIntelligence,
          execution_summary: this.generateExecutionSummary(workflowResult, marketIntelligence)
        },
        metrics: {
          accuracy: this.calculateWorkflowAccuracy(workflowResult),
          processing_speed: workflowResult.agents_executed.length / executionTime * 1000,
          resource_usage: executionTime
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', 'Coordinated workflow failed', { 
        workflowId: this.currentWorkflowId,
        error: error instanceof Error ? error.message : error 
      });
      throw error;
    }
  }

  // Workflow quotidien principal
  async executeDailyAnalysisWorkflow(input: any, initialState: StockAnalysisState): Promise<WorkflowResult> {
    const workflowStart = new Date();
    const executedAgents: string[] = [];
    const agentPerformance: { [agent_id: string]: AgentExecutionResult } = {};
    let currentState = { ...initialState };

    try {
      // Étape 1: Analyse des données historiques
      this.log('info', 'Executing data analysis phase');
      const dataAnalysisAgent = this.agents.get('data-analysis');
      if (dataAnalysisAgent) {
        const analysisResult = await dataAnalysisAgent.run({
          sales_history: input.sales_history || [],
          inventory_history: input.inventory_history || [],
          time_range: input.time_range || { start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), end: new Date() },
          analysis_type: 'FULL_ANALYSIS'
        }, currentState);

        executedAgents.push('data-analysis');
        agentPerformance['data-analysis'] = analysisResult;

        if (analysisResult.success && analysisResult.output) {
          currentState.processed_insights = {
            demand_patterns: analysisResult.output.demand_patterns || [],
            seasonality: analysisResult.output.seasonality_data || [],
            product_segments: analysisResult.output.product_segments || []
          };
        }
      }

      // Étape 2: Génération des prévisions
      this.log('info', 'Executing forecasting phase');
      const forecastingAgent = this.agents.get('forecasting');
      if (forecastingAgent && currentState.processed_insights.demand_patterns.length > 0) {
        const forecastingResult = await forecastingAgent.run({
          historical_data: input.sales_history || [],
          demand_patterns: currentState.processed_insights.demand_patterns,
          external_factors: input.external_factors || [],
          forecast_horizon_days: input.forecast_horizon_days || 30,
          confidence_level: 0.95
        }, currentState);

        executedAgents.push('forecasting');
        agentPerformance['forecasting'] = forecastingResult;

        if (forecastingResult.success && forecastingResult.output) {
          const horizonDays = input.forecast_horizon_days || 30;
          currentState.forecasts = {
            short_term: forecastingResult.output.forecasts.filter((f: any) => 
              this.daysBetween(new Date(), f.forecast_date) <= 7),
            medium_term: forecastingResult.output.forecasts.filter((f: any) => 
              this.daysBetween(new Date(), f.forecast_date) > 7 && this.daysBetween(new Date(), f.forecast_date) <= 30),
            long_term: forecastingResult.output.forecasts.filter((f: any) => 
              this.daysBetween(new Date(), f.forecast_date) > 30),
            confidence_intervals: this.extractConfidenceIntervals(forecastingResult.output.forecasts)
          };
        }
      }

      // Étape 3: Optimisation des stocks
      this.log('info', 'Executing stock optimization phase');
      const stockOptimizationAgent = this.agents.get('stock-optimization');
      if (stockOptimizationAgent && currentState.processed_insights.demand_patterns.length > 0) {
        const optimizationResult = await stockOptimizationAgent.run({
          sales_history: input.sales_history || [],
          demand_patterns: currentState.processed_insights.demand_patterns,
          current_inventory: input.inventory_history || [],
          supplier_data: initialState.raw_data.supplier_data || [],
          cost_parameters: {
            holding_cost_rate: 0.15, // 15% annuel
            ordering_cost: 50, // 50€ par commande
            stockout_cost: 100 // 100€ par rupture
          },
          service_level_target: 0.95,
          lead_time_days: 14
        }, currentState);

        executedAgents.push('stock-optimization');
        agentPerformance['stock-optimization'] = optimizationResult;

        if (optimizationResult.success && optimizationResult.output) {
          currentState.optimization_results = {
            reorder_points: optimizationResult.output.reorder_points || [],
            safety_stocks: optimizationResult.output.safety_stocks || [],
            order_quantities: optimizationResult.output.eoq_results?.map((eoq: any) => ({
              product_id: eoq.product_id,
              economic_order_quantity: eoq.economic_order_quantity,
              recommended_order_quantity: eoq.economic_order_quantity,
              order_frequency_days: eoq.cycle_length_days,
              total_cost_per_cycle: eoq.total_annual_cost / (365 / eoq.cycle_length_days)
            })) || []
          };
        }
      }

      // Étape 4: Détection d'anomalies
      this.log('info', 'Executing anomaly detection phase');
      const anomalyDetectionAgent = this.agents.get('anomaly-detection');
      if (anomalyDetectionAgent) {
        const anomalyResult = await anomalyDetectionAgent.run({
          sales_history: input.sales_history || [],
          forecasts: currentState.forecasts.short_term.concat(currentState.forecasts.medium_term),
          demand_patterns: currentState.processed_insights.demand_patterns,
          current_inventory: input.inventory_history || [],
          detection_parameters: {
            sensitivity_level: 'MEDIUM',
            anomaly_threshold: 2.0, // 2 écarts-types
            trend_detection_window: 14,
            seasonal_adjustment: true
          }
        }, currentState);

        executedAgents.push('anomaly-detection');
        agentPerformance['anomaly-detection'] = anomalyResult;

        if (anomalyResult.success && anomalyResult.output) {
          // Les alertes d'anomalies s'ajoutent aux alertes existantes
          const anomalyAlerts = anomalyResult.output.real_time_alerts || [];
          currentState.alerts = [...(currentState.alerts || []), ...anomalyAlerts];
        }
      }

      // Étape 5: Intelligence externe et contexte marché
      this.log('info', 'Executing external context intelligence phase');
      const externalContextAgent = this.agents.get('external-context');
      let marketIntelligence = null;
      if (externalContextAgent) {
        const contextResult = await externalContextAgent.run({
          company_profile: {
            industry: 'technology', // À personnaliser selon le profil utilisateur
            business_type: 'B2C',
            primary_markets: ['France', 'Europe'],
            competitors: ['Concurrent A', 'Concurrent B', 'Concurrent C'],
            product_categories: ['electronics', 'tech accessories', 'computers']
          },
          analysis_timeframe: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date(),
            forecast_horizon_days: input.forecast_horizon_days || 30
          },
          demand_patterns: currentState.processed_insights.demand_patterns,
          search_configuration: {
            enable_competitor_monitoring: true,
            enable_market_events: true,
            enable_sentiment_analysis: true,
            enable_trend_analysis: true,
            sources_priority: ['news', 'government', 'industry']
          }
        }, currentState);

        executedAgents.push('external-context');
        agentPerformance['external-context'] = contextResult;

        if (contextResult.success && contextResult.output) {
          
          // Intégration des insights marché dans les recommandations
          const marketRecommendations = contextResult.output.contextual_recommendations || [];
          currentState.recommendations = [...(currentState.recommendations || []), ...marketRecommendations.map((rec: string, index: number) => ({
            id: `market_rec_${Date.now()}_${index}`,
            type: 'OPTIMIZE',
            priority: 'MEDIUM',
            product_id: 'MARKET_GLOBAL',
            action: rec,
            reasoning: 'Recommandation basée sur intelligence marché externe',
            expected_impact: 'Optimisation stratégique basée sur contexte marché',
            confidence_score: 0.8,
            agent_source: 'external-context',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }))];

          // Ajustement des prévisions basé sur le contexte externe
          if (contextResult.output.forecast_adjustments) {
            this.log('info', 'Applying market-based forecast adjustments', {
              adjustments: Object.keys(contextResult.output.forecast_adjustments.product_adjustments || {}).length,
              globalFactor: contextResult.output.forecast_adjustments.global_market_factor
            });
          }
        }
      }

      // Étape 6: Génération d'alertes complémentaires basées sur l'analyse
      const additionalAlerts = await this.generateAlerts(currentState);
      currentState.alerts = [...(currentState.alerts || []), ...additionalAlerts];

      // Étape 7: Calcul des KPIs et métriques
      const kpis = this.calculateKPIs(currentState);
      currentState.metrics = kpis;

      // Génération du résultat final du workflow
      const workflowResult: WorkflowResult = {
        workflow_id: this.currentWorkflowId,
        execution_start: workflowStart,
        execution_end: new Date(),
        success: true,
        agents_executed: executedAgents,
        final_state: currentState,
        recommendations: [], // Sera rempli par synthesizeInsights
        alerts: currentState.alerts,
        performance_summary: {
          total_execution_time_ms: Date.now() - workflowStart.getTime(),
          agents_performance: agentPerformance
        }
      };

      return workflowResult;

    } catch (error) {
      this.log('error', 'Workflow execution failed', { error: error instanceof Error ? error.message : error });
      
      return {
        workflow_id: this.currentWorkflowId,
        execution_start: workflowStart,
        execution_end: new Date(),
        success: false,
        agents_executed: executedAgents,
        final_state: currentState,
        recommendations: [],
        alerts: [],
        performance_summary: {
          total_execution_time_ms: Date.now() - workflowStart.getTime(),
          agents_performance: agentPerformance
        }
      };
    }
  }

  // Synthèse des insights et génération des recommandations finales
  async synthesizeInsights(state: StockAnalysisState): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    try {
      // Recommandations basées sur les patterns de demande
      const demandRecommendations = this.generateDemandBasedRecommendations(state);
      recommendations.push(...demandRecommendations);

      // Recommandations basées sur les prévisions
      const forecastRecommendations = this.generateForecastBasedRecommendations(state);
      recommendations.push(...forecastRecommendations);

      // Recommandations basées sur la segmentation
      const segmentationRecommendations = this.generateSegmentationRecommendations(state);
      recommendations.push(...segmentationRecommendations);

      // Priorisation des recommandations
      const prioritizedRecommendations = this.prioritizeRecommendations(recommendations);

      this.log('info', 'Insights synthesized', {
        totalRecommendations: prioritizedRecommendations.length,
        criticalRecommendations: prioritizedRecommendations.filter(r => r.priority === 'CRITICAL').length
      });

      return prioritizedRecommendations;

    } catch (error) {
      this.log('error', 'Failed to synthesize insights', { error: error instanceof Error ? error.message : error });
      return [];
    }
  }

  // Génération d'alertes
  private async generateAlerts(state: StockAnalysisState): Promise<Alert[]> {
    const alerts: Alert[] = [];

    try {
      // Alertes basées sur les prévisions de rupture
      const stockoutAlerts = this.generateStockoutAlerts(state);
      alerts.push(...stockoutAlerts);

      // Alertes de surstockage
      const overstockAlerts = this.generateOverstockAlerts(state);
      alerts.push(...overstockAlerts);

      // Alertes de déviation de prévision
      const deviationAlerts = this.generateDeviationAlerts(state);
      alerts.push(...deviationAlerts);

      // Alertes de performance modèle
      const performanceAlerts = this.generatePerformanceAlerts(state);
      alerts.push(...performanceAlerts);

      return alerts.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity));

    } catch (error) {
      this.log('error', 'Failed to generate alerts', { error: error instanceof Error ? error.message : error });
      return [];
    }
  }

  // Génération des recommandations basées sur les patterns de demande
  private generateDemandBasedRecommendations(state: StockAnalysisState): Recommendation[] {
    const recommendations: Recommendation[] = [];

    for (const pattern of state.processed_insights.demand_patterns) {
      const baseRecommendation = {
        id: this.generateRecommendationId(),
        product_id: pattern.product_id,
        agent_source: this.config.id,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      };

      switch (pattern.pattern_type) {
        case 'SEASONAL':
          if (pattern.seasonality_strength > 0.7) {
            recommendations.push({
              ...baseRecommendation,
              type: 'OPTIMIZE',
              priority: 'HIGH',
              action: 'Optimiser stock saisonnier',
              reasoning: `Produit avec forte saisonnalité (${(pattern.seasonality_strength * 100).toFixed(0)}%). Ajuster les niveaux de stock selon les saisons.`,
              expected_impact: 'Réduction des ruptures de 25% et optimisation des coûts de stockage',
              confidence_score: pattern.confidence,
              estimated_benefit: 1000 // Estimation simplifiée
            });
          }
          break;

        case 'ERRATIC':
          if (pattern.volatility > 0.6) {
            recommendations.push({
              ...baseRecommendation,
              type: 'ADJUST',
              priority: 'MEDIUM',
              action: 'Réviser stratégie de stock',
              reasoning: `Demande très volatile (${(pattern.volatility * 100).toFixed(0)}%). Considérer une approche de sécurité renforcée.`,
              expected_impact: 'Amélioration du service client malgré la volatilité',
              confidence_score: pattern.confidence,
              estimated_cost: 500
            });
          }
          break;

        case 'TRENDING':
          if (pattern.trend_strength > 0.3) {
            const direction = pattern.trend_direction === 'UP' ? 'croissante' : 'décroissante';
            recommendations.push({
              ...baseRecommendation,
              type: 'ADJUST',
              priority: pattern.trend_direction === 'UP' ? 'HIGH' : 'MEDIUM',
              action: `Ajuster pour tendance ${direction}`,
              reasoning: `Tendance ${direction} forte détectée (${(pattern.trend_strength * 100).toFixed(0)}%). Adapter les niveaux de commande.`,
              expected_impact: `Éviter les ${pattern.trend_direction === 'UP' ? 'ruptures' : 'surstocks'} liés à la tendance`,
              confidence_score: pattern.confidence,
              estimated_benefit: pattern.trend_direction === 'UP' ? 1500 : 800
            });
          }
          break;
      }
    }

    return recommendations;
  }

  // Génération des recommandations basées sur les prévisions
  private generateForecastBasedRecommendations(state: StockAnalysisState): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Recommandations pour les prévisions court terme
    for (const forecast of state.forecasts.short_term) {
      if (forecast.accuracy_score < 0.6) {
        recommendations.push({
          id: this.generateRecommendationId(),
          type: 'ALERT',
          priority: 'MEDIUM',
          product_id: forecast.product_id,
          action: 'Vérifier qualité des données',
          reasoning: `Faible confiance dans les prévisions court terme (${(forecast.accuracy_score * 100).toFixed(0)}%)`,
          expected_impact: 'Amélioration de la précision des prévisions futures',
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          confidence_score: 0.8,
          agent_source: this.config.id
        });
      }

      // Recommandations pour demande élevée prévue
      if (forecast.predicted_demand > forecast.confidence_95[1] * 0.8) {
        recommendations.push({
          id: this.generateRecommendationId(),
          type: 'ORDER',
          priority: 'HIGH',
          product_id: forecast.product_id,
          action: 'Commande anticipée recommandée',
          reasoning: `Pic de demande prévu (${forecast.predicted_demand.toFixed(0)} unités) pour ${forecast.forecast_date.toLocaleDateString()}`,
          expected_impact: 'Éviter rupture de stock durant pic de demande',
          deadline: new Date(forecast.forecast_date.getTime() - 7 * 24 * 60 * 60 * 1000),
          estimated_benefit: 2000,
          confidence_score: forecast.accuracy_score,
          agent_source: this.config.id
        });
      }
    }

    return recommendations;
  }

  // Génération des recommandations basées sur la segmentation
  private generateSegmentationRecommendations(state: StockAnalysisState): Recommendation[] {
    const recommendations: Recommendation[] = [];

    for (const segment of state.processed_insights.product_segments) {
      const baseRecommendation = {
        id: this.generateRecommendationId(),
        product_id: segment.product_id,
        agent_source: this.config.id,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 jours
      };

      // Recommandations pour produits critiques (A-X)
      if (segment.strategic_importance === 'CRITICAL') {
        recommendations.push({
          ...baseRecommendation,
          type: 'OPTIMIZE',
          priority: 'CRITICAL',
          action: 'Monitoring renforcé produit critique',
          reasoning: `Produit critique (${segment.abc_classification}-${segment.xyz_classification}) nécessitant un suivi particulier`,
          expected_impact: 'Garantir disponibilité continue du produit stratégique',
          confidence_score: 0.9,
          estimated_benefit: 5000
        });
      }

      // Recommandations pour produits imprévisibles (Z)
      if (segment.xyz_classification === 'Z') {
        recommendations.push({
          ...baseRecommendation,
          type: 'ADJUST',
          priority: 'MEDIUM',
          action: 'Stratégie adaptée produit imprévisible',
          reasoning: `Produit de classe Z (imprévisible) - considérer stock de sécurité renforcé`,
          expected_impact: 'Réduction des ruptures malgré imprévisibilité',
          confidence_score: 0.7,
          estimated_cost: 300
        });
      }

      // Recommandations pour produits à rotation lente
      if (segment.velocity === 'SLOW' && segment.abc_classification === 'C') {
        recommendations.push({
          ...baseRecommendation,
          type: 'OPTIMIZE',
          priority: 'LOW',
          action: 'Réviser politique de stock lent',
          reasoning: `Produit C à rotation lente - optimiser niveaux pour réduire immobilisation`,
          expected_impact: 'Libération de cash flow',
          confidence_score: 0.8,
          estimated_benefit: 800
        });
      }
    }

    return recommendations;
  }

  // Priorisation des recommandations
  private prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a, b) => {
      // Tri par priorité, puis par impact financier, puis par confiance
      const priorityWeight = this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
      if (priorityWeight !== 0) return priorityWeight;

      const impactWeight = (b.estimated_benefit || 0) - (a.estimated_benefit || 0);
      if (impactWeight !== 0) return impactWeight;

      return b.confidence_score - a.confidence_score;
    });
  }

  // Génération d'alertes spécifiques

  private generateStockoutAlerts(state: StockAnalysisState): Alert[] {
    const alerts: Alert[] = [];

    // Recherche des produits avec risque de rupture dans les 7 jours
    for (const forecast of state.forecasts.short_term) {
      const currentInventory = state.raw_data.current_inventory.find(
        inv => inv.product_id === forecast.product_id
      );

      if (currentInventory) {
        const daysUntilStockout = currentInventory.available_quantity / Math.max(forecast.predicted_demand, 1);
        
        if (daysUntilStockout < 7) {
          alerts.push({
            id: this.generateAlertId(),
            type: 'STOCKOUT_RISK',
            severity: daysUntilStockout < 3 ? 'CRITICAL' : 'HIGH',
            product_id: forecast.product_id,
            message: 'Risque de rupture de stock imminent',
            details: `Stock actuel: ${currentInventory.available_quantity} unités. Rupture prévue dans ${daysUntilStockout.toFixed(1)} jours.`,
            created_at: new Date(),
            estimated_impact: {
              financial: forecast.predicted_demand * 50, // Estimation perte CA
              operational: 'Rupture de stock client'
            },
            recommended_action: `Commande urgente de ${Math.ceil(forecast.predicted_demand * 14)} unités`
          });
        }
      }
    }

    return alerts;
  }

  private generateOverstockAlerts(state: StockAnalysisState): Alert[] {
    const alerts: Alert[] = [];

    for (const inventory of state.raw_data.current_inventory) {
      const forecast = state.forecasts.medium_term.find(f => f.product_id === inventory.product_id);
      
      if (forecast) {
        const monthlyDemand = forecast.predicted_demand * 30;
        const monthsOfStock = inventory.available_quantity / Math.max(monthlyDemand, 1);
        
        if (monthsOfStock > 6) { // Plus de 6 mois de stock
          alerts.push({
            id: this.generateAlertId(),
            type: 'OVERSTOCK',
            severity: monthsOfStock > 12 ? 'HIGH' : 'MEDIUM',
            product_id: inventory.product_id,
            message: 'Surstockage détecté',
            details: `Stock actuel: ${inventory.available_quantity} unités représentant ${monthsOfStock.toFixed(1)} mois de demande.`,
            created_at: new Date(),
            estimated_impact: {
              financial: inventory.available_quantity * 20, // Coût de stockage estimé
              operational: 'Immobilisation excessive de capital'
            },
            recommended_action: 'Considérer promotion ou révision de la politique de commande'
          });
        }
      }
    }

    return alerts;
  }

  private generateDeviationAlerts(state: StockAnalysisState): Alert[] {
    const alerts: Alert[] = [];

    // Alertes basées sur les écarts de prévision (simulé)
    for (const forecast of state.forecasts.short_term) {
      if (forecast.accuracy_score < 0.5) {
        alerts.push({
          id: this.generateAlertId(),
          type: 'FORECAST_DEVIATION',
          severity: 'MEDIUM',
          product_id: forecast.product_id,
          message: 'Déviation importante des prévisions',
          details: `Confiance de seulement ${(forecast.accuracy_score * 100).toFixed(0)}% dans les prévisions`,
          created_at: new Date(),
          estimated_impact: {
            financial: 500,
            operational: 'Risque d\'erreur dans planification'
          },
          recommended_action: 'Réviser modèle de prévision et qualité des données'
        });
      }
    }

    return alerts;
  }

  private generatePerformanceAlerts(state: StockAnalysisState): Alert[] {
    const alerts: Alert[] = [];

    // Vérification de la santé des agents
    for (const [agentId, agent] of this.agents.entries()) {
      const health = agent.getHealthMetrics();
      
      if (health.status === 'ERROR' || health.error_rate > 0.1) {
        alerts.push({
          id: this.generateAlertId(),
          type: 'SUPPLIER_ISSUE', // Réutilisation du type existant
          severity: 'HIGH',
          product_id: 'SYSTEM',
          message: `Problème de performance agent ${agentId}`,
          details: `Taux d'erreur: ${(health.error_rate * 100).toFixed(1)}%, Score: ${(health.performance_score * 100).toFixed(0)}%`,
          created_at: new Date(),
          estimated_impact: {
            financial: 1000,
            operational: 'Dégradation qualité des analyses'
          },
          recommended_action: 'Vérifier configuration et données d\'entrée de l\'agent'
        });
      }
    }

    return alerts;
  }

  // Calcul des KPIs globaux
  private calculateKPIs(state: StockAnalysisState): StockManagementKPIs {
    const forecastAccuracy = this.calculateForecastAccuracy(state);
    const serviceMetrics = this.calculateServiceMetrics(state);
    const financialMetrics = this.calculateFinancialMetrics(state);
    const aiPerformance = this.calculateAIPerformance(state);

    return {
      forecast_accuracy: forecastAccuracy,
      service_metrics: serviceMetrics,
      financial_metrics: financialMetrics,
      ai_performance: aiPerformance
    };
  }

  private calculateForecastAccuracy(state: StockAnalysisState): StockManagementKPIs['forecast_accuracy'] {
    const allForecasts = [
      ...state.forecasts.short_term,
      ...state.forecasts.medium_term
    ];

    if (allForecasts.length === 0) {
      return { overall_mape: 100, short_term_mape: 100, medium_term_mape: 100, bias_percentage: 0 };
    }

    const overallMape = this.calculateMean(allForecasts.map(f => (1 - f.accuracy_score) * 100));
    const shortTermMape = state.forecasts.short_term.length > 0 
      ? this.calculateMean(state.forecasts.short_term.map(f => (1 - f.accuracy_score) * 100))
      : 100;
    const mediumTermMape = state.forecasts.medium_term.length > 0
      ? this.calculateMean(state.forecasts.medium_term.map(f => (1 - f.accuracy_score) * 100))
      : 100;

    return {
      overall_mape: overallMape,
      short_term_mape: shortTermMape,
      medium_term_mape: mediumTermMape,
      bias_percentage: 0 // Simplification - nécessiterait comparaison avec données réelles
    };
  }

  private calculateServiceMetrics(state: StockAnalysisState): StockManagementKPIs['service_metrics'] {
    const stockoutAlerts = state.alerts.filter(a => a.type === 'STOCKOUT_RISK');
    const totalProducts = state.raw_data.current_inventory.length;

    return {
      service_level: Math.max(0, 1 - (stockoutAlerts.length / Math.max(totalProducts, 1))) * 100,
      fill_rate: 95, // Simulation - nécessiterait données commandes
      stockout_frequency: stockoutAlerts.filter(a => a.severity === 'CRITICAL').length,
      average_stockout_duration: 1.5 // Simulation
    };
  }

  private calculateFinancialMetrics(state: StockAnalysisState): StockManagementKPIs['financial_metrics'] {
    const totalInventoryValue = state.raw_data.current_inventory.reduce(
      (sum, inv) => sum + inv.available_quantity * 25, 0 // Prix unitaire simulé
    );

    const monthlySales = state.raw_data.sales_history
      .filter(sale => sale.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, sale) => sum + sale.revenue, 0);

    return {
      inventory_turnover: monthlySales > 0 ? (monthlySales * 12) / totalInventoryValue : 0,
      days_of_inventory: totalInventoryValue > 0 ? (totalInventoryValue / (monthlySales / 30)) : 0,
      holding_cost_percentage: 12, // Simulation - 12% annuel
      dead_stock_ratio: 5 // Simulation - 5% de stock dormant
    };
  }

  private calculateAIPerformance(state: StockAnalysisState): StockManagementKPIs['ai_performance'] {
    const totalAlerts = state.alerts.length;
    const highPriorityAlerts = state.alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;

    return {
      alert_precision: totalAlerts > 0 ? (highPriorityAlerts / totalAlerts) * 100 : 0,
      recommendation_adoption: 75, // Simulation - nécessiterait tracking utilisateur
      proactive_prevention: 60, // Simulation
      model_stability: 85 // Simulation
    };
  }

  // Mise à jour des métriques temps réel
  private updateRealTimeMetrics(state: StockAnalysisState): RealTimeMetrics {
    const currentAlerts = state.alerts.filter(a => !a.resolved_at);
    const inventoryStatus = this.calculateInventoryStatus(state);
    const agentHealth = this.calculateAgentHealth();

    return {
      current_alerts: currentAlerts,
      forecast_confidence_today: this.calculateTodayForecastConfidence(state),
      inventory_status: inventoryStatus,
      agent_health: agentHealth
    };
  }

  private calculateInventoryStatus(state: StockAnalysisState) {
    const inventory = state.raw_data.current_inventory;
    const stockoutAlerts = state.alerts.filter(a => a.type === 'STOCKOUT_RISK');
    const overstockAlerts = state.alerts.filter(a => a.type === 'OVERSTOCK');

    return {
      products_below_min: stockoutAlerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length,
      products_above_max: overstockAlerts.length,
      predicted_stockouts_7d: stockoutAlerts.length,
      total_inventory_value: inventory.reduce((sum, inv) => sum + inv.available_quantity * 25, 0)
    };
  }

  private calculateAgentHealth(): RealTimeMetrics['agent_health'] {
    const agentHealth: RealTimeMetrics['agent_health'] = {};

    for (const [agentId, agent] of this.agents.entries()) {
      agentHealth[agentId] = agent.getHealthMetrics();
    }

    return agentHealth;
  }

  private calculateTodayForecastConfidence(state: StockAnalysisState): number {
    const todayForecasts = state.forecasts.short_term.filter(f => 
      this.daysBetween(new Date(), f.forecast_date) <= 1
    );

    return todayForecasts.length > 0 
      ? this.calculateMean(todayForecasts.map(f => f.accuracy_score)) * 100
      : 0;
  }

  // Méthodes utilitaires

  private generateWorkflowId(): string {
    return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRecommendationId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateInputSize(input: any): number {
    if (!input) return 0;
    return (input.sales_history?.length || 0) + (input.inventory_history?.length || 0);
  }

  private daysBetween(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  private extractConfidenceIntervals(forecasts: any[]): { [product_id: string]: [number, number] } {
    const intervals: { [product_id: string]: [number, number] } = {};
    
    for (const forecast of forecasts) {
      if (!intervals[forecast.product_id]) {
        intervals[forecast.product_id] = forecast.confidence_95;
      }
    }
    
    return intervals;
  }

  private getSeverityWeight(severity: Alert['severity']): number {
    switch (severity) {
      case 'CRITICAL': return 4;
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  }

  private getPriorityWeight(priority: Recommendation['priority']): number {
    switch (priority) {
      case 'CRITICAL': return 4;
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  }

  private calculateOverallConfidence(workflowResult: WorkflowResult): number {
    const performances = Object.values(workflowResult.performance_summary.agents_performance);
    if (performances.length === 0) return 0;

    return this.calculateMean(performances.map(p => p.confidence_score));
  }

  private calculateWorkflowAccuracy(workflowResult: WorkflowResult): number {
    const performances = Object.values(workflowResult.performance_summary.agents_performance);
    if (performances.length === 0) return 0;

    return this.calculateMean(performances.map(p => p.metrics.accuracy || 0));
  }

  private generateExecutionSummary(workflowResult: WorkflowResult, marketIntelligence?: any): string {
    const executionTime = workflowResult.performance_summary.total_execution_time_ms;
    const agentsCount = workflowResult.agents_executed.length;
    const recommendationsCount = workflowResult.recommendations.length;
    const alertsCount = workflowResult.alerts.length;

    let summary = `Workflow Phase 3 exécuté en ${executionTime}ms avec ${agentsCount} agents. ` +
                  `Généré ${recommendationsCount} recommandations et ${alertsCount} alertes. ` +
                  `Confiance globale: ${(this.calculateOverallConfidence(workflowResult) * 100).toFixed(0)}%.`;

    if (marketIntelligence) {
      const marketInsights = marketIntelligence.market_insights?.length || 0;
      const competitorActions = marketIntelligence.competitor_analysis?.reduce((sum: number, comp: any) => 
        sum + (comp.actions_detected?.length || 0), 0) || 0;
      const marketEvents = marketIntelligence.market_events?.length || 0;

      summary += ` Intelligence marché: ${marketInsights} insights, ${competitorActions} actions concurrentielles, ${marketEvents} événements détectés.`;
    }

    return summary;
  }
}