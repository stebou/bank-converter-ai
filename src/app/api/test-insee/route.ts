import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const nombre = searchParams.get('nombre') || '5';

  if (!query) {
    return NextResponse.json({ error: 'Paramètre q manquant' }, { status: 400 });
  }

  try {
    console.log('🔍 API Route - Recherche INSEE:', { query, nombre });
    
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('nombre', nombre);
    
    const inseeUrl = `https://api.insee.fr/api-sirene/3.11/siret?${params.toString()}`;
    console.log('📍 URL INSEE:', inseeUrl);
    
    const response = await fetch(inseeUrl, {
      headers: {
        'X-INSEE-Api-Key-Integration': process.env.NEXT_PUBLIC_INSEE_API_KEY || '',
        'Accept': 'application/json'
      }
    });

    console.log('📊 Status INSEE:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur INSEE:', response.status, errorText);
      return NextResponse.json({ 
        error: `Erreur API INSEE: ${response.status} - ${errorText}` 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Succès INSEE - Total:', data.header?.total);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('💥 Erreur API Route:', error);
    return NextResponse.json({ 
      error: `Erreur serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    }, { status: 500 });
  }
}
