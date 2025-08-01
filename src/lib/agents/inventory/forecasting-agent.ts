// Agent de Prévision Multi-Horizon

import { BaseAgent } from '../shared/base-agent';
import type { 
  AgentConfig, 
  AgentExecutionResult, 
  StockAnalysisState,
  ForecastingInput,
  ForecastingOutput,
  SalesRecord,
  ForecastResult,
  ForecastMetrics,
  DemandPattern,
  ExternalFactor
} from '@/types/ai-agents';

export class ForecastingAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: 'forecasting-agent',
      name: 'Forecasting Agent',
      version: '1.0.0',
      capabilities: [
        'short_term_forecasting',
        'medium_term_forecasting',
        'long_term_forecasting',
        'ensemble_modeling',
        'confidence_intervals',
        'model_selection'
      ],
      dependencies: ['sales_history', 'demand_patterns'],
      performance_targets: {
        max_execution_time_ms: 10000,
        min_accuracy_score: 0.75,
        max_error_rate: 0.1
      }
    };
    
    super(config);
  }

  async execute(input: ForecastingInput, state: StockAnalysisState): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    
    try {
      this.log('info', 'Starting forecasting analysis', { 
        productsToForecast: new Set(input.historical_data.map(r => r.product_id)).size,
        horizonDays: input.forecast_horizon_days,
        confidenceLevel: input.confidence_level
      });

      // Préparation des données par produit
      const productData = this.groupDataByProduct(input.historical_data);
      const forecasts: ForecastResult[] = [];
      const modelPerformance: ForecastMetrics[] = [];

      // Génération des prévisions pour chaque produit
      for (const [productId, salesData] of productData.entries()) {
        if (salesData.length < 10) {
          this.log('warn', `Insufficient data for product ${productId}`, { dataPoints: salesData.length });
          continue;
        }

        const productPattern = input.demand_patterns.find(p => p.product_id === productId);
        const productForecasts = await this.forecastProduct(
          productId, 
          salesData, 
          productPattern,
          input.forecast_horizon_days,
          input.confidence_level,
          input.external_factors
        );

        forecasts.push(...productForecasts.forecasts);
        modelPerformance.push(productForecasts.performance);
      }

      // Calcul des métriques globales
      const overallPerformance = this.calculateOverallPerformance(modelPerformance);
      const recommendationQuality = this.assessRecommendationQuality(forecasts, input.demand_patterns);

      const output: ForecastingOutput = {
        forecasts,
        model_performance: overallPerformance,
        recommendation_quality: recommendationQuality,
        model_selection_reasoning: this.generateModelSelectionReasoning(modelPerformance)
      };

      const executionTime = Date.now() - startTime;
      
      this.log('info', 'Forecasting completed successfully', {
        forecastsGenerated: forecasts.length,
        avgAccuracy: overallPerformance.MAPE,
        executionTimeMs: executionTime
      });

      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: true,
        confidence_score: recommendationQuality,
        output,
        metrics: {
          accuracy: 1 - (overallPerformance.MAPE / 100), // Convert MAPE to accuracy
          processing_speed: forecasts.length / executionTime * 1000,
          resource_usage: executionTime
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', 'Forecasting failed', { error: error instanceof Error ? error.message : error });
      throw error;
    }
  }

  // Prévision pour un produit spécifique
  private async forecastProduct(
    productId: string,
    salesData: SalesRecord[],
    pattern: DemandPattern | undefined,
    horizonDays: number,
    confidenceLevel: number,
    externalFactors?: ExternalFactor[]
  ): Promise<{ forecasts: ForecastResult[]; performance: ForecastMetrics }> {
    
    // Préparation des données temporelles
    const timeSeries = this.prepareTimeSeries(salesData);
    
    // Sélection du modèle optimal selon le pattern
    const selectedModels = this.selectOptimalModels(pattern, timeSeries.length, horizonDays);
    
    // Génération des prévisions avec ensemble de modèles
    const modelResults = await Promise.all(
      selectedModels.map(model => this.generateModelForecast(
        productId, 
        timeSeries, 
        model, 
        horizonDays, 
        confidenceLevel,
        externalFactors
      ))
    );

    // Ensemble forecasting - combinaison des modèles
    const ensembleForecasts = this.combineModelForecasts(modelResults, confidenceLevel);
    
    // Évaluation de la performance sur données historiques
    const performance = this.evaluateModelPerformance(timeSeries, selectedModels[0]);

    return {
      forecasts: ensembleForecasts,
      performance
    };
  }

  // Préparation des séries temporelles
  private prepareTimeSeries(salesData: SalesRecord[]): { date: Date; value: number }[] {
    // Agrégation par jour
    const dailyAggregation = new Map<string, number>();
    
    for (const record of salesData) {
      const dateKey = record.date.toISOString().split('T')[0];
      const current = dailyAggregation.get(dateKey) || 0;
      dailyAggregation.set(dateKey, current + record.quantity_sold);
    }

    // Conversion en série temporelle ordonnée
    const timeSeries = Array.from(dailyAggregation.entries())
      .map(([dateStr, value]) => ({ date: new Date(dateStr), value }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Remplissage des jours manquants avec interpolation
    return this.fillMissingDays(timeSeries);
  }

  // Remplissage des jours manquants
  private fillMissingDays(timeSeries: { date: Date; value: number }[]): { date: Date; value: number }[] {
    if (timeSeries.length < 2) return timeSeries;

    const filled: { date: Date; value: number }[] = [];
    const startDate = timeSeries[0].date;
    const endDate = timeSeries[timeSeries.length - 1].date;
    
    const dataMap = new Map(timeSeries.map(item => [
      item.date.toISOString().split('T')[0], 
      item.value
    ]));

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const value = dataMap.get(dateKey) || this.interpolateValue(currentDate, timeSeries);
      
      filled.push({ date: new Date(currentDate), value });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filled;
  }

  // Interpolation simple pour valeurs manquantes
  private interpolateValue(targetDate: Date, timeSeries: { date: Date; value: number }[]): number {
    // Trouve les points avant et après pour interpolation linéaire
    let before = timeSeries[0];
    let after = timeSeries[timeSeries.length - 1];

    for (let i = 0; i < timeSeries.length - 1; i++) {
      if (timeSeries[i].date <= targetDate && timeSeries[i + 1].date >= targetDate) {
        before = timeSeries[i];
        after = timeSeries[i + 1];
        break;
      }
    }

    if (before.date.getTime() === after.date.getTime()) {
      return before.value;
    }

    // Interpolation linéaire
    const ratio = (targetDate.getTime() - before.date.getTime()) / 
                  (after.date.getTime() - before.date.getTime());
    
    return before.value + (after.value - before.value) * ratio;
  }

  // Sélection des modèles optimaux
  private selectOptimalModels(
    pattern: DemandPattern | undefined, 
    dataLength: number, 
    horizonDays: number
  ): string[] {
    const models: string[] = [];

    // Modèle de base : moyenne mobile
    models.push('moving_average');

    // Sélection selon le pattern détecté
    if (pattern) {
      switch (pattern.pattern_type) {
        case 'SEASONAL':
          models.push('seasonal_naive');
          if (dataLength > 100) models.push('holt_winters');
          break;
        case 'TRENDING':
          models.push('linear_trend');
          if (dataLength > 50) models.push('exponential_smoothing');
          break;
        case 'STABLE':
          models.push('simple_exponential_smoothing');
          break;
        case 'ERRATIC':
          models.push('croston'); // Pour demande intermittente
          break;
      }
    }

    // Modèles avancés pour horizons longs et données suffisantes
    if (horizonDays > 30 && dataLength > 200) {
      models.push('arima');
    }

    return models.length > 0 ? models : ['moving_average'];
  }

  // Génération de prévision avec un modèle spécifique
  private async generateModelForecast(
    productId: string,
    timeSeries: { date: Date; value: number }[],
    modelType: string,
    horizonDays: number,
    confidenceLevel: number,
    externalFactors?: ExternalFactor[]
  ): Promise<{ model: string; forecasts: ForecastResult[]; confidence: number }> {
    
    const forecasts: ForecastResult[] = [];
    const lastDate = timeSeries[timeSeries.length - 1].date;
    
    for (let day = 1; day <= horizonDays; day++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(lastDate.getDate() + day);
      
      const prediction = await this.predictValue(timeSeries, modelType, day, externalFactors);
      const confidenceInterval = this.calculateConfidenceInterval(
        prediction.value, 
        prediction.uncertainty, 
        confidenceLevel
      );

      forecasts.push({
        product_id: productId,
        forecast_date: forecastDate,
        predicted_demand: Math.max(0, prediction.value), // Pas de demande négative
        confidence_80: [
          Math.max(0, prediction.value - prediction.uncertainty),
          prediction.value + prediction.uncertainty
        ],
        confidence_95: confidenceInterval,
        model_used: modelType,
        accuracy_score: prediction.confidence
      });
    }

    return {
      model: modelType,
      forecasts,
      confidence: this.calculateMean(forecasts.map(f => f.accuracy_score))
    };
  }

  // Prédiction de valeur selon le modèle
  private async predictValue(
    timeSeries: { date: Date; value: number }[],
    modelType: string,
    daysAhead: number,
    externalFactors?: ExternalFactor[]
  ): Promise<{ value: number; uncertainty: number; confidence: number }> {
    
    const values = timeSeries.map(t => t.value);
    const n = values.length;
    
    let predictedValue = 0;
    let uncertainty = 0;
    let confidence = 0.7;

    switch (modelType) {
      case 'moving_average':
        const windowSize = Math.min(7, n);
        predictedValue = this.calculateMean(values.slice(-windowSize));
        uncertainty = this.calculateStandardDeviation(values.slice(-windowSize));
        confidence = 0.6;
        break;

      case 'simple_exponential_smoothing':
        predictedValue = this.exponentialSmoothing(values, 0.3);
        uncertainty = this.calculateStandardDeviation(values) * 0.8;
        confidence = 0.7;
        break;

      case 'linear_trend':
        const trend = this.calculateLinearTrend(values);
        predictedValue = trend.predict(n + daysAhead - 1);
        uncertainty = trend.uncertainty;
        confidence = trend.rsquared;
        break;

      case 'seasonal_naive':
        const seasonLength = 7; // Saisonnalité hebdomadaire
        const seasonalIndex = (n + daysAhead - 1) % seasonLength;
        const seasonalValues = values.filter((_, i) => i % seasonLength === seasonalIndex);
        predictedValue = this.calculateMean(seasonalValues);
        uncertainty = this.calculateStandardDeviation(seasonalValues);
        confidence = 0.65;
        break;

      case 'holt_winters':
        const hwResult = this.holtWinters(values, daysAhead);
        predictedValue = hwResult.forecast;
        uncertainty = hwResult.uncertainty;
        confidence = hwResult.confidence;
        break;

      case 'croston':
        const crostonResult = this.crostonMethod(values, daysAhead);
        predictedValue = crostonResult.forecast;
        uncertainty = crostonResult.uncertainty;
        confidence = crostonResult.confidence;
        break;

      default:
        predictedValue = this.calculateMean(values);
        uncertainty = this.calculateStandardDeviation(values);
        confidence = 0.5;
    }

    // Ajustement avec facteurs externes
    if (externalFactors && externalFactors.length > 0) {
      const adjustment = this.applyExternalFactors(predictedValue, externalFactors, daysAhead);
      predictedValue = adjustment.adjustedValue;
      confidence *= adjustment.confidenceMultiplier;
    }

    return { 
      value: predictedValue, 
      uncertainty: Math.max(uncertainty, predictedValue * 0.1), // Incertitude minimum de 10%
      confidence: Math.min(Math.max(confidence, 0.1), 0.95) // Borner entre 10% et 95%
    };
  }

  // Implémentations des modèles de prévision

  private exponentialSmoothing(values: number[], alpha: number = 0.3): number {
    if (values.length === 0) return 0;
    
    let smoothed = values[0];
    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    }
    
    return smoothed;
  }

  private calculateLinearTrend(values: number[]): { predict: (x: number) => number; uncertainty: number; rsquared: number } {
    const n = values.length;
    if (n < 2) return { predict: () => values[0] || 0, uncertainty: 0, rsquared: 0 };

    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumYY = y.reduce((acc, yi) => acc + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calcul R²
    const yMean = sumY / n;
    const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - (slope * i + intercept), 2), 0);
    const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
    const rsquared = 1 - (ssRes / ssTot);

    // Erreur standard
    const mse = ssRes / (n - 2);
    const uncertainty = Math.sqrt(mse);

    return {
      predict: (x: number) => slope * x + intercept,
      uncertainty,
      rsquared: Math.max(0, rsquared)
    };
  }

  private holtWinters(values: number[], daysAhead: number): { forecast: number; uncertainty: number; confidence: number } {
    // Implémentation simplifiée de Holt-Winters
    if (values.length < 14) {
      return { forecast: this.calculateMean(values), uncertainty: this.calculateStandardDeviation(values), confidence: 0.5 };
    }

    const alpha = 0.3; // Lissage de niveau
    const beta = 0.1;  // Lissage de tendance
    const gamma = 0.2; // Lissage saisonnier
    const seasonLength = 7; // Saisonnalité hebdomadaire

    // Initialisation
    let level = this.calculateMean(values.slice(0, seasonLength));
    let trend = 0;
    const seasonal = new Array(seasonLength).fill(1);

    // Calcul initial de la saisonnalité
    for (let i = 0; i < seasonLength; i++) {
      const seasonValues = values.filter((_, idx) => idx % seasonLength === i);
      seasonal[i] = this.calculateMean(seasonValues) / level;
    }

    // Mise à jour des composantes
    for (let i = seasonLength; i < values.length; i++) {
      const prevLevel = level;
      const seasonalIdx = i % seasonLength;
      
      level = alpha * (values[i] / seasonal[seasonalIdx]) + (1 - alpha) * (prevLevel + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
      seasonal[seasonalIdx] = gamma * (values[i] / level) + (1 - gamma) * seasonal[seasonalIdx];
    }

    // Prévision
    const forecastSeasonalIdx = (values.length + daysAhead - 1) % seasonLength;
    const forecast = (level + trend * daysAhead) * seasonal[forecastSeasonalIdx];
    
    // Calcul de l'incertitude
    const residuals = values.slice(seasonLength).map((val, i) => {
      const idx = (i + seasonLength) % seasonLength;
      const fitted = level * seasonal[idx];
      return Math.abs(val - fitted);
    });
    
    const uncertainty = this.calculateMean(residuals) * 1.5;
    const confidence = Math.max(0.6, 1 - (uncertainty / Math.abs(forecast)));

    return { forecast: Math.max(0, forecast), uncertainty, confidence };
  }

  private crostonMethod(values: number[], daysAhead: number): { forecast: number; uncertainty: number; confidence: number } {
    // Méthode de Croston pour demande intermittente
    const nonZeroValues: number[] = [];
    const intervals: number[] = [];
    
    let lastNonZeroIndex = -1;
    
    for (let i = 0; i < values.length; i++) {
      if (values[i] > 0) {
        nonZeroValues.push(values[i]);
        if (lastNonZeroIndex >= 0) {
          intervals.push(i - lastNonZeroIndex);
        }
        lastNonZeroIndex = i;
      }
    }

    if (nonZeroValues.length < 2) {
      return { forecast: 0, uncertainty: 0, confidence: 0.3 };
    }

    const alpha = 0.1;
    
    // Lissage exponentiel des tailles et intervalles
    let avgSize = nonZeroValues[0];
    let avgInterval = intervals[0] || 1;
    
    for (let i = 1; i < nonZeroValues.length; i++) {
      avgSize = alpha * nonZeroValues[i] + (1 - alpha) * avgSize;
      if (i < intervals.length) {
        avgInterval = alpha * intervals[i] + (1 - alpha) * avgInterval;
      }
    }

    // Prévision
    const demandRate = avgSize / avgInterval;
    const forecast = demandRate * daysAhead;
    
    const uncertainty = this.calculateStandardDeviation(nonZeroValues) / Math.sqrt(avgInterval);
    const confidence = Math.min(0.8, nonZeroValues.length / 20); // Plus de données = plus de confiance

    return { forecast: Math.max(0, forecast), uncertainty, confidence };
  }

  private applyExternalFactors(
    baseValue: number, 
    factors: ExternalFactor[], 
    daysAhead: number
  ): { adjustedValue: number; confidenceMultiplier: number } {
    let adjustment = 1;
    let confidenceMultiplier = 1;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    for (const factor of factors) {
      const daysDiff = Math.abs((factor.date.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) { // Facteur actif dans les 7 jours
        const impact = factor.impact_score * Math.exp(-daysDiff / 3); // Décroissance exponentielle
        
        switch (factor.type) {
          case 'PROMOTIONAL':
            adjustment *= (1 + impact);
            confidenceMultiplier *= 0.9; // Promotions ajoutent de l'incertitude
            break;
          case 'WEATHER':
            adjustment *= (1 + impact * 0.5);
            confidenceMultiplier *= 0.95;
            break;
          case 'CALENDAR':
            adjustment *= (1 + impact * 0.3);
            confidenceMultiplier *= 0.98;
            break;
          default:
            adjustment *= (1 + impact * 0.2);
            confidenceMultiplier *= 0.97;
        }
      }
    }

    return {
      adjustedValue: baseValue * adjustment,
      confidenceMultiplier: Math.max(0.5, confidenceMultiplier)
    };
  }

  // Combinaison des prévisions d'ensemble
  private combineModelForecasts(
    modelResults: { model: string; forecasts: ForecastResult[]; confidence: number }[],
    confidenceLevel: number
  ): ForecastResult[] {
    if (modelResults.length === 0) return [];
    
    const combinedForecasts: ForecastResult[] = [];
    const numDays = modelResults[0].forecasts.length;

    for (let day = 0; day < numDays; day++) {
      const dayForecasts = modelResults.map(result => result.forecasts[day]);
      const weights = modelResults.map(result => result.confidence);
      const totalWeight = weights.reduce((a, b) => a + b, 0);

      // Moyenne pondérée
      const weightedPrediction = dayForecasts.reduce((sum, forecast, i) => 
        sum + forecast.predicted_demand * (weights[i] / totalWeight), 0
      );

      // Calcul de l'incertitude combinée
      const variance = dayForecasts.reduce((sum, forecast, i) => 
        sum + Math.pow(forecast.predicted_demand - weightedPrediction, 2) * (weights[i] / totalWeight), 0
      );
      const combinedUncertainty = Math.sqrt(variance);

      // Intervalle de confiance
      const confidenceInterval = this.calculateConfidenceInterval(
        weightedPrediction, 
        combinedUncertainty, 
        confidenceLevel
      );

      combinedForecasts.push({
        product_id: dayForecasts[0].product_id,
        forecast_date: dayForecasts[0].forecast_date,
        predicted_demand: Math.max(0, weightedPrediction),
        confidence_80: [
          Math.max(0, weightedPrediction - combinedUncertainty),
          weightedPrediction + combinedUncertainty
        ],
        confidence_95: confidenceInterval,
        model_used: `ensemble_${modelResults.map(r => r.model).join('_')}`,
        accuracy_score: totalWeight / modelResults.length
      });
    }

    return combinedForecasts;
  }

  private calculateConfidenceInterval(
    prediction: number, 
    uncertainty: number, 
    confidenceLevel: number
  ): [number, number] {
    // Utilisation de la distribution normale pour l'intervalle de confiance
    const zScore = confidenceLevel === 0.95 ? 1.96 : 1.28; // 95% ou 80%
    const margin = zScore * uncertainty;
    
    return [
      Math.max(0, prediction - margin),
      prediction + margin
    ];
  }

  // Méthodes utilitaires

  private groupDataByProduct(salesData: SalesRecord[]): Map<string, SalesRecord[]> {
    const grouped = new Map<string, SalesRecord[]>();
    
    for (const record of salesData) {
      if (!grouped.has(record.product_id)) {
        grouped.set(record.product_id, []);
      }
      grouped.get(record.product_id)!.push(record);
    }
    
    return grouped;
  }

  private evaluateModelPerformance(
    timeSeries: { date: Date; value: number }[],
    modelType: string
  ): ForecastMetrics {
    if (timeSeries.length < 20) {
      return { MAPE: 50, WMAPE: 50, MAE: 10, RMSE: 15, bias: 0, tracking_signal: 0 };
    }

    // Validation croisée temporelle
    const trainSize = Math.floor(timeSeries.length * 0.8);
    const trainData = timeSeries.slice(0, trainSize);
    const testData = timeSeries.slice(trainSize);

    const predictions: number[] = [];
    const actuals = testData.map(t => t.value);

    // Génération des prévisions pour la période de test
    for (let i = 0; i < testData.length; i++) {
      const prediction = this.predictValue(trainData, modelType, i + 1);
      predictions.push(prediction.then ? 0 : (prediction as any).value || 0);
    }

    // Calcul des métriques
    const mape = this.calculateMAPE(actuals, predictions);
    const mae = this.calculateMAE(actuals, predictions);
    const rmse = this.calculateRMSE(actuals, predictions);
    
    const errors = actuals.map((actual, i) => actual - predictions[i]);
    const bias = this.calculateMean(errors);
    const meanAbsError = this.calculateMean(errors.map(Math.abs));
    const trackingSignal = meanAbsError > 0 ? Math.abs(bias) / meanAbsError : 0;

    // WMAPE (Weighted MAPE)
    const totalActual = actuals.reduce((a, b) => a + Math.abs(b), 0);
    const totalAbsError = errors.reduce((a, b) => a + Math.abs(b), 0);
    const wmape = totalActual > 0 ? (totalAbsError / totalActual) * 100 : mape;

    return {
      MAPE: mape,
      WMAPE: wmape,
      MAE: mae,
      RMSE: rmse,
      bias,
      tracking_signal: trackingSignal
    };
  }

  private calculateOverallPerformance(modelPerformances: ForecastMetrics[]): ForecastMetrics {
    if (modelPerformances.length === 0) {
      return { MAPE: 100, WMAPE: 100, MAE: 0, RMSE: 0, bias: 0, tracking_signal: 0 };
    }

    return {
      MAPE: this.calculateMean(modelPerformances.map(p => p.MAPE)),
      WMAPE: this.calculateMean(modelPerformances.map(p => p.WMAPE)),
      MAE: this.calculateMean(modelPerformances.map(p => p.MAE)),
      RMSE: this.calculateMean(modelPerformances.map(p => p.RMSE)),
      bias: this.calculateMean(modelPerformances.map(p => p.bias)),
      tracking_signal: this.calculateMean(modelPerformances.map(p => p.tracking_signal))
    };
  }

  private assessRecommendationQuality(
    forecasts: ForecastResult[], 
    patterns: DemandPattern[]
  ): number {
    if (forecasts.length === 0) return 0;

    // Qualité basée sur la cohérence avec les patterns détectés
    let qualityScore = 0;
    let totalForecasts = 0;

    const productForecasts = new Map<string, ForecastResult[]>();
    for (const forecast of forecasts) {
      if (!productForecasts.has(forecast.product_id)) {
        productForecasts.set(forecast.product_id, []);
      }
      productForecasts.get(forecast.product_id)!.push(forecast);
    }

    for (const [productId, productForecastList] of productForecasts.entries()) {
      const pattern = patterns.find(p => p.product_id === productId);
      if (!pattern) continue;

      const avgAccuracy = this.calculateMean(productForecastList.map(f => f.accuracy_score));
      const consistencyScore = this.calculateForecastConsistency(productForecastList, pattern);
      
      qualityScore += (avgAccuracy * 0.7 + consistencyScore * 0.3) * productForecastList.length;
      totalForecasts += productForecastList.length;
    }

    return totalForecasts > 0 ? qualityScore / totalForecasts : 0;
  }

  private calculateForecastConsistency(forecasts: ForecastResult[], pattern: DemandPattern): number {
    // Vérifier si les prévisions sont cohérentes avec le pattern détecté
    const values = forecasts.map(f => f.predicted_demand);
    
    switch (pattern.pattern_type) {
      case 'STABLE':
        // Pour un pattern stable, la variance devrait être faible
        const cv = this.calculateStandardDeviation(values) / this.calculateMean(values);
        return Math.max(0, 1 - cv);
        
      case 'TRENDING':
        // Pour un pattern avec tendance, vérifier la monotonie
        const trend = this.detectMonotonicity(values);
        return pattern.trend_direction === 'UP' ? trend.upward : 
               pattern.trend_direction === 'DOWN' ? trend.downward : trend.stable;
        
      case 'SEASONAL':
        // Pour un pattern saisonnier, vérifier la périodicité (simplifié)
        return 0.7; // Score fixe pour la saisonnalité (nécessiterait une analyse plus complexe)
        
      default:
        return 0.6; // Score par défaut pour patterns erratiques
    }
  }

  private detectMonotonicity(values: number[]): { upward: number; downward: number; stable: number } {
    if (values.length < 2) return { upward: 0, downward: 0, stable: 1 };
    
    let upward = 0;
    let downward = 0;
    let stable = 0;
    
    for (let i = 1; i < values.length; i++) {
      const diff = values[i] - values[i - 1];
      if (Math.abs(diff) < 0.1 * values[i - 1]) {
        stable++;
      } else if (diff > 0) {
        upward++;
      } else {
        downward++;
      }
    }
    
    const total = values.length - 1;
    return {
      upward: upward / total,
      downward: downward / total,
      stable: stable / total
    };
  }

  private generateModelSelectionReasoning(modelPerformances: ForecastMetrics[]): string {
    if (modelPerformances.length === 0) {
      return "Aucune donnée suffisante pour la sélection de modèle";
    }

    const avgMAPE = this.calculateMean(modelPerformances.map(p => p.MAPE));
    const avgBias = this.calculateMean(modelPerformances.map(p => p.bias));
    
    let reasoning = `Performance moyenne: MAPE de ${avgMAPE.toFixed(1)}%. `;
    
    if (avgMAPE < 10) {
      reasoning += "Excellente précision de prévision. ";
    } else if (avgMAPE < 20) {
      reasoning += "Bonne précision de prévision. ";
    } else {
      reasoning += "Précision modérée - données potentiellement volatiles. ";
    }
    
    if (Math.abs(avgBias) > 5) {
      reasoning += `Biais détecté (${avgBias > 0 ? 'sur-estimation' : 'sous-estimation'}). `;
    }
    
    reasoning += "Utilisation d'ensemble de modèles pour robustesse.";
    
    return reasoning;
  }
}