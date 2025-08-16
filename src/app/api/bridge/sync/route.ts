import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Données de test demo pour Bridge API Demo Bank (ID: 574)
const DEMO_ACCOUNTS = [
  {
    bridgeAccountId: 'demo_account_574_001',
    bridgeItemId: 'demo_item_574_main',
    name: 'Compte Courant Pro',
    type: 'checking',
    balance: 45678.9,
    currency: 'EUR',
    iban: 'FR7630001007941234567890185',
    bankName: 'Demo Bank',
    isActive: true,
  },
  {
    bridgeAccountId: 'demo_account_574_002',
    bridgeItemId: 'demo_item_574_main',
    name: 'Compte Épargne',
    type: 'savings',
    balance: 125000.0,
    currency: 'EUR',
    iban: 'FR7630001007941234567890186',
    bankName: 'Demo Bank',
    isActive: true,
  },
  {
    bridgeAccountId: 'demo_account_574_003',
    bridgeItemId: 'demo_item_574_secondary',
    name: 'Compte Investissement',
    type: 'investment',
    balance: 78540.25,
    currency: 'EUR',
    iban: 'FR7630001007941234567890187',
    bankName: 'Demo Bank',
    isActive: true,
  },
];

const DEMO_TRANSACTIONS = [
  {
    bridgeTransactionId: 'demo_tx_574_001',
    bridgeAccountId: 'demo_account_574_001',
    amount: -1250.0,
    description: 'Loyer bureau - Janvier 2025',
    transactionDate: new Date('2025-01-10'),
    category: 'Immobilier',
    subcategory: 'Loyer',
    type: 'debit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: 'demo_tx_574_002',
    bridgeAccountId: 'demo_account_574_001',
    amount: 5500.0,
    description: 'Virement client ABC Corp',
    transactionDate: new Date('2025-01-08'),
    category: 'Revenus',
    subcategory: 'Prestations',
    type: 'credit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: 'demo_tx_574_003',
    bridgeAccountId: 'demo_account_574_001',
    amount: -350.75,
    description: 'Facture électricité',
    transactionDate: new Date('2025-01-05'),
    category: 'Charges',
    subcategory: 'Énergie',
    type: 'debit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: 'demo_tx_574_004',
    bridgeAccountId: 'demo_account_574_002',
    amount: 2500.0,
    description: 'Épargne mensuelle',
    transactionDate: new Date('2025-01-01'),
    category: 'Épargne',
    subcategory: 'Virement',
    type: 'credit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: 'demo_tx_574_005',
    bridgeAccountId: 'demo_account_574_003',
    amount: 1250.5,
    description: 'Dividendes actions',
    transactionDate: new Date('2025-01-12'),
    category: 'Investissement',
    subcategory: 'Dividendes',
    type: 'credit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: 'demo_tx_574_006',
    bridgeAccountId: 'demo_account_574_001',
    amount: -89.99,
    description: 'Abonnement logiciel comptabilité',
    transactionDate: new Date('2025-01-03'),
    category: 'Services',
    subcategory: 'Logiciels',
    type: 'debit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: 'demo_tx_574_007',
    bridgeAccountId: 'demo_account_574_001',
    amount: 3200.0,
    description: 'Virement client XYZ Ltd',
    transactionDate: new Date('2025-01-15'),
    category: 'Revenus',
    subcategory: 'Prestations',
    type: 'credit',
    currency: 'EUR',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { forceDemoMode = false } = body;

    console.log('[BRIDGE_SYNC] 🚀 Début de synchronisation des données bancaires');

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log(`[BRIDGE_SYNC] 👤 Utilisateur Clerk: ${userId}`);

    // Récupérer ou créer l'utilisateur depuis la base de données
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.log(`[BRIDGE_SYNC] ⚠️  Utilisateur non trouvé, création automatique...`);
      
      try {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: `user-${userId}@temp.com`,
            name: `User ${userId.slice(-6)}`,
            updatedAt: new Date(),
          }
        });
        console.log(`[BRIDGE_SYNC] ✅ Utilisateur créé: ${user.id}`);
      } catch (createError) {
        console.error(`[BRIDGE_SYNC] ❌ Erreur création utilisateur:`, createError);
        return NextResponse.json(
          { error: 'Impossible de créer l\'utilisateur' },
          { status: 500 }
        );
      }
    } else {
      console.log(`[BRIDGE_SYNC] ✅ Utilisateur trouvé: ${user.id}`);
    }

    // Déterminer si on utilise l'API Bridge réelle ou les données démo
    const useDemoMode = forceDemoMode || !process.env.BRIDGE_CLIENT_ID || !process.env.BRIDGE_CLIENT_SECRET;
    
    let accounts: any[] = [];
    let transactions: any[] = [];
    
    if (useDemoMode) {
      console.log('[BRIDGE_SYNC] 🎯 Mode démo activé');
      accounts = DEMO_ACCOUNTS;
      transactions = DEMO_TRANSACTIONS;
    } else {
      console.log('[BRIDGE_SYNC] 🌐 Utilisation de l\'API Bridge réelle');
      try {
        const { BridgeAPIClient } = await import('@/lib/bridge');
        const bridgeClient = new BridgeAPIClient();
        
        // Récupérer les comptes via l'API Bridge
        const bridgeAccounts = await bridgeClient.getAccounts(`user_${user.id}`);
        
        // Convertir les données Bridge au format attendu
        accounts = bridgeAccounts.map((account: any) => ({
          bridgeAccountId: account.id,
          bridgeItemId: account.item_id || account.itemId || 'unknown',
          name: account.name,
          type: account.type,
          balance: account.balance,
          currency: account.currency,
          iban: account.iban,
          bankName: account.bank_name || account.bankName || 'Unknown Bank',
          isActive: account.status === 'active',
        }));
        
        // Récupérer les transactions pour tous les comptes
        if (accounts.length > 0) {
          const accountIds = accounts.map(acc => acc.bridgeAccountId);
          const bridgeTransactions = await bridgeClient.getAllTransactions(accountIds, 200);
          
          transactions = bridgeTransactions.map(tx => ({
            bridgeTransactionId: tx.id,
            bridgeAccountId: tx.account_id,
            amount: tx.amount,
            description: tx.description,
            transactionDate: new Date(tx.date),
            category: tx.category || 'Autre',
            subcategory: tx.raw_description || 'N/A',
            type: tx.type,
            currency: tx.currency,
          }));
        }
        
        console.log(`[BRIDGE_SYNC] 📊 Récupéré ${accounts.length} comptes et ${transactions.length} transactions via Bridge API`);
      } catch (bridgeError) {
        console.error('[BRIDGE_SYNC] ⚠️ Erreur API Bridge, fallback vers démo:', bridgeError);
        accounts = DEMO_ACCOUNTS;
        transactions = DEMO_TRANSACTIONS;
      }
    }

    // Synchroniser les comptes
    const accountIds: string[] = [];
    for (const accountData of accounts) {
      const account = await prisma.bankAccount.upsert({
        where: {
          bridgeAccountId: accountData.bridgeAccountId,
        },
        update: {
          balance: accountData.balance,
          lastSyncAt: new Date(),
        },
        create: {
          userId: user.id,
          bridgeAccountId: accountData.bridgeAccountId,
          bridgeItemId: accountData.bridgeItemId,
          name: accountData.name,
          type: accountData.type,
          balance: accountData.balance,
          currency: accountData.currency,
          iban: accountData.iban,
          bankName: accountData.bankName,
          isActive: accountData.isActive,
          lastSyncAt: new Date(),
          updatedAt: new Date(),
        },
      });

      accountIds.push(account.id);
      console.log(
        `[BRIDGE_SYNC] 💳 Compte synchronisé: ${account.name} (${account.balance}€)`
      );
    }

    // Synchroniser les transactions
    let transactionCount = 0;
    
    // Créer un map des comptes pour un accès plus efficace
    const accountsMap = new Map();
    const allUserAccounts = await prisma.bankAccount.findMany({
      where: { userId: user.id },
      select: { id: true, bridgeAccountId: true }
    });
    
    for (const acc of allUserAccounts) {
      accountsMap.set(acc.bridgeAccountId, acc.id);
    }
    
    console.log(`[BRIDGE_SYNC] 🗺️ Comptes disponibles pour transactions:`, Array.from(accountsMap.keys()));
    
    for (const txData of transactions) {
      const accountId = accountsMap.get(txData.bridgeAccountId);
      
      console.log(`[BRIDGE_SYNC] 🔍 Recherche compte pour transaction ${txData.bridgeTransactionId}: ${txData.bridgeAccountId} -> ${accountId}`);
      
      if (accountId) {
        try {
          await prisma.bankTransaction.upsert({
            where: {
              bridgeTransactionId: txData.bridgeTransactionId,
            },
            update: {
              amount: txData.amount,
              description: txData.description,
              transactionDate: txData.transactionDate,
            },
            create: {
              userId: user.id,
              accountId: accountId,
              bridgeTransactionId: txData.bridgeTransactionId,
              amount: txData.amount,
              description: txData.description,
              transactionDate: txData.transactionDate,
              category: txData.category,
              subcategory: txData.subcategory,
              type: txData.type,
              currency: txData.currency,
              aiConfidence: 0.95,
              isRecurring: false,
              tags: [],
            },
          });

          transactionCount++;
          console.log(
            `[BRIDGE_SYNC] ✅ Transaction créée: ${txData.description} (${txData.amount}€)`
          );
        } catch (error) {
          console.error(`[BRIDGE_SYNC] ❌ Erreur transaction ${txData.bridgeTransactionId}:`, error);
        }
      } else {
        console.error(`[BRIDGE_SYNC] ⚠️ Compte non trouvé pour transaction ${txData.bridgeTransactionId}, bridgeAccountId: ${txData.bridgeAccountId}`);
      }
    }

    // Calculer les KPIs basés sur les données synchronisées
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const monthlyRevenue = transactions
      .filter(tx => tx.type === 'credit' && tx.transactionDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const monthlyExpenses = transactions
      .filter(tx => tx.type === 'debit' && tx.transactionDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    console.log(
      `[BRIDGE_SYNC] 🎉 Synchronisation terminée: ${accounts.length} comptes, ${transactionCount} transactions`
    );
    console.log(`[BRIDGE_SYNC] 📈 KPIs calculés: Balance totale: ${totalBalance}€, Revenus: ${monthlyRevenue}€, Dépenses: ${monthlyExpenses}€`);

    return NextResponse.json({
      success: true,
      message: useDemoMode ? 'Données de test synchronisées avec succès' : 'Données Bridge synchronisées avec succès',
      accounts: accounts.length,
      transactions: transactionCount,
      demo: useDemoMode,
      userId: user.id,
      clerkUserId: userId,
      kpis: {
        totalBalance,
        monthlyRevenue,
        monthlyExpenses,
        transactionCount,
        accountsCount: accounts.length,
      },
    });
  } catch (error) {
    console.error('[BRIDGE_SYNC] ❌ Erreur lors de la synchronisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation des données demo' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Rediriger vers POST pour la compatibilité
  return POST(request);
}