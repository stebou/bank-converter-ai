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

// Types pour la gestion des stocks
export type Product = {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  price: number;
  category: string;
  lastUpdated: Date;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
};

export type StockMovement = {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  timestamp: Date;
  userId: string;
  reference?: string;
};

export type OdooProduct = {
  odooId: number;
  name: string;
  sku: string;
  currentStock: number;
  price: number;
  category: string;
  lastSynced: Date;
};

export type InventoryStats = {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  weeklyIncoming: number;
  weeklyOutgoing: number;
  turnoverRate: string;
};

export type OdooConfig = {
  url: string;
  database: string;
  username: string;
  password: string;
};

export type StockMode = 'internal' | 'odoo';