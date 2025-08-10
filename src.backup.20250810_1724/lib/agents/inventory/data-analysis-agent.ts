// Agent d'Analyse des Données Historiques

import { BaseAgent } from '../shared/base-agent';
import type {
  AgentConfig,
  AgentExecutionResult,
  StockAnalysisState,
  DataAnalysisInput,
  DataAnalysisOutput,
  SalesRecord,
  DemandPattern,
  ProductSegment,
  SeasonalityData,
} from '@/types/ai-agents';

export class DataAnalysisAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: 'data-analysis-agent',
      name: 'Data Analysis Agent',
      version: '1.0.0',
      capabilities: [
        'pattern_detection',
        'seasonality_analysis',
        'abc_xyz_segmentation',
        'trend_analysis',
        'demand_volatility_calculation',
      ],
      dependencies: ['sales_history'],
      performance_targets: {
        max_execution_time_ms: 5000,
        min_accuracy_score: 0.8,
        max_error_rate: 0.05,
      },
    };

    super(config);
  }

  async execute(
    input: DataAnalysisInput,
    state: StockAnalysisState
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      this.log('info', 'Starting data analysis', {
        salesRecords: input.sales_history.length,
        timeRange: input.time_range,
      });

      // Analyse des patterns de demande
      const demandPatterns = await this.analyzeDemandPatterns(
        input.sales_history
      );

      // Segmentation ABC/XYZ des produits
      const productSegments = await this.segmentProducts(input.sales_history);

      // Analyse de saisonnalité
      const seasonalityData = await this.analyzeSeasonality(
        input.sales_history
      );

      // Calcul de la qualité des données
      const dataQualityScore = this.calculateDataQuality(input.sales_history);

      // Génération d'insights clés
      const keyInsights = this.generateKeyInsights(
        demandPatterns,
        productSegments,
        seasonalityData
      );

      const output: DataAnalysisOutput = {
        demand_patterns: demandPatterns,
        product_segments: productSegments,
        seasonality_data: seasonalityData,
        key_insights: keyInsights,
        confidence_score: this.calculateOverallConfidence(
          demandPatterns,
          dataQualityScore
        ),
        data_quality_score: dataQualityScore,
      };

      const executionTime = Date.now() - startTime;

      this.log('info', 'Data analysis completed successfully', {
        patternsFound: demandPatterns.length,
        segmentsCreated: productSegments.length,
        executionTimeMs: executionTime,
      });

      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: true,
        confidence_score: output.confidence_score,
        output,
        metrics: {
          accuracy: output.confidence_score,
          processing_speed: (input.sales_history.length / executionTime) * 1000, // records per second
          resource_usage: executionTime,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', 'Data analysis failed', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }

  // Analyse des patterns de demande pour chaque produit
  private async analyzeDemandPatterns(
    salesHistory: SalesRecord[]
  ): Promise<DemandPattern[]> {
    const patterns: DemandPattern[] = [];

    // Grouper les ventes par produit
    const productSales = this.groupSalesByProduct(salesHistory);

    for (const [productId, sales] of productSales.entries()) {
      if (sales.length < 10) continue; // Pas assez de données

      const pattern = await this.analyzeProductPattern(productId, sales);
      patterns.push(pattern);
    }

    return patterns;
  }

  // Analyse du pattern d'un produit spécifique
  private async analyzeProductPattern(
    productId: string,
    sales: SalesRecord[]
  ): Promise<DemandPattern> {
    // Préparation des données temporelles
    const dailySales = this.aggregateDailySales(sales);
    const values = Array.from(dailySales.values());

    // Calcul de la volatilité
    const volatility = this.calculateVolatility(values);

    // Détection de saisonnalité
    const seasonalityStrength = this.detectSeasonality(dailySales);

    // Détection de tendance
    const trendAnalysis = this.detectTrend(values);

    // Classification du type de pattern
    const patternType = this.classifyPattern(
      volatility,
      seasonalityStrength,
      trendAnalysis.strength
    );

    // Calcul de confiance basé sur la quantité et qualité des données
    const confidence = this.calculatePatternConfidence(
      sales.length,
      volatility
    );

    return {
      product_id: productId,
      pattern_type: patternType,
      seasonality_strength: seasonalityStrength,
      trend_direction: trendAnalysis.direction,
      trend_strength: trendAnalysis.strength,
      volatility,
      confidence,
    };
  }

  // Segmentation ABC/XYZ des produits
  private async segmentProducts(
    salesHistory: SalesRecord[]
  ): Promise<ProductSegment[]> {
    const segments: ProductSegment[] = [];

    // Calcul des métriques par produit
    const productMetrics = this.calculateProductMetrics(salesHistory);

    // Classification ABC (basée sur le revenue)
    const abcClassification = this.performABCClassification(productMetrics);

    // Classification XYZ (basée sur la prévisibilité)
    const xyzClassification = this.performXYZClassification(productMetrics);

    for (const [productId, metrics] of productMetrics.entries()) {
      segments.push({
        product_id: productId,
        abc_classification: abcClassification.get(productId) || 'C',
        xyz_classification: xyzClassification.get(productId) || 'Z',
        velocity: this.classifyVelocity(metrics.avgMonthlySales),
        margin_category: this.classifyMargin(metrics.avgMargin),
        strategic_importance: this.determineStrategicImportance(
          abcClassification.get(productId) || 'C',
          xyzClassification.get(productId) || 'Z'
        ),
      });
    }

    return segments;
  }

  // Analyse de saisonnalité
  private async analyzeSeasonality(
    salesHistory: SalesRecord[]
  ): Promise<SeasonalityData[]> {
    const seasonalityData: SeasonalityData[] = [];
    const productSales = this.groupSalesByProduct(salesHistory);

    for (const [productId, sales] of productSales.entries()) {
      if (sales.length < 365) continue; // Besoin d'au moins un an de données

      const monthlySales = this.aggregateMonthlySales(sales);
      const seasonalMultipliers =
        this.calculateSeasonalMultipliers(monthlySales);
      const peakLowSeasons = this.identifyPeakLowSeasons(seasonalMultipliers);

      seasonalityData.push({
        product_id: productId,
        seasonal_periods: this.identifySeasonalPeriods(monthlySales),
        seasonal_multipliers: seasonalMultipliers,
        peak_season: peakLowSeasons.peak,
        low_season: peakLowSeasons.low,
      });
    }

    return seasonalityData;
  }

  // Méthodes utilitaires

  private groupSalesByProduct(
    sales: SalesRecord[]
  ): Map<string, SalesRecord[]> {
    const grouped = new Map<string, SalesRecord[]>();

    for (const sale of sales) {
      if (!grouped.has(sale.product_id)) {
        grouped.set(sale.product_id, []);
      }
      grouped.get(sale.product_id)!.push(sale);
    }

    return grouped;
  }

  private aggregateDailySales(sales: SalesRecord[]): Map<string, number> {
    const dailySales = new Map<string, number>();

    for (const sale of sales) {
      const dateKey = sale.date.toISOString().split('T')[0];
      const current = dailySales.get(dateKey) || 0;
      dailySales.set(dateKey, current + sale.quantity_sold);
    }

    return dailySales;
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;

    const mean = this.calculateMean(values);
    const variance =
      values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient de variation normalisé
    return mean > 0 ? Math.min(stdDev / mean, 2) : 0;
  }

  private detectSeasonality(dailySales: Map<string, number>): number {
    const values = Array.from(dailySales.values());
    if (values.length < 14) return 0;

    // Autocorrélation simple pour détecter saisonnalité hebdomadaire
    const weeklyCorrelation = this.calculateAutocorrelation(values, 7);
    const monthlyCorrelation = this.calculateAutocorrelation(values, 30);

    return Math.max(weeklyCorrelation, monthlyCorrelation);
  }

  private calculateAutocorrelation(values: number[], lag: number): number {
    if (values.length <= lag) return 0;

    const n = values.length - lag;
    let correlation = 0;

    for (let i = 0; i < n; i++) {
      correlation += values[i] * values[i + lag];
    }

    const mean1 = this.calculateMean(values.slice(0, n));
    const mean2 = this.calculateMean(values.slice(lag));

    return (
      Math.abs(correlation / n - mean1 * mean2) /
      this.calculateStandardDeviation(values) ** 2
    );
  }

  private detectTrend(values: number[]): {
    direction: 'UP' | 'DOWN' | 'STABLE';
    strength: number;
  } {
    if (values.length < 3) return { direction: 'STABLE', strength: 0 };

    // Régression linéaire simple
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const meanY = sumY / n;

    const strength = Math.abs(slope) / (meanY || 1);
    const direction = slope > 0.1 ? 'UP' : slope < -0.1 ? 'DOWN' : 'STABLE';

    return { direction, strength: Math.min(strength, 1) };
  }

  private classifyPattern(
    volatility: number,
    seasonalityStrength: number,
    trendStrength: number
  ): DemandPattern['pattern_type'] {
    if (seasonalityStrength > 0.3) return 'SEASONAL';
    if (trendStrength > 0.2) return 'TRENDING';
    if (volatility < 0.3) return 'STABLE';
    return 'ERRATIC';
  }

  private calculatePatternConfidence(
    dataPoints: number,
    volatility: number
  ): number {
    const dataConfidence = Math.min(dataPoints / 100, 1); // Plus de données = plus de confiance
    const volatilityPenalty = Math.max(0, 1 - volatility); // Moins de volatilité = plus de confiance

    return dataConfidence * 0.6 + volatilityPenalty * 0.4;
  }

  private calculateProductMetrics(
    salesHistory: SalesRecord[]
  ): Map<string, any> {
    const metrics = new Map();
    const productSales = this.groupSalesByProduct(salesHistory);

    for (const [productId, sales] of productSales.entries()) {
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.revenue, 0);
      const totalQuantity = sales.reduce(
        (sum, sale) => sum + sale.quantity_sold,
        0
      );
      const avgPrice = totalRevenue / totalQuantity;

      // Calcul de métriques temporelles
      const monthlySales = this.aggregateMonthlySales(sales);
      const monthlyValues = Array.from(monthlySales.values());

      metrics.set(productId, {
        totalRevenue,
        totalQuantity,
        avgPrice,
        avgMonthlySales: this.calculateMean(monthlyValues),
        salesVolatility: this.calculateVolatility(monthlyValues),
        avgMargin: avgPrice * 0.3, // Simulation de marge
        dataPoints: sales.length,
      });
    }

    return metrics;
  }

  private performABCClassification(
    productMetrics: Map<string, any>
  ): Map<string, 'A' | 'B' | 'C'> {
    const classification = new Map<string, 'A' | 'B' | 'C'>();

    // Trier par revenue total
    const sortedProducts = Array.from(productMetrics.entries()).sort(
      ([, a], [, b]) => b.totalRevenue - a.totalRevenue
    );

    const totalRevenue = sortedProducts.reduce(
      (sum, [, metrics]) => sum + metrics.totalRevenue,
      0
    );

    let cumulativeRevenue = 0;
    for (const [productId, metrics] of sortedProducts) {
      cumulativeRevenue += metrics.totalRevenue;
      const cumulativePercentage = cumulativeRevenue / totalRevenue;

      if (cumulativePercentage <= 0.8) {
        classification.set(productId, 'A');
      } else if (cumulativePercentage <= 0.95) {
        classification.set(productId, 'B');
      } else {
        classification.set(productId, 'C');
      }
    }

    return classification;
  }

  private performXYZClassification(
    productMetrics: Map<string, any>
  ): Map<string, 'X' | 'Y' | 'Z'> {
    const classification = new Map<string, 'X' | 'Y' | 'Z'>();

    for (const [productId, metrics] of productMetrics.entries()) {
      const cv = metrics.salesVolatility; // Coefficient de variation

      if (cv < 0.2) {
        classification.set(productId, 'X'); // Prévisible
      } else if (cv < 0.5) {
        classification.set(productId, 'Y'); // Modérément prévisible
      } else {
        classification.set(productId, 'Z'); // Imprévisible
      }
    }

    return classification;
  }

  private classifyVelocity(
    avgMonthlySales: number
  ): 'FAST' | 'MEDIUM' | 'SLOW' {
    if (avgMonthlySales > 100) return 'FAST';
    if (avgMonthlySales > 20) return 'MEDIUM';
    return 'SLOW';
  }

  private classifyMargin(avgMargin: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (avgMargin > 50) return 'HIGH';
    if (avgMargin > 20) return 'MEDIUM';
    return 'LOW';
  }

  private determineStrategicImportance(
    abc: 'A' | 'B' | 'C',
    xyz: 'X' | 'Y' | 'Z'
  ): 'CRITICAL' | 'IMPORTANT' | 'STANDARD' {
    if (abc === 'A' && xyz === 'X') return 'CRITICAL';
    if (abc === 'A' || xyz === 'X') return 'IMPORTANT';
    return 'STANDARD';
  }

  private aggregateMonthlySales(sales: SalesRecord[]): Map<number, number> {
    const monthlySales = new Map<number, number>();

    for (const sale of sales) {
      const month = sale.date.getMonth();
      const current = monthlySales.get(month) || 0;
      monthlySales.set(month, current + sale.quantity_sold);
    }

    return monthlySales;
  }

  private calculateSeasonalMultipliers(
    monthlySales: Map<number, number>
  ): number[] {
    const multipliers = new Array(12).fill(1);
    const avgMonthlySales = this.calculateMean(
      Array.from(monthlySales.values())
    );

    if (avgMonthlySales === 0) return multipliers;

    for (let month = 0; month < 12; month++) {
      const monthSales = monthlySales.get(month) || 0;
      multipliers[month] = monthSales / avgMonthlySales;
    }

    return multipliers;
  }

  private identifyPeakLowSeasons(multipliers: number[]): {
    peak: { start: number; end: number };
    low: { start: number; end: number };
  } {
    const maxIndex = multipliers.indexOf(Math.max(...multipliers));
    const minIndex = multipliers.indexOf(Math.min(...multipliers));

    return {
      peak: { start: maxIndex * 30, end: (maxIndex + 1) * 30 },
      low: { start: minIndex * 30, end: (minIndex + 1) * 30 },
    };
  }

  private identifySeasonalPeriods(monthlySales: Map<number, number>): number[] {
    const periods: number[] = [];
    const avgSales = this.calculateMean(Array.from(monthlySales.values()));

    for (const [month, sales] of monthlySales.entries()) {
      if (sales > avgSales * 1.2) {
        // 20% au-dessus de la moyenne
        periods.push(month * 30); // Approximation en jours
      }
    }

    return periods;
  }

  private calculateDataQuality(salesHistory: SalesRecord[]): number {
    if (salesHistory.length === 0) return 0;

    // Facteurs de qualité
    const completenessScore = Math.min(salesHistory.length / 1000, 1); // Plus de données = mieux

    const consistencyScore = this.calculateConsistencyScore(salesHistory);
    const freshnessScore = this.calculateFreshnessScore(salesHistory);

    return (
      completenessScore * 0.4 + consistencyScore * 0.4 + freshnessScore * 0.2
    );
  }

  private calculateConsistencyScore(salesHistory: SalesRecord[]): number {
    // Vérifier la cohérence des données
    let consistentRecords = 0;

    for (const record of salesHistory) {
      if (
        record.quantity_sold > 0 &&
        record.revenue > 0 &&
        record.product_id &&
        record.date
      ) {
        consistentRecords++;
      }
    }

    return consistentRecords / salesHistory.length;
  }

  private calculateFreshnessScore(salesHistory: SalesRecord[]): number {
    if (salesHistory.length === 0) return 0;

    const now = new Date();
    const mostRecentSale = Math.max(...salesHistory.map(s => s.date.getTime()));
    const daysSinceLastSale =
      (now.getTime() - mostRecentSale) / (1000 * 60 * 60 * 24);

    // Score diminue avec l'âge des données
    return Math.max(0, 1 - daysSinceLastSale / 30);
  }

  private generateKeyInsights(
    patterns: DemandPattern[],
    segments: ProductSegment[],
    seasonality: SeasonalityData[]
  ): string[] {
    const insights: string[] = [];

    // Insights sur les patterns
    const seasonalProducts = patterns.filter(
      p => p.pattern_type === 'SEASONAL'
    ).length;
    const erraticProducts = patterns.filter(
      p => p.pattern_type === 'ERRATIC'
    ).length;

    if (seasonalProducts > 0) {
      insights.push(
        `${seasonalProducts} produits présentent des patterns saisonniers forts`
      );
    }

    if (erraticProducts > patterns.length * 0.3) {
      insights.push(
        `${erraticProducts} produits ont des patterns de demande erratiques nécessitant une attention particulière`
      );
    }

    // Insights sur la segmentation
    const criticalProducts = segments.filter(
      s => s.strategic_importance === 'CRITICAL'
    ).length;
    const aProducts = segments.filter(s => s.abc_classification === 'A').length;

    insights.push(
      `${aProducts} produits génèrent 80% du chiffre d'affaires (classe A)`
    );
    insights.push(
      `${criticalProducts} produits sont identifiés comme critiques pour l'activité`
    );

    // Insights sur la saisonnalité
    if (seasonality.length > 0) {
      const avgSeasonalStrength =
        patterns.map(p => p.seasonality_strength).reduce((a, b) => a + b, 0) /
        patterns.length;

      if (avgSeasonalStrength > 0.3) {
        insights.push(
          'Fort impact saisonnier détecté - optimisation des stocks par saison recommandée'
        );
      }
    }

    return insights;
  }

  private calculateOverallConfidence(
    patterns: DemandPattern[],
    dataQualityScore: number
  ): number {
    if (patterns.length === 0) return 0;

    const avgPatternConfidence =
      patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;

    return avgPatternConfidence * 0.7 + dataQualityScore * 0.3;
  }
}
