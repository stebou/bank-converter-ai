// Types pour le système d'agents IA de gestion prédictive des stocks

export interface SalesRecord {
  product_id: string;
  date: Date;
  quantity_sold: number;
  revenue: number;
  channel: string;
  customer_segment?: string;
}

export interface InventoryRecord {
  product_id: string;
  current_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  location: string;
  last_updated: Date;
}

export interface SupplierRecord {
  supplier_id: string;
  product_id: string;
  lead_time_days: number;
  minimum_order_quantity: number;
  cost_per_unit: number;
  reliability_score: number; // 0-1
}

export interface ForecastResult {
  product_id: string;
  forecast_date: Date;
  predicted_demand: number;
  confidence_80: [number, number];
  confidence_95: [number, number];
  model_used: string;
  accuracy_score: number;
}

export interface ForecastMetrics {
  MAPE: number; // Mean Absolute Percentage Error
  WMAPE: number; // Weighted MAPE
  MAE: number; // Mean Absolute Error
  RMSE: number; // Root Mean Square Error
  bias: number; // Systematic error
  tracking_signal: number; // Cumulative error monitoring
}

export interface DemandPattern {
  product_id: string;
  pattern_type: 'SEASONAL' | 'TRENDING' | 'STABLE' | 'ERRATIC';
  seasonality_strength: number; // 0-1
  trend_direction: 'UP' | 'DOWN' | 'STABLE';
  trend_strength: number; // 0-1
  volatility: number; // 0-1
  confidence: number; // 0-1
}

export interface ProductSegment {
  product_id: string;
  abc_classification: 'A' | 'B' | 'C'; // Based on revenue
  xyz_classification: 'X' | 'Y' | 'Z'; // Based on predictability
  velocity: 'FAST' | 'MEDIUM' | 'SLOW';
  margin_category: 'HIGH' | 'MEDIUM' | 'LOW';
  strategic_importance: 'CRITICAL' | 'IMPORTANT' | 'STANDARD';
}

export interface SeasonalityData {
  product_id: string;
  seasonal_periods: number[]; // Days of year with peaks
  seasonal_multipliers: number[]; // Multiplier for each month
  peak_season: { start: number; end: number }; // Day of year
  low_season: { start: number; end: number };
}

export interface ReorderPoint {
  product_id: string;
  reorder_point_quantity: number;
  lead_time_demand: number;
  safety_stock_quantity: number;
  daily_demand_average: number;
  critical_threshold: number;
  emergency_threshold: number;
  recommended_order_quantity: number;
  review_frequency_days: number;
  confidence_score: number;
}

export interface SafetyStock {
  product_id: string;
  safety_stock_quantity: number;
  service_level: number;
  lead_time_days: number;
  demand_mean_during_lead_time: number;
  demand_std_during_lead_time: number;
  z_score: number;
  volatility_adjustment: number;
  annual_holding_cost: number;
  confidence_score: number;
}

export interface OrderQuantity {
  product_id: string;
  economic_order_quantity: number;
  recommended_order_quantity: number;
  order_frequency_days: number;
  total_cost_per_cycle: number;
  holding_cost_per_unit: number;
  ordering_cost_per_order: number;
}

export interface Alert {
  id: string;
  type:
    | 'STOCKOUT_RISK'
    | 'OVERSTOCK'
    | 'DEMAND_SPIKE'
    | 'SUPPLIER_ISSUE'
    | 'FORECAST_DEVIATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  product_id: string;
  message: string;
  details: string;
  created_at: Date;
  resolved_at?: Date;
  estimated_impact: {
    financial: number;
    operational: string;
  };
  recommended_action: string;
}

export interface Recommendation {
  id: string;
  type: 'ORDER' | 'ADJUST' | 'ALERT' | 'OPTIMIZE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  product_id: string;
  action: string;
  reasoning: string;
  expected_impact: string;
  deadline: Date;
  estimated_cost?: number;
  estimated_benefit?: number;
  confidence_score: number; // 0-1
  agent_source: string;
}

export interface OptimizationMetrics {
  service_level: number; // % demande satisfaite (95%+)
  inventory_turnover: number; // Rotation stock (6-12x/an)
  days_of_inventory: number; // Couverture stock (15-45 jours)
  holding_cost_ratio: number; // % CA immobilisé (<15%)
  stockout_frequency: number; // Nb ruptures/mois (<2%)
}

export interface StockManagementKPIs {
  // Précision prévisions
  forecast_accuracy: {
    overall_mape: number; // <10% excellent, <20% bon
    short_term_mape: number; // 1-4 semaines
    medium_term_mape: number; // 1-3 mois
    bias_percentage: number; // Tendance sur/sous-estimation
  };

  // Service client
  service_metrics: {
    service_level: number; // % demande satisfaite (target: >95%)
    fill_rate: number; // % commandes complètes (target: >98%)
    stockout_frequency: number; // Nb ruptures/mois (target: <2)
    average_stockout_duration: number; // Jours (target: <1)
  };

