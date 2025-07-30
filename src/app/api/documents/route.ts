// Dans : src/app/api/documents/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
// Import dynamique sera fait dans la fonction

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

    // Extraire le texte du PDF si c'est un PDF
    let extractedText: string | null = null;
    if (file.type === 'application/pdf') {
      try {
        // Import dynamique pour éviter les erreurs de build
        const pdfParse = (await import('pdf-parse')).default;
        const buffer = await file.arrayBuffer();
        const pdfData = await pdfParse(Buffer.from(buffer));
        extractedText = pdfData.text;
        console.log('[PDF_EXTRACTION] Extracted text length:', extractedText.length);
      } catch (error) {
        console.error('[PDF_EXTRACTION] Error extracting PDF text:', error);
        // Continue without extracted text
      }
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
          extractedText: extractedText,
          // Données simulées pour la démonstration
          aiConfidence: Math.random() * 30 + 70, // 70-100%
          anomaliesDetected: Math.floor(Math.random() * 3),
          totalTransactions: Math.floor(Math.random() * 50) + 10,
          bankDetected: ['BNP Paribas', 'Crédit Agricole', 'LCL', 'Société Générale'][Math.floor(Math.random() * 4)],
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
    
    return NextResponse.json({
      ...newDocument,
      hasExtractedText: !!extractedText,
      extractedTextLength: extractedText?.length || 0,
    }, { status: 201 });

  } catch (error) {
    console.error('[DOCUMENTS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}