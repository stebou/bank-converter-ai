// Migration vers OpenAI Agents SDK officiel
// EXEMPLE de migration pour votre système bancaire

import { Agent, tool, run } from '@openai/agents';
import { z } from 'zod';

// 1. TOOLS avec SDK officiel - Remplacement de vos tools actuels
export const extractTransactionsTool = tool({
  name: 'extract_transactions',
  description: 'Extract and parse transactions from banking documents',
  parameters: z.object({
    documentText: z.string().describe('Raw text content of the banking document'),
    format: z.enum(['pdf', 'csv', 'json']).optional().default('pdf'),
  }),
  async execute({ documentText, format }) {
    // Votre logique d'extraction existante
    const transactions = [];
    const lines = documentText.split('\n');
    let transactionId = 1;

    for (const line of lines) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[.,]\d{2})/);
      if (match) {
        transactions.push({
          id: `txn_${transactionId++}`,
          date: match[1],
          description: match[2].trim(),
          amount: parseFloat(match[3].replace(',', '.')),
          type: match[3].startsWith('-') ? 'debit' : 'credit',
        });
      }
    }

    return JSON.stringify(transactions);
  },
});

export const detectAnomaliesTool = tool({
  name: 'detect_anomalies',
  description: 'Detect anomalies and suspicious patterns in transactions',
  parameters: z.object({
    transactions: z.array(z.any()),
    thresholds: z.object({
      unusualAmount: z.number().optional().default(5000),
      frequencyLimit: z.number().optional().default(10),
    }).optional(),
  }),
  async execute({ transactions, thresholds = {} }) {
    const anomalies = [];
    const { unusualAmount = 5000, frequencyLimit = 10 } = thresholds;

    // Votre logique de détection existante
    transactions.forEach((tx) => {
      if (Math.abs(tx.amount) > unusualAmount) {
        anomalies.push({
          transactionId: tx.id,
          anomalyType: 'unusual_amount',
          severity: Math.abs(tx.amount) > unusualAmount * 2 ? 'high' : 'medium',
          description: `Transaction amount ${tx.amount} exceeds normal threshold`,
          riskScore: Math.min((Math.abs(tx.amount) / unusualAmount) * 5, 10),
        });
      }
    });

    return JSON.stringify(anomalies);
  },
});

// 2. AGENTS avec SDK officiel - Remplacement de vos agents actuels
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
  `,
  tools: [extractTransactionsTool, detectAnomaliesTool],
});

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
  `,
  tools: [detectAnomaliesTool],
});

// 3. AGENT PRINCIPAL avec HANDOFFS - Nouvelle fonctionnalité
export const bankingTriageAgent = Agent.create({
  name: 'Banking Triage Agent',
  model: 'gpt-4o',
  instructions: `
    You are a banking triage agent that routes requests to specialists:
    - For document analysis and transaction extraction, delegate to Banking Analyst
    - For fraud detection and security concerns, delegate to Fraud Detection Specialist
    - For simple questions, answer directly
    
    Always explain your routing decisions.
  `,
  handoffs: [bankingAnalystAgent, fraudDetectionAgent],
});

// 4. FONCTION D'EXÉCUTION avec SDK officiel
export async function runBankingAnalysis(
  input: string,
  documentData?: any,
  agentType: 'triage' | 'analyst' | 'fraud' = 'triage'
) {
  try {
    let agent;
    switch (agentType) {
      case 'analyst':
        agent = bankingAnalystAgent;
        break;
      case 'fraud':
        agent = fraudDetectionAgent;
        break;
      default:
        agent = bankingTriageAgent;
    }

    const fullInput = documentData 
      ? `${input}\n\nDocument Data: ${JSON.stringify(documentData, null, 2)}`
      : input;

    const result = await run(agent, fullInput);
    
    return {
      success: true,
      result: result.finalOutput,
      agent: result.lastAgent?.name,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error running banking analysis:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// 5. CONTEXTE et GUARDRAILS - Nouvelles fonctionnalités
interface BankingContext {
  userId: string;
  accountType: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const secureBankingAgent = new Agent<BankingContext>({
  name: 'Secure Banking Analyst',
  model: 'gpt-4o',
  instructions: ({ context }) => `
    You are analyzing banking data for user ${context.userId}.
    Account type: ${context.accountType}
    Risk level: ${context.riskLevel}
    
    ${context.riskLevel === 'high' ? 'Apply extra security measures and validation.' : ''}
    Always protect sensitive financial information.
  `,
  tools: [extractTransactionsTool, detectAnomaliesTool],
  inputGuardrails: [
    {
      name: 'Sensitive Data Check',
      execute: async ({ input }) => {
        const containsSensitive = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(input);
        return {
          tripwireTriggered: containsSensitive,
          outputInfo: containsSensitive ? 'Credit card detected' : 'Clean input',
        };
      },
    },
  ],
});

// 6. STREAMING SUPPORT - Nouvelle fonctionnalité
export async function runBankingAnalysisWithStreaming(input: string) {
  const result = await run(bankingAnalystAgent, input, { stream: true });
  
  // Retourner le stream pour l'interface utilisateur
  return result.toTextStream({ compatibleWithNodeStreams: true });
}