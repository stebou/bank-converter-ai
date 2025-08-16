import { sireneService } from '@/lib/sirene/service';
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

    console.log("🔍 Recherche d'entreprises:", {
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
      siret: siretParam,
    });

    let results;

    if (siren) {
      const response = await sireneService.searchBySiren(siren);
      results = response.companies;
    } else {
      // Construire les critères pour le nouveau service
      const criteria: any = {};
      if (codePostal) criteria.codePostal = codePostal;
      if (commune) criteria.ville = commune;
      if (activitePrincipale) criteria.activitePrincipale = activitePrincipale;
      if (trancheEffectifs) criteria.trancheEffectifs = trancheEffectifs;
      if (etatAdministratif) criteria.etatAdministratif = etatAdministratif;
      if (categorieJuridique) criteria.categorieJuridique = categorieJuridique;
      if (departement) criteria.departement = departement;
      if (dateCreationDebut) criteria.dateCreationDebut = dateCreationDebut;
      if (dateCreationFin) criteria.dateCreationFin = dateCreationFin;
      if (siretParam) criteria.siret = siretParam;

      // Utiliser le service unifié
      const response = await sireneService.searchCompanies(query, criteria, 1, limit);
      results = response.companies;
    }

    return NextResponse.json({
      results,
      total: results.length,
      source: 'sirene-simplifie',
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche d'entreprises" },
      { status: 500 }
    );
  }
}
