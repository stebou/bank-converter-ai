// Tools bancaires migrés vers OpenAI Agents SDK officiel
import { tool } from '@openai/agents';
import { z } from 'zod';

// Schémas réutilisables pour éviter la duplication - Optimisé Zod
const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  description: z.string(),
  type: z.enum(['debit', 'credit']),
  category: z.string().nullable().optional(),
});

const AnomalySchema = z.object({
  transactionId: z.string(),
  anomalyType: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  description: z.string(),
  riskScore: z.number(),
});

const PeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
});

// Types pour les données bancaires
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
  balance?: number;
}

export interface BankingDocument {
  accountNumber: string;
  accountHolder: string;
  bank: string;
  period: {
    start: string;
    end: string;
  };
  transactions: Transaction[];
  openingBalance: number;
  closingBalance: number;
}

export interface AnomalyResult {
  transactionId: string;
  anomalyType: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  riskScore: number;
}

// Tool pour extraire les transactions - SDK officiel
export const extractTransactionsTool = tool({
  name: 'extract_transactions',
  description: 'Extract and parse transactions from banking documents',
  parameters: z.object({
    documentText: z.string().describe('Raw text content of the banking document'),
    format: z.enum(['pdf', 'csv', 'json']).default('pdf'),
  }),
  async execute({ documentText, format }) {
    console.log(`🔍 Extracting transactions from ${format} document...`);
    
    try {
      const transactions: Transaction[] = [];
      const lines = documentText.split('\n');
      let transactionId = 1;

      for (const line of lines) {
        // Pattern amélioré pour détecter les transactions
        const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[.,]\d{2})/);
        if (match) {
          const amount = parseFloat(match[3].replace(',', '.'));
          transactions.push({
            id: `txn_${transactionId++}`,
            date: match[1],
            description: match[2].trim(),
            amount: amount,
            type: amount < 0 ? 'debit' : 'credit',
          });
        }
      }

      console.log(`✅ Extracted ${transactions.length} transactions`);
      return JSON.stringify({
        success: true,
        transactionsCount: transactions.length,
        transactions: transactions,
        extractedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error extracting transactions:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        transactions: [],
      });
    }
  },
});

