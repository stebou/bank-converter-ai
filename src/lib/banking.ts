import { prisma } from './prisma';

export interface BridgeAccountData {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  iban?: string;
  bank_name: string;
}

export interface BridgeTransactionData {
  id: string;
  account_id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  subcategory?: string;
  currency: string;
  type: 'debit' | 'credit';
}

export class BankingService {
  private bridgeApiUrl: string;
  private bridgeClientId: string;
  private bridgeClientSecret: string;

  constructor() {
    this.bridgeApiUrl =
      process.env.BRIDGE_API_URL || 'https://api.bridgeapi.io/v3';
    this.bridgeClientId = process.env.BRIDGE_CLIENT_ID!;
    this.bridgeClientSecret = process.env.BRIDGE_CLIENT_SECRET!;
  }

  private async getBridgeAccessToken(): Promise<string> {
    try {
      // Bridge API v3 utilise Basic Auth pour l'authentification
      const credentials = Buffer.from(
        `${this.bridgeClientId}:${this.bridgeClientSecret}`
      ).toString('base64');

      const response = await fetch(`${this.bridgeApiUrl}/auth/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          '[BANKING_SERVICE] Bridge API error response:',
          errorText
        );
        throw new Error(
          `Bridge auth failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('[BANKING_SERVICE] Auth error:', error);
      throw new Error('Failed to authenticate with Bridge API');
    }
  }

  async getUserBankAccounts(clerkUserId: string): Promise<any[]> {
    try {
      // Récupérer l'ID utilisateur interne depuis Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
      });

      if (!user) {
        console.log(
          `[BANKING_SERVICE] No user found for Clerk ID: ${clerkUserId}`
        );
        return [];
      }

      const accounts = await prisma.bankAccount.findMany({
        where: { userId: user.id, isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      console.log(
        `[BANKING_SERVICE] Found ${accounts.length} accounts for user ${user.id} (Clerk: ${clerkUserId})`
      );
      return accounts;
    } catch (error) {
      console.error('[BANKING_SERVICE] Get accounts error:', error);
      throw new Error('Failed to fetch bank accounts');
    }
  }

  async getUserBankTransactions(
    clerkUserId: string,
    accountId?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      // Récupérer l'ID utilisateur interne depuis Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
      });

      if (!user) {
        console.log(
          `[BANKING_SERVICE] No user found for Clerk ID: ${clerkUserId}`
        );
        return [];
      }

      const where: any = { userId: user.id };
      if (accountId) {
        where.accountId = accountId;
      }

      const transactions = await prisma.bankTransaction.findMany({
        where,
        include: {
          account: {
            select: {
              name: true,
              bankName: true,
            },
          },
        },
        orderBy: { transactionDate: 'desc' },
        take: limit,
      });

      console.log(
        `[BANKING_SERVICE] Found ${transactions.length} transactions for user ${user.id} (Clerk: ${clerkUserId})`
      );
      return transactions;
    } catch (error) {
      console.error('[BANKING_SERVICE] Get transactions error:', error);
      throw new Error('Failed to fetch bank transactions');
    }
  }

  async syncUserBankData(
    userId: string
  ): Promise<{ accounts: number; transactions: number }> {
    try {
      const accessToken = await this.getBridgeAccessToken();

      // Récupérer les comptes depuis Bridge API v3
      const accountsResponse = await fetch(`${this.bridgeApiUrl}/accounts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!accountsResponse.ok) {
        throw new Error(
          `Failed to fetch accounts: ${accountsResponse.statusText}`
        );
      }

      const accountsData = await accountsResponse.json();
      let syncedAccounts = 0;
      let syncedTransactions = 0;

      // Synchroniser chaque compte
      for (const bridgeAccount of accountsData.resources || []) {
        await this.syncBankAccount(userId, bridgeAccount);
        syncedAccounts++;

        // Synchroniser les transactions du compte
        const transactionCount = await this.syncAccountTransactions(
          userId,
          bridgeAccount.id,
          accessToken
        );
        syncedTransactions += transactionCount;
      }

      return { accounts: syncedAccounts, transactions: syncedTransactions };
    } catch (error) {
      console.error('[BANKING_SERVICE] Sync error:', error);
      throw new Error('Failed to sync bank data');
    }
  }

  private async syncBankAccount(
    userId: string,
    bridgeAccount: BridgeAccountData
  ): Promise<void> {
    try {
      await prisma.bankAccount.upsert({
        where: { bridgeAccountId: bridgeAccount.id },
        update: {
          name: bridgeAccount.name,
          balance: bridgeAccount.balance,
          currency: bridgeAccount.currency,
          type: bridgeAccount.type,
          iban: bridgeAccount.iban,
          bankName: bridgeAccount.bank_name,
          lastSyncAt: new Date(),
          updatedAt: new Date(),
        },
        create: {
          userId,
          bridgeAccountId: bridgeAccount.id,
          name: bridgeAccount.name,
          balance: bridgeAccount.balance,
          currency: bridgeAccount.currency,
          type: bridgeAccount.type,
          iban: bridgeAccount.iban,
          bankName: bridgeAccount.bank_name,
          lastSyncAt: new Date(),
        },
      });
    } catch (error) {
      console.error('[BANKING_SERVICE] Sync account error:', error);
      throw error;
    }
  }

  private async syncAccountTransactions(
    userId: string,
    bridgeAccountId: string,
    accessToken: string
  ): Promise<number> {
    try {
      // Récupérer l'ID du compte local
      const localAccount = await prisma.bankAccount.findUnique({
        where: { bridgeAccountId: bridgeAccountId },
      });

      if (!localAccount) {
        console.warn(
          `[BANKING_SERVICE] Local account not found for Bridge ID: ${bridgeAccountId}`
        );
        return 0;
      }

      const transactionsResponse = await fetch(
        `${this.bridgeApiUrl}/accounts/${bridgeAccountId}/transactions?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!transactionsResponse.ok) {
        throw new Error(
          `Failed to fetch transactions: ${transactionsResponse.statusText}`
        );
      }

      const transactionsData = await transactionsResponse.json();
      let syncedCount = 0;

      for (const bridgeTransaction of transactionsData.resources || []) {
        await this.syncBankTransaction(
          userId,
          localAccount.id,
          bridgeTransaction
        );
        syncedCount++;
      }

      return syncedCount;
    } catch (error) {
      console.error('[BANKING_SERVICE] Sync transactions error:', error);
      return 0;
    }
  }

  private async syncBankTransaction(
    userId: string,
    accountId: string,
    bridgeTransaction: BridgeTransactionData
  ): Promise<void> {
    try {
      await prisma.bankTransaction.upsert({
        where: { bridgeTransactionId: bridgeTransaction.id },
        update: {
          amount: bridgeTransaction.amount,
          description: bridgeTransaction.description,
          transactionDate: new Date(bridgeTransaction.date),
          category: bridgeTransaction.category,
          subcategory: bridgeTransaction.subcategory,
          type: bridgeTransaction.type,
          currency: bridgeTransaction.currency,
        },
        create: {
          userId,
          accountId,
          bridgeTransactionId: bridgeTransaction.id,
          amount: bridgeTransaction.amount,
          description: bridgeTransaction.description,
          transactionDate: new Date(bridgeTransaction.date),
          category: bridgeTransaction.category,
          subcategory: bridgeTransaction.subcategory,
          type: bridgeTransaction.type,
          currency: bridgeTransaction.currency,
        },
      });
    } catch (error) {
      console.error('[BANKING_SERVICE] Sync transaction error:', error);
      throw error;
    }
  }

  async getFinancialAnalytics(
    clerkUserId: string,
    timeframe: string = '30d'
  ): Promise<any> {
    try {
      // Récupérer l'ID utilisateur interne depuis Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
      });

      if (!user) {
        console.log(
          `[BANKING_SERVICE] No user found for Clerk ID: ${clerkUserId}`
        );
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netAmount: 0,
          categoryBreakdown: {},
          monthlyTrend: {},
          transactionCount: 0,
        };
      }

      const startDate = this.getStartDateFromTimeframe(timeframe);

      const transactions = await prisma.bankTransaction.findMany({
        where: {
          userId: user.id,
          transactionDate: {
            gte: startDate,
          },
        },
        include: {
          account: true,
        },
      });

      const totalIncome = transactions
        .filter(t => {
          // Revenus : soit type credit, soit montant positif (pour être sûr)
          return t.type === 'credit' || (t.type !== 'debit' && t.amount > 0);
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const totalExpenses = transactions
        .filter(t => {
          // Dépenses : soit type debit, soit montant négatif (pour être sûr)
          return t.type === 'debit' || (t.type !== 'credit' && t.amount < 0);
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const categoryBreakdown = this.calculateCategoryBreakdown(transactions);
      const monthlyTrend = this.calculateMonthlyTrend(transactions);

      return {
        totalIncome,
        totalExpenses,
        netAmount: totalIncome - totalExpenses,
        categoryBreakdown,
        monthlyTrend,
        transactionCount: transactions.length,
      };
    } catch (error) {
      console.error('[BANKING_SERVICE] Analytics error:', error);
      throw new Error('Failed to generate financial analytics');
    }
  }

  private getStartDateFromTimeframe(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private calculateCategoryBreakdown(
    transactions: any[]
  ): Record<string, number> {
    const breakdown: Record<string, number> = {};

    transactions.forEach(transaction => {
      const category = transaction.category || 'Autre';
      const amount = Math.abs(transaction.amount);
      breakdown[category] = (breakdown[category] || 0) + amount;
    });

    return breakdown;
  }

  private calculateMonthlyTrend(
    transactions: any[]
  ): Record<string, { income: number; expenses: number }> {
    const trend: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(transaction => {
      const monthKey = transaction.transactionDate.toISOString().slice(0, 7); // YYYY-MM

      if (!trend[monthKey]) {
        trend[monthKey] = { income: 0, expenses: 0 };
      }

      // Utiliser le montant et le type pour déterminer revenus vs dépenses
      if (transaction.type === 'credit' || transaction.amount > 0) {
        trend[monthKey].income += Math.abs(transaction.amount);
      } else if (transaction.type === 'debit' || transaction.amount < 0) {
        trend[monthKey].expenses += Math.abs(transaction.amount);
      }
    });

    return trend;
  }
}

export const bankingService = new BankingService();
