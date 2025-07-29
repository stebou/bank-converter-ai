// Dans : src/app/api/documents/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma'; // Assurez-vous que c'est bien `prisma` qui est exporté

export async function POST(req: NextRequest) {
  try {
    // La correction est ici : `await` est obligatoire
    const { userId } = await auth(); 

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé dans la base de données." }, { status: 404 });
    }

    if (user.documentsLimit <= 0) {
      return NextResponse.json({ error: "Crédits insuffisants pour analyser le document." }, { status: 402 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const [newDocument] = await prisma.$transaction([
      prisma.document.create({
        data: {
          userId: user.id,
          filename: file.name,
          status: 'PENDING_ANALYSIS',
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          documentsLimit: {
            decrement: 1,
          },
          documentsUsed: {
            increment: 1,
          },
        },
      }),
    ]);
    
    return NextResponse.json(newDocument, { status: 201 });

  } catch (error) {
    console.error('[DOCUMENTS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}