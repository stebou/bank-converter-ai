// Anomaly Detection Agent - Détection d'anomalies et alertes temps réel

import { BaseAgent } from './base-agent';
import type { 
  AgentConfig, 
  AgentExecutionResult, 
  StockAnalysisState,
  SalesRecord,
  ForecastResult,
  Alert,
  DemandPattern
} from '@/types/ai-agents';

interface AnomalyDetectionInput {
  sales_history: SalesRecord[];
  forecasts: ForecastResult[];
  demand_patterns: DemandPattern[];
  current_inventory: any[];
  real_time_data?: {
    current_sales: SalesRecord[];
    stock_movements: any[];
    supplier_alerts: any[];
  };
  detection_parameters: {
    sensitivity_level: 'LOW' | 'MEDIUM' | 'HIGH';
    anomaly_threshold: number; // Seuil de détection (nombre d'écarts-types)
    trend_detection_window: number; // Fenêtre d'analyse en jours
    seasonal_adjustment: boolean;
  };
}

interface AnomalyResult {
  product_id: string;
  anomaly_type: 'DEMAND_SPIKE' | 'DEMAND_DROP' | 'FORECAST_DEVIATION' | 'INVENTORY_DRIFT' | 'SUPPLIER_ISSUE' | 'SEASONAL_SHIFT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detected_at: Date;
  description: string;
  current_value: number;
  expected_value: number;
  deviation_score: number; // Nombre d'écarts-types
  confidence_score: number;
  impact_assessment: {
    financial_impact: number;
    operational_impact: string;
    customer_impact: string;
  };
  root_cause_analysis: string[];
  recommended_actions: string[];
}

interface StatisticalBaseline {
  product_id: string;
  mean: number;
  std_dev: number;
  median: number;
  q25: number;
  q75: number;
  iqr: number;
  seasonal_adjustments: { [month: number]: number };
  trend_coefficient: number;
  last_updated: Date;
}

export class AnomalyDetectionAgent extends BaseAgent {
  private baselines: Map<string, StatisticalBaseline> = new Map();
  private anomalyHistory: AnomalyResult[] = [];

  constructor() {
    const config: AgentConfig = {
      id: 'anomaly-detection',
      name: 'Anomaly Detection Agent',
      version: '1.0.0',
      capabilities: [
        'real_time_anomaly_detection',
        'statistical_baseline_learning',
        'trend_change_detection',
        'seasonal_anomaly_detection',
        'forecast_deviation_monitoring',
        'supply_chain_disruption_detection'
      ],
      dependencies: ['data-analysis', 'forecasting'],
      performance_targets: {
        max_execution_time_ms: 5000,
        min_accuracy_score: 0.85,
        max_error_rate: 0.05
      }
    };

    super(config);
  }

  async execute(input: AnomalyDetectionInput, state: StockAnalysisState): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      this.log('info', 'Starting anomaly detection analysis', {
        productsCount: input.demand_patterns.length,
        sensitivityLevel: input.detection_parameters.sensitivity_level,
        threshold: input.detection_parameters.anomaly_threshold
      });

      // 1. Calcul/mise à jour des baselines statistiques
      await this.updateStatisticalBaselines(input);

      // 2. Détection d'anomalies de demande
      const demandAnomalies = await this.detectDemandAnomalies(input);

      // 3. Détection d'anomalies de prévision
      const forecastAnomalies = await this.detectForecastDeviations(input);

      // 4. Détection d'anomalies d'inventaire
      const inventoryAnomalies = await this.detectInventoryAnomalies(input);

      // 5. Détection d'anomalies saisonnières
      const seasonalAnomalies = await this.detectSeasonalAnomalies(input);

      // 6. Détection d'anomalies de chaîne d'approvisionnement
      const supplyChainAnomalies = await this.detectSupplyChainAnomalies(input);

      // 7. Consolidation et priorisation des anomalies
      const allAnomalies = [
        ...demandAnomalies,
        ...forecastAnomalies,
        ...inventoryAnomalies,
        ...seasonalAnomalies,
        ...supplyChainAnomalies
      ];

