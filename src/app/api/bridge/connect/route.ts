import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * API route pour initier la connexion d'un compte société via Bridge API
 * POST /api/bridge/connect - Créer une session Connect pour lier le compte société
 */
export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur existe
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Utiliser l'API Bridge v3 pour créer une session Connect
    try {
      const { BridgeAPIClient } = await import('@/lib/bridge');
      const bridgeClient = new BridgeAPIClient();

      // Générer un ID utilisateur unique pour Bridge
      const bridgeUserId = `user_${dbUser.id}`;

      // Créer une session Connect avec l'API v3
      const connectSession = await bridgeClient.createConnectSession(
        bridgeUserId,
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?connected=true`,
        574 // Demo Bank ID
      );

      // Sauvegarder la session dans la base de données pour le suivi
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          // Vous pouvez ajouter des champs pour tracker les sessions Bridge
          // bridgeUserId: bridgeUserId,
          // lastConnectSession: connectSession.id,
        },
      });

      return NextResponse.json({
        connect_url: connectSession.url,
        session_id: connectSession.id,
        bridge_user_id: bridgeUserId,
        success: true,
      });
    } catch (bridgeError) {
      console.error('[BRIDGE_CONNECT] Erreur Bridge API:', bridgeError);

      // Fallback vers une URL de demo avec le Demo Bank
      const demoUrl = `${process.env.BRIDGE_CONNECT_URL}?demo=true&bank_id=574&user=${dbUser.id}`;
      return NextResponse.json({
        connect_url: demoUrl,
        session_id: `demo_${Date.now()}`,
        is_demo: true,
      });
    }
  } catch (error) {
    console.error('[BRIDGE_CONNECT] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
