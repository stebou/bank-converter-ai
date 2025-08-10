import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Servir le fichier PDF original depuis la base de données
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
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const { documentId } = await params;

    // Récupérer le document avec son contenu binaire
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.id,
      },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        fileContent: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    if (!document.fileContent) {
      return NextResponse.json(
        { error: 'Contenu du fichier non disponible' },
        { status: 404 }
      );
    }

    // Retourner le fichier PDF avec les headers appropriés
    return new NextResponse(document.fileContent, {
      status: 200,
      headers: {
        'Content-Type': document.mimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${document.originalName}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[PDF_SERVE_ERROR]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
