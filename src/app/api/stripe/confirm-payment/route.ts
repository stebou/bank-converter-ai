import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { paymentIntentId, planId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (!paymentIntentId || !planId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier le PaymentIntent avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ 
        error: 'Le paiement n\'a pas été validé' 
      }, { status: 400 });
    }

    // Récupérer l'utilisateur et le plan
    const [user, plan] = await Promise.all([
      prisma.user.findUnique({ where: { clerkId: userId } }),
      prisma.plan.findUnique({ where: { id: planId } })
    ]);

    if (!user || !plan) {
      return NextResponse.json({ 
        error: 'Utilisateur ou plan non trouvé' 
      }, { status: 404 });
    }

    // Transaction atomique pour mettre à jour l'utilisateur et créer le paiement
    await prisma.$transaction([
      // Mettre à jour l'utilisateur
      prisma.user.update({
        where: { id: user.id },
        data: {
          currentPlan: plan.name,
          subscriptionStatus: 'active',
          documentsLimit: {
            increment: plan.documentsLimit
          },
        }
      }),
      // Enregistrer le paiement
      prisma.payment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          amount: paymentIntent.amount / 100, // Convertir de centimes à euros
          currency: paymentIntent.currency,
          status: 'completed',
          description: `Achat du plan ${plan.name}`,
          createdAt: new Date()
        }
      })
    ]);

    console.log(`[PAYMENT_CONFIRMED] User ${userId} purchased plan ${plan.name}`);

    return NextResponse.json({
      success: true,
      message: 'Paiement confirmé et plan activé'
    });

  } catch (error) {
    console.error('[CONFIRM_PAYMENT_ERROR]', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la confirmation du paiement' 
    }, { status: 500 });
  }
}