// API pour récupérer l'historique des conversations
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les messages récents
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limiter à 50 derniers messages
      include: {
        document: {
          select: {
            id: true,
            originalName: true,
            filename: true,
          },
        },
      },
    });

    // Inverser l'ordre pour avoir les plus anciens en premier
    const formattedMessages = messages.reverse().map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      documentId: msg.documentId,
      createdAt: msg.createdAt.toISOString(),
      document: msg.document
        ? {
            id: msg.document.id,
            name: msg.document.originalName || msg.document.filename,
          }
        : null,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error: unknown) {
    console.error('[CHAT_HISTORY] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
