const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserData() {
  try {
    console.log('🔧 Correction des données utilisateur...\n');

    // Récupérer l'utilisateur alternativepolice94 (qui a les données)
    const userWithData = await prisma.user.findUnique({
      where: { email: 'alternativepolice94@gmail.com' }
    });

    // Récupérer l'utilisateur actuel (user_30YMLfAMnea9KqPLNaHefGCEAvR)
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: 'user_30YMLfAMnea9KqPLNaHefGCEAvR' }
    });

    if (!userWithData || !currentUser) {
      console.log('❌ Utilisateurs non trouvés');
      console.log('User with data:', userWithData?.email);
      console.log('Current user:', currentUser?.clerkId);
      return;
    }

    console.log('👥 Utilisateurs identifiés:');
    console.log(`  - Avec données: ${userWithData.email} (ID: ${userWithData.id})`);
    console.log(`  - Actuel: ${currentUser.clerkId} (ID: ${currentUser.id})`);

    // Transférer tous les comptes bancaires
    const accountsUpdated = await prisma.bankAccount.updateMany({
      where: { userId: userWithData.id },
      data: { userId: currentUser.id }
    });

    console.log(`💳 ${accountsUpdated.count} comptes bancaires transférés`);

    // Transférer toutes les transactions
    const transactionsUpdated = await prisma.bankTransaction.updateMany({
      where: { userId: userWithData.id },
      data: { userId: currentUser.id }
    });

    console.log(`💰 ${transactionsUpdated.count} transactions transférées`);

    // Vérification finale
    const finalCounts = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        _count: {
          select: {
            bankAccounts: true,
            bankTransactions: true
          }
        }
      }
    });

    console.log('\n✅ Vérification finale:');
    console.log(`  - Comptes: ${finalCounts._count.bankAccounts}`);
    console.log(`  - Transactions: ${finalCounts._count.bankTransactions}`);

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserData();