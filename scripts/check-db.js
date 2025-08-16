const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la base de données...\n');

    // Vérifier les utilisateurs
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        clerkId: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            bankAccounts: true,
            bankTransactions: true
          }
        }
      }
    });

    console.log('👥 Utilisateurs trouvés:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.email} (Clerk: ${user.clerkId})`);
      console.log(`    Comptes: ${user._count.bankAccounts}, Transactions: ${user._count.bankTransactions}`);
    });

    // Vérifier les comptes bancaires
    const accounts = await prisma.bankAccount.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        balance: true,
        bankName: true,
        isActive: true,
        user: {
          select: {
            email: true,
            clerkId: true
          }
        }
      }
    });

    console.log('\n💳 Comptes bancaires trouvés:', accounts.length);
    accounts.forEach(account => {
      console.log(`  - ${account.name}: ${account.balance}€ (${account.bankName})`);
      console.log(`    Utilisateur: ${account.user.email}`);
    });

    // Vérifier les transactions
    const transactions = await prisma.bankTransaction.findMany({
      take: 5,
      select: {
        id: true,
        description: true,
        amount: true,
        transactionDate: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        transactionDate: 'desc'
      }
    });

    console.log('\n💰 Transactions récentes trouvées:', transactions.length);
    transactions.forEach(tx => {
      console.log(`  - ${tx.description}: ${tx.amount}€ (${tx.transactionDate.toLocaleDateString()})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();