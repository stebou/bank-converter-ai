import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { documentId } = await params;

    // Vérifier que le document appartient à l'utilisateur
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        user: {
          clerkId: user.id,
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les transactions du document
    const transactions = await prisma.transaction.findMany({
      where: {
        documentId: documentId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    console.log(
      `[TRANSACTIONS_API] Retrieved ${transactions.length} transactions for document ${documentId}`
    );

    return NextResponse.json(
      {
        success: true,
        transactions: transactions,
        document: {
          id: document.id,
          filename: document.filename,
          bankDetected: document.bankDetected,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[TRANSACTIONS_API] Error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
