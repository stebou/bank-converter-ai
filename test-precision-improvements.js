// Test des améliorations de précision SIRENE
// Test l'utilisation de tous les champs selon la documentation v3.11

const testSearches = [
  // Test 1: Recherche avec espaces (ancien problème)
  {
    term: "JEAN MARTIN",
    description: "Recherche avec espaces - doit utiliser AND au lieu de guillemets"
  },
  
  // Test 2: Entrepreneur individuel avec prénom/nom
  {
    term: "BERNARD DUPONT", 
    description: "Entrepreneur individuel - doit chercher dans tous les champs prenom/nom"
  },
  
  // Test 3: Société avec dénomination usuelle
  {
    term: "LA POSTE",
    description: "Société avec dénomination usuelle - doit chercher dans tous les champs dénomination"
  },
  
  // Test 4: Recherche par sigle
  {
    term: "SNCF",
    description: "Recherche par sigle - doit inclure sigleUniteLegale"
  },
  
  // Test 5: Enseigne d'établissement
  {
    term: "CARREFOUR",
    description: "Enseigne d'établissement - doit chercher dans enseigne1/2/3Etablissement"
  }
];

async function testImprovedSearch() {
  console.log('🧪 Test des améliorations de précision SIRENE\n');
  
  for (const test of testSearches) {
    console.log(`\n📋 Test: ${test.description}`);
    console.log(`🔍 Terme: "${test.term}"`);
    
    try {
      const response = await fetch(`http://localhost:3000/api/companies/search?q=${encodeURIComponent(test.term)}&limit=5`);
      const data = await response.json();
      
      console.log(`✅ Résultats trouvés: ${data.total}`);
      
      if (data.results && data.results.length > 0) {
        console.log('📊 Premiers résultats:');
        data.results.slice(0, 3).forEach((result, i) => {
          console.log(`  ${i+1}. ${result.denomination} (${result.siren})`);
          if (result.adresse) {
            console.log(`     📍 ${result.adresse.commune} ${result.adresse.codePostal}`);
          }
        });
      }
      
      // Analyser la requête construite
      if (data.meta && data.meta.q) {
        console.log(`🔧 Requête générée: ${data.meta.q}`);
      }
      
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
    }
  }
}

// Test de comparaison avant/après
async function compareOldVsNew() {
  console.log('\n🔄 Comparaison ancienne vs nouvelle recherche\n');
  
  const testTerm = "MARTIN DUPONT";
  
  // Test avec l'ancienne logique (simulation)
  console.log('📊 Ancienne logique (guillemets):');
  console.log(`   Requête: denominationUniteLegale:"${testTerm}"* OR nomUniteLegale:"${testTerm}"*`);
  
  // Test avec la nouvelle logique
  console.log('📊 Nouvelle logique (AND multi-champs):');
  const words = testTerm.split(' ');
  const wordQuery = words.map(w => `${w}*`).join(' AND ');
  console.log(`   Requête: (denominationUniteLegale:(${wordQuery}) OR nominUniteLegale:(${wordQuery}) OR ...)`);
  
  // Test réel
  try {
    const response = await fetch(`http://localhost:3000/api/companies/search?q=${encodeURIComponent(testTerm)}&limit=10`);
    const data = await response.json();
    
    console.log(`\n✅ Résultats avec nouvelle logique: ${data.total}`);
    console.log(`🔧 Requête réelle: ${data.meta?.q}`);
    
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
  }
}

// Test de couverture des champs
async function testFieldCoverage() {
  console.log('\n📋 Test de couverture des champs selon la documentation\n');
  
  const fieldTests = [
    { field: 'denominationUniteLegale', example: 'PEUGEOT' },
    { field: 'denominationUsuelle1UniteLegale', example: 'LA POSTE' },
    { field: 'sigleUniteLegale', example: 'SNCF' },
    { field: 'nomUniteLegale', example: 'MARTIN' },
    { field: 'prenomUsuelUniteLegale', example: 'JEAN' },
    { field: 'enseigne1Etablissement', example: 'CARREFOUR' }
  ];
  
  for (const test of fieldTests) {
    console.log(`🔍 Test champ: ${test.field}`);
    console.log(`   Exemple: ${test.example}`);
    
    try {
      const response = await fetch(`http://localhost:3000/api/companies/search?q=${encodeURIComponent(test.example)}&limit=3`);
      const data = await response.json();
      
      console.log(`   ✅ Résultats: ${data.total}`);
      
      if (data.results && data.results.length > 0) {
        const first = data.results[0];
        console.log(`   📊 Premier résultat: ${first.denomination}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}`);
    }
    console.log('');
  }
}

// Exécuter tous les tests
async function runAllTests() {
  await testImprovedSearch();
  await compareOldVsNew();
  await testFieldCoverage();
  
  console.log('\n🎯 Tests terminés. Vérifiez que:');
  console.log('1. Les recherches avec espaces fonctionnent mieux');
  console.log('2. Plus d\'entrepreneurs individuels sont trouvés');
  console.log('3. Les enseignes et dénominations usuelles sont trouvées');
  console.log('4. La couverture globale est améliorée');
}

runAllTests().catch(console.error);
