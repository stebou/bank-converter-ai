import { SireneApiService } from '@/lib/services/sirene-api';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Configuration de l'API SIRENE
const sireneApi = new SireneApiService({
  baseUrl: process.env.NEXT_PUBLIC_INSEE_API_BASE || 'https://api.insee.fr/api-sirene/3.11',
  apiKey: process.env.NEXT_PUBLIC_INSEE_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const siren = searchParams.get('siren');
    const date = searchParams.get('date') || undefined;
    
    if (!siren) {
      return NextResponse.json({ 
        error: 'Paramètre SIREN requis' 
      }, { status: 400 });
    }

    // Validation du SIREN
    if (!/^\d{9}$/.test(siren)) {
      return NextResponse.json({ 
        error: 'SIREN doit être un numéro à 9 chiffres' 
      }, { status: 400 });
    }

    // Validation de la date si fournie
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ 
        error: 'Date doit être au format AAAA-MM-JJ' 
      }, { status: 400 });
    }

    console.log(`🔍 Interrogation unitaire SIREN: ${siren}${date ? ` à la date ${date}` : ''}`);

    try {
      const sireneResponse = await sireneApi.getUniteLegale(siren, date);
      
      // Extraire les données courantes pour faciliter l'usage
      const currentData = SireneApiService.getCurrentPeriodData(sireneResponse.uniteLegale);
      
      return NextResponse.json({
        success: true,
        siren,
        date: date || null,
        uniteLegale: sireneResponse.uniteLegale,
        currentPeriod: currentData,
        historicalPeriods: sireneResponse.uniteLegale?.periodesUniteLegale?.length || 0,
        source: 'sirene'
      });

    } catch (sireneError: any) {
      console.error('❌ Erreur API SIRENE:', sireneError);
      
      return NextResponse.json({
        error: 'Erreur lors de l\'interrogation du SIREN',
        details: sireneError.message,
        siren
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
