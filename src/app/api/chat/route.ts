// API de chat intelligent avec OpenAI
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  documentId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { message, documentId, conversationHistory } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // Récupérer l'utilisateur pour vérifier les crédits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Construire le contexte
    let systemPrompt = `Tu es un assistant IA spécialisé dans l'analyse de documents financiers et bancaires. 
Tu aides les utilisateurs à comprendre leurs relevés bancaires, transactions, et données financières.

Réponds de manière claire, précise et professionnelle. Si tu ne peux pas répondre à une question, 
explique pourquoi et propose des alternatives.

Utilisateur actuel: ${user.name || user.email}`;

    let contextText = '';

    // Si une question spécifique à un document
    if (documentId) {
      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          userId: user.id,
        },
        include: {
          transactions: {
            take: 50, // Limiter pour éviter les tokens trop longs
            orderBy: { date: 'desc' }
          }
        }
      });

      if (!document) {
        return NextResponse.json({ 
          error: 'Document non trouvé ou non autorisé' 
        }, { status: 404 });
      }

      // Ajouter le contexte du document
      contextText = `
DOCUMENT ANALYSÉ: ${document.originalName}
Banque détectée: ${document.bankDetected || 'Non identifiée'}
Nombre de transactions: ${document.totalTransactions}
Anomalies détectées: ${document.anomaliesDetected}
Date d'upload: ${document.createdAt.toLocaleDateString('fr-FR')}

TRANSACTIONS RÉCENTES:
${document.transactions.map(t => 
  `- ${t.date.toLocaleDateString('fr-FR')}: ${t.amount}€ - ${t.description}`
).join('\n')}

${document.extractedText ? `CONTENU EXTRAIT:\n${document.extractedText.substring(0, 2000)}...` : ''}
`;

      systemPrompt += `\n\nTu analyses spécifiquement le document "${document.originalName}".`;
    }

    // Construire l'historique de conversation
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt + (contextText ? `\n\nCONTEXTE:\n${contextText}` : '') }
    ];

    // Ajouter l'historique récent
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-6).forEach((msg: ChatMessage) => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Ajouter le message actuel
    messages.push({ role: 'user', content: message });

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('Pas de réponse de l\'IA');
    }

    // Calculer le coût approximatif
    const tokensUsed = completion.usage?.total_tokens || 0;
    const estimatedCost = (tokensUsed / 1000) * 0.0015; // Prix approximatif GPT-4o-mini

    // Sauvegarder les messages en base
    await prisma.$transaction([
      // Message utilisateur
      prisma.chatMessage.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          role: 'user',
          content: message,
          tokens: Math.floor(tokensUsed * 0.3), // Estimation pour le message utilisateur
        }
      }),
      // Réponse assistant
      prisma.chatMessage.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          role: 'assistant',
          content: aiResponse,
          tokens: Math.floor(tokensUsed * 0.7), // Estimation pour la réponse
          cost: estimatedCost,
        }
      })
    ]);

    return NextResponse.json({
      content: aiResponse,
      tokensUsed,
      cost: estimatedCost,
      documentContext: documentId ? true : false,
    });

  } catch (error: unknown) {
    console.error('[CHAT_API] Error:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json({ 
        error: 'Configuration IA manquante' 
      }, { status: 500 });
    }

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ 
      error: `Erreur du service IA: ${errorMessage}` 
    }, { status: 500 });
  }
}