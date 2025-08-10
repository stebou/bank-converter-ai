// Types pour les outils bancaires
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

// Tool pour extraire les transactions
export const extractTransactionsTool = {
  type: "function" as const,
  function: {
    name: "extract_transactions",
    description: "Extract and parse transactions from banking documents",
    parameters: {
      type: "object",
      properties: {
        documentText: {
          type: "string",
          description: "Raw text content of the banking document"
        },
        format: {
          type: "string",
          enum: ["pdf", "csv", "json"],
          description: "Format of the source document"
        }
      },
      required: ["documentText"]
    }
  }
};

// Tool pour détecter les anomalies
export const detectAnomaliesTool = {
  type: "function" as const,
  function: {
    name: "detect_anomalies",
    description: "Detect anomalies and suspicious patterns in transactions",
    parameters: {
      type: "object",
      properties: {
        transactions: {
          type: "array",
          description: "Array of transactions to analyze"
        },
        thresholds: {
          type: "object",
          properties: {
            unusualAmount: { type: "number" },
            frequencyLimit: { type: "number" },
            velocityThreshold: { type: "number" }
          }
        }
      },
      required: ["transactions"]
    }
  }
};

// Tool pour calculer les balances
export const calculateBalanceTool = {
  type: "function" as const,
  function: {
    name: "calculate_balance",
    description: "Calculate running balances and financial metrics",
    parameters: {
      type: "object",
      properties: {
        transactions: {
          type: "array",
          description: "Array of transactions"
        },
        openingBalance: {
          type: "number",
          description: "Starting balance"
        }
      },
      required: ["transactions", "openingBalance"]
    }
  }
};

// Tool pour catégoriser les transactions
export const categorizeTransactionsTool = {
  type: "function" as const,
  function: {
    name: "categorize_transactions",
    description: "Automatically categorize transactions by type and purpose",
    parameters: {
      type: "object",
      properties: {
        transactions: {
          type: "array",
          description: "Array of transactions to categorize"
        },
        customCategories: {
          type: "array",
          description: "Optional custom category definitions"
        }
      },
      required: ["transactions"]
    }
  }
};

// Tool pour générer des rapports
export const generateBankingReportTool = {
  type: "function" as const,
  function: {
    name: "generate_banking_report",
    description: "Generate comprehensive banking analysis report",
    parameters: {
      type: "object",
      properties: {
        transactions: {
          type: "array",
          description: "Processed transactions"
        },
        anomalies: {
          type: "array",
          description: "Detected anomalies"
        },
        period: {
          type: "object",
          properties: {
            start: { type: "string" },
            end: { type: "string" }
          }
        },
        reportType: {
          type: "string",
          enum: ["summary", "detailed", "fraud-focus"],
          description: "Type of report to generate"
        }
      },
      required: ["transactions", "period"]
    }
  }
};

