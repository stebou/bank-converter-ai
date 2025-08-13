// Test direct de l'API INSEE avec votre configuration actuelle
// Exécuter avec: node test-insee-config.js

const testInseeApi = async () => {
  console.log('🔍 Test de l\'API INSEE SIRENE...\n');
  
  const apiKey = '75fc671b-0576-45b9-bc67-1b0576b5b909';
  const baseUrl = 'https://api.insee.fr/entreprises/sirene/V3.11';
  
  // Test 1: Vérifier avec Bearer
  console.log('📡 Test 1: Bearer Authentication');
  console.log(`URL: ${baseUrl}/siret?q=denominationUniteLegale:airbus&nombre=5`);
  
  try {
    const response = await fetch(`${baseUrl}/siret?q=denominationUniteLegale:airbus&nombre=5`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'NodeJS-Test'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Token is valid');
      console.log('Data keys:', Object.keys(data));
      if (data.etablissements && data.etablissements.length > 0) {
        console.log(`Found ${data.etablissements.length} establishments`);
      }
      return true;
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Could not parse error response' }));
      console.log('❌ FAILED:', errorData);
      
      if (response.status === 401) {
        if (errorData.fault?.message?.includes('expired')) {
          console.log('🔄 TOKEN EXPIRED - Need to renew');
        } else if (errorData.fault?.message?.includes('Invalid Credentials')) {
          console.log('🔄 INVALID TOKEN - Need new token');
        }
      }
    }
  } catch (error) {
    console.error('💥 Network Error:', error.message);
  }
  
  return false;
};

// Test 2: Vérifier les endpoints disponibles
const testEndpoints = async () => {
  console.log('\n🔍 Test 2: Endpoints disponibles');
  
  const endpoints = [
    '/informations',
    '/siren', 
    '/siret',
    '/liensSuccession'
  ];
  
  const baseUrl = 'https://api.insee.fr/entreprises/sirene/V3.11';
  const apiKey = '75fc671b-0576-45b9-bc67-1b0576b5b909';
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        console.log(`  ✅ ${endpoint} accessible`);
      } else if (response.status === 401) {
        console.log(`  🔐 ${endpoint} requires authentication (token issue)`);
      } else {
        console.log(`  ⚠️  ${endpoint} other status`);
      }
    } catch (error) {
      console.log(`  💥 ${endpoint} error:`, error.message);
    }
  }
};

// Exécuter les tests
const runTests = async () => {
  const tokenValid = await testInseeApi();
  
  if (!tokenValid) {
    await testEndpoints();
    
    console.log('\n📝 RÉSUMÉ:');
    console.log('❌ Votre token INSEE est expiré ou invalide');
    console.log('🔧 Solutions:');
    console.log('  1. Connectez-vous sur https://api.insee.fr/catalogue/');
    console.log('  2. Allez dans "Mes applications"'); 
    console.log('  3. Cliquez sur "Générer les clefs" pour renouveler le token');
    console.log('  4. Ou créez une nouvelle application si nécessaire');
    console.log('  5. Mettez à jour NEXT_PUBLIC_INSEE_API_KEY dans .env.local');
  } else {
    console.log('\n✅ Token valide - L\'erreur vient d\'ailleurs');
  }
};

runTests().catch(console.error);