      const prioritizedAnomalies = this.prioritizeAnomalies(allAnomalies);

      // 8. Génération d'alertes temps réel
      const realTimeAlerts = await this.generateRealTimeAlerts(prioritizedAnomalies);

      // 9. Analyse des tendances d'anomalies
      const trendAnalysis = this.analyzeTrends(prioritizedAnomalies);

      // 10. Mise à jour de l'historique
      this.updateAnomalyHistory(prioritizedAnomalies);

      const executionTime = Date.now() - startTime;

      this.log('info', 'Anomaly detection completed', {
        totalAnomalies: prioritizedAnomalies.length,
        criticalAnomalies: prioritizedAnomalies.filter(a => a.severity === 'CRITICAL').length,
        realTimeAlerts: realTimeAlerts.length,
        executionTimeMs: executionTime
      });

      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: true,
        confidence_score: this.calculateDetectionConfidence(prioritizedAnomalies),
        output: {
          anomalies_detected: prioritizedAnomalies,
          real_time_alerts: realTimeAlerts,
          statistical_baselines: Array.from(this.baselines.values()),
          trend_analysis: trendAnalysis,
          detection_summary: this.generateDetectionSummary(prioritizedAnomalies),
          recommendations: this.generateSystemRecommendations(prioritizedAnomalies)
        },
        metrics: {
          accuracy: this.calculateAccuracy(prioritizedAnomalies),
          processing_speed: prioritizedAnomalies.length / executionTime * 1000,
          resource_usage: executionTime
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', 'Anomaly detection failed', { 
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

  // Mise à jour des baselines statistiques
  private async updateStatisticalBaselines(input: AnomalyDetectionInput): Promise<void> {
    const productIds = [...new Set(input.sales_history.map(sale => sale.product_id))];

    for (const productId of productIds) {
      const productSales = input.sales_history.filter(sale => sale.product_id === productId);
      const baseline = this.calculateStatisticalBaseline(productId, productSales, input.detection_parameters);
      this.baselines.set(productId, baseline);
    }

    this.log('info', 'Statistical baselines updated', { baselineCount: this.baselines.size });
  }

  private calculateStatisticalBaseline(
    productId: string, 
    sales: SalesRecord[], 
    params: AnomalyDetectionInput['detection_parameters']
  ): StatisticalBaseline {
    const dailyDemands = this.aggregateDailyDemands(sales);
    const values = Object.values(dailyDemands);

    if (values.length === 0) {
      return this.createEmptyBaseline(productId);
    }

    // Calculs statistiques de base
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Calculs de percentiles
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = this.calculatePercentile(sortedValues, 0.5);
    const q25 = this.calculatePercentile(sortedValues, 0.25);
    const q75 = this.calculatePercentile(sortedValues, 0.75);
    const iqr = q75 - q25;

    // Ajustements saisonniers
    const seasonalAdjustments = params.seasonal_adjustment 
      ? this.calculateSeasonalAdjustments(sales)
      : {};

    // Coefficient de tendance
    const trendCoefficient = this.calculateTrendCoefficient(values);

    return {
      product_id: productId,
      mean,
      std_dev: stdDev,
      median,
      q25,
      q75,
      iqr,
      seasonal_adjustments: seasonalAdjustments,
      trend_coefficient: trendCoefficient,
      last_updated: new Date()
    };
  }

  // Détection d'anomalies de demande
  private async detectDemandAnomalies(input: AnomalyDetectionInput): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];
    const recentWindow = 7; // Derniers 7 jours

