import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plan';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const WEBHOOK_MESSAGES = {
  NO_SIGNATURE: 'Aucune signature Stripe fournie.',
  SIGNATURE_VERIFICATION_FAILED: 'Échec de la vérification de la signature du webhook.',
  PROCESSING_FAILED: 'Le traitement du webhook a échoué.',
  SUCCESS: 'Webhook traité avec succès.'
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error(WEBHOOK_MESSAGES.NO_SIGNATURE);
      return NextResponse.json({ error: WEBHOOK_MESSAGES.NO_SIGNATURE }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error: unknown) { // --- CORRECTION 1 : Type 'any' remplacé par 'unknown' ---
      console.error(`❌ ${WEBHOOK_MESSAGES.SIGNATURE_VERIFICATION_FAILED}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during signature verification.';
      return NextResponse.json({ error: `${WEBHOOK_MESSAGES.SIGNATURE_VERIFICATION_FAILED}: ${errorMessage}` }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

        if (session.metadata?.userId && session.metadata?.planId && customerId && subscriptionId) {
          const planId = session.metadata.planId as keyof typeof PLANS;
          const plan = PLANS[planId];
          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'active',
              currentPlan: planId,
              documentsLimit: plan.documentsLimit,
            },
          });
          console.log(`✅ Abonnement activé pour l'utilisateur ${session.metadata.userId}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (subscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: 'active' },
          });
          console.log(`✅ Paiement réussi pour l'abonnement ${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof failedInvoice.subscription === 'string' ? failedInvoice.subscription : failedInvoice.subscription?.id;
        if (subscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: 'past_due' },
          });
          console.log(`❌ Échec de paiement pour l'abonnement ${subscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as Stripe.Subscription;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: deletedSub.id },
          data: {
            subscriptionStatus: 'canceled',
            currentPlan: 'free',
            documentsLimit: PLANS.free.documentsLimit,
          },
        });
        console.log(`🚫 Abonnement annulé : ${deletedSub.id}`);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ message: WEBHOOK_MESSAGES.SUCCESS, received: true });

  } catch (error: unknown) { // --- CORRECTION 2 : Type 'any' remplacé par 'unknown' ---
    console.error(`[STRIPE_WEBHOOK_ERROR] ${WEBHOOK_MESSAGES.PROCESSING_FAILED}`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during webhook processing.';
    return NextResponse.json(
      { error: WEBHOOK_MESSAGES.PROCESSING_FAILED, details: errorMessage },
      { status: 500 }
    );
  }
}