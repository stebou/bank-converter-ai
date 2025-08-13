// Test des champs de requête valides selon la doc INSEE
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';
const BASE_URL = 'https://api.insee.fr/api-sirene/3.11';

async function testQueryFields() {
  console.log('🔍 Test des champs de requête valides API SIRENE');
  console.log('='.repeat(50));

  const testQueries = [
    // Champs d'identification
    { field: 'siren', value: '552100554', description: 'SIREN (9 chiffres)' },
    { field: 'siret', value: '55210055400554', description: 'SIRET (14 chiffres)' },
    
    // Champs de dénomination (à tester)
    { field: 'denominationUniteLegale', value: 'PEUGEOT*', description: 'Dénomination unité légale' },
    { field: 'nomUniteLegale', value: 'MARTIN*', description: 'Nom unité légale (personnes physiques)' },
    { field: 'enseigne1Etablissement', value: 'CARREFOUR*', description: 'Enseigne établissement' },
    
    // Champs géographiques
    { field: 'codePostalEtablissement', value: '75001', description: 'Code postal établissement' },
    { field: 'codeCommuneEtablissement', value: '75101', description: 'Code commune établissement' },
    { field: 'libelleCommuneEtablissement', value: 'PARIS*', description: 'Libellé commune établissement' },
    
    // Champs d'activité
    { field: 'activitePrincipaleUniteLegale', value: '62.01Z', description: 'Activité principale UL (code NAF)' },
    { field: 'activitePrincipaleEtablissement', value: '47.11F', description: 'Activité principale établissement' },
    
    // Champs d'état
    { field: 'etatAdministratifUniteLegale', value: 'A', description: 'État administratif UL (A/C)' },
    { field: 'etatAdministratifEtablissement', value: 'A', description: 'État administratif établissement (A/F)' }
  ];

  for (const test of testQueries) {
    try {
      const query = `${test.field}:${test.value}`;
      const url = `${BASE_URL}/siret?q=${encodeURIComponent(query)}&nombre=1`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-INSEE-Api-Key-Integration': API_KEY
        }
      });

      const data = await response.json();
      
      if (data.header.statut === 200) {
        console.log(`✅ ${test.field}: ${data.header.total} résultats - ${test.description}`);
      } else {
        console.log(`❌ ${test.field}: Erreur ${data.header.statut} - ${data.header.message}`);
      }
      
      // Petite pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ ${test.field}: Erreur réseau - ${error.message}`);
    }
  }

  console.log('\n📊 CHAMPS DE REQUÊTE VALIDÉS pour buildQueryFromCriteria');
}

testQueryFields();
