import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment completed:', session.id);

        // Récupérer les métadonnées
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId || !planId) {
          console.error('Missing metadata in session:', { userId, planId });
          break;
        }

        // Récupérer le plan depuis la base de données
        const plan = await prisma.plan.findUnique({
          where: { id: planId }
        });

        if (!plan) {
          console.error('Plan not found:', planId);
          break;
        }

        // Met à jour l'utilisateur avec le nouvel abonnement
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: 'active',
            currentPlan: plan.name,
            documentsLimit: {
              increment: plan.documentsLimit
            }
          }
        });

        // Enregistrer le paiement
        await prisma.payment.create({
          data: {
            userId: userId,
            planId: planId,
            stripeSessionId: session.id,
            amount: (session.amount_total || 0) / 100, // Stripe utilise les centimes
            currency: session.currency || 'eur',
            status: 'completed',
            description: `Achat du plan ${plan.name}`
          }
        });

        console.log('User subscription updated successfully');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        
        // Mettre à jour le statut de l'abonnement
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            subscriptionStatus: subscription.status
          }
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        
        // Réinitialiser l'abonnement de l'utilisateur
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            subscriptionStatus: 'cancelled',
            currentPlan: 'free',
            stripeSubscriptionId: null
          }
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed for subscription:', (invoice as any).subscription);
        
        // Marquer l'abonnement comme ayant un problème de paiement
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: (invoice as any).subscription as string },
          data: {
            subscriptionStatus: 'past_due'
          }
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}