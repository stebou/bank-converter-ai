/**
 * Bridge API Integration - Configuration et types
 */

// Types Bridge API
export interface BridgeAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  iban?: string;
  swift?: string;
  status: 'active' | 'inactive' | 'closed';
  updated_at: string;
}

export interface BridgeTransaction {
  id: string;
  account_id: string;
  amount: number;
  currency: string;
  description: string;
  category: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'debit' | 'credit';
  raw_description: string;
  balance: number;
}

export interface BridgeItem {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  bank_id: string;
  created_at: string;
  updated_at: string;
}

export interface BridgeConnectSession {
  id: string;
  url: string;
  expires_at: string;
  status: 'pending' | 'success' | 'error';
  created_at: string;
}

// Configuration Bridge API
export const BRIDGE_CONFIG = {
  API_URL: 'https://api.bridgeapi.io',
  API_VERSION: 'v3',
  CLIENT_ID: process.env.BRIDGE_CLIENT_ID,
  CLIENT_SECRET: process.env.BRIDGE_CLIENT_SECRET,
  ENVIRONMENT: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  API_VERSION_DATE: '2025-01-15',
};

/**
 * Client Bridge API
 */
export class BridgeAPIClient {
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseURL = `${BRIDGE_CONFIG.API_URL}/${BRIDGE_CONFIG.API_VERSION}`;
    this.clientId = BRIDGE_CONFIG.CLIENT_ID || '';
    this.clientSecret = BRIDGE_CONFIG.CLIENT_SECRET || '';
  }

  /**
   * Verify credentials are available - Bridge API 2025 uses direct header auth
   */
  private ensureCredentials(): void {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Bridge API credentials not configured. Set BRIDGE_CLIENT_ID and BRIDGE_CLIENT_SECRET environment variables.');
    }
  }

  /**
   * Requête vers l'API Bridge v3 - 2025 auth avec headers directs
   */
  private async apiRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    this.ensureCredentials();

    console.log(`[BRIDGE_API] Making request to: ${this.baseURL}${endpoint}`);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Client-Id': this.clientId,
        'Client-Secret': this.clientSecret,
        'Bridge-Version': BRIDGE_CONFIG.API_VERSION_DATE,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`[BRIDGE_API] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[BRIDGE_API] Error response: ${errorText}`);
      throw new Error(`Bridge API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Créer une session Connect pour lier un compte bancaire - API v3
   */
  async createConnectSession(
    userId: string,
    redirectUri: string,
    providerId?: number
  ): Promise<BridgeConnectSession> {
    const payload: any = {
      redirect_url: redirectUri,
      account_types: 'all',
    };

    if (providerId) {
      payload.provider_id = providerId;
    }

    if (userId) {
      payload.user_email = userId; // v3 uses email instead of uuid
    }

    return this.apiRequest('/aggregation/connect-sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Récupérer les comptes bancaires d'un utilisateur - API v3
   */
  async getAccounts(userId: string): Promise<BridgeAccount[]> {
    const data = await this.apiRequest(`/aggregation/accounts?user_uuid=${userId}`);
    return data.resources || [];
  }

  /**
   * Récupérer les providers (banques) disponibles - API v3
   */
  async getProviders(): Promise<any[]> {
    const data = await this.apiRequest('/aggregation/providers');
    return data.resources || [];
  }

  /**
   * Récupérer les transactions d'un compte - API v3
   */
  async getTransactions(
    accountId: string,
    limit = 50,
    since?: string
  ): Promise<BridgeTransaction[]> {
    let url = `/aggregation/transactions?account_id=${accountId}&limit=${limit}`;
    if (since) {
      url += `&since=${since}`;
    }
    const data = await this.apiRequest(url);
    return data.resources || [];
  }

  /**
   * Récupérer toutes les transactions pour plusieurs comptes
   */
  async getAllTransactions(
    accountIds: string[],
    limit = 200,
    since?: string
  ): Promise<BridgeTransaction[]> {
    const allTransactions: BridgeTransaction[] = [];
    
    for (const accountId of accountIds) {
      try {
        const transactions = await this.getTransactions(accountId, limit, since);
        allTransactions.push(...transactions);
      } catch (error) {
        console.error(`Error fetching transactions for account ${accountId}:`, error);
      }
    }
    
    return allTransactions;
  }

  /**
   * Synchroniser les comptes bancaires d'un utilisateur
   */
  async syncUserAccounts(
    userId: string
  ): Promise<{ accounts: BridgeAccount[]; transactions: BridgeTransaction[] }> {
    try {
      const accounts = await this.getAccounts(userId);
      const allTransactions: BridgeTransaction[] = [];

      for (const account of accounts) {
        const transactions = await this.getTransactions(account.id);
        allTransactions.push(...transactions);
      }

      return { accounts, transactions: allTransactions };
    } catch (error) {
      console.error('Error syncing user accounts:', error);
      throw error;
    }
  }

  /**
   * Créer un lien de paiement Bridge
   */
  async createPaymentLink(options: {
    amount: number;
    currency: string;
    description: string;
    redirectUri: string;
    expiresAt: string;
  }): Promise<any> {
    try {
      return await this.apiRequest('/payment-links', {
        method: 'POST',
        body: JSON.stringify({
          amount: options.amount,
          currency: options.currency,
          description: options.description,
          redirect_uri: options.redirectUri,
          expires_at: options.expiresAt,
        }),
      });
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  }

  /**
   * Récupérer un lien de paiement Bridge
   */
  async getPaymentLink(paymentId: string): Promise<any> {
    try {
      return await this.apiRequest(`/payment-links/${paymentId}`);
    } catch (error) {
      console.error('Error getting payment link:', error);
      throw error;
    }
  }
}

// Instance globale du client
export const bridgeClient = new BridgeAPIClient();

/**
 * Données de démo pour les tests (quand Bridge API n'est pas configuré)
 */
export const DEMO_ACCOUNTS: BridgeAccount[] = [
  {
    id: 'demo_acc_1',
    name: 'Compte Courant Principal',
    balance: 2547.83,
    currency: 'EUR',
    type: 'checking',
    iban: 'FR76 1234 5678 9012 3456 789',
    status: 'active',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo_acc_2',
    name: 'Livret A',
    balance: 15230.5,
    currency: 'EUR',
    type: 'savings',
    status: 'active',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo_acc_3',
    name: 'Compte Professionnel',
    balance: 8945.12,
    currency: 'EUR',
    type: 'business',
    iban: 'FR76 9876 5432 1098 7654 321',
    status: 'active',
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_TRANSACTIONS: BridgeTransaction[] = [
  {
    id: 'demo_tx_1',
    account_id: 'demo_acc_1',
    amount: -45.67,
    currency: 'EUR',
    description: 'Carrefour Market',
    category: 'Alimentation',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'debit',
    raw_description: 'CB CARREFOUR MARKET 123456789',
    balance: 2547.83,
  },
  {
    id: 'demo_tx_2',
    account_id: 'demo_acc_1',
    amount: 1200.0,
    currency: 'EUR',
    description: 'Salaire - Entreprise XYZ',
    category: 'Revenus',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'credit',
    raw_description: 'VIR ENTREPRISE XYZ SALAIRE',
    balance: 2593.5,
  },
  {
    id: 'demo_tx_3',
    account_id: 'demo_acc_1',
    amount: -89.99,
    currency: 'EUR',
    description: 'Netflix Abonnement',
    category: 'Loisirs',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'debit',
    raw_description: 'PRELEVEMENT NETFLIX',
    balance: 1393.5,
  },
  {
    id: 'demo_tx_4',
    account_id: 'demo_acc_2',
    amount: 500.0,
    currency: 'EUR',
    description: 'Virement depuis compte courant',
    category: 'Épargne',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'credit',
    raw_description: 'VIR COMPTE COURANT EPARGNE',
    balance: 15230.5,
  },
];

/**
 * Hook pour utiliser les données Bridge API ou les données de démo
 */
export function useBridgeData(userId?: string) {
  const isDemoMode = !BRIDGE_CONFIG.CLIENT_ID || !BRIDGE_CONFIG.CLIENT_SECRET;

  if (isDemoMode) {
    return {
      accounts: DEMO_ACCOUNTS,
      transactions: DEMO_TRANSACTIONS,
      isDemoMode: true,
      loading: false,
      error: null,
    };
  }

  // TODO: Implémenter la logique réelle avec Bridge API
  return {
    accounts: [],
    transactions: [],
    isDemoMode: false,
    loading: false,
    error: null,
  };
}
