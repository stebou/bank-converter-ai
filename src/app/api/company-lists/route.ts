import { prisma } from '@/lib/prisma';
import { CreateCompanyListData } from '@/types/company-lists';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur dans notre base pour avoir l'ID interne
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const lists = await prisma.companyList.findMany({
      where: {
        userId: user.id,
        isArchived: false
      },
      include: {
        companies: {
          include: {
            dirigeants: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        },
        tags: true,
        _count: {
          select: {
            companies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error('Erreur lors de la récupération des listes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur dans notre base pour avoir l'ID interne
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const data: CreateCompanyListData = await request.json();
    
    // Validation des données
    if (!data.name || data.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom de la liste est requis' }, 
        { status: 400 }
      );
    }

    // Vérifier si une liste avec ce nom existe déjà
    const existingList = await prisma.companyList.findFirst({
      where: {
        userId: user.id,
        name: data.name.trim(),
        isArchived: false
      }
    });

    if (existingList) {
      return NextResponse.json(
        { error: 'Une liste avec ce nom existe déjà' }, 
        { status: 400 }
      );
    }

    const newList = await prisma.companyList.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        color: data.color || '#3b82f6',
        userId: user.id
      },
      include: {
        companies: {
          include: {
            dirigeants: true,
            tags: {
              include: {
                tag: true
              }
            }
          }
        },
        tags: true,
        _count: {
          select: {
            companies: true
          }
        }
      }
    });

    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la liste:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
