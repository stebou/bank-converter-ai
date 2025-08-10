// Export principal pour tous les agents
export * from './banking/agents';
export * from './inventory/agents';

// Export des tools avec aliases pour éviter les conflits
export * from './banking/tools';
export { toolImplementations as inventoryToolImplementations } from './inventory/tools';

// Types et interfaces communes
export interface AgentConfig {
  name: string;
  model: string;
  instructions: string;
  tools: any[];
}

export interface AnalysisRequest {
  type: 'banking' | 'inventory';
  data: any;
  analysisType?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysisType: string;
  result: any;
  timestamp: string;
  error?: string;
}
