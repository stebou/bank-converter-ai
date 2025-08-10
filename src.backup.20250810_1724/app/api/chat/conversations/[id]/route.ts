import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const { id: conversationId } = await context.params;
    const body = await req.json();

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Construire les données à mettre à jour
    const updateData: {
      title?: string;
      updatedAt?: Date;
      isFavorite?: boolean;
    } = {};

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json({ error: 'Titre invalide' }, { status: 400 });
      }
      updateData.title = body.title.trim();
    }

    if (body.isFavorite !== undefined) {
      if (typeof body.isFavorite !== 'boolean') {
        return NextResponse.json(
          { error: 'isFavorite doit être un booléen' },
          { status: 400 }
        );
      }
      updateData.isFavorite = body.isFavorite;
    }

    // Mettre à jour la conversation
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedConversation.id,
      title: updatedConversation.title,
      isFavorite: updatedConversation.isFavorite,
      lastMessageAt: updatedConversation.lastMessageAt.toISOString(),
      createdAt: updatedConversation.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[CONVERSATION_UPDATE_API] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const { id: conversationId } = await context.params;

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la conversation et ses messages (cascade)
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CONVERSATION_DELETE_API] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
