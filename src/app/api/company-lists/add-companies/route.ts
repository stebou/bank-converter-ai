import { prisma } from "@/lib/prisma";
import { getCompanyBySiren } from '@/lib/sirene';
import type { AddCompaniesToListData } from '@/types/company-lists';
import { auth } from "@clerk/nextjs/server";
import { CompanyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data: AddCompaniesToListData = await request.json();
    const { listId, companies } = data;

    // Vérifier que la liste existe et appartient à l'utilisateur
    const list = await prisma.companyList.findFirst({
      where: {
        id: listId,
        user: {
          clerkId: userId
        }
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

    // Traiter chaque entreprise
    const companiesToCreate = [];
    
    for (const company of companies) {
      // Vérifier si l'entreprise existe déjà dans cette liste
      const existingCompany = await prisma.company.findFirst({
        where: {
          siren: company.siren,
          companyListId: listId
        }
      });

      if (!existingCompany) {
        // Récupérer les informations complètes depuis l'API INSEE
        console.log(`🔍 Enrichissement des données pour SIREN: ${company.siren}`);
        const inseeData = await getCompanyBySiren(company.siren);
        
        let companyData;
        
        if (inseeData) {
          // Utiliser les données enrichies de l'INSEE
          console.log(`✅ Données INSEE trouvées pour ${company.siren}:`, inseeData.denomination);
          
          companyData = {
            siren: company.siren,
            siret: company.siret || inseeData.siret,
            statut: company.statut || CompanyStatus.NEW,
            notes: company.notes || '',
            companyListId: listId,
            ownerId: user.id,
            addedAt: new Date(),
            lastUpdatedFromINSEE: new Date(),
            
            // Données enrichies depuis l'API INSEE
            denomination: inseeData.denomination || `Entreprise ${company.siren}`,
            etatAdministratif: inseeData.etatAdministratif || 'A',
            siege: true, // Toujours true pour le siège
            dateCreation: inseeData.dateCreation ? new Date(inseeData.dateCreation) : new Date(),
            activitePrincipale: inseeData.activitePrincipale || '',
            activitePrincipaleLibelle: inseeData.activitePrincipaleLibelle || '',
            categorieJuridique: inseeData.categorieJuridique || '',
            trancheEffectifs: inseeData.trancheEffectifs || '',
            
            // Adresse
            ville: inseeData.adresse?.commune || '',
            codePostal: inseeData.adresse?.codePostal || '',
            adresseComplete: [
              inseeData.adresse?.numeroVoie,
              inseeData.adresse?.typeVoie,
              inseeData.adresse?.libelleVoie
            ].filter(Boolean).join(' ') || '',
            
            // Champs calculés
            secteur: inseeData.activitePrincipaleLibelle || '',
            industrie: inseeData.activitePrincipaleLibelle || '',
            emplacement: `${inseeData.adresse?.commune || ''} ${inseeData.adresse?.codePostal || ''}`.trim()
          };
        } else {
          // Fallback si l'API INSEE ne retourne pas de données
          console.log(`⚠️ Aucune donnée INSEE trouvée pour ${company.siren}, utilisation des données minimales`);
          
          companyData = {
            siren: company.siren,
            siret: company.siret,
            statut: company.statut || CompanyStatus.NEW,
            notes: company.notes || '',
            companyListId: listId,
            ownerId: user.id,
            addedAt: new Date(),
            
            // Valeurs par défaut
            denomination: `Entreprise ${company.siren}`,
            etatAdministratif: 'A',
            siege: true,
            dateCreation: new Date(),
            activitePrincipale: '',
            activitePrincipaleLibelle: '',
            categorieJuridique: '',
            trancheEffectifs: '',
            ville: '',
            codePostal: '',
            adresseComplete: '',
            secteur: '',
            industrie: '',
            emplacement: ''
          };
        }
        
        companiesToCreate.push(companyData);
      }
    }

    // Créer les nouvelles entreprises en batch
    if (companiesToCreate.length > 0) {
      await prisma.company.createMany({
        data: companiesToCreate
      });
    }

    // Retourner le nombre d'entreprises ajoutées
    return NextResponse.json({ 
      success: true, 
      added: companiesToCreate.length,
      total: companies.length,
      message: `${companiesToCreate.length} entreprise(s) ajoutée(s) avec succès sur ${companies.length}` 
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout des entreprises:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
