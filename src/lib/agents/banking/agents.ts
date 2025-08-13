import OpenAI from 'openai';
import {
  calculateBalanceTool,
  categorizeTransactionsTool,
  detectAnomaliesTool,
  extractTransactionsTool,
  generateBankingReportTool
} from './tools';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Agent principal pour l'analyse bancaire
export const bankingAnalystAgent = {
  name: "Banking Document Analyst",
  model: "gpt-4-turbo-preview",
  instructions: `
    You are an expert banking document analyst specialized in:
    - Extracting and analyzing transactions from bank statements
    - Detecting anomalies and potential fraud
    - Calculating balances and financial metrics
    - Categorizing expenses and income
    - Generating comprehensive financial reports
    
    Always provide accurate, detailed analysis with clear explanations.
    Format monetary values properly and highlight important findings.
  `,
  tools: [
    extractTransactionsTool,
    detectAnomaliesTool,
    calculateBalanceTool,
    categorizeTransactionsTool,
    generateBankingReportTool
  ]
};

// Agent spécialisé pour la détection de fraude
export const fraudDetectionAgent = {
  name: "Fraud Detection Specialist",
  model: "gpt-4-turbo-preview",
  instructions: `
    You are a fraud detection specialist focused on:
    - Identifying suspicious transaction patterns
    - Detecting unusual account activity
    - Flagging potential security risks
    - Analyzing transaction velocity and amounts
    
    Be thorough but avoid false positives. Provide risk scores and explanations.
  `,
  tools: [
    detectAnomaliesTool,
    calculateBalanceTool
  ]
};

// Agent pour l'analyse de cash flow
export const cashFlowAnalystAgent = {
  name: "Cash Flow Analyst",
  model: "gpt-4-turbo-preview",
  instructions: `
    You analyze cash flow patterns and trends:
    - Monthly/quarterly cash flow analysis
    - Income vs expenses tracking
    - Seasonal patterns identification
    - Cash flow forecasting
    
    Provide actionable insights and recommendations.
  `,
  tools: [
    calculateBalanceTool,
    categorizeTransactionsTool,
    generateBankingReportTool
  ]
};

// Fonction helper pour exécuter un agent bancaire - VERSION SIMPLIFIÉE
export async function runBankingAgent(
  agentConfig: typeof bankingAnalystAgent,
  input: string,
  documentData?: any
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
          content: documentData 
            ? `${input}\n\nDocument Data: ${JSON.stringify(documentData, null, 2)}`
            : input
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return completion.choices[0].message.content || "Aucune réponse générée";
  } catch (error) {
    console.error('Error running banking agent:', error);
    throw error;
  }
}

