import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    console.log('[BRIDGE_CONNECTIONS] 📋 Récupération des connexions');

    // Authentification Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log(`[BRIDGE_CONNECTIONS] 👤 Utilisateur Clerk: ${userId}`);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Récupérer les comptes actifs groupés par bridge_item_id
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { 
        userId: user.id,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Grouper les comptes par bridge_item_id pour créer des connexions
    const connectionsMap = new Map();

    bankAccounts.forEach(account => {
      const itemId = account.bridgeItemId || `item_${account.id}`;
      
      if (!connectionsMap.has(itemId)) {
        connectionsMap.set(itemId, {
          bridgeItemId: itemId,
          bankName: account.bankName || 'Banque Inconnue',
          connectedAt: account.createdAt.toISOString(),
          accounts: []
        });
      }

      connectionsMap.get(itemId).accounts.push({
        id: account.id,
        bridgeAccountId: account.bridgeAccountId,
        name: account.name,
        type: account.type,
        balance: parseFloat(account.balance.toString()),
        currency: account.currency,
        iban: account.iban
      });
    });

    const connections = Array.from(connectionsMap.values());

    console.log(`[BRIDGE_CONNECTIONS] ✅ ${connections.length} connexions trouvées`);

    return NextResponse.json({
      success: true,
      data: { connections },
      count: connections.length
    });

  } catch (error) {
    console.error('[BRIDGE_CONNECTIONS] ❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des connexions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('[BRIDGE_CONNECTIONS] 🗑️ Déconnexion d\'une connexion spécifique');

    // Authentification Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'itemId depuis les query params
    const url = new URL(request.url);
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'itemId requis' }, { status: 400 });
    }

    console.log(`[BRIDGE_CONNECTIONS] 👤 Utilisateur: ${userId}, Item: ${itemId}`);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Trouver et déconnecter les comptes liés à cet item
    const accountsToDisconnect = await prisma.bankAccount.findMany({
      where: {
        userId: user.id,
        bridgeItemId: itemId,
        isActive: true
      }
    });

    if (accountsToDisconnect.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun compte à déconnecter pour cet item',
        accountsDisconnected: 0
      });
    }

    // Marquer les comptes comme déconnectés
    const disconnectResult = await prisma.bankAccount.updateMany({
      where: {
        userId: user.id,
        bridgeItemId: itemId,
        isActive: true
      },
      data: {
        isActive: false,
        disconnectedAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(`[BRIDGE_CONNECTIONS] ✅ ${disconnectResult.count} comptes déconnectés pour l'item ${itemId}`);

    return NextResponse.json({
      success: true,
      message: `${disconnectResult.count} compte(s) déconnecté(s) avec succès`,
      accountsDisconnected: disconnectResult.count,
      itemId: itemId,
      accountNames: accountsToDisconnect.map(acc => acc.name)
    });

  } catch (error) {
    console.error('[BRIDGE_CONNECTIONS] ❌ Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}