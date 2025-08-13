import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Données de test demo pour Bridge API Demo Bank (ID: 574)
const DEMO_ACCOUNTS = [
  {
    bridgeAccountId: 'demo_account_574_001',
    name: 'Compte Courant Pro',
    type: 'checking',
    balance: 45678.90,
    currency: 'EUR',
    iban: 'FR7630001007941234567890185',
    bankName: 'Demo Bank',
    isActive: true,
  },
  {
    bridgeAccountId: 'demo_account_574_002', 
    name: 'Compte Épargne',
    type: 'savings',
    balance: 125000.00,
    currency: 'EUR',
    iban: 'FR7630001007941234567890186',
    bankName: 'Demo Bank',
    isActive: true,
  },
  {
    bridgeAccountId: 'demo_account_574_003',
    name: 'Compte Investissement',
    type: 'investment',
    balance: 78540.25,
    currency: 'EUR',
    iban: 'FR7630001007941234567890187',
    bankName: 'Demo Bank', 
    isActive: true,
  }
];

const DEMO_TRANSACTIONS = [
  {
    bridgeTransactionId: 'demo_tx_574_001',
    bridgeAccountId: 'demo_account_574_001',
    amount: -1250.00,
    description: 'Loyer bureau - Janvier 2025',
    transactionDate: new Date('2025-01-10'),
    category: 'Immobilier',
    subcategory: 'Loyer',
    type: 'debit',
    currency: 'EUR'
  },
  {
    bridgeTransactionId: 'demo_tx_574_002',
    bridgeAccountId: 'demo_account_574_001',
    amount: 5500.00,
    description: 'Virement client ABC Corp',
    transactionDate: new Date('2025-01-08'),
    category: 'Revenus',
    subcategory: 'Prestations',
    type: 'credit',
    currency: 'EUR'
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
    currency: 'EUR'
  },
  {
    bridgeTransactionId: 'demo_tx_574_004',
    bridgeAccountId: 'demo_account_574_002',
    amount: 2500.00,
    description: 'Épargne mensuelle',
    transactionDate: new Date('2025-01-01'),
    category: 'Épargne',
    subcategory: 'Virement',
    type: 'credit',
    currency: 'EUR'
  },
  {
    bridgeTransactionId: 'demo_tx_574_005',
    bridgeAccountId: 'demo_account_574_003',
    amount: 1250.50,
    description: 'Dividendes actions',
    transactionDate: new Date('2025-01-12'),
    category: 'Investissement',
    subcategory: 'Dividendes',
    type: 'credit',
    currency: 'EUR'
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
    currency: 'EUR'
  },
  {
    bridgeTransactionId: 'demo_tx_574_007',
    bridgeAccountId: 'demo_account_574_001',
    amount: 3200.00,
    description: 'Virement client XYZ Ltd',
    transactionDate: new Date('2025-01-15'),
    category: 'Revenus',
    subcategory: 'Prestations',
    type: 'credit',
    currency: 'EUR'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('[BRIDGE_SYNC] Début de synchronisation des données demo');
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    console.log(`[BRIDGE_SYNC] Utilisateur trouvé: ${user.id}`);

    // Synchroniser les comptes demo
    const accountIds: string[] = [];
    for (const accountData of DEMO_ACCOUNTS) {
      const account = await prisma.bankAccount.upsert({
        where: {
          bridgeAccountId: accountData.bridgeAccountId
        },
        update: {
          balance: accountData.balance,
          lastSyncAt: new Date(),
        },
        create: {
          userId: user.id,
          bridgeAccountId: accountData.bridgeAccountId,
          name: accountData.name,
          type: accountData.type,
          balance: accountData.balance,
          currency: accountData.currency,
          iban: accountData.iban,
          bankName: accountData.bankName,
          isActive: accountData.isActive,
          lastSyncAt: new Date(),
        }
      });
      
      accountIds.push(account.id);
      console.log(`[BRIDGE_SYNC] Compte synchronisé: ${account.name} (${account.balance}€)`);
    }

    // Synchroniser les transactions demo
    let transactionCount = 0;
    for (const txData of DEMO_TRANSACTIONS) {
      // Trouver l'ID du compte correspondant
      const account = await prisma.bankAccount.findFirst({
        where: {
          userId: user.id,
          bridgeAccountId: txData.bridgeAccountId
        }
      });

      if (account) {
        await prisma.bankTransaction.upsert({
          where: {
            bridgeTransactionId: txData.bridgeTransactionId
          },
          update: {
            amount: txData.amount,
            description: txData.description,
          },
          create: {
            userId: user.id,
            accountId: account.id,
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
            tags: []
          }
        });
        
        transactionCount++;
        console.log(`[BRIDGE_SYNC] Transaction synchronisée: ${txData.description} (${txData.amount}€)`);
      }
    }

    console.log(`[BRIDGE_SYNC] Synchronisation terminée: ${DEMO_ACCOUNTS.length} comptes, ${transactionCount} transactions`);

    return NextResponse.json({
      success: true,
      message: 'Données de test synchronisées avec succès',
      accounts: DEMO_ACCOUNTS.length,
      transactions: transactionCount,
      demo: true
    });

  } catch (error) {
    console.error('[BRIDGE_SYNC] Erreur lors de la synchronisation:', error);
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