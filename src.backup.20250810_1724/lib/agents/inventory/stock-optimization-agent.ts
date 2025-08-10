// Stock Optimization Agent - Calculs EOQ, safety stock et points de commande

import { BaseAgent } from '../shared/base-agent';
import type {
  AgentConfig,
  AgentExecutionResult,
  StockAnalysisState,
  SalesRecord,
  DemandPattern,
  OptimizationResult,
  ReorderPoint,
  SafetyStock,
  OrderQuantity,
} from '@/types/ai-agents';

interface StockOptimizationInput {
  sales_history: SalesRecord[];
  demand_patterns: DemandPattern[];
  current_inventory: any[];
  supplier_data: any[];
  cost_parameters: {
    holding_cost_rate: number; // Taux de coût de stockage annuel
    ordering_cost: number; // Coût fixe par commande
    stockout_cost: number; // Coût de rupture par unité
  };
  service_level_target: number; // Niveau de service cible (0.95 = 95%)
  lead_time_days: number; // Délai d'approvisionnement moyen
}

interface EOQResult {
  product_id: string;
  economic_order_quantity: number;
  annual_demand: number;
  holding_cost_per_unit: number;
  ordering_cost: number;
  total_annual_cost: number;
  optimal_order_frequency: number; // Nombre de commandes par an
  cycle_length_days: number;
}

export class StockOptimizationAgent extends BaseAgent {
  private Z_SCORES = {
    0.9: 1.28,
    0.95: 1.65,
    0.97: 1.88,
    0.99: 2.33,
    0.999: 3.09,
  };

  constructor() {
    const config: AgentConfig = {
      id: 'stock-optimization',
      name: 'Stock Optimization Agent',
      version: '1.0.0',
      capabilities: [
        'eoq_calculation',
        'safety_stock_optimization',
        'reorder_point_calculation',
        'abc_xyz_optimization',
        'service_level_optimization',
        'cost_minimization',
      ],
      dependencies: ['data-analysis'],
      performance_targets: {
        max_execution_time_ms: 10000,
        min_accuracy_score: 0.85, // Ajusté pour être plus réaliste
        max_error_rate: 0.01,
      },
    };

    super(config);
  }

