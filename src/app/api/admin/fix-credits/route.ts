// API d'administration pour corriger les crédits des utilisateurs existants
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('[ADMIN] Starting credit fix for existing subscribers...');

    // Trouver tous les utilisateurs avec un abonnement actif mais des crédits incorrects
    const usersToFix = await prisma.user.findMany({
      where: {
        subscriptionStatus: 'active',
        currentPlan: {
          not: 'free'
        }
      },
      include: {
        payments: {
          include: {
            plan: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    console.log(`[ADMIN] Found ${usersToFix.length} users with active subscriptions`);

    const fixes = [];

    for (const user of usersToFix) {
      const latestPayment = user.payments[0];
      
      if (latestPayment && latestPayment.plan) {
        const expectedCredits = latestPayment.plan.documentsLimit;
        const currentCredits = user.documentsLimit;
        
        if (currentCredits < expectedCredits) {
          // Corriger les crédits
          await prisma.user.update({
            where: { id: user.id },
            data: {
              documentsLimit: expectedCredits,
              documentsUsed: user.documentsUsed // Garder l'utilisation actuelle
            }
          });

          fixes.push({
            userId: user.id,
            email: user.email,
            plan: latestPayment.plan.name,
            creditsBefore: currentCredits,
            creditsAfter: expectedCredits,
            used: user.documentsUsed
          });

          console.log(`[ADMIN] Fixed credits for ${user.email}: ${currentCredits} -> ${expectedCredits}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed credits for ${fixes.length} users`,
      fixes: fixes,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('[ADMIN] Error fixing credits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}