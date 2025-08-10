import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST - Supprimer plusieurs documents en lot
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
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const { documentIds } = await req.json();

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json(
        { error: 'Liste de documents invalide' },
        { status: 400 }
      );
    }

    // Vérifier que tous les documents appartiennent à l'utilisateur
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        userId: user.id,
      },
    });

    if (documents.length !== documentIds.length) {
      return NextResponse.json(
        { error: "Certains documents n'appartiennent pas à l'utilisateur" },
        { status: 403 }
      );
    }

    // Supprimer tous les documents et leurs données associées dans une transaction
    await prisma.$transaction([
      // Supprimer les transactions associées
      prisma.transaction.deleteMany({
        where: { documentId: { in: documentIds } },
      }),
      // Supprimer les messages de chat associés
      prisma.chatMessage.deleteMany({
        where: { documentId: { in: documentIds } },
      }),
      // Supprimer les messages de conversation associés (nouveau schéma)
      prisma.conversationMessage.deleteMany({
        where: {
          documentIds: {
            array_contains: documentIds,
          },
        },
      }),
      // Supprimer les documents eux-mêmes
      prisma.document.deleteMany({
        where: { id: { in: documentIds } },
      }),
      // Mettre à jour le compteur de documents utilisés
      prisma.user.update({
        where: { id: user.id },
        data: {
          documentsUsed: {
            decrement: documentIds.length,
          },
        },
      }),
    ]);

    console.log('[BULK_DELETE] Successfully deleted documents:', documentIds);

    return NextResponse.json({
      success: true,
      message: `${documentIds.length} document${documentIds.length > 1 ? 's' : ''} supprimé${documentIds.length > 1 ? 's' : ''} avec succès`,
      deletedCount: documentIds.length,
      documentIds: documentIds,
    });
  } catch (error) {
    console.error('[BULK_DELETE_ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression en lot' },
      { status: 500 }
    );
  }
}
