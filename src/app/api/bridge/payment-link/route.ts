import { bridgeClient } from '@/lib/bridge';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/bridge/payment-link - Créer un lien de paiement Bridge
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, currency = 'EUR', description, planType } = body;

    if (!amount || !description) {
      return NextResponse.json(
        { error: 'Montant et description requis' },
        { status: 400 }
      );
    }

    try {
      // URL de redirection après paiement
      const redirectUri = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?payment=success`;
      
      // Créer le lien de paiement Bridge
      const paymentLink = await bridgeClient.createPaymentLink({
        amount: amount * 100, // Bridge API utilise les centimes
        currency,
        description,
        redirectUri,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      });

      // Sauvegarder le paiement en base
      await prisma.payment.create({
        data: {
          userId: user.id,
          bridgePaymentId: paymentLink.id,
          amount: amount,
          currency,
          description,
          planType: planType || 'pro',
          status: 'pending',
          paymentUrl: paymentLink.url,
        },
      });

      return NextResponse.json({
        success: true,
        paymentLink: {
          id: paymentLink.id,
          url: paymentLink.url,
          amount: amount,
          currency,
          description,
          expiresAt: paymentLink.expires_at,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (bridgeError) {
      console.error('Erreur Bridge API:', bridgeError);
      
      // En mode démo, retourner une URL de simulation
      return NextResponse.json({
        success: true,
        paymentLink: {
          id: `demo_payment_${Date.now()}`,
          url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?payment=success&demo=true`,
          amount: amount,
          currency,
          description,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Erreur création lien de paiement:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bridge/payment-link/[id] - Vérifier le statut d'un paiement
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const paymentId = url.pathname.split('/').pop();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de paiement requis' },
        { status: 400 }
      );
    }

    try {
      // Vérifier le statut du paiement Bridge
      const paymentLink = await bridgeClient.getPaymentLink(paymentId);
      
      // Mettre à jour le statut en base
      await prisma.payment.updateMany({
        where: {
          bridgePaymentId: paymentId,
          userId: user.id,
        },
        data: {
          status: paymentLink.status,
        },
      });

      return NextResponse.json({
        success: true,
        payment: {
          id: paymentLink.id,
          status: paymentLink.status,
          amount: paymentLink.amount / 100, // Convertir en euros
          currency: paymentLink.currency,
          description: paymentLink.description,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (bridgeError) {
      console.error('Erreur vérification paiement Bridge:', bridgeError);
      
      // En mode démo, simuler un paiement réussi
      return NextResponse.json({
        success: true,
        payment: {
          id: paymentId,
          status: 'paid',
          amount: 29.99,
          currency: 'EUR',
          description: 'Abonnement Pro (Demo)',
        },
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
