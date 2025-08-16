// API de validation de documents pour utilisateurs non connectés - utilise les services centralisés

import { NextRequest, NextResponse } from 'next/server';
import { processDocument } from '@/lib/services/document-processor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log(
      '[VALIDATE_DOCUMENT] Processing file:',
      file.name,
      file.size,
      file.type
    );

    // Traitement unifié avec le nouveau service
    // saveToDatabase = false pour les utilisateurs non connectés
    const result = await processDocument(file, false);

    if (!result.success) {
      // Gestion des erreurs avec le nouveau format unifié
      if (result.error?.type === 'DOCUMENT_REJECTED') {
        return NextResponse.json(
          {
            error: 'DOCUMENT_REJECTED',
            message: result.error.message,
            documentType: result.error.documentType || 'autre',
          },
          { status: 400 }
        );
      } else if (result.error?.type === 'INVALID_FILE') {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: result.error?.message || 'Erreur de traitement' },
          { status: 500 }
        );
      }
    }

    // Document traité avec succès
    const data = result.data!;
    console.log(
      '[VALIDATE_DOCUMENT] Document processed successfully:',
      data.bankDetected,
      data.totalTransactions,
      'transactions'
    );

    // Retourner la réponse avec le même format que l'ancienne API
    return NextResponse.json(
      {
        success: true,
        bankDetected: data.bankDetected,
        totalTransactions: data.totalTransactions,
        anomaliesDetected: data.anomaliesDetected,
        aiConfidence: data.aiConfidence,
        documentType: data.documentType,
        hasExtractedText: data.hasExtractedText,
        extractedTextLength: data.extractedTextLength,
        analysisMethod: data.analysisMethod,
        integratedProcessing: data.integratedProcessing,
        transactions: data.transactions,
        processingTime: data.processingTime,
        aiCost: data.aiCost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[VALIDATE_DOCUMENT_ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}