import { searchBySiren, searchCompanies, searchCompaniesWithFilters } from '@/lib/sirene';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const siren = searchParams.get('siren');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filtres géographiques et autres
    const codePostal = searchParams.get('codePostal');
    const commune = searchParams.get('commune');
    const activitePrincipale = searchParams.get('activitePrincipale');
    const trancheEffectifs = searchParams.get('trancheEffectifs');
    const etatAdministratif = searchParams.get('etatAdministratif');
    const categorieJuridique = searchParams.get('categorieJuridique');
    const departement = searchParams.get('departement');
    const dateCreationDebut = searchParams.get('dateCreationDebut');
    const dateCreationFin = searchParams.get('dateCreationFin');
    const siretParam = searchParams.get('siret');

    console.log('🔍 Recherche d\'entreprises:', { 
      query, 
      siren, 
      limit, 
      codePostal, 
      commune, 
      activitePrincipale, 
      trancheEffectifs, 
      etatAdministratif,
      categorieJuridique,
      departement,
      dateCreationDebut,
      dateCreationFin,
      siret: siretParam
    });

    let results;
    
    if (siren) {
      results = await searchBySiren(siren);
    } else {
      // Construire les filtres
      const filters: Record<string, string> = {};
      if (codePostal) filters.codePostalEtablissement = codePostal;
      if (commune) filters.libelleCommuneEtablissement = commune;
      if (activitePrincipale) filters.activitePrincipaleUniteLegale = activitePrincipale;
      if (trancheEffectifs) filters.trancheEffectifsUniteLegale = trancheEffectifs;
      if (etatAdministratif) filters.etatAdministratifEtablissement = etatAdministratif;
      if (categorieJuridique) filters.categorieJuridiqueUniteLegale = categorieJuridique;
      if (departement) filters.departement = departement;
      if (dateCreationDebut) filters.dateCreationUniteLegaleDebut = dateCreationDebut;
      if (dateCreationFin) filters.dateCreationUniteLegaleFin = dateCreationFin;
      if (siretParam) filters.siret = siretParam;

      // Si on a des filtres ou pas de query text, utiliser la recherche multicritères
      if (Object.keys(filters).length > 0 || !query) {
        results = await searchCompaniesWithFilters(query, filters, limit);
      } else {
        // Recherche simple par nom
        results = await searchCompanies(query, limit);
      }
    }

    return NextResponse.json({
      results,
      total: results.length,
      source: 'sirene-simplifie'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche d\'entreprises' },
      { status: 500 }
    );
  }
}