// Implémentations des fonctions outils
export const toolImplementations = {
  extract_transactions: async (params: any): Promise<Transaction[]> => {
    const { documentText, format = "pdf" } = params;
    
    // Logique d'extraction selon le format
    // Pour l'instant, simulation simple
    const transactions: Transaction[] = [];
    
    // Parse simple pour demo - à remplacer par vraie logique d'extraction
    const lines = documentText.split('\n');
    let transactionId = 1;
    
    for (const line of lines) {
      // Pattern simple pour détecter les transactions
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[.,]\d{2})/);
      if (match) {
        transactions.push({
          id: `txn_${transactionId++}`,
          date: match[1],
          description: match[2].trim(),
          amount: parseFloat(match[3].replace(',', '.')),
          type: match[3].startsWith('-') ? 'debit' : 'credit'
        });
      }
    }
    
    return transactions;
  },

  detect_anomalies: async (params: any): Promise<AnomalyResult[]> => {
    const { transactions, thresholds = {} } = params;
    const anomalies: AnomalyResult[] = [];
    
    const {
      unusualAmount = 5000,
      frequencyLimit = 10,
      velocityThreshold = 3
    } = thresholds;
    
    // Détection de montants inhabituels
    transactions.forEach((tx: Transaction) => {
      if (Math.abs(tx.amount) > unusualAmount) {
        anomalies.push({
          transactionId: tx.id,
          anomalyType: 'unusual_amount',
          severity: Math.abs(tx.amount) > unusualAmount * 2 ? 'high' : 'medium',
          description: `Transaction amount ${tx.amount} exceeds normal threshold`,
          riskScore: Math.min((Math.abs(tx.amount) / unusualAmount) * 5, 10)
        });
      }
    });
    
    // Détection de fréquence élevée
    const dateGroups = transactions.reduce((acc: any, tx: Transaction) => {
      const date = tx.date.split(' ')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(dateGroups).forEach(([date, count]) => {
      if ((count as number) > frequencyLimit) {
        anomalies.push({
          transactionId: `date_${date}`,
          anomalyType: 'high_frequency',
          severity: 'medium',
          description: `${count} transactions on ${date} exceeds frequency limit`,
          riskScore: Math.min((count as number) / frequencyLimit * 3, 10)
        });
      }
    });
    
    return anomalies;
  },

  calculate_balance: async (params: any) => {
    const { transactions, openingBalance } = params;
    let runningBalance = openingBalance;
    
    const processedTransactions = transactions.map((tx: Transaction) => {
      runningBalance += tx.amount;
      return {
        ...tx,
        balance: runningBalance
      };
    });
    
    return {
      transactions: processedTransactions,
      openingBalance,
      closingBalance: runningBalance,
      totalCredits: transactions.filter((tx: Transaction) => tx.amount > 0)
        .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0),
      totalDebits: transactions.filter((tx: Transaction) => tx.amount < 0)
        .reduce((sum: number, tx: Transaction) => sum + Math.abs(tx.amount), 0)
    };
  },

  categorize_transactions: async (params: any) => {
    const { transactions, customCategories = [] } = params;
    
    const defaultCategories = {
      'salary': ['salaire', 'salary', 'paie', 'virement employeur'],
      'grocery': ['leclerc', 'carrefour', 'auchan', 'monoprix', 'super'],
      'gas': ['shell', 'total', 'bp', 'esso', 'carburant'],
      'utilities': ['edf', 'engie', 'orange', 'sfr', 'free'],
      'banking': ['frais', 'commission', 'agios', 'cotisation'],
      'transfer': ['virement', 'transfer', 'prelevement']
    };
    
    const categorizedTransactions = transactions.map((tx: Transaction) => {
      const description = tx.description.toLowerCase();
      let category = 'other';
      
      for (const [cat, keywords] of Object.entries(defaultCategories)) {
        if (keywords.some(keyword => description.includes(keyword))) {
          category = cat;
          break;
        }
      }
      
      return {
        ...tx,
        category
      };
    });
    
    return categorizedTransactions;
  },

  generate_banking_report: async (params: any) => {
    const { transactions, anomalies = [], period, reportType = "summary" } = params;
    
    const totalTransactions = transactions.length;
    const totalCredits = transactions.filter((tx: Transaction) => tx.amount > 0)
      .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);
    const totalDebits = transactions.filter((tx: Transaction) => tx.amount < 0)
      .reduce((sum: number, tx: Transaction) => sum + Math.abs(tx.amount), 0);
    const netFlow = totalCredits - totalDebits;
    
    const report = {
      summary: {
        period: period,
        totalTransactions,
        totalCredits,
        totalDebits,
        netFlow,
        anomaliesCount: anomalies.length
      },
      anomalies: anomalies,
      insights: [
        totalCredits > totalDebits ? "Positive cash flow period" : "Negative cash flow period",
        anomalies.length > 0 ? `${anomalies.length} anomalies detected requiring attention` : "No anomalies detected",
        `Average transaction amount: ${(totalCredits + totalDebits) / totalTransactions}`
      ]
    };
    
    if (reportType === "detailed") {
      report.insights.push("Detailed transaction breakdown available");
    }
    
    return report;
  }
};
