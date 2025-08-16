// API de documents unifiée - utilise les services centralisés

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { processDocument } from '@/lib/services/document-processor';

// GET - Récupérer la liste des documents de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    console.log('[DOCUMENTS_GET] === STARTING REQUEST ===');
    console.log(
      '[DOCUMENTS_GET] Request headers:',
      Object.fromEntries(req.headers.entries())
    );

    const { userId } = await auth();
    console.log('[DOCUMENTS_GET] Clerk userId after auth():', userId);

    if (!userId) {
      console.log('[DOCUMENTS_GET] ❌ No userId found - returning 401');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log(
      '[DOCUMENTS_GET] ✅ User authenticated, looking up in database...'
    );

    // Utiliser une requête relationnelle comme dans le dashboard principal
    const userDocuments = await prisma.document.findMany({
      where: {
        user: {
          clerkId: userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        originalName: true,
        createdAt: true,
        bankDetected: true,
        totalTransactions: true,
        aiConfidence: true,
        anomaliesDetected: true,
        status: true,
        fileSize: true,
      },
    });

    console.log(
      '[DOCUMENTS_GET] 📊 Documents found via relation:',
      userDocuments.length
    );

    if (userDocuments.length > 0) {
      console.log('[DOCUMENTS_GET] First document sample:', {
        id: userDocuments[0].id,
        originalName: userDocuments[0].originalName,
        bankDetected: userDocuments[0].bankDetected,
        totalTransactions: userDocuments[0].totalTransactions,
      });
    }

    const formattedDocuments = userDocuments.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      originalName: doc.originalName,
      createdAt: doc.createdAt.toISOString(),
      bankDetected: doc.bankDetected,
      totalTransactions: doc.totalTransactions || 0,
      aiConfidence: doc.aiConfidence,
      anomaliesDetected: doc.anomaliesDetected || 0,
      status: doc.status,
    }));

    console.log(
      '[DOCUMENTS_GET] ✅ Returning',
      formattedDocuments.length,
      'documents'
    );
    return NextResponse.json(formattedDocuments);
  } catch (error) {
    console.error('[DOCUMENTS_GET_ERROR] ❌ Unexpected error:', error);
    console.error(
      '[DOCUMENTS_GET_ERROR] Stack trace:',
      error instanceof Error ? error.stack : 'No stack'
    );
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé dans la base de données.' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log(
      '[DOCUMENTS_API] Processing file:',
      file.name,
      file.size,
      file.type
    );

    // Traitement unifié avec le nouveau service
    const result = await processDocument(file, true); // saveToDatabase = true

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
      '[DOCUMENTS_API] Document processed successfully:',
      data.bankDetected,
      data.totalTransactions,
      'transactions'
    );

    // Retourner la réponse avec le même format que l'ancienne API
    return NextResponse.json(
      {
        id: data.documentId,
        filename: file.name,
        originalName: file.name,
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
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[DOCUMENTS_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}