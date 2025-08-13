// Test de la correction pour les espaces
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';

// Fonction buildQueryFromCriteria corrigée
function buildQueryFromCriteria(criteria, freeText) {
  const parts = [];
  const clean = (v) => v?.trim().toUpperCase().replace(/\s+/g, ' ');
  
  // Helper pour gérer les espaces dans les requêtes SIRENE
  const formatSearchTerm = (term) => {
    // Si le terme contient des espaces, l'entourer de guillemets
    return term.includes(' ') ? `"${term}"` : term;
  };

  // Texte libre : recherche sur dénomination (champ validé)
  if (freeText && freeText.trim()) {
    const term = clean(freeText);
    const formattedTerm = formatSearchTerm(term);
    parts.push(`denominationUniteLegale:${formattedTerm}*`);
  }

  // Critères spécifiques avec champs validés uniquement
  if (criteria.denomination) {
    const term = clean(criteria.denomination);
    const formattedTerm = formatSearchTerm(term);
    parts.push(`denominationUniteLegale:${formattedTerm}*`);
  }

  if (criteria.siren) parts.push(`siren:${criteria.siren}`);
  if (criteria.codePostal) parts.push(`codePostalEtablissement:${criteria.codePostal}`);
  if (criteria.commune) {
    const term = clean(criteria.commune);
    const formattedTerm = formatSearchTerm(term);
    parts.push(`libelleCommuneEtablissement:${formattedTerm}`);
  }
  if (criteria.activitePrincipale) parts.push(`activitePrincipaleUniteLegale:${criteria.activitePrincipale}`);
  
  // État administratif : uniquement au niveau unité légale (validé)
  if (criteria.etatAdministratif) {
    parts.push(`etatAdministratifUniteLegale:${criteria.etatAdministratif}`);
  } else {
    // Par défaut uniquement les unités légales actives
    parts.push('etatAdministratifUniteLegale:A');
  }
  
  // Retourner la requête avec AND simple
  const query = parts.join(' AND ');
  return query || 'etatAdministratifUniteLegale:A';
}

async function testCorrectedSearches() {
  console.log('🔧 Test des recherches avec espaces (CORRIGÉES)');
  console.log('='.repeat(55));

  const testCases = [
    { query: 'PEUGEOT', description: 'Sans espace (contrôle)' },
    { query: 'PEUGEOT CITROEN', description: 'Avec espace (problématique avant)' },
    { query: 'LA POSTE', description: 'Avec espace (nom courant)' },
    { query: 'CREDIT AGRICOLE', description: 'Avec espaces multiples' }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.description}`);
    console.log(`   🔤 Recherche: "${testCase.query}"`);

    // Construction de la requête avec la fonction corrigée
    const sireneQuery = buildQueryFromCriteria({}, testCase.query);
    console.log(`   🏗️  Requête SIRENE: "${sireneQuery}"`);

    try {
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
            console.log(`         SIREN: ${etab.siren}, Loc: ${adresse.codePostalEtablissement || 'N/A'} ${adresse.libelleCommuneEtablissement || 'N/A'}`);
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

  console.log('\n🎉 Tests terminés ! La correction devrait résoudre le problème des espaces.');
}

testCorrectedSearches();
