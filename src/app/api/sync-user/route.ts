// API pour synchroniser les utilisateurs Clerk avec la base de données
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { clerkId, email, name } = await req.json();
    
    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (existingUser) {
      // Mettre à jour les informations si nécessaire
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          name: name || existingUser.name,
        }
      });
      
      console.log(`[SYNC] User ${clerkId} updated in database`);
      return NextResponse.json({ 
        success: true, 
        action: 'updated',
        user: updatedUser 
      });
    } else {
      // Créer un nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          name: name || 'Utilisateur',
        }
      });
      
      console.log(`[SYNC] New user ${clerkId} created in database`);
      return NextResponse.json({ 
        success: true, 
        action: 'created',
        user: newUser 
      });
    }
  } catch (error: unknown) {
    console.error('[SYNC] Database error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}