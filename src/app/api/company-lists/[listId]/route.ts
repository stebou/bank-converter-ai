import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Supprimer une liste d'entreprises
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { listId } = await params;

    // Vérifier que la liste existe et appartient à l'utilisateur
    const existingList = await prisma.companyList.findFirst({
      where: {
        id: listId,
        user: {
          clerkId: userId,
        },
      },
    });

    if (!existingList) {
      return NextResponse.json({ error: 'Liste non trouvée' }, { status: 404 });
    }

    // Supprimer toutes les entreprises de la liste en premier
    await prisma.company.deleteMany({
      where: {
        companyListId: listId,
      },
    });

    // Supprimer tous les tags de la liste
    await prisma.tag.deleteMany({
      where: {
        companyListId: listId,
      },
    });

    // Supprimer la liste elle-même
    await prisma.companyList.delete({
      where: {
        id: listId,
      },
    });

    return NextResponse.json(
      { message: 'Liste supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la liste:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * Mettre à jour une liste d'entreprises
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { listId } = await params;
    const body = await request.json();
    const { name, description, color } = body;

    // Vérifier que la liste existe et appartient à l'utilisateur
    const existingList = await prisma.companyList.findFirst({
      where: {
        id: listId,
        user: {
          clerkId: userId,
        },
      },
    });

    if (!existingList) {
      return NextResponse.json({ error: 'Liste non trouvée' }, { status: 404 });
    }

    // Mettre à jour la liste
    const updatedList = await prisma.companyList.update({
      where: {
        id: listId,
      },
      data: {
        name: name || existingList.name,
        description: description || existingList.description,
        color: color || existingList.color,
      },
    });

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la liste:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * Récupérer une liste d'entreprises spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { listId } = await params;

    // Récupérer la liste avec ses entreprises et tags
    const list = await prisma.companyList.findFirst({
      where: {
        id: listId,
        user: {
          clerkId: userId,
        },
      },
      include: {
        companies: {
          orderBy: {
            addedAt: 'desc',
          },
        },
        tags: {
          orderBy: {
            name: 'asc',
          },
        },
        _count: {
          select: {
            companies: true,
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: 'Liste non trouvée' }, { status: 404 });
    }

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
