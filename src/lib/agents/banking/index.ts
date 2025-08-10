// Banking AI Agents Team - Nouvelle structure optimisée
// Équipe d'agents IA spécialisés dans l'analyse bancaire et financière

// Export des nouveaux agents optimisés
export * from './agents';
export * from './tools';

// Types pour l'équipe banking (à partir de la nouvelle structure)
export interface AgentTask {
  id: string;
  type: 'analysis' | 'fraud' | 'cashflow';
  priority: 'low' | 'medium' | 'high';
  data: any;
}

export interface AgentWorkflow {
  tasks: AgentTask[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface BusinessInsightReport {
  summary: string;
  companyHealth: {
    score: number;
    trend: 'improving' | 'stable' | 'declining';
    riskLevel: 'low' | 'medium' | 'high';
  };
  financialMetrics: {
    cashFlow: number;
    monthlyGrowth: number;
    expenseRatio: number;
    profitMargin: number;
  };
  insights: {
    strengths: string[];
    concerns: string[];
    opportunities: string[];
  };
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    timeline: string;
    impact: string;
  }>;
}
