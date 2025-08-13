import { bridgeClient } from '@/lib/bridge';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route pour tester l'agrégation bancaire Bridge API
 * GET /api/bridge/test - Test de l'authentification Bridge API
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Test d'authentification Bridge API
    try {
      const accessToken = await bridgeClient.authenticate();
      
      return NextResponse.json({
        success: true,
        message: 'Bridge API authentification réussie - Agrégation bancaire disponible',
        hasToken: !!accessToken,
        isDemo: !process.env.BRIDGE_CLIENT_ID || !process.env.BRIDGE_CLIENT_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
        timestamp: new Date().toISOString(),
      });
    } catch (bridgeError) {
      return NextResponse.json({
        success: false,
        message: 'Erreur d\'authentification Bridge API',
        error: bridgeError instanceof Error ? bridgeError.message : 'Erreur inconnue',
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Erreur API Bridge test:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bridge/test - Créer une session Connect pour lier des comptes bancaires
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { redirectUri } = body;

    if (!redirectUri) {
      return NextResponse.json(
        { error: 'redirectUri requis' },
        { status: 400 }
      );
    }

    try {
      // Créer une session Connect Bridge pour lier des comptes bancaires
      const session = await bridgeClient.createConnectSession(user.id, redirectUri);
      
      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          url: session.url,
          expires_at: session.expires_at,
        },
        message: 'Session de connexion bancaire créée avec succès',
        timestamp: new Date().toISOString(),
      });
    } catch (bridgeError) {
      return NextResponse.json({
        success: false,
        error: bridgeError instanceof Error ? bridgeError.message : 'Erreur Bridge API',
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Erreur création session Bridge:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
