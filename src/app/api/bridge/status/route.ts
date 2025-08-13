import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
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

    // Compter les comptes bancaires actifs
    const accountsCount = await prisma.bankAccount.count({
      where: {
        userId: user.id,
        isActive: true
      }
    });

    // Récupérer la date de dernière synchronisation
    const lastAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: user.id,
        isActive: true
      },
      orderBy: {
        lastSyncAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        hasConnectedAccount: accountsCount > 0,
        accountsCount,
        lastSyncAt: lastAccount?.lastSyncAt?.toISOString() || null,
      }
    });

  } catch (error) {
    console.error('[BRIDGE_STATUS] Erreur lors de la vérification du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du statut' },
      { status: 500 }
    );
  }
}
