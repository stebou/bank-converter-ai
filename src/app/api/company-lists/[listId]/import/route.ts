import { prisma } from "@/lib/prisma";
import { ImportFilters } from '@/types/company-lists';
import { auth } from "@clerk/nextjs/server";
import { CompanyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const listId = params.listId;
    const filters: ImportFilters = await request.json();

    // Vérifier que la liste existe et appartient à l'utilisateur
    const list = await prisma.companyList.findFirst({
      where: {
        id: listId,
        userId
      }
    });

    if (!list) {
      return NextResponse.json({ error: 'Liste non trouvée' }, { status: 404 });
    }

    // Récupérer l'utilisateur interne pour les nouvelles entreprises
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Import via IDs d'entreprises (depuis notre base de données de test)
    if (filters.companyIds && filters.companyIds.length > 0) {
      const mockCompaniesData = [
        {
          id: 'mock-1',
          siren: '123456789',
          denomination: 'TechCorp Solutions',
          ville: 'Paris',
          secteur: 'Technologies',
          activitePrincipaleLibelle: 'Développement de logiciels'
        },
        {
          id: 'mock-2',
          siren: '987654321',
          denomination: 'Innovation Lab',
          ville: 'Lyon',
          secteur: 'R&D',
          activitePrincipaleLibelle: 'Recherche et développement'
        },
        {
          id: 'mock-3',
          siren: '456789123',
          denomination: 'Digital Factory',
          ville: 'Marseille',
          secteur: 'Numérique',
          activitePrincipaleLibelle: 'Services numériques'
        }
      ];

      const importedCompanies = [];
      let importedCount = 0;

      for (const companyId of filters.companyIds) {
        const mockData = mockCompaniesData.find(c => c.id === companyId);
        if (mockData) {
          // Vérifier si l'entreprise existe déjà dans cette liste
          const existingCompany = await prisma.company.findFirst({
            where: {
              siren: mockData.siren,
              companyListId: listId
            }
          });

          if (!existingCompany) {
            const newCompany = await prisma.company.create({
              data: {
                siren: mockData.siren,
                siret: mockData.siren + '00001', // Génération d'un SIRET fictif
                denomination: mockData.denomination,
                ville: mockData.ville,
                secteur: mockData.secteur,
                activitePrincipaleLibelle: mockData.activitePrincipaleLibelle,
                statut: CompanyStatus.NEW,
                siege: true,
                addedAt: new Date(),
                ownerId: user.id,
                companyListId: listId
              }
            });
            importedCompanies.push(newCompany);
            importedCount++;
          }
        }
      }

      return NextResponse.json({
        imported: importedCount,
        errors: 0,
        details: {
          importedCompanies: importedCompanies.map(c => ({
            siren: c.siren,
            denomination: c.denomination,
            ville: c.ville
          })),
          errors: []
        }
      });
    }

    // Si on a une liste de SIREN/SIRET
    if (filters.sirens && filters.sirens.length > 0) {
      const importedCompanies = [];
      const errors = [];

      for (const siren of filters.sirens) {
        try {
          // Rechercher l'entreprise dans la base ou la récupérer via l'API INSEE
          let company = await prisma.company.findFirst({
            where: {
              OR: [
                { siren },
                { siret: siren }
              ]
            }
          });

          // Si l'entreprise n'existe pas, on pourrait la créer ici
          // en utilisant l'API INSEE (à implémenter plus tard)
          if (!company) {
            // Pour l'instant, créer une entrée basique
            company = await prisma.company.create({
              data: {
                siren: siren.length === 9 ? siren : siren.substring(0, 9),
                siret: siren,
                denomination: `Entreprise ${siren}`,
                statut: CompanyStatus.NEW,
                ownerId: user.id,
                companyListId: listId
              }
            });
          }

          // Vérifier si l'entreprise n'est pas déjà dans la liste
          const existingAssociation = await prisma.companyList.findFirst({
            where: {
              id: listId,
              companies: {
                some: {
                  id: company.id
                }
              }
            }
          });

          if (!existingAssociation) {
            // Ajouter l'entreprise à la liste
            await prisma.companyList.update({
              where: { id: listId },
              data: {
                companies: {
                  connect: { id: company.id }
                }
              }
            });

            importedCompanies.push(company);
          }

        } catch (error) {
          console.error(`Erreur lors de l'import de ${siren}:`, error);
          errors.push({
            siren,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          });
        }
      }

      return NextResponse.json({
        imported: importedCompanies.length,
        errors: errors.length,
        details: {
          importedCompanies: importedCompanies.map(c => ({
            siren: c.siren,
            siret: c.siret,
            denomination: c.denomination
          })),
          errors
        }
      });
    }

    // Pour les autres types de filtres (à implémenter plus tard)
    return NextResponse.json({ 
      error: 'Type d\'import non supporté pour le moment' 
    }, { status: 400 });

  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
