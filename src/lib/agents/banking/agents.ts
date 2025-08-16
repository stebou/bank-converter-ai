// Agents bancaires migrés vers OpenAI Agents SDK officiel
import { Agent, run } from '@openai/agents';
import {
  calculateBalanceTool,
  categorizeTransactionsTool,
  detectAnomaliesTool,
  extractTransactionsTool,
  generateBankingReportTool,
} from './tools';

// Agent principal pour l'analyse bancaire - SDK officiel
export const bankingAnalystAgent = new Agent({
  name: 'Banking Document Analyst',
  model: 'gpt-4o',
  instructions: `
    You are an expert banking document analyst specialized in:
    - Extracting and analyzing transactions from bank statements
    - Detecting anomalies and potential fraud
    - Calculating balances and financial metrics
    - Categorizing expenses and income
    - Generating comprehensive financial reports
    
    Always provide accurate, detailed analysis with clear explanations.
    Format monetary values properly and highlight important findings.
    Use the available tools to process banking documents and provide structured analysis.
  `,
  tools: [
    extractTransactionsTool,
    detectAnomaliesTool,
    calculateBalanceTool,
    categorizeTransactionsTool,
    generateBankingReportTool,
  ],
});

// Agent spécialisé pour la détection de fraude - SDK officiel
export const fraudDetectionAgent = new Agent({
  name: 'Fraud Detection Specialist',
  model: 'gpt-4o',
  instructions: `
    You are a fraud detection specialist focused on:
    - Identifying suspicious transaction patterns
    - Detecting unusual account activity
    - Flagging potential security risks
    - Analyzing transaction velocity and amounts
    
    Be thorough but avoid false positives. Provide risk scores and explanations.
    Use the anomaly detection tools to analyze transaction data and provide detailed risk assessments.
  `,
  tools: [detectAnomaliesTool, calculateBalanceTool],
});

// Agent pour l'analyse de cash flow - SDK officiel
export const cashFlowAnalystAgent = new Agent({
  name: 'Cash Flow Analyst',
  model: 'gpt-4o',
  instructions: `
    You analyze cash flow patterns and trends:
    - Monthly/quarterly cash flow analysis
    - Income vs expenses tracking
    - Seasonal patterns identification
    - Cash flow forecasting
    
    Provide actionable insights and recommendations based on financial data analysis.
    Use categorization and balance calculation tools to provide comprehensive cash flow insights.
  `,
  tools: [
    calculateBalanceTool,
    categorizeTransactionsTool,
    generateBankingReportTool,
  ],
});

// Agent de triage avec handoffs - Nouvelle fonctionnalité SDK
export const bankingTriageAgent = new Agent({
  name: 'Banking Triage Agent',
  model: 'gpt-4o',
  instructions: `
    You are a banking triage agent that routes requests to specialists:
    - For comprehensive document analysis and transaction extraction, delegate to Banking Document Analyst
    - For fraud detection and security concerns, delegate to Fraud Detection Specialist
    - For cash flow analysis and financial insights, delegate to Cash Flow Analyst
    - For simple questions about banking, answer directly
    
    Always explain your routing decisions and provide context for handoffs.
  `,
  handoffs: [bankingAnalystAgent, fraudDetectionAgent, cashFlowAnalystAgent],
});

