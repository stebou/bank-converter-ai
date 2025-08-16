// Agents d'inventaire migrés vers OpenAI Agents SDK officiel
import { Agent, run } from '@openai/agents';
import {
  analyzeStockLevelsTool,
  detectSlowMovingItemsTool,
  forecastDemandTool,
  generateInventoryReportTool,
  optimizeInventoryTool,
} from './tools';

// Agent principal pour l'analyse d'inventaire - SDK officiel
export const inventoryAnalystAgent = new Agent({
  name: 'Inventory Management Analyst',
  model: 'gpt-4o',
  instructions: `
    You are an expert inventory management analyst specialized in:
    - Analyzing stock levels and inventory turnover
    - Optimizing inventory policies and reorder points
    - Forecasting demand patterns and seasonal trends
    - Identifying slow-moving and obsolete inventory
    - Generating actionable inventory insights
    
    Always provide data-driven recommendations with clear justifications.
    Consider factors like lead times, storage costs, and stockout risks.
    Use the available tools to perform comprehensive inventory analysis.
  `,
  tools: [
    analyzeStockLevelsTool,
    optimizeInventoryTool,
    forecastDemandTool,
    detectSlowMovingItemsTool,
    generateInventoryReportTool,
  ],
});

// Agent spécialisé pour l'optimisation - SDK officiel
export const stockOptimizationAgent = new Agent({
  name: 'Stock Optimization Specialist',
  model: 'gpt-4o',
  instructions: `
    You are a stock optimization specialist focused on:
    - Calculate optimal order quantities (EOQ)
    - Set reorder points and safety stock levels
    - Minimize holding costs while avoiding stockouts
    - Balance service levels with inventory investment
    
    Focus on cost-effective solutions and ROI optimization.
    Provide specific recommendations with quantified benefits.
  `,
  tools: [
    analyzeStockLevelsTool,
    optimizeInventoryTool,
    generateInventoryReportTool,
  ],
});

// Agent pour les prévisions de demande - SDK officiel
export const demandForecastAgent = new Agent({
  name: 'Demand Forecasting Specialist',
  model: 'gpt-4o',
  instructions: `
    You are a demand forecasting specialist focused on:
    - Analyze historical sales patterns
    - Identify seasonal and cyclical trends
    - Predict future demand using statistical models
    - Account for external factors and market changes
    
    Provide confidence intervals and forecast accuracy metrics.
    Explain your forecasting methodology and assumptions.
  `,
  tools: [
    forecastDemandTool,
    analyzeStockLevelsTool,
    detectSlowMovingItemsTool,
  ],
});

// Agent de triage pour l'inventaire avec handoffs - Nouvelle fonctionnalité SDK
export const inventoryTriageAgent = new Agent({
  name: 'Inventory Triage Agent',
  model: 'gpt-4o',
  instructions: `
    You are an inventory triage agent that routes requests to specialists:
    - For comprehensive inventory analysis and stock level evaluation, delegate to Inventory Management Analyst
    - For optimization problems and cost reduction, delegate to Stock Optimization Specialist
    - For demand forecasting and trend analysis, delegate to Demand Forecasting Specialist
    - For simple questions about inventory concepts, answer directly
    
    Always explain your routing decisions and provide context for handoffs.
  `,
  handoffs: [inventoryAnalystAgent, stockOptimizationAgent, demandForecastAgent],
});

