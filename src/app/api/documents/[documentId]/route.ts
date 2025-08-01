import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer le contenu détaillé d'un document spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const { documentId } = await params;

    // Récupérer le document avec ses transactions
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      id: document.id,
      filename: document.filename,
      originalName: document.originalName,
      extractedText: document.extractedText,
      bankDetected: document.bankDetected,
      totalTransactions: document.totalTransactions,
      aiConfidence: document.aiConfidence,
      anomaliesDetected: document.anomaliesDetected,
      status: document.status,
      createdAt: document.createdAt.toISOString(),
      transactions: document.transactions.map(t => ({
        id: t.id,
        date: t.date.toISOString(),
        amount: t.amount,
        description: t.description,
        originalDesc: t.originalDesc,
        category: t.category,
        subcategory: t.subcategory,
        aiConfidence: t.aiConfidence,
        anomalyScore: t.anomalyScore,
      }))
    });

  } catch (error) {
    console.error('[DOCUMENT_DETAIL_ERROR]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un document et toutes ses données associées
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const { documentId } = await params;

    // Vérifier que le document appartient à l'utilisateur
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.id,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 });
    }

    // Supprimer le document et toutes ses données associées dans une transaction
    await prisma.$transaction([
      // Supprimer les transactions associées
      prisma.transaction.deleteMany({
        where: { documentId: documentId }
      }),
      // Supprimer les messages de chat associés (si applicable)
      prisma.chatMessage.deleteMany({
        where: { documentId: documentId }
      }),
      // Supprimer le document lui-même
      prisma.document.delete({
        where: { id: documentId }
      }),
      // Mettre à jour le compteur de documents utilisés (sans rendre de crédit)
      prisma.user.update({
        where: { id: user.id },
        data: {
          documentsUsed: {
            decrement: 1,
          },
        },
      }),
    ]);

    console.log('[DOCUMENT_DELETE] Successfully deleted document:', documentId);

    return NextResponse.json({
      success: true,
      message: 'Document supprimé avec succès',
      documentId: documentId
    });

  } catch (error) {
    console.error('[DOCUMENT_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}