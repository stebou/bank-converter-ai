import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { planId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur et le plan
    const [user, plan] = await Promise.all([
      prisma.user.findUnique({ where: { clerkId: userId } }),
      prisma.plan.findUnique({ where: { id: planId } }),
    ]);

    if (!user || !plan) {
      return NextResponse.json(
        {
          error: 'Utilisateur ou plan non trouvé',
        },
        { status: 404 }
      );
    }

    // Simuler l'activation d'un abonnement
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentPlan: plan.name,
        subscriptionStatus: 'active',
        // Garder la limite pour référence mais ne plus l'utiliser comme contrainte
        documentsLimit: plan.documentsLimit,
        // Réinitialiser le compteur d'utilisation
        documentsUsed: 0,
      },
    });

    console.log(
      `[TEST] Simulated purchase: User ${userId} -> Plan ${plan.name}`
    );

    return NextResponse.json({
      success: true,
      message: 'Purchase simulated successfully',
      plan: plan.name,
    });
  } catch (error) {
    console.error('[SIMULATE_PURCHASE_ERROR]', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la simulation',
      },
      { status: 500 }
    );
  }
}
