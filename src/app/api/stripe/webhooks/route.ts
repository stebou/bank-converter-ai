import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

/**
 * Ce webhook est appelé par Stripe pour nous notifier des événements.
 * Nous nous concentrons ici sur `checkout.session.completed` pour les paiements uniques.
 */
export async function POST(req: NextRequest) {
  // On récupère le corps de la requête en tant que texte brut pour la vérification de la signature.
  const body = await req.text();

  // On récupère la signature Stripe depuis les en-têtes.
  // Dans les Route Handlers de Next.js, `headers()` est synchrone.
  const headerList = headers();
  const signature = (await headerList).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  // Étape 1 : Vérifier la signature pour s'assurer que la requête vient bien de Stripe.
try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    // Si la signature est invalide, on rejette la requête.
    // Le littéral de modèle ici est correctement formaté.
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue';
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  // Étape 2 : Gérer l'événement spécifique qui nous intéresse.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planId } = session.metadata || {};

    if (!userId || !planId) {
      // Sécurité : on ne fait rien si les informations nécessaires sont manquantes.
      return new NextResponse('Métadonnées userId ou planId manquantes', { status: 400 });
    }

    try {
      // On récupère les détails du plan acheté depuis notre propre base de données.
      const plan = await prisma.plan.findUnique({ where: { id: planId } });

      if (!plan) {
        console.error(`Webhook a reçu un paiement pour un plan inexistant. ID: ${planId}`);
        // On renvoie une erreur mais on répond 200 à Stripe pour ne pas qu'il réessaie.
        return new NextResponse(`Plan non trouvé: ${planId}`, { status: 404 });
      }

      // On met à jour les crédits de l'utilisateur.
      await prisma.user.update({
        where: { id: userId },
        data: { documentsLimit: { increment: plan.documentsLimit } },
      });

    } catch (error) {
      console.error("Erreur de base de données dans le webhook Stripe :", error);
      // En cas d'erreur de BDD, on veut que Stripe réessaie plus tard.
      return new NextResponse('Erreur de base de données lors de la mise à jour.', { status: 500 });
    }
  }

  // Étape 3 : Confirmer la bonne réception de l'événement à Stripe.
  return new NextResponse(null, { status: 200 });
}