// Tool pour détecter les anomalies - SDK officiel
export const detectAnomaliesTool = tool({
  name: 'detect_anomalies',
  description: 'Detect anomalies and suspicious patterns in transactions',
  parameters: z.object({
    transactions: z.array(TransactionSchema.omit({ category: true })),
    thresholds: z.object({
      unusualAmount: z.number().default(5000),
      frequencyLimit: z.number().default(10),
      velocityThreshold: z.number().default(3),
    }).default({}),
  }),
  async execute({ transactions, thresholds = {} }) {
    console.log(`🔍 Analyzing ${transactions.length} transactions for anomalies...`);
    
    try {
      const anomalies: AnomalyResult[] = [];
      const {
        unusualAmount = 5000,
        frequencyLimit = 10,
        velocityThreshold = 3,
      } = thresholds;

      // Détection de montants inhabituels
      transactions.forEach((tx) => {
        if (Math.abs(tx.amount) > unusualAmount) {
          anomalies.push({
            transactionId: tx.id,
            anomalyType: 'unusual_amount',
            severity: Math.abs(tx.amount) > unusualAmount * 2 ? 'high' : 'medium',
            description: `Transaction amount ${tx.amount}€ exceeds normal threshold (${unusualAmount}€)`,
            riskScore: Math.min((Math.abs(tx.amount) / unusualAmount) * 5, 10),
          });
        }
      });

      // Détection de fréquence élevée
      const dateGroups = transactions.reduce((acc: Record<string, number>, tx) => {
        const date = tx.date.split(' ')[0]; // Extraire juste la date
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      Object.entries(dateGroups).forEach(([date, count]) => {
        if (count > frequencyLimit) {
          anomalies.push({
            transactionId: `date_${date}`,
            anomalyType: 'high_frequency',
            severity: count > frequencyLimit * 2 ? 'high' : 'medium',
            description: `${count} transactions on ${date} exceeds frequency limit (${frequencyLimit})`,
            riskScore: Math.min((count / frequencyLimit) * 3, 10),
          });
        }
      });

      // Détection de patterns suspects dans les descriptions
      const suspiciousPatterns = [
        /cash\s*withdraw/i,
        /atm.*withdrawal/i,
        /suspicious/i,
        /unknown/i,
      ];

      transactions.forEach((tx) => {
        suspiciousPatterns.forEach((pattern, index) => {
          if (pattern.test(tx.description)) {
            anomalies.push({
              transactionId: tx.id,
              anomalyType: 'suspicious_description',
              severity: 'medium',
              description: `Suspicious pattern detected in description: "${tx.description}"`,
              riskScore: 4 + index,
            });
          }
        });
      });

      console.log(`🚨 Found ${anomalies.length} anomalies`);
      return JSON.stringify({
        success: true,
        anomaliesCount: anomalies.length,
        anomalies: anomalies,
        analyzedAt: new Date().toISOString(),
        summary: {
          highRisk: anomalies.filter(a => a.severity === 'high').length,
          mediumRisk: anomalies.filter(a => a.severity === 'medium').length,
          lowRisk: anomalies.filter(a => a.severity === 'low').length,
        },
      });
    } catch (error) {
      console.error('❌ Error detecting anomalies:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        anomalies: [],
      });
    }
  },
});

// Tool pour calculer les balances - SDK officiel
export const calculateBalanceTool = tool({
  name: 'calculate_balance',
  description: 'Calculate running balances and financial metrics',
  parameters: z.object({
    transactions: z.array(TransactionSchema.pick({ id: true, date: true, amount: true, type: true })),
    openingBalance: z.number().describe('Starting balance for the period'),
  }),
  async execute({ transactions, openingBalance }) {
    console.log(`💰 Calculating balances for ${transactions.length} transactions...`);
    
    try {
      let runningBalance = openingBalance;
      
      // Trier les transactions par date
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const processedTransactions = sortedTransactions.map((tx) => {
        runningBalance += tx.amount;
        return {
          ...tx,
          balance: runningBalance,
        };
      });

      const totalCredits = transactions
        .filter(tx => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalDebits = transactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      const netFlow = totalCredits - totalDebits;
      const avgTransactionAmount = transactions.length > 0 
        ? (totalCredits + totalDebits) / transactions.length 
        : 0;

      console.log(`✅ Balance calculated: ${runningBalance}€ (Net flow: ${netFlow}€)`);
      
      return JSON.stringify({
        success: true,
        transactions: processedTransactions,
        openingBalance,
        closingBalance: runningBalance,
        totalCredits,
        totalDebits,
        netFlow,
        avgTransactionAmount,
        calculatedAt: new Date().toISOString(),
        summary: {
          transactionCount: transactions.length,
          positiveFlow: netFlow > 0,
          balanceChange: runningBalance - openingBalance,
        },
      });
    } catch (error) {
      console.error('❌ Error calculating balance:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        openingBalance,
        closingBalance: openingBalance,
      });
    }
  },
});

// Tool pour catégoriser les transactions - SDK officiel
export const categorizeTransactionsTool = tool({
  name: 'categorize_transactions',
  description: 'Automatically categorize transactions by type and purpose',
  parameters: z.object({
    transactions: z.array(TransactionSchema.pick({ id: true, description: true, amount: true, type: true })),
    customCategories: z.array(z.object({
      name: z.string(),
      keywords: z.array(z.string()),
    })).default([]),
  }),
  async execute({ transactions, customCategories = [] }) {
    console.log(`🏷️ Categorizing ${transactions.length} transactions...`);
    
    try {
      // Catégories par défaut étendues
      const defaultCategories = {
        salary: ['salaire', 'salary', 'paie', 'virement employeur', 'wages', 'payroll'],
        grocery: ['leclerc', 'carrefour', 'auchan', 'monoprix', 'super', 'casino', 'franprix'],
        gas: ['shell', 'total', 'bp', 'esso', 'carburant', 'essence', 'station'],
        utilities: ['edf', 'engie', 'orange', 'sfr', 'free', 'bouygues', 'electricité', 'gaz'],
        banking: ['frais', 'commission', 'agios', 'cotisation', 'prelevement bancaire'],
        transfer: ['virement', 'transfer', 'prelevement', 'versement'],
        restaurant: ['restaurant', 'mcdo', 'kfc', 'burger', 'pizza', 'deliveroo', 'uber eats'],
        transport: ['sncf', 'ratp', 'metro', 'bus', 'taxi', 'uber', 'transport'],
        shopping: ['amazon', 'fnac', 'zara', 'h&m', 'shopping', 'achat'],
        health: ['pharmacie', 'medecin', 'hopital', 'dentiste', 'mutuelle', 'secu'],
        entertainment: ['cinema', 'spotify', 'netflix', 'theatre', 'concert'],
        rent: ['loyer', 'rent', 'immobilier', 'agence'],
      };

      // Fusionner avec les catégories personnalisées
      const allCategories = { ...defaultCategories };
      customCategories.forEach(custom => {
        allCategories[custom.name.toLowerCase()] = custom.keywords;
      });

      const categorizedTransactions = transactions.map((tx) => {
        const description = tx.description.toLowerCase();
        let category = 'other';
        let confidence = 0;

        // Rechercher la meilleure correspondance
        for (const [cat, keywords] of Object.entries(allCategories)) {
          const matches = keywords.filter(keyword => 
            description.includes(keyword.toLowerCase())
          );
          
          if (matches.length > 0) {
            const currentConfidence = matches.length / keywords.length;
            if (currentConfidence > confidence) {
              category = cat;
              confidence = currentConfidence;
            }
          }
        }

        return {
          ...tx,
          category,
          confidence: Math.round(confidence * 100),
        };
      });

      // Statistiques par catégorie
      const categoryStats = Object.keys(allCategories).reduce((stats, cat) => {
        const categoryTx = categorizedTransactions.filter(tx => tx.category === cat);
        stats[cat] = {
          count: categoryTx.length,
          totalAmount: categoryTx.reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
          avgAmount: categoryTx.length > 0 
            ? categoryTx.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) / categoryTx.length 
            : 0,
        };
        return stats;
      }, {} as Record<string, any>);

      console.log(`✅ Categorized transactions into ${Object.keys(categoryStats).length} categories`);
      
      return JSON.stringify({
        success: true,
        transactions: categorizedTransactions,
        categoryStats,
        categorizedAt: new Date().toISOString(),
        summary: {
          totalCategories: Object.keys(allCategories).length,
          categorizedCount: categorizedTransactions.filter(tx => tx.category !== 'other').length,
          uncategorizedCount: categorizedTransactions.filter(tx => tx.category === 'other').length,
        },
      });
    } catch (error) {
      console.error('❌ Error categorizing transactions:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        transactions: [],
      });
    }
  },
});

