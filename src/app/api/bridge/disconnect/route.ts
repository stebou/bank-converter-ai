import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[BRIDGE_DISCONNECT] 🚀 Déconnexion comptes Bridge');

    // Authentification Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log(`[BRIDGE_DISCONNECT] 👤 Utilisateur Clerk: ${userId}`);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Récupérer les comptes actifs avant déconnexion
    const activeAccounts = await prisma.bankAccount.findMany({
      where: { 
        userId: user.id,
        isActive: true 
      }
    });

    if (activeAccounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun compte à déconnecter',
        accountsDisconnected: 0
      });
    }

    // Marquer les comptes comme déconnectés
    const disconnectResult = await prisma.bankAccount.updateMany({
      where: {
        userId: user.id,
        isActive: true
      },
      data: {
        isActive: false,
        disconnectedAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(`[BRIDGE_DISCONNECT] 🔌 ${disconnectResult.count} comptes déconnectés`);

    // Optionnel: Supprimer complètement les comptes demo
    const body = await request.json().catch(() => ({}));
    const { deleteDemo = false } = body;

    if (deleteDemo) {
      await prisma.bankAccount.deleteMany({
        where: { 
          userId: user.id,
          bridgeAccountId: { startsWith: 'demo_' }
        }
      });
      console.log(`[BRIDGE_DISCONNECT] 🗑️ Comptes demo supprimés`);
    }

    return NextResponse.json({
      success: true,
      message: `${disconnectResult.count} compte(s) déconnecté(s) avec succès`,
      accountsDisconnected: disconnectResult.count,
      accountNames: activeAccounts.map(acc => acc.name),
      demo: activeAccounts.some(acc => acc.bridgeAccountId.startsWith('demo_')),
      userId: user.id,
      clerkUserId: userId
    });

  } catch (error) {
    console.error('[BRIDGE_DISCONNECT] ❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion Bridge' },
      { status: 500 }
    );
  }
}