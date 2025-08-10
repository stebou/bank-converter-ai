// Fichier : src/app/api/stripe/checkout/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const dashboardUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    // 1. On récupère le planId envoyé par le client
    const { planId } = await req.json();

    if (!userId) {
      return new NextResponse('Non autorisé', { status: 401 });
    }
    if (!planId) {
      return new NextResponse('ID de plan manquant', { status: 400 });
    }

    // 2. On va chercher l'utilisateur ET le plan dans la base de données
    const [user, plan] = await Promise.all([
      prisma.user.findUnique({ where: { clerkId: userId } }),
      prisma.plan.findUnique({ where: { id: planId } }),
    ]);

    if (!user) {
      return new NextResponse('Utilisateur non trouvé', { status: 404 });
    }
    if (!plan) {
      return new NextResponse('Plan non trouvé dans la base de données', {
        status: 404,
      });
    }

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email! });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // 3. On crée la session de paiement avec les informations DYNAMIQUES du plan
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription', // Mode abonnement
      // LA CORRECTION EST ICI : On utilise `plan.stripePriceId` de notre BDD
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      metadata: {
        userId: user.id,
        planId: plan.id, // On passe l'ID de notre plan au webhook
      },
      success_url: `${dashboardUrl.origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${dashboardUrl.origin}/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
