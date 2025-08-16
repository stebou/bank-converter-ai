import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function transferDataToCurrentUser() {
  console.log('🔄 TRANSFERT DES DONNÉES VERS L\'UTILISATEUR ACTUEL');
  console.log('==================================================');

  try {
    // Utilisateur source (qui a les données)
    const sourceUserId = 'cmebc1bbu000087gv0hezg4y2';
    // Utilisateur cible (connecté actuellement)
    const targetUserId = 'cmebcre6c000087r23a5nxba2';

    console.log(`Source: ${sourceUserId}`);
    console.log(`Target: ${targetUserId}`);

    // 1. Transférer les comptes bancaires
    const accountsTransferred = await prisma.bankAccount.updateMany({
      where: { userId: sourceUserId },
      data: { userId: targetUserId }
    });

    console.log(`✅ ${accountsTransferred.count} comptes transférés`);

    // 2. Transférer les transactions
    const transactionsTransferred = await prisma.bankTransaction.updateMany({
      where: { userId: sourceUserId },
      data: { userId: targetUserId }
    });

    console.log(`✅ ${transactionsTransferred.count} transactions transférées`);

    // 3. Vérification
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        _count: {
          select: {
            bankAccounts: true,
            bankTransactions: true
          }
        }
      }
    });

    console.log(`\n🎯 RÉSULTAT:`);
    console.log(`Utilisateur cible maintenant a:`);
    console.log(`- ${targetUser?._count.bankAccounts} comptes`);
    console.log(`- ${targetUser?._count.bankTransactions} transactions`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

transferDataToCurrentUser();
