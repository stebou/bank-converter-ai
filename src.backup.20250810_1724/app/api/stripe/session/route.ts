// API pour récupérer les détails d'une session Stripe
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Récupérer les détails de la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.userId || !session.metadata?.planId) {
      return NextResponse.json(
        { error: 'Invalid session metadata' },
        { status: 400 }
      );
    }

    // Récupérer les détails du plan depuis notre base de données
    const plan = await prisma.plan.findUnique({
      where: { id: session.metadata.planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
      },
      plan: {
        name: plan.name,
        price: plan.price,
        description: plan.description,
      },
    });
  } catch (error: unknown) {
    console.error('[STRIPE_SESSION] Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