    for (const [productId, baseline] of this.baselines.entries()) {
      const recentSales = input.sales_history
        .filter(sale => 
          sale.product_id === productId && 
          sale.date > new Date(Date.now() - recentWindow * 24 * 60 * 60 * 1000)
        );

      if (recentSales.length === 0) continue;

      const recentDemand = recentSales.reduce((sum, sale) => sum + sale.quantity_sold, 0);
      const expectedDemand = baseline.mean * recentWindow;
      
      // Ajustement saisonnier si activé
      const currentMonth = new Date().getMonth();
      const seasonalAdjustment = input.detection_parameters.seasonal_adjustment 
        ? (baseline.seasonal_adjustments[currentMonth] || 1)
        : 1;
      
      const adjustedExpectedDemand = expectedDemand * seasonalAdjustment;
      const threshold = input.detection_parameters.anomaly_threshold;
      const deviationScore = Math.abs(recentDemand - adjustedExpectedDemand) / (baseline.std_dev * Math.sqrt(recentWindow));

      if (deviationScore > threshold) {
        const isSpike = recentDemand > adjustedExpectedDemand;
        
        anomalies.push({
          product_id: productId,
          anomaly_type: isSpike ? 'DEMAND_SPIKE' : 'DEMAND_DROP',
          severity: this.calculateSeverity(deviationScore, threshold),
          detected_at: new Date(),
          description: `${isSpike ? 'Pic' : 'Chute'} de demande anormal détecté sur ${recentWindow} jours`,
          current_value: recentDemand,
          expected_value: adjustedExpectedDemand,
          deviation_score: deviationScore,
          confidence_score: Math.min(0.95, deviationScore / threshold),
          impact_assessment: this.assessImpact(productId, isSpike ? 'spike' : 'drop', recentDemand, adjustedExpectedDemand),
          root_cause_analysis: this.analyzeRootCause(productId, isSpike ? 'spike' : 'drop', input),
          recommended_actions: this.generateActionRecommendations(productId, isSpike ? 'spike' : 'drop', deviationScore)
        });
      }
    }

