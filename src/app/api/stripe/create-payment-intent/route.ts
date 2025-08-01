import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { planId, amount } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (!planId || !amount) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier que l'utilisateur et le plan existent
    const [user, plan] = await Promise.all([
      prisma.user.findUnique({ where: { clerkId: userId } }),
      prisma.plan.findUnique({ where: { id: planId } })
    ]);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (!plan) {
      return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 });
    }

    // Créer ou récupérer le customer Stripe
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
          clerkId: userId
        }
      });
      stripeCustomerId = customer.id;

      // Mettre à jour l'utilisateur avec le customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId }
      });
    }

    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Montant en centimes
      currency: 'eur',
      customer: stripeCustomerId,
      metadata: {
        planId: plan.id,
        userId: user.id,
        clerkId: userId
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('[CREATE_PAYMENT_INTENT_ERROR]', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création du paiement' 
    }, { status: 500 });
  }
}