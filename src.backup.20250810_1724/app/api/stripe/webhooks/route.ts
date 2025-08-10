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
  // Dans Next.js 15, headers() retourne une Promise
  const headerList = await headers();
  const signature = headerList.get('Stripe-Signature') as string;

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

  console.log(`[STRIPE_WEBHOOK] Received event: ${event.type}`);

  // Étape 2 : Gérer les différents événements
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planId } = session.metadata || {};

    if (!userId || !planId) {
      console.error('[STRIPE_WEBHOOK] Missing metadata:', { userId, planId });
      return new NextResponse('Métadonnées userId ou planId manquantes', {
        status: 400,
      });
    }

    try {
      // Récupérer les détails du plan et de l'utilisateur
      const [user, plan] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.plan.findUnique({ where: { id: planId } }),
      ]);

      if (!user || !plan) {
        console.error(`[STRIPE_WEBHOOK] User or plan not found:`, {
          userId,
          planId,
        });
        return new NextResponse(`User or plan not found`, { status: 404 });
      }

      // Mettre à jour le customer ID si pas déjà fait
      if (!user.stripeCustomerId && session.customer) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: session.customer as string },
        });
      }

      // Si c'est un abonnement, activer le plan
      if (session.mode === 'subscription' && session.subscription) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            currentPlan: plan.name,
            // Garder la limite de documents pour référence/historique mais ne plus l'utiliser comme contrainte
            documentsLimit: plan.documentsLimit,
            // Réinitialiser le compteur d'utilisation pour le nouvel abonnement
            documentsUsed: 0,
          },
        });
        console.log(
          `[STRIPE_WEBHOOK] Subscription activated for user ${userId} with plan ${plan.name}`
        );
      } else {
        // Plus de paiements uniques - système d'abonnement pur
        console.log(
          `[STRIPE_WEBHOOK] Unsupported payment mode: ${session.mode}. Only subscriptions are supported.`
        );
        return new NextResponse('Only subscription payments are supported', {
          status: 400,
        });
      }

      // Créer un enregistrement de paiement
      await prisma.payment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          stripeSessionId: session.id,
          amount: (session.amount_total || 0) / 100, // Convertir de centimes en euros
          currency: session.currency || 'eur',
          status: 'completed',
          description: `Achat du plan: ${plan.name}`,
        },
      });
    } catch (error) {
      console.error('[STRIPE_WEBHOOK] Database error:', error);
      return new NextResponse(
        'Erreur de base de données lors de la mise à jour.',
        { status: 500 }
      );
    }
  }

  // Gérer les événements d'abonnement
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;

    try {
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          subscriptionStatus: subscription.status,
        },
      });
      console.log(
        `[STRIPE_WEBHOOK] Subscription ${subscription.id} updated to ${subscription.status}`
      );
    } catch (error) {
      console.error('[STRIPE_WEBHOOK] Error updating subscription:', error);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;

    try {
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          subscriptionStatus: 'cancelled',
          stripeSubscriptionId: null,
        },
      });
      console.log(`[STRIPE_WEBHOOK] Subscription ${subscription.id} cancelled`);
    } catch (error) {
      console.error('[STRIPE_WEBHOOK] Error cancelling subscription:', error);
    }
  }

  // Étape 3 : Confirmer la bonne réception de l'événement à Stripe.
  return new NextResponse(null, { status: 200 });
}
