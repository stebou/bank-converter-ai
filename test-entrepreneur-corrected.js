// Test de la correction pour les entrepreneurs individuels
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

  // Texte libre : recherche combinée sur dénomination ET nom (pour inclure les entrepreneurs individuels)
  if (freeText && freeText.trim()) {
    const term = clean(freeText);
    const formattedTerm = formatSearchTerm(term);
    // Recherche dans denomination (sociétés) OU nomUniteLegale (entrepreneurs individuels)
    parts.push(`(denominationUniteLegale:${formattedTerm}* OR nomUniteLegale:${formattedTerm}*)`);
  }

  // État administratif par défaut
  parts.push('etatAdministratifUniteLegale:A');
  
  // Retourner la requête avec AND simple
  const query = parts.join(' AND ');
  return query || 'etatAdministratifUniteLegale:A';
}

async function testEntrepreneurIndividuelCorrected() {
  console.log('🔧 Test de la correction pour entrepreneurs individuels');
  console.log('='.repeat(60));

  const testCases = [
    { term: 'MARTIN', description: 'Nom courant (devrait trouver sociétés ET entrepreneurs)' },
    { term: 'CYRIL', description: 'Prénom typique d\'entrepreneur individuel' },
    { term: 'NADIA', description: 'Prénom féminin d\'entrepreneur individuel' },
    { term: 'DUPONT', description: 'Nom de famille très courant' },
    { term: 'JEAN MARTIN', description: 'Prénom + nom complet' }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.description}`);
    console.log(`   🔤 Recherche: "${testCase.term}"`);

    const sireneQuery = buildQueryFromCriteria({}, testCase.term);
    console.log(`   🏗️  Requête: "${sireneQuery}"`);

    try {
      const searchUrl = 'https://api.insee.fr/api-sirene/3.11/siret?q=' + 
        encodeURIComponent(sireneQuery) + 
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
            
            // Logique du transformer pour l'affichage
            const denomination = uniteLegale.denominationUniteLegale || 
                                (uniteLegale.prenom1UniteLegale && uniteLegale.nomUniteLegale ? 
                                  \`\${uniteLegale.prenom1UniteLegale} \${uniteLegale.nomUniteLegale}\`.trim() : 
                                  uniteLegale.nomUniteLegale) ||
                                'Nom non disponible';
            
            const categorieJuridique = uniteLegale.categorieJuridiqueUniteLegale || etab.categorieJuridiqueUniteLegale;
            const isEntrepreneurIndividuel = categorieJuridique === '1000';
            const type = isEntrepreneurIndividuel ? '👤 Entrepreneur individuel' : '🏢 Société';
            
            console.log(\`      \${idx + 1}. \${type}\`);
            console.log(\`         Nom affiché: "\${denomination}"\`);
            if (uniteLegale.denominationUniteLegale) {
              console.log(\`         Dénomination: "\${uniteLegale.denominationUniteLegale}"\`);
            }
            if (uniteLegale.nomUniteLegale) {
              console.log(\`         Nom: "\${uniteLegale.nomUniteLegale}"\`);
            }
            if (uniteLegale.prenom1UniteLegale) {
              console.log(\`         Prénom: "\${uniteLegale.prenom1UniteLegale}"\`);
            }
            console.log(\`         SIREN: \${etab.siren}\`);
            console.log(\`         Localisation: \${adresse.codePostalEtablissement || 'N/A'} \${adresse.libelleCommuneEtablissement || 'N/A'}\`);
          });
        } else {
          console.log(\`   ⚠️  Aucun établissement trouvé\`);
        }
      } else {
        const errorText = await response.text();
        console.log(\`   ❌ Erreur \${response.status}: \${response.statusText}\`);
        console.log(\`   📄 Détails: \${errorText}\`);
      }
    } catch (error) {
      console.log(\`   🚫 Exception: \${error.message}\`);
    }
  }

  console.log('\\n🎉 Test terminé ! La correction devrait maintenant inclure les entrepreneurs individuels.');
}

testEntrepreneurIndividuelCorrected();
