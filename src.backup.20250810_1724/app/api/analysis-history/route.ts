// API Route pour la gestion de l'historique des analyses

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, analysisType, analysisData } = body;

    console.log('[ANALYSIS-HISTORY] Action:', action, 'Type:', analysisType);

    if (action === 'save') {
      // Pour l'instant, on retourne juste un succès car la sauvegarde se fait côté client dans localStorage
      // Dans le futur, on pourrait sauvegarder en base de données ici

      return NextResponse.json({
        success: true,
        message: 'Analyse sauvegardée avec succès',
        analysis_id: `${analysisType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'list') {
      // Pour l'instant, on retourne un message indiquant que les données sont côté client
      return NextResponse.json({
        success: true,
        message: 'Les analyses sont stockées localement sur le client',
        storage_type: 'localStorage',
        note: 'Utilisez AnalysisStorage côté client pour récupérer les données',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Action non supportée' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[ANALYSIS-HISTORY] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Pour l'instant, juste un endpoint de status
    return NextResponse.json({
      success: true,
      status: 'active',
      storage_info: {
        type: 'localStorage',
        location: 'client-side',
        max_analyses: 50,
        auto_cleanup: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ANALYSIS-HISTORY] Status check failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la vérification du statut',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
