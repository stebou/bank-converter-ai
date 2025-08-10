import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  console.log('[DEBUG] Starting user-documents debug...');

  try {
    // 1. Vérifier l'authentification Clerk
    const { userId } = await auth();
    console.log('[DEBUG] Clerk userId:', userId);

    if (!userId) {
      return NextResponse.json({
        error: 'Not authenticated',
        clerkUserId: null,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Vérifier si l'utilisateur existe en base
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    console.log('[DEBUG] Database user found:', !!user);
    if (user) {
      console.log('[DEBUG] User ID:', user.id);
      console.log('[DEBUG] User documents count:', user.documents.length);
    }

    // 3. Vérifier le total de documents dans la base
    const totalDocuments = await prisma.document.count();
    console.log('[DEBUG] Total documents in database:', totalDocuments);

    // 4. Documents orphelins non vérifiés pour éviter les erreurs de type

    // 5. Lister tous les utilisateurs
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        _count: {
          select: { documents: true },
        },
      },
    });
    console.log('[DEBUG] All users in database:', allUsers.length);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      clerkUserId: userId,
      databaseUser: user
        ? {
            id: user.id,
            clerkId: user.clerkId,
            name: user.name,
            email: user.email,
            documentsCount: user.documents.length,
            recentDocuments: user.documents.map(doc => ({
              id: doc.id,
              filename: doc.filename,
              originalName: doc.originalName,
              createdAt: doc.createdAt,
              status: doc.status,
            })),
          }
        : null,
      databaseStats: {
        totalUsers: allUsers.length,
        totalDocuments: totalDocuments,
        orphanDocuments: 0, // Non calculé pour éviter les erreurs de type
        allUsers: allUsers,
      },
    });
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json(
      {
        error: 'Debug error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
