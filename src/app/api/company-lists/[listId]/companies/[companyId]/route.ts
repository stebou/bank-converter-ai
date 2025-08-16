import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { listId: string; companyId: string } }
) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { listId, companyId } = params;

    // Vérifier que la liste appartient à l'utilisateur
    const list = await prisma.companyList.findFirst({
      where: {
        id: listId,
        user: {
          clerkId: userId,
        },
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: 'Liste non trouvée ou accès non autorisé' },
        { status: 404 }
      );
    }

    // Vérifier que l'entreprise existe dans cette liste
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        companyListId: listId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Entreprise non trouvée dans cette liste' },
        { status: 404 }
      );
    }

    // Supprimer l'entreprise
    await prisma.company.delete({
      where: {
        id: companyId,
      },
    });

    return NextResponse.json({
      message: 'Entreprise supprimée avec succès',
      deletedCompanyId: companyId,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression de l'entreprise" },
      { status: 500 }
    );
  }
}
