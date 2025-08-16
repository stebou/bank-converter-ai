import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const DEMO_ACCOUNTS = [
  {
    bridgeAccountId: `demo_acc_${Date.now()}_1`,
    bridgeItemId: `demo_item_${Date.now()}`,
    name: 'Compte Courant Pro',
    type: 'checking',
    balance: 45678.90,
    currency: 'EUR',
    iban: 'FR7630001007941234567890185',
    bankName: 'Demo Bank',
    isActive: true,
  },
  {
    bridgeAccountId: `demo_acc_${Date.now()}_2`,
    bridgeItemId: `demo_item_${Date.now()}`,
    name: 'Compte Épargne',
    type: 'savings',
    balance: 125000.00,
    currency: 'EUR',
    iban: 'FR7630001007941234567890186',
    bankName: 'Demo Bank',
    isActive: true,
  },
  {
    bridgeAccountId: `demo_acc_${Date.now()}_3`,
    bridgeItemId: `demo_item_${Date.now()}`,
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
    bridgeTransactionId: `demo_tx_${Date.now()}_1`,
    amount: 3200.00,
    description: 'Virement client XYZ Ltd',
    transactionDate: new Date(),
    category: 'Revenus',
    subcategory: 'Virement',
    type: 'credit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: `demo_tx_${Date.now()}_2`,
    amount: -1250.00,
    description: 'Loyer bureau - Août 2025',
    transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'Dépenses',
    subcategory: 'Loyer',
    type: 'debit',
    currency: 'EUR',
  },
  {
    bridgeTransactionId: `demo_tx_${Date.now()}_3`,
    amount: 5500.00,
    description: 'Virement client ABC Corp',
    transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: 'Revenus',
    subcategory: 'Virement',
    type: 'credit',
    currency: 'EUR',
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('[BRIDGE_DEMO] 🚀 Connexion comptes demo Bridge');

    // Authentification Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log(`[BRIDGE_DEMO] 👤 Utilisateur Clerk: ${userId}`);

    // Récupérer ou créer l'utilisateur
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@demo.com`,
          name: `Demo User ${userId.slice(-6)}`,
          updatedAt: new Date(),
        }
      });
      console.log(`[BRIDGE_DEMO] ✅ Utilisateur créé: ${user.id}`);
    }

    // Supprimer les anciens comptes demo de cet utilisateur
    await prisma.bankAccount.deleteMany({
      where: { 
        userId: user.id,
        bridgeAccountId: { startsWith: 'demo_' }
      }
    });

    console.log(`[BRIDGE_DEMO] 🧹 Anciens comptes demo supprimés`);

    // Créer les nouveaux comptes demo
    const createdAccounts = [];
    for (const accountData of DEMO_ACCOUNTS) {
      const account = await prisma.bankAccount.create({
        data: {
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

      createdAccounts.push(account);
      console.log(`[BRIDGE_DEMO] 💳 Compte créé: ${account.name} (${account.balance}€)`);
    }

    // Créer des transactions demo
    let transactionCount = 0;
    for (let i = 0; i < DEMO_TRANSACTIONS.length && i < createdAccounts.length; i++) {
      const txData = DEMO_TRANSACTIONS[i];
      const account = createdAccounts[i];

      await prisma.bankTransaction.create({
        data: {
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
          tags: [],
        },
      });

      transactionCount++;
      console.log(`[BRIDGE_DEMO] ✅ Transaction créée: ${txData.description} (${txData.amount}€)`);
    }

    const totalBalance = createdAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    console.log(`[BRIDGE_DEMO] 🎉 Connexion demo terminée: ${createdAccounts.length} comptes, ${transactionCount} transactions`);

    return NextResponse.json({
      success: true,
      message: 'Comptes demo Bridge connectés avec succès',
      accounts: createdAccounts.length,
      transactions: transactionCount,
      totalBalance,
      demo: true,
      userId: user.id,
      clerkUserId: userId,
      accountDetails: createdAccounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        balance: acc.balance,
        type: acc.type
      }))
    });

  } catch (error) {
    console.error('[BRIDGE_DEMO] ❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion demo Bridge' },
      { status: 500 }
    );
  }
}