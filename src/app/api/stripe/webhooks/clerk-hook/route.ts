// Fichier : src/app/api/webhooks/clerk/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // On essaie de lire le corps de la requête pour s'assurer qu'il est valide
    const payload = await req.json();
    
    // Si on arrive ici, c'est que la requête a bien été reçue et lue.
    console.log("Webhook reçu et corps de la requête lu avec succès:", payload);
    
    // On renvoie une réponse de succès claire
    return NextResponse.json({ 
      status: 'success', 
      message: 'Webhook reçu et traité (test)',
    }, { status: 200 });

 // ...existing code...
} catch (error) {
  console.error("Erreur dans le traitement du webhook:", error);

  let message = "Erreur interne du serveur";
  if (error instanceof Error) {
    message = `Erreur interne du serveur: ${error.message}`;
  }

  return NextResponse.json({ 
    status: 'error', 
    message 
  }, { status: 500 });
}
// ...existing code...
}
