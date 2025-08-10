// Test direct dans la console du navigateur
// À coller dans la console de Chrome/Firefox sur la page de l'application

async function testInseeAPIInBrowser() {
  console.log('🧪 Test direct de l\'API INSEE depuis le navigateur...');
  
  try {
    // Test avec la même logique que l'application
    const searchParams = new URLSearchParams();
    searchParams.append('q', 'denominationUniteLegale:Google*');
    searchParams.append('nombre', '5');
    
    const url = `https://api.insee.fr/api-sirene/3.11/siret?${searchParams.toString()}`;
    console.log('📍 URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'X-INSEE-Api-Key-Integration': '75fc671b-0576-45b9-bc67-1b0576b5b909',
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur:', response.status, errorText);
      return { error: errorText, status: response.status };
    }
    
    const data = await response.json();
    console.log('✅ Succès! Données:', data);
    console.log('📈 Total:', data.header?.total);
    console.log('🏢 Entreprises:', data.etablissements?.length);
    
    return { success: true, data };
    
  } catch (error) {
    console.error('💥 Erreur catch:', error);
    return { error: error.message };
  }
}

// Test CORS
async function testCORS() {
  console.log('🔒 Test CORS...');
  try {
    const response = await fetch('https://api.insee.fr/api-sirene/3.11/siret?q=siren:552100554&nombre=1', {
      headers: {
        'X-INSEE-Api-Key-Integration': '75fc671b-0576-45b9-bc67-1b0576b5b909',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    console.log('CORS Status:', response.status);
    return response.status;
  } catch (error) {
    console.error('CORS Error:', error.message);
    return error.message;
  }
}

// Lancer les tests
console.log('🚀 Démarrage des tests...');
testCORS().then(() => testInseeAPIInBrowser());