// Fonction d'exécution avec SDK officiel - Nouvelle interface
export async function runBankingAgent(
  agentType: 'triage' | 'analyst' | 'fraud' | 'cashflow' = 'triage',
  input: string,
  documentData?: any
) {
  console.log(`🏦 Starting banking analysis with ${agentType} agent...`);
  
  try {
    let agent: Agent;
    switch (agentType) {
      case 'analyst':
        agent = bankingAnalystAgent;
        break;
      case 'fraud':
        agent = fraudDetectionAgent;
        break;
      case 'cashflow':
        agent = cashFlowAnalystAgent;
        break;
      default:
        agent = bankingTriageAgent;
    }

    const fullInput = documentData 
      ? `${input}\n\nDocument Data: ${JSON.stringify(documentData, null, 2)}`
      : input;

    console.log(`🔄 Running agent: ${agent.name}`);
    const result = await run(agent, fullInput);
    
    console.log(`✅ Banking analysis completed by: ${agent.name}`);
    
    return {
      success: true,
      result: result.finalOutput,
      agent: agent.name,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('❌ Error running banking agent:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error',
      agentType,
      timestamp: new Date().toISOString(),
    };
  }
}

// Fonction avec streaming pour l'interface utilisateur
export async function runBankingAgentWithStreaming(
  agentType: 'triage' | 'analyst' | 'fraud' | 'cashflow' = 'triage',
  input: string,
  documentData?: any
) {
  console.log(`🌊 Starting streaming banking analysis with ${agentType} agent...`);
  
  try {
    let agent: Agent;
    switch (agentType) {
      case 'analyst':
        agent = bankingAnalystAgent;
        break;
      case 'fraud':
        agent = fraudDetectionAgent;
        break;
      case 'cashflow':
        agent = cashFlowAnalystAgent;
        break;
      default:
        agent = bankingTriageAgent;
    }

    const fullInput = documentData 
      ? `${input}\n\nDocument Data: ${JSON.stringify(documentData, null, 2)}`
      : input;

    const result = await run(agent, fullInput);
    
    // Pour le moment, retourner le résultat final en tant que string
    // Le streaming nécessite une configuration différente avec le SDK
    return result.finalOutput;
  } catch (error: any) {
    console.error('❌ Error in streaming banking analysis:', error);
    throw new Error(error?.message || 'Unknown streaming error');
  }
}

// Interface pour le contexte de sécurité bancaire
export interface BankingContext {
  userId: string;
  accountType: string;
  riskLevel: 'low' | 'medium' | 'high';
  complianceLevel: 'basic' | 'enhanced' | 'strict';
}

// Agent sécurisé avec guardrails
export const secureBankingAgent = new Agent<BankingContext>({
  name: 'Secure Banking Analyst',
  model: 'gpt-4o',
  instructions: ({ context }) => `
    You are analyzing banking data for user ${context.userId}.
    Account type: ${context.accountType}
    Risk level: ${context.riskLevel}
    Compliance level: ${context.complianceLevel}
    
    ${context.riskLevel === 'high' ? 'Apply extra security measures and detailed validation.' : ''}
    ${context.complianceLevel === 'strict' ? 'Follow strict compliance protocols and detailed reporting.' : ''}
    
    Always protect sensitive financial information and follow data privacy regulations.
    Provide detailed explanations for all risk assessments and recommendations.
  `,
  tools: [extractTransactionsTool, detectAnomaliesTool, calculateBalanceTool],
  inputGuardrails: [
    {
      name: 'Credit Card Detection',
      execute: async ({ input }) => {
        // Convertir l'input en string pour l'analyse
        const inputText = typeof input === 'string' ? input : JSON.stringify(input);
        const containsCreditCard = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(inputText);
        return {
          tripwireTriggered: containsCreditCard,
          outputInfo: containsCreditCard ? 'Credit card number detected in input' : 'No sensitive card data detected',
        };
      },
    },
    {
      name: 'SSN Detection',
      execute: async ({ input }) => {
        // Convertir l'input en string pour l'analyse
        const inputText = typeof input === 'string' ? input : JSON.stringify(input);
        const containsSSN = /\b\d{3}-\d{2}-\d{4}\b/.test(inputText);
        return {
          tripwireTriggered: containsSSN,
          outputInfo: containsSSN ? 'Social Security Number detected in input' : 'No SSN detected',
        };
      },
    },
    {
      name: 'Account Number Detection',
      execute: async ({ input }) => {
        // Convertir l'input en string pour l'analyse
        const inputText = typeof input === 'string' ? input : JSON.stringify(input);
        const containsAccount = /\b(?:account|compte)\s*(?:number|numero|n°)?\s*:?\s*\d{8,}\b/i.test(inputText);
        return {
          tripwireTriggered: containsAccount,
          outputInfo: containsAccount ? 'Bank account number detected in input' : 'No account numbers detected',
        };
      },
    },
  ],
});