// Tool pour générer des rapports - SDK officiel
export const generateBankingReportTool = tool({
  name: 'generate_banking_report',
  description: 'Generate comprehensive banking analysis report',
  parameters: z.object({
    transactions: z.array(TransactionSchema),
    anomalies: z.array(AnomalySchema).default([]),
    period: PeriodSchema,
    reportType: z.enum(['summary', 'detailed', 'fraud-focus']).default('summary'),
    includeCharts: z.boolean().default(false),
  }),
  async execute({ transactions, anomalies = [], period, reportType, includeCharts = false }) {
    console.log(`📊 Generating ${reportType} banking report...`);
    
    try {
      const totalTransactions = transactions.length;
      const totalCredits = transactions
        .filter((tx: any) => tx.amount > 0)
        .reduce((sum: number, tx: any) => sum + tx.amount, 0);
      
      const totalDebits = transactions
        .filter((tx: any) => tx.amount < 0)
        .reduce((sum: number, tx: any) => sum + Math.abs(tx.amount), 0);
      
      const netFlow = totalCredits - totalDebits;
      const avgTransactionAmount = totalTransactions > 0 
        ? (totalCredits + totalDebits) / totalTransactions 
        : 0;

      // Analyse par catégorie si disponible
      const categoryAnalysis = transactions.reduce((acc: Record<string, any>, tx: any) => {
        const category = tx.category || 'other';
        if (!acc[category]) {
          acc[category] = { count: 0, amount: 0 };
        }
        acc[category].count++;
        acc[category].amount += Math.abs(tx.amount);
        return acc;
      }, {});

      // Insights générés automatiquement
      const insights = [
        netFlow > 0 ? '✅ Positive cash flow period' : '⚠️ Negative cash flow period',
        anomalies.length > 0 
          ? `🚨 ${anomalies.length} anomalies detected requiring attention`
          : '✅ No anomalies detected',
        `📊 Average transaction: ${avgTransactionAmount.toFixed(2)}€`,
        totalCredits > totalDebits * 1.5 
          ? '💰 Strong income period'
          : totalDebits > totalCredits * 1.5 
            ? '💸 High expense period'
            : '⚖️ Balanced spending pattern',
      ];

      // Recommandations basées sur l'analyse
      const recommendations = [];
      if (netFlow < 0) {
        recommendations.push('Consider reviewing expenses to improve cash flow');
      }
      if (anomalies.filter((a: any) => a.severity === 'high').length > 0) {
        recommendations.push('High-risk anomalies require immediate investigation');
      }
      if (Object.keys(categoryAnalysis).length > 10) {
        recommendations.push('Consider consolidating transaction categories for better tracking');
      }

      const report = {
        reportMetadata: {
          type: reportType,
          period,
          generatedAt: new Date().toISOString(),
          includeCharts,
        },
        summary: {
          totalTransactions,
          totalCredits,
          totalDebits,
          netFlow,
          avgTransactionAmount,
          anomaliesCount: anomalies.length,
          riskLevel: anomalies.filter((a: any) => a.severity === 'high').length > 0 ? 'high' 
                   : anomalies.filter((a: any) => a.severity === 'medium').length > 0 ? 'medium' 
                   : 'low',
        },
        categoryAnalysis,
        anomalies: reportType === 'fraud-focus' ? anomalies : anomalies.slice(0, 5),
        insights,
        recommendations,
      };

      // Ajouter des détails supplémentaires selon le type de rapport
      if (reportType === 'detailed') {
        report.summary = {
          ...report.summary,
          dailyBreakdown: transactions.reduce((acc: Record<string, any>, tx: any) => {
            const date = tx.date.split(' ')[0];
            if (!acc[date]) acc[date] = { credits: 0, debits: 0, count: 0 };
            if (tx.amount > 0) acc[date].credits += tx.amount;
            else acc[date].debits += Math.abs(tx.amount);
            acc[date].count++;
            return acc;
          }, {}),
        };
      }

      console.log(`✅ Generated ${reportType} report with ${insights.length} insights`);
      
      return JSON.stringify(report);
    } catch (error) {
      console.error('❌ Error generating report:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        reportType,
        generatedAt: new Date().toISOString(),
      });
    }
  },
});