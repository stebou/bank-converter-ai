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
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur existe
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Créer un utilisateur Bridge si nécessaire
    try {
      const bridgeUserResponse = await fetch(`${process.env.BRIDGE_API_URL}/v2/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BRIDGE_API_KEY}`,
          'Bridge-Version': '2025-01-15'
        },
        body: JSON.stringify({
          email: dbUser.email,
          password: `bridge_${dbUser.id}`,
        })
      });

      let bridgeUser;
      if (bridgeUserResponse.ok) {
        bridgeUser = await bridgeUserResponse.json();
      } else {
        // L'utilisateur existe peut-être déjà, essayons de le récupérer
        console.log('[BRIDGE_CONNECT] Utilisateur Bridge existant');
        bridgeUser = { uuid: `existing_${dbUser.id}` };
      }

      // Créer une session Connect avec Demo Bank pré-sélectionnée
      const connectResponse = await fetch(`${process.env.BRIDGE_API_URL}/v2/connect/items/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BRIDGE_API_KEY}`,
          'Bridge-Version': '2025-01-15'
        },
        body: JSON.stringify({
          user_uuid: bridgeUser.uuid,
          prefill_bank_id: 574, // Demo Bank ID
          redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?connected=true`,
          webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/bridge/webhook`
        })
      });

      if (connectResponse.ok) {
        const connectData = await connectResponse.json();
        return NextResponse.json({
          connect_url: connectData.redirect_url,
          session_id: connectData.uuid,
          bridge_user_id: bridgeUser.uuid
        });
      } else {
        // Fallback vers Demo Bank direct
        const demoUrl = `${process.env.BRIDGE_CONNECT_URL}?user_uuid=${bridgeUser.uuid}&bank_id=574`;
        return NextResponse.json({
          connect_url: demoUrl,
          session_id: `demo_${Date.now()}`,
          bridge_user_id: bridgeUser.uuid
        });
      }

    } catch (bridgeError) {
      console.error('[BRIDGE_CONNECT] Erreur Bridge API:', bridgeError);
      
      // Fallback vers une URL de demo avec le Demo Bank
      const demoUrl = `${process.env.BRIDGE_CONNECT_URL}?demo=true&bank_id=574&user=${dbUser.id}`;
      return NextResponse.json({
        connect_url: demoUrl,
        session_id: `demo_${Date.now()}`,
        is_demo: true
      });
    }

  } catch (error) {
    console.error("[BRIDGE_CONNECT] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
