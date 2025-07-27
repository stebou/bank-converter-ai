import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plan';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // ✅ Next.js 14 + Clerk moderne
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();
    
    // Validation du plan
    if (!planId || !(planId in PLANS)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    
    // ✅ Trouver ou créer l'utilisateur
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      // Créer l'utilisateur s'il n'existe pas
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: '', // Sera mis à jour par webhook Clerk
          name: '',
        }
      });
    }

    // ✅ Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: plan.stripePriceId,
        quantity: 1,
      }],
      success_url: `${req.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}