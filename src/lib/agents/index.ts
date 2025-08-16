// Index principal pour le système d'agents OpenAI SDK
// Migration vers OpenAI Agents SDK officiel terminée

// Export des agents bancaires migrés
export {
  bankingAnalystAgent,
  fraudDetectionAgent,
  cashFlowAnalystAgent,
  bankingTriageAgent,
  secureBankingAgent,
  runBankingAgent,
  runBankingAgentWithStreaming,
  type BankingContext,
} from './banking/agents';

// Export des agents d'inventaire migrés
export {
  inventoryAnalystAgent,
  stockOptimizationAgent,
  demandForecastAgent,
  inventoryTriageAgent,
  secureInventoryAgent,
  runInventoryAgent,
  runInventoryAgentWithStreaming,
  type InventoryContext,
} from './inventory/agents';

// Export des tools bancaires SDK
export {
  extractTransactionsTool,
  detectAnomaliesTool,
  calculateBalanceTool,
  categorizeTransactionsTool,
  generateBankingReportTool,
  type Transaction,
  type BankingDocument,
  type AnomalyResult,
} from './banking/tools';

// Export des tools d'inventaire SDK
export {
  analyzeStockLevelsTool,
  optimizeInventoryTool,
  forecastDemandTool,
  detectSlowMovingItemsTool,
  generateInventoryReportTool,
  type InventoryItem,
  type SalesData,
  type DemandForecast,
  type OptimizationResult,
} from './inventory/tools';

// Types et interfaces pour le nouveau système SDK
export interface AgentRunResult {
  success: boolean;
  result?: string;
  error?: string;
  agent?: string;
  timestamp: string;
}

export interface StreamingOptions {
  stream?: boolean;
  compatibleWithNodeStreams?: boolean;
}

// Interface unifiée pour les demandes d'analyse
export interface AnalysisRequest {
  type: 'banking' | 'inventory';
  agentType?: 'triage' | 'analyst' | 'fraud' | 'cashflow' | 'optimization' | 'forecast';
  input: string;
  data?: any;
  streaming?: boolean;
  context?: BankingContext | InventoryContext;
}

// Interface unifiée pour les réponses d'analyse
export interface AnalysisResponse {
  success: boolean;
  result?: string;
  agent?: string;
  timestamp: string;
  error?: string;
}

// Fonction utilitaire pour exécuter n'importe quel agent
export async function runAgent(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    if (request.type === 'banking') {
      const result = await runBankingAgent(
        request.agentType as any,
        request.input,
        request.data
      );
      return result;
    } else if (request.type === 'inventory') {
      const result = await runInventoryAgent(
        request.agentType as any,
        request.input,
        request.data
      );
      return result;
    } else {
      throw new Error(`Unknown agent type: ${request.type}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// Fonction utilitaire pour le streaming
export async function runAgentStreaming(request: AnalysisRequest) {
  if (request.type === 'banking') {
    return runBankingAgentWithStreaming(
      request.agentType as any,
      request.input,
      request.data
    );
  } else if (request.type === 'inventory') {
    return runInventoryAgentWithStreaming(
      request.agentType as any,
      request.input,
      request.data
    );
  } else {
    throw new Error(`Unknown agent type for streaming: ${request.type}`);
  }
}

// Métadonnées du système d'agents
export const AGENTS_METADATA = {
  version: '2.0.0',
  sdkVersion: '@openai/agents',
  migrationDate: new Date().toISOString(),
  features: [
    'OpenAI Agents SDK official',
    'Agent handoffs',
    'Input guardrails',
    'Streaming support',
    'Zod validation',
    'Type safety',
    'Error handling',
    'Context awareness',
  ],
  agents: {
    banking: {
      triage: 'bankingTriageAgent',
      analyst: 'bankingAnalystAgent',
      fraud: 'fraudDetectionAgent',
      cashflow: 'cashFlowAnalystAgent',
      secure: 'secureBankingAgent',
    },
    inventory: {
      triage: 'inventoryTriageAgent',
      analyst: 'inventoryAnalystAgent',
      optimization: 'stockOptimizationAgent',
      forecast: 'demandForecastAgent',
      secure: 'secureInventoryAgent',
    },
  },
};
