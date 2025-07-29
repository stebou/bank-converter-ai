import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plan';
import { NextRequest, NextResponse } from 'next/server';

// Bonne pratique : Centraliser les messages pour éviter les chaînes de caractères "magiques"
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Accès non autorisé.',
  INVALID_PLAN: 'Le plan sélectionné est invalide.',
  INTERNAL_SERVER_ERROR: 'Une erreur interne est survenue.',
  STRIPE_URL_MISSING: "La création de la session Stripe n'a pas retourné d'URL."
};

/**
 * Interface définissant la structure attendue du corps de la requête POST.
 * Cela permet de typer le résultat de req.json() et d'éviter l'erreur `no-explicit-any`.
 */
interface CheckoutRequestBody {
  planId: string;
}

/**
 * Récupère un utilisateur depuis la base de données ou le crée s'il n'existe pas encore.
 * Cette fonction est réutilisable et clarifie la logique de la fonction POST.
 * @param clerkId - L'ID de l'utilisateur fourni par Clerk.
 * @returns L'objet utilisateur de la base de données.
 */
async function getOrCreateUserInDb(clerkId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) {
    return existingUser;
  }

  // Crée l'utilisateur avec des valeurs par défaut.
  // Le webhook de Clerk se chargera de mettre à jour l'e-mail et le nom plus tard.
  const newUser = await prisma.user.create({
    data: {
      clerkId,
      email: '',
      name: '',
    },
  });

  return newUser;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    // --- CORRECTION APPLIQUÉE ICI ---
    // On déstructure directement `planId` et on type le corps de la requête avec notre interface.
    // Cela remplace les deux lignes précédentes et résout l'erreur ESLint.
    const { planId } = await req.json() as CheckoutRequestBody;

    // Vérifie que le planId existe et qu'il est une clé valide de notre objet PLANS
    if (!planId || !Object.keys(PLANS).includes(planId)) {
      return NextResponse.json({ error: ERROR_MESSAGES.INVALID_PLAN }, { status: 400 });
    }

    const planToSubscribe = PLANS[planId as keyof typeof PLANS];
    const user = await getOrCreateUserInDb(userId);

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId ?? undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: planToSubscribe.stripePriceId,
        quantity: 1,
      }],
      success_url: `${req.nextUrl.origin}/dashboard?payment_success=true`,
      cancel_url: `${req.nextUrl.origin}/dashboard?payment_canceled=true`,
      metadata: {
        userId: user.id,
        planId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    if (!session.url) {
      throw new Error(ERROR_MESSAGES.STRIPE_URL_MISSING);
    }

    return NextResponse.json({ url: session.url });

  } catch (error: unknown) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    // Vérifie le type de l'erreur avant d'en extraire le message
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details: errorMessage },
      { status: 500 }
    );
  }
}