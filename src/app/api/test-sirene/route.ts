// Endpoint de test public pour l'API SIRENE (sans authentification)
import { searchCompanies } from '@/lib/sirene';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Paramètre "q" requis pour la recherche' },
        { status: 400 }
      );
    }

    console.log('🔍 Test SIRENE pour:', query);

    // Recherche via l'API SIRENE
    const companies = await searchCompanies(query, 10);

    return NextResponse.json({
      success: true,
      query,
      count: companies.length,
      companies,
      timestamp: new Date().toISOString(),
      note: 'Endpoint de test - sans authentification'
    });

  } catch (error) {
    console.error('❌ Erreur test SIRENE:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la recherche SIRENE',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
