// Test simple avec fetch pour vérifier l'API INSEE directement
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';
const BASE_URL = 'https://api.insee.fr/api-sirene/3.11';

async function testOptimizedFields() {
  console.log('🧪 Test des champs optimisés selon documentation INSEE');
  console.log('='.repeat(60));

  try {
    // Test avec les champs optimisés selon la documentation
    const optimizedFields = [
      // Unité légale (variables essentielles)
      'siren',
      'denominationUniteLegale',
      'nomUniteLegale',
      'categorieJuridiqueUniteLegale',
      'activitePrincipaleUniteLegale',
      'etatAdministratifUniteLegale',
      'trancheEffectifsUniteLegale',
      'dateCreationUniteLegale',
      'nicSiegeUniteLegale',
      // Établissement (variables essentielles) 
      'siret',
      'enseigne1Etablissement',
      'etatAdministratifEtablissement',
      'etablissementSiege',
      'activitePrincipaleEtablissement',
      'numeroVoieEtablissement',
      'typeVoieEtablissement',
      'libelleVoieEtablissement',
      'codePostalEtablissement',
      'libelleCommuneEtablissement'
    ].join(',');

    console.log('📋 Champs sélectionnés:', optimizedFields.split(',').length, 'variables');
    
    // Test avec PEUGEOT et tri par pertinence
    const searchUrl = new URL(`${BASE_URL}/siret`);
    searchUrl.searchParams.append('q', 'denominationUniteLegale:PEUGEOT* AND etatAdministratifEtablissement:A');
    searchUrl.searchParams.append('nombre', '3');
    searchUrl.searchParams.append('champs', optimizedFields);
    searchUrl.searchParams.append('tri', 'score desc,dateCreationEtablissement desc');

    console.log('\n🔍 Requête:', searchUrl.toString().replace(API_KEY, 'KEY_MASKED'));

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('\n✅ Statut:', data.header.statut, data.header.message);
    console.log('📊 Total trouvé:', data.header.total);
    console.log('📄 Retournés:', data.header.nombre);

    if (data.etablissements && data.etablissements.length > 0) {
      console.log('\n🏢 Premier établissement:');
      const etab = data.etablissements[0];
      console.log(`   SIREN/SIRET: ${etab.siren}/${etab.siret}`);
      console.log(`   Dénomination: ${etab.denominationUniteLegale || etab.nomUniteLegale}`);
      console.log(`   Enseigne: ${etab.enseigne1Etablissement || 'Non renseignée'}`);
      console.log(`   Activité UL: ${etab.activitePrincipaleUniteLegale}`);
      console.log(`   Activité Etab: ${etab.activitePrincipaleEtablissement || 'Non renseignée'}`);
      console.log(`   Adresse: ${etab.numeroVoieEtablissement || ''} ${etab.typeVoieEtablissement || ''} ${etab.libelleVoieEtablissement || ''}`);
      console.log(`   Ville: ${etab.codePostalEtablissement} ${etab.libelleCommuneEtablissement}`);
      console.log(`   État: ${etab.etatAdministratifEtablissement} | Siège: ${etab.etablissementSiege ? 'Oui' : 'Non'}`);
      console.log(`   Effectifs: ${etab.trancheEffectifsUniteLegale || 'Non renseigné'}`);
    }

    // Test syntaxe OU avec parenthèses selon documentation
    console.log('\n📋 Test syntaxe OR avec variables documentées');
    const orQuery = '(denominationUniteLegale:LVMH* OR enseigne1Etablissement:LVMH*) AND etatAdministratifEtablissement:A';
    const orUrl = new URL(`${BASE_URL}/siret`);
    orUrl.searchParams.append('q', orQuery);
    orUrl.searchParams.append('nombre', '2');
    orUrl.searchParams.append('champs', 'siren,siret,denominationUniteLegale,enseigne1Etablissement,libelleCommuneEtablissement');

    console.log('🔍 Requête OR:', orQuery);

    const orResponse = await fetch(orUrl, {
      headers: {
        'Accept': 'application/json', 
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });

    const orData = await orResponse.json();
    console.log(`✅ Résultats OR: ${orData.header.nombre}/${orData.header.total}`);

    console.log('\n🎉 Test des champs optimisés réussi !');
    console.log('✨ L\'API utilise maintenant les variables officielles INSEE v3.11');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testOptimizedFields();
