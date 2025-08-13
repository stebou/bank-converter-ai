// Test des requêtes avec espaces pour identifier le problème exact
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';

async function testSearchWithSpaces() {
  console.log('🔍 Test des recherches avec espaces');
  console.log('='.repeat(50));

  // Test 1: Requête sans espace (qui fonctionne)
  console.log('\n📋 Test 1: Requête SANS espace');
  await testQuery('PEUGEOT');

  // Test 2: Requête avec espace (problématique)
  console.log('\n📋 Test 2: Requête AVEC espace');
  await testQuery('PEUGEOT CITROEN');

  // Test 3: Requête avec espace entre guillemets
  console.log('\n📋 Test 3: Requête avec guillemets');
  await testQuery('"PEUGEOT CITROEN"');

  // Test 4: Requête avec AND explicite
  console.log('\n📋 Test 4: Requête avec AND explicite');
  await testQuery('PEUGEOT AND CITROEN');

  // Test 5: Requête avec espace remplacé par +
  console.log('\n📋 Test 5: Requête avec +');
  await testQuery('PEUGEOT+CITROEN');
}

async function testQuery(searchTerm) {
  try {
    console.log(`   🔤 Terme de recherche: "${searchTerm}"`);
    
    // Construction de la requête comme dans le code actuel
    const cleanTerm = searchTerm.trim().toUpperCase().replace(/\s+/g, ' ');
    const sireneQuery = `denominationUniteLegale:${cleanTerm}* AND etatAdministratifUniteLegale:A`;
    
    console.log(`   🏗️  Requête SIRENE: "${sireneQuery}"`);
    console.log(`   🌐 URL encodée: "${encodeURIComponent(sireneQuery)}"`);

    const searchUrl = 'https://api.insee.fr/api-sirene/3.11/siret?q=' + 
      encodeURIComponent(sireneQuery) + 
      '&nombre=3&champs=siren,siret,denominationUniteLegale,nomUniteLegale,activitePrincipaleUniteLegale,etatAdministratifUniteLegale,codePostalEtablissement,libelleCommuneEtablissement&tri=score desc';

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Succès: ${data.header.statut} | ${data.header.nombre}/${data.header.total} résultats`);
      
      if (data.etablissements && data.etablissements.length > 0) {
        data.etablissements.slice(0, 2).forEach((etab, idx) => {
          const uniteLegale = etab.uniteLegale || {};
          const adresse = etab.adresseEtablissement || {};
          console.log(`      ${idx + 1}. ${uniteLegale.denominationUniteLegale || etab.denominationUniteLegale || 'Sans nom'}`);
          console.log(`         SIREN: ${etab.siren}, Localisation: ${adresse.codePostalEtablissement || 'N/A'} ${adresse.libelleCommuneEtablissement || 'N/A'}`);
        });
      } else {
        console.log(`   ⚠️  Aucun établissement trouvé`);
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Erreur ${response.status}: ${response.statusText}`);
      console.log(`   📄 Détails: ${errorText}`);
    }

  } catch (error) {
    console.log(`   🚫 Exception: ${error.message}`);
  }
}

testSearchWithSpaces();
