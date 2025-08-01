import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: [
        { isFavorite: 'desc' },
        { lastMessageAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        isFavorite: true,
        lastMessageAt: true,
        createdAt: true,
        _count: {
          select: { messages: true }
        }
      }
    });

    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      isFavorite: conv.isFavorite,
      lastMessageAt: conv.lastMessageAt.toISOString(),
      createdAt: conv.createdAt.toISOString(),
      messageCount: conv._count.messages
    }));

    return NextResponse.json(formattedConversations);

  } catch (error) {
    console.error('[CONVERSATIONS_API] Error:', error);
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
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const { title } = await req.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Titre requis' }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: title.trim(),
        isFavorite: false,
        lastMessageAt: new Date(),
      }
    });

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      isFavorite: conversation.isFavorite,
      lastMessageAt: conversation.lastMessageAt.toISOString(),
      createdAt: conversation.createdAt.toISOString(),
      messageCount: 0
    });

  } catch (error) {
    console.error('[CONVERSATIONS_API] Error creating conversation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}