  async execute(
    input: StockOptimizationInput,
    state: StockAnalysisState
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      this.log('info', 'Starting stock optimization analysis', {
        productsCount: input.demand_patterns.length,
        serviceLevel: input.service_level_target,
        leadTimeDays: input.lead_time_days,
      });

      // 1. Calcul EOQ pour chaque produit
      const eoqResults = await this.calculateEOQForAllProducts(input);

      // 2. Calcul des stocks de sécurité
      const safetyStockResults = await this.calculateSafetyStocks(input);

      // 3. Calcul des points de commande
      const reorderPoints = await this.calculateReorderPoints(
        input,
        safetyStockResults
      );

      // 4. Optimisation par segmentation ABC/XYZ
      const segmentOptimization = await this.optimizeBySegmentation(
        input,
        state
      );

      // 5. Analyse de sensibilité
      const sensitivityAnalysis = await this.performSensitivityAnalysis(
        input,
        eoqResults
      );

      // 6. Recommandations d'amélioration
      const improvementRecommendations =
        await this.generateImprovementRecommendations(
          eoqResults,
          safetyStockResults,
          reorderPoints
        );

      const executionTime = Date.now() - startTime;

      this.log('info', 'Stock optimization completed', {
        eoqCalculations: eoqResults.length,
        safetyStockCalculations: safetyStockResults.length,
        reorderPoints: reorderPoints.length,
        executionTimeMs: executionTime,
      });

      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: true,
        confidence_score: this.calculateOptimizationConfidence(
          eoqResults,
          safetyStockResults
        ),
        output: {
          eoq_results: eoqResults,
          safety_stocks: safetyStockResults,
          reorder_points: reorderPoints,
          segment_optimization: segmentOptimization,
          sensitivity_analysis: sensitivityAnalysis,
          improvement_recommendations: improvementRecommendations,
          optimization_summary: this.generateOptimizationSummary(
            eoqResults,
            safetyStockResults
          ),
        },
        metrics: {
          accuracy: this.calculateAccuracy(eoqResults),
          processing_speed: (eoqResults.length / executionTime) * 1000,
          resource_usage: executionTime,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', 'Stock optimization failed', {
        error: error instanceof Error ? error.message : error,
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
          resource_usage: executionTime,
        },
      };
    }
  }

  // Calcul EOQ (Economic Order Quantity) - Formule de Wilson
  private async calculateEOQForAllProducts(
    input: StockOptimizationInput
  ): Promise<EOQResult[]> {
    const results: EOQResult[] = [];

    for (const pattern of input.demand_patterns) {
      try {
        const eoqResult = await this.calculateEOQForProduct(pattern, input);
        results.push(eoqResult);
      } catch (error) {
        this.log('warn', 'Failed to calculate EOQ for product', {
          productId: pattern.product_id,
          error: error instanceof Error ? error.message : error,
        });
      }
    }

    return results;
  }

  private async calculateEOQForProduct(
    pattern: DemandPattern,
    input: StockOptimizationInput
  ): Promise<EOQResult> {
    // Calcul de la demande annuelle à partir de l'historique
    const productSales = input.sales_history.filter(
      sale => sale.product_id === pattern.product_id
    );
    const annualDemand = this.calculateAnnualDemand(productSales);

    if (annualDemand <= 0) {
      throw new Error(
        `Invalid annual demand for product ${pattern.product_id}`
      );
    }

    // Estimation du coût unitaire (approximation depuis les ventes)
    const avgUnitPrice = this.calculateAverageUnitPrice(productSales);
    const holdingCostPerUnit =
      avgUnitPrice * input.cost_parameters.holding_cost_rate;

    // Formule EOQ: sqrt((2 * D * S) / H)
    // D = Demande annuelle, S = Coût de commande, H = Coût de stockage unitaire
    const eoq = Math.sqrt(
      (2 * annualDemand * input.cost_parameters.ordering_cost) /
        holdingCostPerUnit
    );

    // Calculs dérivés
    const orderFrequency = annualDemand / eoq;
    const cycleLengthDays = 365 / orderFrequency;

    // Coût total annuel
    const orderingCostAnnual =
      orderFrequency * input.cost_parameters.ordering_cost;
    const holdingCostAnnual = (eoq / 2) * holdingCostPerUnit;
    const totalAnnualCost = orderingCostAnnual + holdingCostAnnual;

    return {
      product_id: pattern.product_id,
      economic_order_quantity: Math.round(eoq),
      annual_demand: annualDemand,
      holding_cost_per_unit: holdingCostPerUnit,
      ordering_cost: input.cost_parameters.ordering_cost,
      total_annual_cost: totalAnnualCost,
      optimal_order_frequency: orderFrequency,
      cycle_length_days: cycleLengthDays,
    };
  }

  // Calcul des stocks de sécurité
  private async calculateSafetyStocks(
    input: StockOptimizationInput
  ): Promise<SafetyStock[]> {
    const results: SafetyStock[] = [];

    for (const pattern of input.demand_patterns) {
      try {
        const safetyStock = await this.calculateSafetyStockForProduct(
          pattern,
          input
        );
        results.push(safetyStock);
      } catch (error) {
        this.log('warn', 'Failed to calculate safety stock for product', {
          productId: pattern.product_id,
          error: error instanceof Error ? error.message : error,
        });
      }
    }

    return results;
  }

  private async calculateSafetyStockForProduct(
    pattern: DemandPattern,
    input: StockOptimizationInput
  ): Promise<SafetyStock> {
    const productSales = input.sales_history.filter(
      sale => sale.product_id === pattern.product_id
    );

    // Calcul de la demande moyenne et écart-type durant le délai d'approvisionnement
    const demandStats = this.calculateDemandStatistics(
      productSales,
      input.lead_time_days
    );

    // Calcul du facteur de sécurité (Z-score) basé sur le niveau de service
    const zScore = this.getServiceLevelZScore(input.service_level_target);

    // Formule stock de sécurité: Z * σ_LT
    // où σ_LT est l'écart-type de la demande pendant le délai d'approvisionnement
    const safetyStockQuantity = Math.ceil(zScore * demandStats.leadTimeStdDev);

    // Ajustement basé sur la volatilité du produit
    const volatilityAdjustment = this.calculateVolatilityAdjustment(pattern);
    const adjustedSafetyStock = Math.ceil(
      safetyStockQuantity * volatilityAdjustment
    );

    // Calcul du coût du stock de sécurité
    const avgUnitPrice = this.calculateAverageUnitPrice(productSales);
    const safetyStockCost =
      adjustedSafetyStock *
      avgUnitPrice *
      input.cost_parameters.holding_cost_rate;

    return {
      product_id: pattern.product_id,
      safety_stock_quantity: adjustedSafetyStock,
      service_level: input.service_level_target,
      lead_time_days: input.lead_time_days,
      demand_mean_during_lead_time: demandStats.leadTimeMean,
      demand_std_during_lead_time: demandStats.leadTimeStdDev,
      z_score: zScore,
      volatility_adjustment: volatilityAdjustment,
      annual_holding_cost: safetyStockCost,
      confidence_score: Math.min(0.95, pattern.confidence + 0.1),
    };
  }

  // Calcul des points de commande
  private async calculateReorderPoints(
    input: StockOptimizationInput,
    safetyStocks: SafetyStock[]
  ): Promise<ReorderPoint[]> {
    const results: ReorderPoint[] = [];

    for (const safetyStock of safetyStocks) {
      try {
        const reorderPoint = await this.calculateReorderPointForProduct(
          safetyStock,
          input
        );
        results.push(reorderPoint);
      } catch (error) {
        this.log('warn', 'Failed to calculate reorder point for product', {
          productId: safetyStock.product_id,
          error: error instanceof Error ? error.message : error,
        });
      }
    }

    return results;
  }

  private async calculateReorderPointForProduct(
    safetyStock: SafetyStock,
    input: StockOptimizationInput
  ): Promise<ReorderPoint> {
    const productSales = input.sales_history.filter(
      sale => sale.product_id === safetyStock.product_id
    );
    const dailyDemandAvg = this.calculateDailyDemandAverage(productSales);

    // Formule point de commande: (Demande moyenne * Délai) + Stock de sécurité
    const leadTimeDemand = dailyDemandAvg * input.lead_time_days;
    const reorderPointQuantity = Math.ceil(
      leadTimeDemand + safetyStock.safety_stock_quantity
    );

    // Calcul des délais d'urgence (si stock < seuil critique)
    const criticalThreshold = Math.ceil(reorderPointQuantity * 0.7);
    const emergencyThreshold = Math.ceil(reorderPointQuantity * 0.5);

    return {
      product_id: safetyStock.product_id,
      reorder_point_quantity: reorderPointQuantity,
      lead_time_demand: leadTimeDemand,
      safety_stock_quantity: safetyStock.safety_stock_quantity,
      daily_demand_average: dailyDemandAvg,
      critical_threshold: criticalThreshold,
      emergency_threshold: emergencyThreshold,
      recommended_order_quantity: this.findEOQForProduct(
        safetyStock.product_id,
        input
      ),
      review_frequency_days: 7, // Révision hebdomadaire par défaut
      confidence_score: safetyStock.confidence_score,
    };
  }

  // Optimisation par segmentation ABC/XYZ
  private async optimizeBySegmentation(
    input: StockOptimizationInput,
    state: StockAnalysisState
  ): Promise<any> {
    const segmentStrategies: { [key: string]: any } = {};

    for (const segment of state.processed_insights.product_segments) {
      const segmentKey = `${segment.abc_classification}-${segment.xyz_classification}`;

      if (!segmentStrategies[segmentKey]) {
        segmentStrategies[segmentKey] = {
          segment: segmentKey,
          products: [],
          strategy: this.getOptimizationStrategy(
            segment.abc_classification,
            segment.xyz_classification
          ),
          recommended_parameters: this.getRecommendedParameters(
            segment.abc_classification,
            segment.xyz_classification
          ),
        };
      }

      segmentStrategies[segmentKey].products.push(segment.product_id);
    }

    return {
      segment_strategies: Object.values(segmentStrategies),
      total_segments: Object.keys(segmentStrategies).length,
      optimization_focus: this.identifyOptimizationFocus(segmentStrategies),
    };
  }

  // Analyse de sensibilité des paramètres
  private async performSensitivityAnalysis(
    input: StockOptimizationInput,
    eoqResults: EOQResult[]
  ): Promise<any> {
    const sensitivities = [];

    // Test de sensibilité sur les coûts de commande (+/-20%)
    const orderingCostVariations = [-0.2, -0.1, 0.1, 0.2];

    for (const variation of orderingCostVariations) {
      const modifiedInput = {
        ...input,
        cost_parameters: {
          ...input.cost_parameters,
          ordering_cost: input.cost_parameters.ordering_cost * (1 + variation),
        },
      };

      const modifiedEOQ = await this.calculateEOQForProduct(
        input.demand_patterns[0],
        modifiedInput
      );
      const originalEOQ = eoqResults[0];

      const eoqChange =
        ((modifiedEOQ.economic_order_quantity -
          originalEOQ.economic_order_quantity) /
          originalEOQ.economic_order_quantity) *
        100;

      sensitivities.push({
        parameter: 'ordering_cost',
        variation_percent: variation * 100,
        eoq_change_percent: eoqChange,
        sensitivity_ratio: eoqChange / (variation * 100),
      });
    }

    return {
      sensitivities,
      most_sensitive_parameter:
        this.identifyMostSensitiveParameter(sensitivities),
      recommendations: this.generateSensitivityRecommendations(sensitivities),
    };
  }

  // Méthodes utilitaires

  private calculateAnnualDemand(sales: SalesRecord[]): number {
    if (sales.length === 0) return 0;

    const totalQuantity = sales.reduce(
      (sum, sale) => sum + sale.quantity_sold,
      0
    );
    const daysSpan = this.calculateDaysSpan(sales);

    // Extrapolation sur une année
    return Math.round((totalQuantity / daysSpan) * 365);
  }

  private calculateDaysSpan(sales: SalesRecord[]): number {
    if (sales.length === 0) return 1;

    const dates = sales.map(sale => sale.date.getTime()).sort();
    const spanMs = dates[dates.length - 1] - dates[0];
    return Math.max(1, Math.ceil(spanMs / (1000 * 60 * 60 * 24)));
  }

  private calculateAverageUnitPrice(sales: SalesRecord[]): number {
    if (sales.length === 0) return 100; // Prix par défaut

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
    const totalQuantity = sales.reduce(
      (sum, sale) => sum + sale.quantity_sold,
      0
    );

    return totalQuantity > 0 ? totalRevenue / totalQuantity : 100;
  }

  private calculateDailyDemandAverage(sales: SalesRecord[]): number {
    const totalQuantity = sales.reduce(
      (sum, sale) => sum + sale.quantity_sold,
      0
    );
    const daysSpan = this.calculateDaysSpan(sales);
    return totalQuantity / daysSpan;
  }

  private calculateDemandStatistics(
    sales: SalesRecord[],
    leadTimeDays: number
  ): { leadTimeMean: number; leadTimeStdDev: number } {
    const dailyDemands = this.groupSalesByDay(sales);
    const demands = Object.values(dailyDemands);

    const mean = demands.reduce((sum, d) => sum + d, 0) / demands.length;
    const variance =
      demands.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) /
      demands.length;
    const stdDev = Math.sqrt(variance);

    // Ajustement pour le délai d'approvisionnement
    const leadTimeMean = mean * leadTimeDays;
    const leadTimeStdDev = stdDev * Math.sqrt(leadTimeDays);

    return { leadTimeMean, leadTimeStdDev };
  }

  private groupSalesByDay(sales: SalesRecord[]): { [date: string]: number } {
    const dailyDemands: { [date: string]: number } = {};

    for (const sale of sales) {
      const dateKey = sale.date.toISOString().split('T')[0];
      dailyDemands[dateKey] = (dailyDemands[dateKey] || 0) + sale.quantity_sold;
    }

    return dailyDemands;
  }

  private getServiceLevelZScore(serviceLevel: number): number {
    const closestLevel = Object.keys(this.Z_SCORES)
      .map(Number)
      .reduce((prev, curr) =>
        Math.abs(curr - serviceLevel) < Math.abs(prev - serviceLevel)
          ? curr
          : prev
      );

    return this.Z_SCORES[closestLevel as keyof typeof this.Z_SCORES];
  }

  private calculateVolatilityAdjustment(pattern: DemandPattern): number {
    // Ajustement basé sur la volatilité et le type de pattern
    let adjustment = 1.0;

    if (pattern.pattern_type === 'ERRATIC' && pattern.volatility > 0.5) {
      adjustment = 1.2 + (pattern.volatility - 0.5) * 0.6; // +20% à +50%
    } else if (
      pattern.pattern_type === 'SEASONAL' &&
      pattern.seasonality_strength > 0.7
    ) {
      adjustment = 1.1 + (pattern.seasonality_strength - 0.7) * 0.3; // +10% à +19%
    }

    return Math.min(1.5, adjustment); // Limite à +50%
  }

  private findEOQForProduct(
    productId: string,
    input: StockOptimizationInput
  ): number {
    const pattern = input.demand_patterns.find(p => p.product_id === productId);
    if (!pattern) return 100; // Valeur par défaut

    try {
      const eoqResult = this.calculateEOQForProduct(pattern, input);
      return eoqResult.economic_order_quantity;
    } catch {
      return 100;
    }
  }

  private getOptimizationStrategy(abc: string, xyz: string): string {
    const strategies: { [key: string]: string } = {
      'A-X': 'Gestion serrée - EOQ strict + faible stock sécurité',
      'A-Y': 'Surveillance moyenne - EOQ + stock sécurité ajusté',
      'A-Z': 'Sécurité renforcée - EOQ + stock sécurité élevé',
      'B-X': 'Gestion standard - EOQ classique',
      'B-Y': 'Flexibilité modérée - EOQ + ajustements saisonniers',
      'B-Z': 'Approche prudente - Stock sécurité renforcé',
      'C-X': 'Gestion simplifiée - Commandes groupées',
      'C-Y': 'Révision périodique - Commandes peu fréquentes',
      'C-Z': 'Stock minimal - Approvisionnement réactif',
    };

    return strategies[`${abc}-${xyz}`] || 'Stratégie standard';
  }

  private getRecommendedParameters(abc: string, xyz: string): any {
    const parameters: { [key: string]: any } = {
      'A-X': {
        serviceLevel: 0.99,
        reviewFrequency: 'daily',
        safetyStockMultiplier: 0.8,
      },
      'A-Y': {
        serviceLevel: 0.97,
        reviewFrequency: 'weekly',
        safetyStockMultiplier: 1.0,
      },
      'A-Z': {
        serviceLevel: 0.95,
        reviewFrequency: 'weekly',
        safetyStockMultiplier: 1.4,
      },
      'B-X': {
        serviceLevel: 0.95,
        reviewFrequency: 'weekly',
        safetyStockMultiplier: 1.0,
      },
      'B-Y': {
        serviceLevel: 0.93,
        reviewFrequency: 'bi-weekly',
        safetyStockMultiplier: 1.1,
      },
      'B-Z': {
        serviceLevel: 0.9,
        reviewFrequency: 'bi-weekly',
        safetyStockMultiplier: 1.3,
      },
      'C-X': {
        serviceLevel: 0.9,
        reviewFrequency: 'monthly',
        safetyStockMultiplier: 0.9,
      },
      'C-Y': {
        serviceLevel: 0.87,
        reviewFrequency: 'monthly',
        safetyStockMultiplier: 1.0,
      },
      'C-Z': {
        serviceLevel: 0.85,
        reviewFrequency: 'quarterly',
        safetyStockMultiplier: 1.2,
      },
    };

    return (
      parameters[`${abc}-${xyz}`] || {
        serviceLevel: 0.95,
        reviewFrequency: 'weekly',
        safetyStockMultiplier: 1.0,
      }
    );
  }

  private identifyOptimizationFocus(segmentStrategies: any): string {
    const segmentCounts = Object.keys(segmentStrategies).length;

    if (segmentCounts <= 3) {
      return 'Focus sur optimisation fine par segment';
    } else if (segmentCounts <= 6) {
      return 'Approche équilibrée multi-segments';
    } else {
      return 'Standardisation avec exceptions pour segments critiques';
    }
  }

  private identifyMostSensitiveParameter(sensitivities: any[]): string {
    return sensitivities.reduce((prev, curr) =>
      Math.abs(curr.sensitivity_ratio) > Math.abs(prev.sensitivity_ratio)
        ? curr
        : prev
    ).parameter;
  }

  private generateSensitivityRecommendations(sensitivities: any[]): string[] {
    const recommendations = [];

    for (const sensitivity of sensitivities) {
      if (Math.abs(sensitivity.sensitivity_ratio) > 0.5) {
        recommendations.push(
          `Attention: ${sensitivity.parameter} est très sensible (ratio: ${sensitivity.sensitivity_ratio.toFixed(2)})`
        );
      }
    }

    return recommendations;
  }

  private async generateImprovementRecommendations(
    eoqResults: EOQResult[],
    safetyStocks: SafetyStock[],
    reorderPoints: ReorderPoint[]
  ): Promise<string[]> {
    const recommendations = [];

    // Analyse des EOQ trop élevées
    const highEOQ = eoqResults.filter(
      eoq => eoq.economic_order_quantity > eoq.annual_demand * 0.3
    );
    if (highEOQ.length > 0) {
      recommendations.push(
        `${highEOQ.length} produits ont un EOQ élevé (>30% demande annuelle) - réviser coûts de commande`
      );
    }

    // Analyse des stocks de sécurité élevés
    const highSafetyStock = safetyStocks.filter(
      ss => ss.volatility_adjustment > 1.3
    );
    if (highSafetyStock.length > 0) {
      recommendations.push(
        `${highSafetyStock.length} produits nécessitent des stocks de sécurité élevés - améliorer prévisions`
      );
    }

    // Analyse des points de commande critiques
    const criticalReorder = reorderPoints.filter(
      rp => rp.confidence_score < 0.7
    );
    if (criticalReorder.length > 0) {
      recommendations.push(
        `${criticalReorder.length} points de commande ont faible confiance - vérifier données historiques`
      );
    }

    return recommendations;
  }

  private calculateOptimizationConfidence(
    eoqResults: EOQResult[],
    safetyStocks: SafetyStock[]
  ): number {
    if (eoqResults.length === 0 || safetyStocks.length === 0) return 0;

    const avgSafetyStockConfidence =
      safetyStocks.reduce((sum, ss) => sum + ss.confidence_score, 0) /
      safetyStocks.length;
    const eoqValidityScore =
      eoqResults.filter(
        eoq => eoq.economic_order_quantity > 0 && eoq.annual_demand > 0
      ).length / eoqResults.length;

    return (avgSafetyStockConfidence + eoqValidityScore) / 2;
  }

  private calculateAccuracy(eoqResults: EOQResult[]): number {
    // Métrique simple basée sur la cohérence des calculs
    const validResults = eoqResults.filter(
      eoq =>
        eoq.economic_order_quantity > 0 &&
        eoq.annual_demand > 0 &&
        eoq.total_annual_cost > 0
    );

    return validResults.length / Math.max(eoqResults.length, 1);
  }

  private generateOptimizationSummary(
    eoqResults: EOQResult[],
    safetyStocks: SafetyStock[]
  ): string {
    const totalProducts = eoqResults.length;
    const avgEOQ =
      eoqResults.reduce((sum, eoq) => sum + eoq.economic_order_quantity, 0) /
      totalProducts;
    const totalAnnualCost = eoqResults.reduce(
      (sum, eoq) => sum + eoq.total_annual_cost,
      0
    );
    const avgSafetyStock =
      safetyStocks.reduce((sum, ss) => sum + ss.safety_stock_quantity, 0) /
      safetyStocks.length;

    return (
      `Optimisation de ${totalProducts} produits: EOQ moyen ${Math.round(avgEOQ)} unités, ` +
      `coût total ${Math.round(totalAnnualCost)}€/an, stock sécurité moyen ${Math.round(avgSafetyStock)} unités.`
    );
  }
}
