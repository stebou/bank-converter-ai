const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAnalytics() {
  try {
    // Test avec 1y timeframe comme dans l'application
    const user = await prisma.user.findFirst({
      where: {
        clerkId: {
          startsWith: 'user_30'
        }
      }
    });

    console.log('User found:', user?.id);

    if (!user) {
      console.log('No user found');
      return;
    }

    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1y
    console.log('Start date for 1y:', startDate.toISOString());

    const transactions = await prisma.bankTransaction.findMany({
      where: {
        userId: user.id,
        transactionDate: {
          gte: startDate
        }
      }
    });

    console.log(`Found ${transactions.length} transactions`);

    const totalIncome = transactions
      .filter(t => t.type === 'credit' || (t.type !== 'debit' && t.amount > 0))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'debit' || (t.type !== 'credit' && t.amount < 0))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    console.log('\n=== ANALYTICS RESULT (1y) ===');
    console.log({
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: transactions.length
    });

    // Vérifier les détails des transactions
    console.log('\n=== TRANSACTION DETAILS ===');
    const incomeTransactions = transactions.filter(t => t.type === 'credit' || (t.type !== 'debit' && t.amount > 0));
    const expenseTransactions = transactions.filter(t => t.type === 'debit' || (t.type !== 'credit' && t.amount < 0));

    console.log('\nINCOME TRANSACTIONS:');
    incomeTransactions.forEach(t => {
      console.log(`  ${t.type} - ${t.amount} - ${t.description}`);
    });

    console.log('\nEXPENSE TRANSACTIONS:');
    expenseTransactions.forEach(t => {
      console.log(`  ${t.type} - ${t.amount} - ${t.description}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAnalytics();
