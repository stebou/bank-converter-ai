const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testRealTimeSearch() {
  const INSEE_API_KEY = process.env.NEXT_PUBLIC_INSEE_API_KEY;
  console.log('🔑 Clé API:', INSEE_API_KEY ? INSEE_API_KEY.substring(0, 8) + '...' : 'MANQUANTE');

  // Test 1: Recherche simple par nom (comme dans l'application)
  console.log('\n=== TEST 1: Recherche par nom (comme app) ===');
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('q', 'denominationUniteLegale:Google*');
    searchParams.append('nombre', '5');
    
    const finalURL = `https://api.insee.fr/api-sirene/3.11/siret?${searchParams.toString()}`;
    console.log('URL:', finalURL);
    
    const response = await fetch(finalURL, {
      headers: {
        'X-INSEE-Api-Key-Integration': INSEE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data.substring(0, 500) + '...');
  } catch (error) {
    console.error('Erreur Test 1:', error.message);
  }

  // Test 2: Recherche selon la documentation officielle
  console.log('\n=== TEST 2: Recherche selon doc officielle ===');
  try {
    const searchParams = new URLSearchParams();
    // Selon la doc: recherche par dénomination (variables historisées)
    searchParams.append('q', 'periode(denominationUniteLegale:Google)');
    searchParams.append('nombre', '5');
    
    const finalURL = `https://api.insee.fr/api-sirene/3.11/siret?${searchParams.toString()}`;
    console.log('URL:', finalURL);
    
    const response = await fetch(finalURL, {
      headers: {
        'X-INSEE-Api-Key-Integration': INSEE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data.substring(0, 500) + '...');
  } catch (error) {
    console.error('Erreur Test 2:', error.message);
  }

  // Test 3: Test très simple comme dans la doc
  console.log('\n=== TEST 3: Test minimal doc ===');
  try {
    const response = await fetch('https://api.insee.fr/api-sirene/3.11/siret?q=siren:552100554&nombre=1', {
      headers: {
        'X-INSEE-Api-Key-Integration': INSEE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data.substring(0, 500) + '...');
  } catch (error) {
    console.error('Erreur Test 3:', error.message);
  }
}

testRealTimeSearch().catch(console.error);