  // Efficacité financière
  financial_metrics: {
    inventory_turnover: number; // CA/Stock moyen (target: 6-12)
    days_of_inventory: number; // Stock/Vente quotidienne (target: 30-45)
    holding_cost_percentage: number; // % CA immobilisé (target: <15%)
    dead_stock_ratio: number; // % stock >90j invendu (target: <5%)
  };

  // Qualité décisions IA
  ai_performance: {
    alert_precision: number; // % alertes justifiées (target: >80%)
    recommendation_adoption: number; // % recommandations suivies
    proactive_prevention: number; // % problèmes évités via IA
    model_stability: number; // Variance performance modèles
  };
}

export interface RealTimeMetrics {
  current_alerts: Alert[];
  forecast_confidence_today: number;
  inventory_status: {
    products_below_min: number;
    products_above_max: number;
    predicted_stockouts_7d: number;
    total_inventory_value: number;
  };

  agent_health: {
    [agentName: string]: {
      status: 'HEALTHY' | 'WARNING' | 'ERROR';
      last_execution: Date;
      performance_score: number;
      error_count: number;
    };
  };
}

export interface OptimizationResult {
  product_id: string;
  current_eoq: number;
  optimized_eoq: number;
  current_safety_stock: number;
  optimized_safety_stock: number;
  current_reorder_point: number;
  optimized_reorder_point: number;
  cost_savings_annual: number;
  service_level_improvement: number;
  implementation_priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface StockAnalysisState {
  raw_data: {
    sales_history: SalesRecord[];
    current_inventory: InventoryRecord[];
    supplier_data: SupplierRecord[];
  };

  processed_insights: {
    demand_patterns: DemandPattern[];
    seasonality: SeasonalityData[];
    product_segments: ProductSegment[];
  };

  forecasts: {
    short_term: ForecastResult[];
    medium_term: ForecastResult[];
    long_term: ForecastResult[];
    confidence_intervals: { [product_id: string]: [number, number] };
  };

  optimization_results: {
    reorder_points: ReorderPoint[];
    safety_stocks: SafetyStock[];
    order_quantities: OrderQuantity[];
  };

  alerts: Alert[];
  recommendations: Recommendation[];
  metrics: StockManagementKPIs;
  real_time_metrics: RealTimeMetrics;
}

export interface AgentMessage {
  sender: string;
  receiver: string;
  type: 'DATA_REQUEST' | 'ANALYSIS_RESULT' | 'RECOMMENDATION' | 'ALERT';
  priority: 1 | 2 | 3 | 4 | 5; // 1 = critique, 5 = info
  payload: any;
  timestamp: Date;
  correlation_id: string;
}

export enum WorkflowPattern {
  SEQUENTIAL = 'Pipeline étape par étape',
  PARALLEL = 'Analyses simultanées puis synthèse',
  FEEDBACK_LOOP = 'Validation croisée entre agents',
  EMERGENCY = 'Bypass normal pour urgences',
}

export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  performance_targets: {
    max_execution_time_ms: number;
    min_accuracy_score: number;
    max_error_rate: number;
  };
}

export interface AgentExecutionResult {
  agent_id: string;
  execution_time_ms: number;
  success: boolean;
  error?: string;
  confidence_score: number;
  output: any;
  metrics: {
    accuracy?: number;
    processing_speed: number;
    resource_usage: number;
  };
}

// Interfaces pour les agents spécifiques

export interface DataAnalysisInput {
  sales_history: SalesRecord[];
  inventory_history: InventoryRecord[];
  time_range: { start: Date; end: Date };
  analysis_type:
    | 'PATTERN_DETECTION'
    | 'SEGMENTATION'
    | 'TREND_ANALYSIS'
    | 'FULL_ANALYSIS';
}

export interface DataAnalysisOutput {
  demand_patterns: DemandPattern[];
  product_segments: ProductSegment[];
  seasonality_data: SeasonalityData[];
  key_insights: string[];
  confidence_score: number;
  data_quality_score: number;
}

export interface ForecastingInput {
  historical_data: SalesRecord[];
  demand_patterns: DemandPattern[];
  external_factors?: ExternalFactor[];
  forecast_horizon_days: number;
  confidence_level: number; // 0.8 or 0.95
}

export interface ForecastingOutput {
  forecasts: ForecastResult[];
  model_performance: ForecastMetrics;
  recommendation_quality: number;
  model_selection_reasoning: string;
}

export interface ExternalFactor {
  type: 'WEATHER' | 'CALENDAR' | 'ECONOMIC' | 'PROMOTIONAL' | 'COMPETITIVE';
  date: Date;
  value: number;
  impact_score: number; // 0-1
  description: string;
}

export interface WorkflowResult {
  workflow_id: string;
  execution_start: Date;
  execution_end: Date;
  success: boolean;
  agents_executed: string[];
  final_state: StockAnalysisState;
  recommendations: Recommendation[];
  alerts: Alert[];
  performance_summary: {
    total_execution_time_ms: number;
    agents_performance: { [agent_id: string]: AgentExecutionResult };
  };
}