    return anomalies;
  }

  // Détection d'écarts de prévision
  private async detectForecastDeviations(input: AnomalyDetectionInput): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];
    const comparisonWindow = 7; // Comparaison sur 7 jours

    for (const forecast of input.forecasts) {
      const actualSales = input.sales_history
        .filter(sale => 
          sale.product_id === forecast.product_id &&
          this.isSameDay(sale.date, forecast.forecast_date)
        )
        .reduce((sum, sale) => sum + sale.quantity_sold, 0);

      if (actualSales === 0) continue;

      const forecastError = Math.abs(actualSales - forecast.predicted_demand) / Math.max(forecast.predicted_demand, 1);
      const errorThreshold = 1 - forecast.accuracy_score; // Seuil basé sur la confiance du modèle

      if (forecastError > errorThreshold * 2) { // Erreur significativement plus élevée que prévu
        anomalies.push({
          product_id: forecast.product_id,
          anomaly_type: 'FORECAST_DEVIATION',
          severity: this.calculateSeverityFromError(forecastError),
          detected_at: new Date(),
          description: `Écart important entre prévision et réalité (${(forecastError * 100).toFixed(0)}% d'erreur)`,
          current_value: actualSales,
          expected_value: forecast.predicted_demand,
          deviation_score: forecastError / errorThreshold,
          confidence_score: Math.min(0.9, 1 - forecastError),
          impact_assessment: this.assessForecastImpact(forecast.product_id, forecastError),
          root_cause_analysis: ['Événement imprévu', 'Changement de comportement client', 'Facteur externe non modélisé'],
          recommended_actions: ['Réviser modèle de prévision', 'Analyser facteurs externes', 'Ajuster paramètres']
        });
      }
    }

    return anomalies;
  }

  // Détection d'anomalies d'inventaire
  private async detectInventoryAnomalies(input: AnomalyDetectionInput): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];

    for (const inventory of input.current_inventory) {
      const baseline = this.baselines.get(inventory.product_id);
      if (!baseline) continue;

      // Calcul de la couverture de stock en jours
      const dailyDemandAvg = baseline.mean;
      const daysOfStock = inventory.available_quantity / Math.max(dailyDemandAvg, 0.1);

      // Détection de surstockage
      if (daysOfStock > 90) { // Plus de 3 mois de stock
        anomalies.push({
          product_id: inventory.product_id,
          anomaly_type: 'INVENTORY_DRIFT',
          severity: daysOfStock > 180 ? 'HIGH' : 'MEDIUM',
          detected_at: new Date(),
          description: `Surstockage détecté: ${daysOfStock.toFixed(0)} jours de couverture`,
          current_value: inventory.available_quantity,
          expected_value: dailyDemandAvg * 30, // Stock pour 30 jours
          deviation_score: daysOfStock / 30,
          confidence_score: 0.8,
          impact_assessment: this.assessInventoryImpact(inventory.product_id, 'overstock', daysOfStock),
          root_cause_analysis: ['Baisse de demande', 'Surcommande', 'Retards de vente'],
          recommended_actions: ['Promotion commerciale', 'Révision politique commande', 'Analyse de la demande']
        });
      }

      // Détection de sous-stockage critique
      if (daysOfStock < 3) {
        anomalies.push({
          product_id: inventory.product_id,
          anomaly_type: 'INVENTORY_DRIFT',
          severity: daysOfStock < 1 ? 'CRITICAL' : 'HIGH',
          detected_at: new Date(),
          description: `Risque de rupture critique: seulement ${daysOfStock.toFixed(1)} jours de stock`,
          current_value: inventory.available_quantity,
          expected_value: dailyDemandAvg * 14, // Stock pour 14 jours
          deviation_score: (14 - daysOfStock) / 14,
          confidence_score: 0.9,
          impact_assessment: this.assessInventoryImpact(inventory.product_id, 'understock', daysOfStock),
          root_cause_analysis: ['Retard livraison', 'Pic de demande', 'Erreur de commande'],
          recommended_actions: ['Commande urgente', 'Contact fournisseur', 'Stock de sécurité temporaire']
        });
      }
    }

    return anomalies;
  }

  // Détection d'anomalies saisonnières
  private async detectSeasonalAnomalies(input: AnomalyDetectionInput): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];
    
    if (!input.detection_parameters.seasonal_adjustment) {
      return anomalies;
    }

    const currentMonth = new Date().getMonth();
    
    for (const pattern of input.demand_patterns) {
      if (pattern.pattern_type !== 'SEASONAL') continue;

      const baseline = this.baselines.get(pattern.product_id);
      if (!baseline) continue;

      const expectedSeasonalMultiplier = baseline.seasonal_adjustments[currentMonth] || 1;
      const recentSales = input.sales_history
        .filter(sale => 
          sale.product_id === pattern.product_id && 
          sale.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

      if (recentSales.length === 0) continue;

      const recentAvgDaily = recentSales.reduce((sum, sale) => sum + sale.quantity_sold, 0) / 30;
      const expectedSeasonalDemand = baseline.mean * expectedSeasonalMultiplier;
      const seasonalDeviation = Math.abs(recentAvgDaily - expectedSeasonalDemand) / expectedSeasonalDemand;

      if (seasonalDeviation > 0.3) { // 30% d'écart par rapport au pattern saisonnier
        anomalies.push({
          product_id: pattern.product_id,
          anomaly_type: 'SEASONAL_SHIFT',
          severity: seasonalDeviation > 0.5 ? 'HIGH' : 'MEDIUM',
          detected_at: new Date(),
          description: `Déviation du pattern saisonnier habituel (${(seasonalDeviation * 100).toFixed(0)}% d'écart)`,
          current_value: recentAvgDaily,
          expected_value: expectedSeasonalDemand,
          deviation_score: seasonalDeviation / 0.3,
          confidence_score: pattern.confidence,
          impact_assessment: this.assessSeasonalImpact(pattern.product_id, seasonalDeviation),
          root_cause_analysis: ['Changement tendance marché', 'Événement exceptionnel', 'Evolution comportement client'],
          recommended_actions: ['Réviser modèle saisonnier', 'Analyser concurrence', 'Enquête satisfaction client']
        });
      }
    }

    return anomalies;
  }

  // Détection d'anomalies de chaîne d'approvisionnement
  private async detectSupplyChainAnomalies(input: AnomalyDetectionInput): Promise<AnomalyResult[]> {
    const anomalies: AnomalyResult[] = [];

    // Simulation d'anomalies fournisseur (dans un vrai système, ceci viendrait des données réelles)
    if (input.real_time_data?.supplier_alerts) {
      for (const alert of input.real_time_data.supplier_alerts) {
        anomalies.push({
          product_id: alert.product_id,
          anomaly_type: 'SUPPLIER_ISSUE',
          severity: alert.severity,
          detected_at: new Date(),
          description: alert.description,
          current_value: alert.current_lead_time,
          expected_value: alert.expected_lead_time,
          deviation_score: alert.impact_score,
          confidence_score: 0.9,
          impact_assessment: this.assessSupplyChainImpact(alert.product_id, alert.type),
          root_cause_analysis: alert.root_causes || ['Problème fournisseur'],
          recommended_actions: alert.recommendations || ['Contacter fournisseur alternatif']
        });
      }
    }

    return anomalies;
  }

  // Méthodes utilitaires

  private aggregateDailyDemands(sales: SalesRecord[]): { [date: string]: number } {
    const dailyDemands: { [date: string]: number } = {};

    for (const sale of sales) {
      const dateKey = sale.date.toISOString().split('T')[0];
      dailyDemands[dateKey] = (dailyDemands[dateKey] || 0) + sale.quantity_sold;
    }

    return dailyDemands;
  }

  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = percentile * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }

  private calculateSeasonalAdjustments(sales: SalesRecord[]): { [month: number]: number } {
    const monthlyTotals: { [month: number]: number } = {};
    const monthlyCounts: { [month: number]: number } = {};

    for (const sale of sales) {
      const month = sale.date.getMonth();
      monthlyTotals[month] = (monthlyTotals[month] || 0) + sale.quantity_sold;
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    }

    const monthlyAverages: { [month: number]: number } = {};
    for (let month = 0; month < 12; month++) {
      monthlyAverages[month] = (monthlyTotals[month] || 0) / (monthlyCounts[month] || 1);
    }

    const overallAverage = Object.values(monthlyAverages).reduce((sum, avg) => sum + avg, 0) / 12;
    const adjustments: { [month: number]: number } = {};

    for (let month = 0; month < 12; month++) {
      adjustments[month] = monthlyAverages[month] / overallAverage;
    }

    return adjustments;
  }

  private calculateTrendCoefficient(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private calculateSeverity(deviationScore: number, threshold: number): AnomalyResult['severity'] {
    const ratio = deviationScore / threshold;
    if (ratio > 3) return 'CRITICAL';
    if (ratio > 2) return 'HIGH';
    if (ratio > 1.5) return 'MEDIUM';
    return 'LOW';
  }

  private calculateSeverityFromError(errorRate: number): AnomalyResult['severity'] {
    if (errorRate > 0.8) return 'CRITICAL';
    if (errorRate > 0.5) return 'HIGH';
    if (errorRate > 0.3) return 'MEDIUM';
    return 'LOW';
  }

  private prioritizeAnomalies(anomalies: AnomalyResult[]): AnomalyResult[] {
    return anomalies.sort((a, b) => {
      const severityWeight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const severityDiff = severityWeight[b.severity] - severityWeight[a.severity];
      if (severityDiff !== 0) return severityDiff;

      return b.deviation_score - a.deviation_score;
    });
  }

  private async generateRealTimeAlerts(anomalies: AnomalyResult[]): Promise<Alert[]> {
    const alerts: Alert[] = [];

    for (const anomaly of anomalies) {
      if (anomaly.severity === 'CRITICAL' || anomaly.severity === 'HIGH') {
        alerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: anomaly.anomaly_type,
          severity: anomaly.severity,
          product_id: anomaly.product_id,
          message: anomaly.description,
          details: `Valeur actuelle: ${anomaly.current_value}, Valeur attendue: ${anomaly.expected_value}`,
          created_at: anomaly.detected_at,
          estimated_impact: {
            financial: anomaly.impact_assessment.financial_impact,
            operational: anomaly.impact_assessment.operational_impact
          },
          recommended_action: anomaly.recommended_actions[0] || 'Investigation requise'
        });
      }
    }

    return alerts;
  }

  private analyzeTrends(anomalies: AnomalyResult[]): any {
    const trendsByType: { [key: string]: number } = {};
    const trendsBySeverity: { [key: string]: number } = {};

    for (const anomaly of anomalies) {
      trendsByType[anomaly.anomaly_type] = (trendsByType[anomaly.anomaly_type] || 0) + 1;
      trendsBySeverity[anomaly.severity] = (trendsBySeverity[anomaly.severity] || 0) + 1;
    }

    return {
      total_anomalies: anomalies.length,
      anomalies_by_type: trendsByType,
      anomalies_by_severity: trendsBySeverity,
      most_frequent_type: Object.entries(trendsByType).sort(([,a], [,b]) => b - a)[0]?.[0] || 'NONE',
      trend_analysis: this.calculateAnomalyTrend()
    };
  }

  private updateAnomalyHistory(anomalies: AnomalyResult[]): void {
    this.anomalyHistory.push(...anomalies);
    
    // Garder seulement les 1000 dernières anomalies
    if (this.anomalyHistory.length > 1000) {
      this.anomalyHistory = this.anomalyHistory.slice(-1000);
    }
  }

  // Méthodes d'évaluation d'impact

  private assessImpact(productId: string, type: 'spike' | 'drop', currentValue: number, expectedValue: number): AnomalyResult['impact_assessment'] {
    const difference = Math.abs(currentValue - expectedValue);
    const financialImpact = difference * 25; // Estimation coût unitaire

    return {
      financial_impact: financialImpact,
      operational_impact: type === 'spike' ? 'Risque de rupture' : 'Surstockage potentiel',
      customer_impact: type === 'spike' ? 'Satisfaction accrue' : 'Risque de mécontentement'
    };
  }

  private assessForecastImpact(productId: string, errorRate: number): AnomalyResult['impact_assessment'] {
    return {
      financial_impact: errorRate * 1000,
      operational_impact: 'Planification compromise',
      customer_impact: 'Service potentiellement dégradé'
    };
  }

  private assessInventoryImpact(productId: string, type: 'overstock' | 'understock', daysOfStock: number): AnomalyResult['impact_assessment'] {
    if (type === 'overstock') {
      return {
        financial_impact: daysOfStock * 10,
        operational_impact: 'Immobilisation excessive de capital',
        customer_impact: 'Aucun impact direct'
      };
    } else {
      return {
        financial_impact: (14 - daysOfStock) * 100,
        operational_impact: 'Risque de rupture imminent',
        customer_impact: 'Risque de mécontentement élevé'
      };
    }
  }

  private assessSeasonalImpact(productId: string, deviation: number): AnomalyResult['impact_assessment'] {
    return {
      financial_impact: deviation * 500,
      operational_impact: 'Remise en cause de la planification saisonnière',
      customer_impact: 'Adaptation requise de l\'offre'
    };
  }

  private assessSupplyChainImpact(productId: string, alertType: string): AnomalyResult['impact_assessment'] {
    return {
      financial_impact: 750,
      operational_impact: 'Chaîne d\'approvisionnement perturbée',
      customer_impact: 'Risque de retards de livraison'
    };
  }

  // Méthodes d'analyse des causes

  private analyzeRootCause(productId: string, type: 'spike' | 'drop', input: AnomalyDetectionInput): string[] {
    const causes = [];

    if (type === 'spike') {
      causes.push('Promotion ou événement marketing');
      causes.push('Rupture chez concurrent');
      causes.push('Événement médiatique favorable');
      causes.push('Commande exceptionnelle');
    } else {
      causes.push('Problème qualité produit');
      causes.push('Concurrence accrue');
      causes.push('Changement de saison');
      causes.push('Problème économique général');
    }

    return causes;
  }

  private generateActionRecommendations(productId: string, type: 'spike' | 'drop', deviationScore: number): string[] {
    const actions = [];

    if (type === 'spike') {
      if (deviationScore > 3) {
        actions.push('Commande d\'urgence auprès des fournisseurs');
        actions.push('Activation des stocks de sécurité');
      }
      actions.push('Analyse des causes du pic de demande');
      actions.push('Évaluation de la durabilité de la tendance');
    } else {
      actions.push('Investigation des causes de la baisse');
      actions.push('Révision des prévisions à court terme');
      actions.push('Considérer actions commerciales');
      if (deviationScore > 2) {
        actions.push('Arrêt temporaire des commandes');
      }
    }

    return actions;
  }

  private generateSystemRecommendations(anomalies: AnomalyResult[]): string[] {
    const recommendations = [];
    
    const criticalCount = anomalies.filter(a => a.severity === 'CRITICAL').length;
    if (criticalCount > 0) {
      recommendations.push(`${criticalCount} anomalies critiques détectées - intervention immédiate requise`);
    }

    const demandAnomalies = anomalies.filter(a => a.anomaly_type.includes('DEMAND')).length;
    if (demandAnomalies > anomalies.length * 0.5) {
      recommendations.push('Forte volatilité de la demande - réviser stratégie de prévision');
    }

    const forecastDeviations = anomalies.filter(a => a.anomaly_type === 'FORECAST_DEVIATION').length;
    if (forecastDeviations > 3) {
      recommendations.push('Modèles de prévision défaillants - recalibration nécessaire');
    }

    return recommendations;
  }

  // Méthodes utilitaires finales

  private createEmptyBaseline(productId: string): StatisticalBaseline {
    return {
      product_id: productId,
      mean: 0,
      std_dev: 0,
      median: 0,
      q25: 0,
      q75: 0,
      iqr: 0,
      seasonal_adjustments: {},
      trend_coefficient: 0,
      last_updated: new Date()
    };
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private calculateDetectionConfidence(anomalies: AnomalyResult[]): number {
    if (anomalies.length === 0) return 0.8; // Pas d'anomalies = système stable

    const avgConfidence = anomalies.reduce((sum, anomaly) => sum + anomaly.confidence_score, 0) / anomalies.length;
    return Math.min(0.95, avgConfidence);
  }

  private calculateAccuracy(anomalies: AnomalyResult[]): number {
    // Métrique simple basée sur la cohérence des détections
    const highConfidenceAnomalies = anomalies.filter(a => a.confidence_score > 0.7).length;
    return anomalies.length > 0 ? highConfidenceAnomalies / anomalies.length : 0.9;
  }

  private calculateAnomalyTrend(): string {
    const recentAnomalies = this.anomalyHistory.filter(a => 
      a.detected_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const previousWeekAnomalies = this.anomalyHistory.filter(a => 
      a.detected_at > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
      a.detected_at <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    if (recentAnomalies > previousWeekAnomalies * 1.2) {
      return 'INCREASING';
    } else if (recentAnomalies < previousWeekAnomalies * 0.8) {
      return 'DECREASING';
    } else {
      return 'STABLE';
    }
  }

  private generateDetectionSummary(anomalies: AnomalyResult[]): string {
    const total = anomalies.length;
    const critical = anomalies.filter(a => a.severity === 'CRITICAL').length;
    const high = anomalies.filter(a => a.severity === 'HIGH').length;

    return `Détection de ${total} anomalies: ${critical} critiques, ${high} importantes. ` +
           `Types principaux: ${this.getMostFrequentTypes(anomalies).join(', ')}.`;
  }

  private getMostFrequentTypes(anomalies: AnomalyResult[]): string[] {
    const typeCounts: { [key: string]: number } = {};
    
    for (const anomaly of anomalies) {
      typeCounts[anomaly.anomaly_type] = (typeCounts[anomaly.anomaly_type] || 0) + 1;
    }

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type,]) => type);
  }
}