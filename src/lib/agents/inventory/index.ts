// Inventory/Stock Management AI Agents Team
// Équipe d'agents IA spécialisés dans la gestion des stocks et inventaires

export { BaseAgent } from '../shared/base-agent';
export { MasterCoordinatorAgent as InventoryCoordinator } from './inventory-coordinator';
export { DataAnalysisAgent } from './data-analysis-agent';
export { ForecastingAgent } from './forecasting-agent';
export { StockOptimizationAgent } from './stock-optimization-agent';
export { ExternalContextAgent } from './external-context-agent';
export { AnomalyDetectionAgent } from './anomaly-detection-agent';
export { KPIMetricsAgent } from './kpi-metrics-agent';

// Types pour l'équipe inventory
export type {
  AgentConfig,
  AgentExecutionResult,
  StockAnalysisState,
  WorkflowResult,
  SalesRecord,
  ForecastResult,
  StockManagementKPIs,
  DemandPattern,
  Alert,
  Recommendation
} from '@/types/ai-agents';