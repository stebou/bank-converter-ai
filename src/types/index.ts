// Dans : src/types/index.ts

// Ce type représente un document tel qu'il est stocké dans la base de données via Prisma.
export type DocumentType = {
  id: string;
  userId: string;
  filename: string;
  status: string;
  createdAt: Date; // <-- Changé de 'date: string'

  originalName: string;
  fileSize: number;
  mimeType: string;

  bankDetected: string | null;
  aiConfidence: number | null; // <-- Changé de 'confidence: number'
  processingTime: number | null;
  aiCost: number | null;
  ocrConfidence: number | null;

  totalTransactions: number;
  anomaliesDetected: number; // <-- Changé de 'anomalies: number'
  
  // Nouveaux champs ajoutés
  extractedText: string | null;
  summary: string | null;
  lastAnalyzedAt: Date | null;
  
  // Champs optionnels retournés par l'API
  hasExtractedText?: boolean;
  extractedTextLength?: number;
};

// Types pour le système bancaire
export type BankAccountType = {
  id: string;
  userId: string;
  bridgeAccountId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  iban?: string | null;
  bankName: string;
  isActive: boolean;
  lastSyncAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BankTransactionType = {
  id: string;
  userId: string;
  accountId: string;
  bridgeTransactionId: string;
  amount: number;
  description: string;
  transactionDate: Date;
  category?: string | null;
  subcategory?: string | null;
  type: string;
  currency: string;
  aiConfidence?: number | null;
  isRecurring: boolean;
  tags?: any;
  createdAt: Date;
  account?: {
    name: string;
    bankName: string;
  };
};

export type FinancialAnalyticsType = {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: Record<string, { income: number; expenses: number }>;
  transactionCount: number;
};