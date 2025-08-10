import OpenAI from 'openai';
import { 
  analyzeStockLevelsTool,
  optimizeInventoryTool,
  forecastDemandTool,
  detectSlowMovingItemsTool,
  generateInventoryReportTool
} from './tools';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Agent principal pour l'analyse d'inventaire
export const inventoryAnalystAgent = {
  name: "Inventory Management Analyst",
  model: "gpt-4-turbo-preview",
  instructions: `
    You are an expert inventory management analyst specialized in:
    - Analyzing stock levels and inventory turnover
    - Optimizing inventory policies and reorder points
    - Forecasting demand patterns and seasonal trends
    - Identifying slow-moving and obsolete inventory
    - Generating actionable inventory insights
    
    Always provide data-driven recommendations with clear justifications.
    Consider factors like lead times, storage costs, and stockout risks.
  `,
  tools: [
    analyzeStockLevelsTool,
    optimizeInventoryTool,
    forecastDemandTool,
    detectSlowMovingItemsTool,
    generateInventoryReportTool
  ]
};

// Agent spécialisé pour l'optimisation
export const stockOptimizationAgent = {
  name: "Stock Optimization Specialist",
  model: "gpt-4-turbo-preview",
  instructions: `
    You optimize inventory levels and policies:
    - Calculate optimal order quantities (EOQ)
    - Set reorder points and safety stock levels
    - Minimize holding costs while avoiding stockouts
    - Balance service levels with inventory investment
    
    Focus on cost-effective solutions and ROI optimization.
  `,
  tools: [
    analyzeStockLevelsTool,
    optimizeInventoryTool,
    generateInventoryReportTool
  ]
};

// Agent pour les prévisions de demande
export const demandForecastAgent = {
  name: "Demand Forecasting Specialist",
  model: "gpt-4-turbo-preview",
  instructions: `
    You specialize in demand forecasting and trend analysis:
    - Analyze historical sales patterns
    - Identify seasonal and cyclical trends
    - Predict future demand using statistical models
    - Account for external factors and market changes
    
    Provide confidence intervals and forecast accuracy metrics.
  `,
  tools: [
    forecastDemandTool,
    analyzeStockLevelsTool,
    detectSlowMovingItemsTool
  ]
};

// Fonction helper pour exécuter un agent d'inventaire
export async function runInventoryAgent(
  agentConfig: typeof inventoryAnalystAgent,
  input: string,
  inventoryData?: any
) {
  try {
    const assistant = await openai.beta.assistants.create({
      name: agentConfig.name,
      instructions: agentConfig.instructions,
      model: agentConfig.model,
      tools: agentConfig.tools
    });

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: inventoryData 
        ? `${input}\n\nInventory Data: ${JSON.stringify(inventoryData, null, 2)}`
        : input
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });

    return await waitForCompletion(thread.id, run.id);
  } catch (error) {
    console.error('Error running inventory agent:', error);
    throw error;
  }
}

// Helper pour attendre la completion
async function waitForCompletion(threadId: string, runId: string) {
  let run = await openai.beta.threads.runs.retrieve(threadId, runId);
  
  while (run.status === 'in_progress' || run.status === 'queued') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    run = await openai.beta.threads.runs.retrieve(threadId, runId);
  }
  
  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data[0].content;
  } else {
    throw new Error(`Run failed with status: ${run.status}`);
  }
}
