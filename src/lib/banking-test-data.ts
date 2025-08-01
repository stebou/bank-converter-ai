// Données de test pour le dashboard banking (en attendant Bridge API)

export const mockBankAccounts = [
  {
    id: 'acc_1',
    userId: 'user_test',
    bridgeAccountId: 'bridge_acc_1',
    name: 'Compte Pro Principal',
    type: 'business',
    balance: 45230.89,
    currency: 'EUR',
    iban: 'FR1430002020050500013M02608',
    bankName: 'BNP Paribas',
    isActive: true,
    lastSyncAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'acc_2', 
    userId: 'user_test',
    bridgeAccountId: 'bridge_acc_2',
    name: 'Compte Pro Réserves',
    type: 'business',
    balance: 18750.00,
    currency: 'EUR',
    iban: 'FR1430002020050500013M02609',
    bankName: 'BNP Paribas',
    isActive: true,
    lastSyncAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'acc_3',
    userId: 'user_test', 
    bridgeAccountId: 'bridge_acc_3',
    name: 'Compte Société SARL XYZ',
    type: 'professional',
    balance: 32156.45,
    currency: 'EUR',
    iban: 'FR1420041010050500013M02606',
    bankName: 'Crédit Agricole',
    isActive: true,
    lastSyncAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockBankTransactions = [
  {
    id: 'trans_1',
    userId: 'user_test',
    accountId: 'acc_1',
    bridgeTransactionId: 'bridge_trans_1',
    amount: 15890.00,
    description: 'VIREMENT CLIENT CONTRAT ABC-2025',
    transactionDate: new Date('2025-01-12'),
    category: 'revenus',
    subcategory: 'factures_clients',
    type: 'credit',
    currency: 'EUR',
    aiConfidence: 0.98,
    isRecurring: false,
    tags: null,
    createdAt: new Date(),
  },
  {
    id: 'trans_2',
    userId: 'user_test',
    accountId: 'acc_1', 
    bridgeTransactionId: 'bridge_trans_2',
    amount: -2800.00,
    description: 'SALAIRE EMPLOYE DUPONT',
    transactionDate: new Date('2025-01-01'),
    category: 'charges',
    subcategory: 'salaires',
    type: 'debit',
    currency: 'EUR',
    aiConfidence: 0.98,
    isRecurring: true,
    tags: null,
    createdAt: new Date(),
  },
  {
    id: 'trans_3',
    userId: 'user_test',
    accountId: 'acc_1',
    bridgeTransactionId: 'bridge_trans_3', 
    amount: -890.50,
    description: 'URSSAF COTISATIONS SOCIALES',
    transactionDate: new Date('2025-01-05'),
    category: 'charges',
    subcategory: 'cotisations',
    type: 'debit',
    currency: 'EUR',
    aiConfidence: 0.96,
    isRecurring: true,
    tags: null,
    createdAt: new Date(),
  },
  {
    id: 'trans_4',
    userId: 'user_test',
    accountId: 'acc_2',
    bridgeTransactionId: 'bridge_trans_4',
    amount: 5000.00,
    description: 'PROVISIONNEMENT RESERVES',
    transactionDate: new Date('2025-01-01'),
    category: 'transferts',
    subcategory: 'provisions',
    type: 'credit',
    currency: 'EUR',
    aiConfidence: 0.97,
    isRecurring: true,
    tags: null,
    createdAt: new Date(),
  },
  {
    id: 'trans_5',
    userId: 'user_test',
    accountId: 'acc_3',
    bridgeTransactionId: 'bridge_trans_5',
    amount: 8500.00,
    description: 'FACTURE CLIENT PROJET XYZ',
    transactionDate: new Date('2025-01-15'),
    category: 'revenus',
    subcategory: 'prestations',
    type: 'credit',
    currency: 'EUR',
    aiConfidence: 0.95,
    isRecurring: false,
    tags: null,
    createdAt: new Date(),
  },
  {
    id: 'trans_6',
    userId: 'user_test',
    accountId: 'acc_1',
    bridgeTransactionId: 'bridge_trans_6',
    amount: -450.00,
    description: 'LOYER BUREAU COMMERCIAL',
    transactionDate: new Date('2025-01-03'),
    category: 'charges',
    subcategory: 'immobilier',
    type: 'debit',
    currency: 'EUR',
    aiConfidence: 0.94,
    isRecurring: true,
    tags: null,
    createdAt: new Date(),
  },
  {
    id: 'trans_7',
    userId: 'user_test',
    accountId: 'acc_1',
    bridgeTransactionId: 'bridge_trans_7',
    amount: -125.99,
    description: 'ACHAT MATERIEL INFORMATIQUE',
    transactionDate: new Date('2025-01-08'),
    category: 'charges',
    subcategory: 'equipement',
    type: 'debit',
    currency: 'EUR',
    aiConfidence: 0.93,
    isRecurring: false,
    tags: null,
    createdAt: new Date(),
  },
];

// Fonction pour populer la DB avec des données de test
export async function seedTestBankingData(clerkUserId: string) {
  const { prisma } = await import('./prisma');

  try {
    // Récupérer l'ID utilisateur interne depuis Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      throw new Error(`User not found for Clerk ID: ${clerkUserId}`);
    }

    const userId = user.id;
    console.log(`[BANKING_TEST] Found user ${userId} for Clerk ID ${clerkUserId}`);

    // Supprimer les données existantes pour cet utilisateur
    await prisma.bankTransaction.deleteMany({ where: { userId } });
    await prisma.bankAccount.deleteMany({ where: { userId } });

    // Créer les comptes de test
    const accountsData = mockBankAccounts.map(acc => ({
      ...acc,
      userId,
      id: undefined, // Laisser Prisma générer l'ID
    }));

    const createdAccounts = await Promise.all(
      accountsData.map(accountData => 
        prisma.bankAccount.create({ data: accountData })
      )
    );

    // Créer les transactions de test
    const transactionsData = mockBankTransactions.map(trans => {
      // Mapper l'ancien accountId vers le nouvel ID créé
      const oldAccountId = trans.accountId;
      const newAccountId = createdAccounts.find(acc => 
        acc.bridgeAccountId === mockBankAccounts.find(mock => mock.id === oldAccountId)?.bridgeAccountId
      )?.id;

      return {
        ...trans,
        userId,
        accountId: newAccountId!,
        id: undefined, // Laisser Prisma générer l'ID
      };
    });

    await Promise.all(
      transactionsData.map(transData => 
        prisma.bankTransaction.create({ data: transData })
      )
    );

    console.log(`[BANKING_TEST] Created ${createdAccounts.length} accounts and ${transactionsData.length} transactions for user ${userId} (Clerk: ${clerkUserId})`);

    return {
      accounts: createdAccounts.length,
      transactions: transactionsData.length,
    };
  } catch (error) {
    console.error('[BANKING_TEST] Error seeding test data:', error);
    throw error;
  }
}