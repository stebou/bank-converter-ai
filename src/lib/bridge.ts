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
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.bridgeapi.io' 
    : 'https://api.bridgeapi.io', // Même URL pour sandbox
  API_VERSION: 'v3',
  CLIENT_ID: process.env.BRIDGE_CLIENT_ID,
  CLIENT_SECRET: process.env.BRIDGE_CLIENT_SECRET,
  ENVIRONMENT: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
};

/**
 * Client Bridge API
 */
export class BridgeAPIClient {
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = `${BRIDGE_CONFIG.API_URL}/${BRIDGE_CONFIG.API_VERSION}`;
    this.clientId = BRIDGE_CONFIG.CLIENT_ID || '';
    this.clientSecret = BRIDGE_CONFIG.CLIENT_SECRET || '';
  }

  /**
   * Authentification OAuth2
   */
  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken!;
    } catch (error) {
      console.error('Bridge API authentication error:', error);
      throw error;
    }
  }

  /**
   * Requête authentifiée vers l'API Bridge
   */
  private async authenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Bridge API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Créer une session Connect pour lier un compte bancaire
   */
  async createConnectSession(userId: string, redirectUri: string): Promise<BridgeConnectSession> {
    return this.authenticatedRequest('/connect/sessions', {
      method: 'POST',
      body: JSON.stringify({
        user_uuid: userId,
        redirect_uri: redirectUri,
        context: {
          env: BRIDGE_CONFIG.ENVIRONMENT,
        },
      }),
    });
  }

  /**
   * Récupérer les comptes bancaires d'un utilisateur
   */
  async getAccounts(userId: string): Promise<BridgeAccount[]> {
    const data = await this.authenticatedRequest(`/users/${userId}/accounts`);
    return data.resources || [];
  }

  /**
   * Récupérer les transactions d'un compte
   */
  async getTransactions(accountId: string, limit = 50): Promise<BridgeTransaction[]> {
    const data = await this.authenticatedRequest(`/accounts/${accountId}/transactions?limit=${limit}`);
    return data.resources || [];
  }

  /**
   * Synchroniser les comptes bancaires d'un utilisateur
   */
  async syncUserAccounts(userId: string): Promise<{accounts: BridgeAccount[], transactions: BridgeTransaction[]}> {
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
    balance: 15230.50,
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
    amount: 1200.00,
    currency: 'EUR',
    description: 'Salaire - Entreprise XYZ',
    category: 'Revenus',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'credit',
    raw_description: 'VIR ENTREPRISE XYZ SALAIRE',
    balance: 2593.50,
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
    balance: 1393.50,
  },
  {
    id: 'demo_tx_4',
    account_id: 'demo_acc_2',
    amount: 500.00,
    currency: 'EUR',
    description: 'Virement depuis compte courant',
    category: 'Épargne',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    type: 'credit',
    raw_description: 'VIR COMPTE COURANT EPARGNE',
    balance: 15230.50,
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
