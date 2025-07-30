// Debug endpoint pour vérifier l'état des paiements et abonnements
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Vérifier les utilisateurs récents avec leurs infos Stripe
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        currentPlan: true,
        documentsLimit: true,
        documentsUsed: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Vérifier les paiements
    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { email: true } },
        plan: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Vérifier les plans disponibles
    const plans = await prisma.plan.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stripePriceId: true,
        _count: { select: { payments: true } }
      }
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'PRESENT' : 'MISSING',
        STRIPE_API_KEY: process.env.STRIPE_API_KEY ? 'PRESENT' : 'MISSING',
      },
      users_count: users.length,
      users: users,
      payments_count: payments.length,
      payments: payments,
      plans: plans
    });

  } catch (error: unknown) {
    console.error('[DEBUG] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}