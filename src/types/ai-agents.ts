// Types pour les agents IA et analyses
export interface AIAgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AnalysisResult {
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

export interface MarketIntelligence {
  competitive_landscape: CompetitorAnalysis[];
  market_trends: MarketInsight[];
  emerging_opportunities: MarketEvent[];
  sentiment_analysis: SentimentAnalysis;
  risk_indicators: string[];
  market_size_estimate: number;
  growth_projections: { [key: string]: number };
  // Ajout des propriétés utilisées dans le composant
  market_insights: MarketInsight[];
  competitor_analysis: CompetitorAnalysis[];
  market_events: MarketEvent[];
  contextual_recommendations: string[];
  intelligence_summary?: string;
}

export interface MarketInsight {
  category: string;
  trend_direction: 'up' | 'down' | 'stable';
  confidence: number;
  impact_level: 'low' | 'medium' | 'high';
  timeframe: string;
  description: string;
  data_sources: string[];
  related_keywords: string[];
  geographic_scope: string;
  industry_segments: string[];
  implications: string[];
  recommended_actions: string[];
  risk_level: 'low' | 'medium' | 'high';
  market_indicators: {
    volume_change: number;
    price_volatility: number;
    demand_shift: number;
    supply_constraints: number;
  };
  // Propriétés supplémentaires pour compatibilité
  id?: string;
  title?: string;
  impact_score?: number;
  confidence_score?: number;
  source?: string;
  time_relevance?: string;
  keywords?: string[];
}

export interface CompetitorAnalysis {
  competitor_name: string;
  market_share: number;
  strengths: string[];
  weaknesses: string[];
  recent_moves: string[];
  threat_level: 'low' | 'medium' | 'high';
  // Propriétés supplémentaires pour compatibilité
  threat_assessment?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actions_detected?: string[];
}

export interface MarketEvent {
  event_type: string;
  significance: 'low' | 'medium' | 'high';
  timeline: string;
  impact_description: string;
}

export interface SentimentAnalysis {
  overall_sentiment: 'positive' | 'negative' | 'neutral' | number;
  confidence_score: number;
  key_themes: string[];
  volume_trends: { [key: string]: number };
  geographic_breakdown: { [key: string]: string };
  source_credibility: number;
  temporal_patterns: string[];
  influencer_mentions: string[];
  brand_association_score: number;
  crisis_indicators: string[];
}

export interface Recommendation {
  id: string;
  type: 'optimization' | 'alert' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  category: string;
  confidence: number;
  expected_roi: number;
  implementation_steps: string[];
  dependencies: string[];
  risks: string[];
  // Propriétés supplémentaires pour compatibilité
  action?: string;
  product_id?: string;
  expected_impact?: string;
  confidence_score?: number;
  reasoning?: string;
  estimated_benefit?: number;
  estimated_cost?: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  category: string;
  affected_areas: string[];
  recommended_actions: string[];
  auto_resolved: boolean;
  escalation_level: number;
  // Propriétés supplémentaires pour compatibilité
  product_id?: string;
  details?: string;
  estimated_impact?: string | {
    financial?: number;
    operational?: string;
  };
  recommended_action?: string; // Alias pour recommended_actions[0]
}

export interface KPIs {
  inventory_turnover: number;
  stock_accuracy: number;
  demand_forecast_accuracy: number;
  obsolete_inventory_percentage: number;
  stockout_frequency: number;
  carrying_cost_percentage: number;
  order_fulfillment_rate: number;
  supplier_reliability_score: number;
  cost_per_unit: number;
  profit_margin: number;
  seasonal_variance: number;
  inventory_days_on_hand: number;
  purchase_price_variance: number;
  inventory_shrinkage_rate: number;
  reorder_point_accuracy: number;
  safety_stock_optimization: number;
  abc_analysis_distribution: { [key: string]: number };
  vendor_performance_score: number;
  inventory_value_at_risk: number;
  // Propriétés supplémentaires pour compatibilité
  forecast_accuracy?: {
    overall_mape?: number;
  };
  service_metrics?: {
    service_level?: number;
  };
  financial_metrics?: {
    inventory_turnover?: number;
  };
}

export interface DemandPattern {
  product_category: string;
  seasonality: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: number;
  predictability_score: number;
  external_factors: string[];
  customer_segments: string[];
  // Propriétés supplémentaires pour compatibilité
  product_id?: string;
  pattern_type?: string;
  confidence?: number;
}

export interface ProductSegment {
  name: string;
  revenue_contribution: number;
  growth_rate: number;
  margin: number;
  strategic_importance: 'low' | 'medium' | 'high';
}

export interface Forecast {
  period: string;
  metric: string;
  predicted_value: number;
  confidence_interval: [number, number];
  accuracy_score: number;
  trend_indicators: string[];
}

export interface AgentPerformance {
  execution_time_ms: number;
  success_rate: number;
  confidence_score: number;
  data_quality: number;
  insights_generated: number;
  recommendations_count: number;
  processing_efficiency: number;
}

export interface AnalysisStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  agent: string;
  start_time?: string;
  end_time?: string;
  duration_ms?: number;
  // Propriétés utilisées dans le composant
  title: string;
  description: string;
  startTime?: Date;
  endTime?: Date;
}

export interface AnalysisProgress {
  current_step: number;
  total_steps: number;
  estimated_completion: string;
  status: 'initializing' | 'running' | 'completed' | 'error';
}
