// Classe de base pour tous les agents IA

import type { 
  AgentConfig, 
  AgentExecutionResult, 
  AgentMessage, 
  StockAnalysisState 
} from '@/types/ai-agents';

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected lastExecution?: Date;
  protected errorCount: number = 0;
  protected performanceHistory: number[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
  }

  // Méthode abstraite que chaque agent doit implémenter
  abstract execute(input: any, state: StockAnalysisState): Promise<AgentExecutionResult>;

  // Méthodes communes à tous les agents
  async run(input: any, state: StockAnalysisState): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    this.lastExecution = new Date();

    try {
      // Validation des dépendances
      await this.validateDependencies(state);
      
      // Exécution de l'agent
      const result = await this.execute(input, state);
      
      // Mise à jour des métriques de performance
      this.updatePerformanceMetrics(result);
      
      // Validation du résultat
      this.validateResult(result);
      
      return result;
    } catch (error) {
      this.errorCount++;
      const executionTime = Date.now() - startTime;
      
      console.error(`[${this.config.id}] Execution failed:`, error);
      
      return {
        agent_id: this.config.id,
        execution_time_ms: executionTime,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        confidence_score: 0,
        output: null,
        metrics: {
          processing_speed: 0,
          resource_usage: executionTime
        }
      };
    }
  }

  // Validation des dépendances requises
  protected async validateDependencies(state: StockAnalysisState): Promise<void> {
    for (const dependency of this.config.dependencies) {
      if (!this.isDependencyMet(dependency, state)) {
        throw new Error(`Dependency not met: ${dependency}`);
      }
    }
  }

  // Vérifier si une dépendance est satisfaite
  protected isDependencyMet(dependency: string, state: StockAnalysisState): boolean {
    switch (dependency) {
      case 'sales_history':
        return state.raw_data.sales_history.length > 0;
      case 'inventory_data':
        return state.raw_data.current_inventory.length > 0;
      case 'demand_patterns':
        return state.processed_insights.demand_patterns.length > 0;
      case 'forecasts':
        return state.forecasts.short_term.length > 0;
      default:
        return true;
    }
  }

  // Mise à jour des métriques de performance
  protected updatePerformanceMetrics(result: AgentExecutionResult): void {
    this.performanceHistory.push(result.confidence_score);
    
    // Garder seulement les 100 dernières exécutions
    if (this.performanceHistory.length > 100) {
      this.performanceHistory = this.performanceHistory.slice(-100);
    }
  }

  // Validation du résultat
  protected validateResult(result: AgentExecutionResult): void {
    if (result.execution_time_ms > this.config.performance_targets.max_execution_time_ms) {
      console.warn(`[${this.config.id}] Execution time exceeded target: ${result.execution_time_ms}ms`);
    }
    
    if (result.confidence_score < this.config.performance_targets.min_accuracy_score) {
      console.warn(`[${this.config.id}] Confidence score below target: ${result.confidence_score}`);
    }
  }

  // Métriques de santé de l'agent
  getHealthMetrics() {
    const avgPerformance = this.performanceHistory.length > 0 
      ? this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length 
      : 0;

    const errorRate = this.errorCount / Math.max(this.performanceHistory.length, 1);
    
    let status: 'HEALTHY' | 'WARNING' | 'ERROR' = 'HEALTHY';
    if (errorRate > this.config.performance_targets.max_error_rate) {
      status = 'ERROR';
    } else if (avgPerformance < this.config.performance_targets.min_accuracy_score) {
      status = 'WARNING';
    }

    return {
      status,
      last_execution: this.lastExecution || new Date(0),
      performance_score: avgPerformance,
      error_count: this.errorCount,
      error_rate: errorRate,
      executions_count: this.performanceHistory.length
    };
  }

  // Envoyer un message à un autre agent
  protected createMessage(
    receiver: string, 
    type: AgentMessage['type'], 
    payload: any, 
    priority: number = 3
  ): AgentMessage {
    return {
      sender: this.config.id,
      receiver,
      type,
      priority: priority as 1 | 2 | 3 | 4 | 5,
      payload,
      timestamp: new Date(),
      correlation_id: this.generateCorrelationId()
    };
  }

  // Génération d'ID de corrélation unique
  private generateCorrelationId(): string {
    return `${this.config.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utilitaires de calcul statistique communes
  protected calculateMean(values: number[]): number {
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  protected calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = this.calculateMean(squaredDiffs);
    
    return Math.sqrt(avgSquaredDiff);
  }

  protected calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    
    if (Number.isInteger(index)) {
      return sorted[index];
    }
    
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  // Calcul de métriques de prévision
  protected calculateMAPE(actual: number[], predicted: number[]): number {
    if (actual.length !== predicted.length || actual.length === 0) return 0;
    
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== 0) {
        sum += Math.abs((actual[i] - predicted[i]) / actual[i]);
        count++;
      }
    }
    
    return count > 0 ? (sum / count) * 100 : 0;
  }

  protected calculateMAE(actual: number[], predicted: number[]): number {
    if (actual.length !== predicted.length || actual.length === 0) return 0;
    
    const sum = actual.reduce((acc, val, i) => acc + Math.abs(val - predicted[i]), 0);
    return sum / actual.length;
  }

  protected calculateRMSE(actual: number[], predicted: number[]): number {
    if (actual.length !== predicted.length || actual.length === 0) return 0;
    
    const sumSquaredErrors = actual.reduce((acc, val, i) => 
      acc + Math.pow(val - predicted[i], 2), 0);
    
    return Math.sqrt(sumSquaredErrors / actual.length);
  }

  // Logging structuré
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      agent: this.config.id,
      level,
      message,
      data
    };
    
    console[level](`[${timestamp}] [${this.config.id}] ${message}`, data || '');
  }
}