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

// Fonction helper pour exécuter un agent d'inventaire - VERSION SIMPLIFIÉE
export async function runInventoryAgent(
  agentConfig: typeof inventoryAnalystAgent,
  input: string,
  inventoryData?: any
) {
  try {
    // Utiliser directement l'API de completion au lieu des assistants
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: agentConfig.instructions
        },
        {
          role: "user",
          content: inventoryData 
            ? `${input}\n\nInventory Data: ${JSON.stringify(inventoryData, null, 2)}`
            : input
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return completion.choices[0].message.content || "Aucune réponse générée";
  } catch (error) {
    console.error('Error running inventory agent:', error);
    throw error;
  }
}
