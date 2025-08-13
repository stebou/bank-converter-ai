// Test pour identifier le problème avec les entrepreneurs individuels
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';

async function testEntrepreneurIndividuelSearch() {
  console.log('👤 Test de recherche d\'entrepreneurs individuels');
  console.log('='.repeat(55));

  // Test avec différentes approches de recherche
  const testCases = [
    {
      name: 'Recherche classique (denominationUniteLegale uniquement)',
      query: 'denominationUniteLegale:MARTIN* AND etatAdministratifUniteLegale:A'
    },
    {
      name: 'Recherche par nom (nomUniteLegale)',
      query: 'nomUniteLegale:MARTIN* AND etatAdministratifUniteLegale:A'
    },
    {
      name: 'Recherche combinée (denomination OU nom)',
      query: '(denominationUniteLegale:MARTIN* OR nomUniteLegale:MARTIN*) AND etatAdministratifUniteLegale:A'
    },
    {
      name: 'Recherche générale avec * (sans spécifier le champ)',
      query: 'MARTIN* AND etatAdministratifUniteLegale:A'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    console.log(`   🔍 Requête: "${testCase.query}"`);

    try {
      const searchUrl = 'https://api.insee.fr/api-sirene/3.11/siret?q=' + 
        encodeURIComponent(testCase.query) + 
        '&nombre=5&champs=siren,siret,denominationUniteLegale,nomUniteLegale,prenom1UniteLegale,categorieJuridiqueUniteLegale,activitePrincipaleUniteLegale,etatAdministratifUniteLegale,codePostalEtablissement,libelleCommuneEtablissement&tri=score desc';

      const response = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'X-INSEE-Api-Key-Integration': API_KEY
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Succès: ${data.header.nombre}/${data.header.total} résultats`);
        
        if (data.etablissements && data.etablissements.length > 0) {
          data.etablissements.slice(0, 3).forEach((etab, idx) => {
            const uniteLegale = etab.uniteLegale || {};
            const adresse = etab.adresseEtablissement || {};
            
            // Affichage détaillé pour comprendre la structure
            const denomination = uniteLegale.denominationUniteLegale || etab.denominationUniteLegale;
            const nom = uniteLegale.nomUniteLegale || etab.nomUniteLegale;
            const prenom = uniteLegale.prenom1UniteLegale || etab.prenom1UniteLegale;
            const categorieJuridique = uniteLegale.categorieJuridiqueUniteLegale || etab.categorieJuridiqueUniteLegale;
            
            console.log(`      ${idx + 1}. Type: ${getCategorieJuridiqueLabel(categorieJuridique)}`);
            if (denomination) console.log(`         Dénomination: "${denomination}"`);
            if (nom) console.log(`         Nom: "${nom}"`);
            if (prenom) console.log(`         Prénom: "${prenom}"`);
            console.log(`         SIREN: ${etab.siren}`);
            console.log(`         Localisation: ${adresse.codePostalEtablissement || 'N/A'} ${adresse.libelleCommuneEtablissement || 'N/A'}`);
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
}

function getCategorieJuridiqueLabel(code) {
  const labels = {
    '1000': 'Entrepreneur individuel',
    '5710': 'SAS, société par actions simplifiée',
    '5499': 'SARL, société à responsabilité limitée',
    '5505': 'SARL unipersonnelle',
    '5720': 'SASU, société par actions simplifiée unipersonnelle',
    '6540': 'EURL, entreprise unipersonnelle à responsabilité limitée',
    '5800': 'Société coopérative commerciale'
  };
  return labels[code] || `Catégorie ${code}`;
}

testEntrepreneurIndividuelSearch();
