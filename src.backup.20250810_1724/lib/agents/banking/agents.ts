import OpenAI from 'openai';
import { 
  extractTransactionsTool,
  detectAnomaliesTool,
  calculateBalanceTool,
  categorizeTransactionsTool,
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

// Fonction helper pour exécuter un agent bancaire
export async function runBankingAgent(
  agentConfig: typeof bankingAnalystAgent,
  input: string,
  documentData?: any
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
      content: documentData 
        ? `${input}\n\nDocument Data: ${JSON.stringify(documentData, null, 2)}`
        : input
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });

    return await waitForCompletion(thread.id, run.id);
  } catch (error) {
    console.error('Error running banking agent:', error);
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