// Fonction d'exécution avec SDK officiel - Nouvelle interface
export async function runInventoryAgent(
  agentType: 'triage' | 'analyst' | 'optimization' | 'forecast' = 'triage',
  input: string,
  inventoryData?: any
) {
  console.log(`📦 Starting inventory analysis with ${agentType} agent...`);
  
  try {
    let agent: Agent;
    switch (agentType) {
      case 'analyst':
        agent = inventoryAnalystAgent;
        break;
      case 'optimization':
        agent = stockOptimizationAgent;
        break;
      case 'forecast':
        agent = demandForecastAgent;
        break;
      default:
        agent = inventoryTriageAgent;
    }

    const fullInput = inventoryData 
      ? `${input}\n\nInventory Data: ${JSON.stringify(inventoryData, null, 2)}`
      : input;

    console.log(`🔄 Running agent: ${agent.name}`);
    const result = await run(agent, fullInput);
    
    console.log(`✅ Inventory analysis completed by: ${agent.name}`);
    
    return {
      success: true,
      result: result.finalOutput,
      agent: agent.name,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('❌ Error running inventory agent:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error',
      agentType,
      timestamp: new Date().toISOString(),
    };
  }
}

// Fonction avec streaming pour l'interface utilisateur
export async function runInventoryAgentWithStreaming(
  agentType: 'triage' | 'analyst' | 'optimization' | 'forecast' = 'triage',
  input: string,
  inventoryData?: any
) {
  console.log(`🌊 Starting streaming inventory analysis with ${agentType} agent...`);
  
  try {
    let agent: Agent;
    switch (agentType) {
      case 'analyst':
        agent = inventoryAnalystAgent;
        break;
      case 'optimization':
        agent = stockOptimizationAgent;
        break;
      case 'forecast':
        agent = demandForecastAgent;
        break;
      default:
        agent = inventoryTriageAgent;
    }

    const fullInput = inventoryData 
      ? `${input}\n\nInventory Data: ${JSON.stringify(inventoryData, null, 2)}`
      : input;

    const result = await run(agent, fullInput);
    
    // Pour le moment, retourner le résultat final en tant que string
    // Le streaming nécessite une configuration différente avec le SDK
    return result.finalOutput;
  } catch (error: any) {
    console.error('❌ Error in streaming inventory analysis:', error);
    throw new Error(error?.message || 'Unknown streaming error');
  }
}

// Interface pour le contexte d'inventaire sécurisé
export interface InventoryContext {
  companyId: string;
  warehouseId: string;
  accessLevel: 'read' | 'write' | 'admin';
  departmentRestrictions?: string[];
}

// Agent sécurisé avec guardrails pour l'inventaire
export const secureInventoryAgent = new Agent<InventoryContext>({
  name: 'Secure Inventory Analyst',
  model: 'gpt-4o',
  instructions: ({ context }) => `
    You are analyzing inventory data for company ${context.companyId}, warehouse ${context.warehouseId}.
    Access level: ${context.accessLevel}
    ${context.departmentRestrictions ? `Department restrictions: ${context.departmentRestrictions.join(', ')}` : ''}
    
    ${context.accessLevel === 'read' ? 'Provide analysis only, no modification suggestions.' : ''}
    ${context.accessLevel === 'admin' ? 'Full access - provide comprehensive analysis and recommendations.' : ''}
    
    Always respect data privacy and access control restrictions.
    Focus on actionable insights within the user's authorization level.
  `,
  tools: [analyzeStockLevelsTool, forecastDemandTool, generateInventoryReportTool],
  inputGuardrails: [
    {
      name: 'Vendor Information Protection',
      execute: async ({ input }) => {
        // Convertir l'input en string pour l'analyse
        const inputText = typeof input === 'string' ? input : JSON.stringify(input);
        const containsVendorInfo = /vendor|supplier|contract|pricing|cost/i.test(inputText);
        return {
          tripwireTriggered: containsVendorInfo,
          outputInfo: containsVendorInfo ? 'Vendor-sensitive information detected' : 'No sensitive vendor data detected',
        };
      },
    },
    {
      name: 'Financial Data Protection',
      execute: async ({ input }) => {
        // Convertir l'input en string pour l'analyse
        const inputText = typeof input === 'string' ? input : JSON.stringify(input);
        const containsFinancial = /profit|margin|revenue|\$[0-9,]+/i.test(inputText);
        return {
          tripwireTriggered: containsFinancial,
          outputInfo: containsFinancial ? 'Financial data detected in input' : 'No financial data detected',
        };
      },
    },
  ],
});