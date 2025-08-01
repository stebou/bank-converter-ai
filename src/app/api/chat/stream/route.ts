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
  documentIds?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { message, conversationId, documents, conversationHistory } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    if (!conversationId) {
      return NextResponse.json({ error: 'ID de conversation requis' }, { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier que la conversation appartient à l'utilisateur
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation non trouvée' }, { status: 404 });
    }

    // Construire le contexte système
    const systemPrompt = `Tu es un assistant IA spécialisé dans l'analyse de documents financiers et bancaires. 
Tu aides les utilisateurs à comprendre leurs relevés bancaires, transactions, et données financières.

Réponds de manière claire, précise et professionnelle. Si tu ne peux pas répondre à une question, 
explique pourquoi et propose des alternatives.

Utilisateur actuel: ${user.name || user.email}
Nombre de documents disponibles: ${documents?.length || 0}`;

    // Ajouter le contexte des documents si disponibles
    let contextText = '';
    let referencedDocuments: string[] = [];

    if (documents && documents.length > 0) {
      // Pour chaque document, récupérer les transactions récentes
      const documentsData = await prisma.document.findMany({
        where: {
          id: { in: documents.map((d: { id: string }) => d.id) },
          userId: user.id,
        },
        include: {
          transactions: {
            take: 20, // Limiter pour éviter les tokens trop longs
            orderBy: { date: 'desc' }
          }
        }
      });

      if (documentsData.length > 0) {
        contextText = `
DOCUMENTS DISPONIBLES:
${documentsData.map(doc => `
- ${doc.originalName} (${doc.bankDetected || 'Banque non identifiée'})
  ${doc.totalTransactions} transactions, ${doc.anomaliesDetected} anomalies
  Date d'upload: ${doc.createdAt.toLocaleDateString('fr-FR')}
  Transactions récentes: ${doc.transactions.slice(0, 5).map(t => 
    `${t.date.toLocaleDateString('fr-FR')}: ${t.amount}€ - ${t.description}`
  ).join(', ')}
`).join('\n')}`;

        referencedDocuments = documentsData.map(doc => doc.id);
      }
    }

    // Construire l'historique de conversation
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt + (contextText ? `\n\nCONTEXTE DOCUMENTS:\n${contextText}` : '') }
    ];

    // Ajouter l'historique récent
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-8).forEach((msg: ChatMessage) => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Ajouter le message actuel
    messages.push({ role: 'user', content: message });

    // Créer un ReadableStream pour le streaming
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Sauvegarder le message utilisateur
          const userMessage = await prisma.conversationMessage.create({
            data: {
              conversationId,
              role: 'user',
              content: message,
              documentIds: referencedDocuments.length > 0 ? referencedDocuments : undefined,
            }
          });

          // Créer le stream OpenAI
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 1500,
            temperature: 0.7,
            stream: true,
          });

          let fullResponse = '';
          let messageId = '';

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            
            if (content) {
              fullResponse += content;
              
              // Envoyer le chunk au client
              const data = JSON.stringify({
                content,
                done: false
              });
              
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }

          // Sauvegarder la réponse complète
          const assistantMessage = await prisma.conversationMessage.create({
            data: {
              conversationId,
              role: 'assistant',
              content: fullResponse,
              documentIds: referencedDocuments.length > 0 ? referencedDocuments : undefined,
              referencedDocuments: referencedDocuments.length > 0 ? referencedDocuments : undefined,
            }
          });

          messageId = assistantMessage.id;

          // Mettre à jour la conversation
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { 
              lastMessageAt: new Date(),
              title: conversation.title === `Nouvelle conversation ${conversation.createdAt.toLocaleDateString('fr-FR')}` 
                ? message.substring(0, 50) + (message.length > 50 ? '...' : '')
                : conversation.title
            }
          });

          // Envoyer le message final
          const finalData = JSON.stringify({
            content: '',
            done: true,
            messageId,
            referencedDocuments: referencedDocuments.length > 0 ? referencedDocuments : null
          });
          
          controller.enqueue(new TextEncoder().encode(`data: ${finalData}\n\n`));
          controller.close();

        } catch (error) {
          console.error('[CHAT_STREAM_API] Error:', error);
          
          let errorMessage = 'Une erreur est survenue lors de la génération de la réponse.';
          
          if (error instanceof Error) {
            if (error.message.includes('429') || error.message.includes('quota')) {
              errorMessage = "⚠️ Quota OpenAI dépassé. Veuillez réessayer plus tard.";
            } else if (error.message.includes('API key')) {
              errorMessage = "❌ Configuration API manquante. Contactez l'administrateur.";
            }
          }

          // Sauvegarder le message d'erreur
          await prisma.conversationMessage.create({
            data: {
              conversationId,
              role: 'assistant',
              content: errorMessage,
            }
          });

          const errorData = JSON.stringify({
            content: errorMessage,
            done: true,
            error: true
          });
          
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('[CHAT_STREAM_API] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}