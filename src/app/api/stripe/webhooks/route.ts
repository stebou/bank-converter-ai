import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plan';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    // ✅ Next.js 14 App Router - Bonne méthode
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe signature found');
      return NextResponse.json(
        { error: 'No signature provided' }, 
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // ✅ Vérification signature Stripe
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` }, 
        { status: 400 }
      );
    }

    console.log(`Processing event: ${event.type}`);

    // ✅ Gestion des événements Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.userId && session.metadata?.planId) {
          const planId = session.metadata.planId as keyof typeof PLANS;
          const plan = PLANS[planId];
          
          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: 'active',
              currentPlan: planId,
              documentsLimit: plan.documentsLimit
            }
          });

          console.log(`✅ Subscription activated for user ${session.metadata.userId}`);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        
        // ✅ Gestion correcte du type selon documentation officielle
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id;
          
        if (subscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: 'active' }
          });
          
          console.log(`✅ Payment succeeded for subscription ${subscriptionId}`);
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        
        // ✅ Gestion correcte du type selon documentation officielle
        const failedSubscriptionId = typeof failedInvoice.subscription === 'string' 
          ? failedInvoice.subscription 
          : failedInvoice.subscription?.id;
          
        if (failedSubscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: failedSubscriptionId },
            data: { subscriptionStatus: 'past_due' }
          });
          
          console.log(`❌ Payment failed for subscription ${failedSubscriptionId}`);
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription;
        
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: deletedSub.id },
          data: { 
            subscriptionStatus: 'canceled',
            currentPlan: 'free',
            documentsLimit: PLANS.free.documentsLimit
          }
        });
        
        console.log(`🚫 Subscription canceled: ${deletedSub.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    );
  }
}