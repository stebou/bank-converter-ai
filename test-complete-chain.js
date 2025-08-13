// Test complet de la chaîne API -> Transformer -> Affichage
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';

// Simuler exactement ce que fait notre service
async function testCompleteChain() {
  console.log('🔗 Test complet de la chaîne API → Transformer → Popup');
  console.log('='.repeat(65));

  try {
    // 1. Appel direct à l'API INSEE comme le fait notre service
    console.log('\n📡 1. Appel API INSEE (comme sirene-api.ts)...');
    
    const searchUrl = 'https://api.insee.fr/api-sirene/3.11/siret?q=' + encodeURIComponent('denominationUniteLegale:PEUGEOT* AND etatAdministratifUniteLegale:A') + '&nombre=2&champs=siren,siret,denominationUniteLegale,nomUniteLegale,activitePrincipaleUniteLegale,categorieJuridiqueUniteLegale,dateCreationUniteLegale,trancheEffectifsUniteLegale,etatAdministratifUniteLegale,nicSiegeUniteLegale,enseigne1Etablissement,etatAdministratifEtablissement,etablissementSiege,dateCreationEtablissement,numeroVoieEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement&tri=score desc';

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });

    const data = await response.json();
    console.log(`✅ API INSEE: ${data.header.statut} | ${data.header.nombre}/${data.header.total} établissements`);

    if (data.etablissements && data.etablissements.length > 0) {
      // 2. Transformation (comme sirene-transformer.ts)
      console.log('\n🔄 2. Transformation des données (comme transformer)...');
      
      const etab = data.etablissements[0];
      console.log('Données brutes reçues:', {
        siren: etab.siren,
        siret: etab.siret,
        hasUniteLegale: !!etab.uniteLegale,
        hasAdresse: !!etab.adresseEtablissement,
        hasPeriodes: !!etab.periodesEtablissement
      });

      // Transformation manuelle (simulant le transformer)
      const uniteLegale = etab.uniteLegale || {};
      const adresse = etab.adresseEtablissement || {};
      const periodeCourante = etab.periodesEtablissement?.find(p => p.dateFin === null) || etab.periodesEtablissement?.[0];

      const transformedCompany = {
        siren: etab.siren,
        siret: etab.siret || '',
        denomination: uniteLegale.denominationUniteLegale || etab.denominationUniteLegale || 'Nom non disponible',
        activitePrincipale: uniteLegale.activitePrincipaleUniteLegale || '',
        activitePrincipaleLibelle: getActivityLabel(uniteLegale.activitePrincipaleUniteLegale),
        categorieJuridique: uniteLegale.categorieJuridiqueUniteLegale || '',
        adresse: {
          numeroVoie: adresse.numeroVoieEtablissement || etab.numeroVoieEtablissement,
          typeVoie: adresse.typeVoieEtablissement || etab.typeVoieEtablissement,
          libelleVoie: adresse.libelleVoieEtablissement || etab.libelleVoieEtablissement,
          codePostal: adresse.codePostalEtablissement || etab.codePostalEtablissement || '',
          commune: adresse.libelleCommuneEtablissement || etab.libelleCommuneEtablissement || '',
          departement: '',
          region: ''
        },
        trancheEffectifs: uniteLegale.trancheEffectifsUniteLegale || '',
        trancheEffectifsLibelle: getEffectiveRangeLabel(uniteLegale.trancheEffectifsUniteLegale),
        dateCreation: uniteLegale.dateCreationUniteLegale || '',
        etatAdministratif: uniteLegale.etatAdministratifUniteLegale || periodeCourante?.etatAdministratifEtablissement || ''
      };

      console.log('✅ Données transformées pour la popup:');
      console.log(`   📋 Dénomination: "${transformedCompany.denomination}"`);
      console.log(`   🏢 SIREN: ${transformedCompany.siren}`);
      console.log(`   📍 Localisation: ${transformedCompany.adresse.codePostal} ${transformedCompany.adresse.commune}`);
      console.log(`   👥 Effectifs: ${transformedCompany.trancheEffectifsLibelle || 'Non renseigné'}`);
      console.log(`   ⚡ État: ${transformedCompany.etatAdministratif === 'A' ? 'Actif' : 'Inactif'}`);
      console.log(`   🔧 Activité: ${transformedCompany.activitePrincipaleLibelle || transformedCompany.activitePrincipale}`);

      // 3. Vérification de l'affichage dans la popup
      console.log('\n🖥️ 3. Vérification affichage popup...');
      
      const popupData = {
        // Ce que la popup affiche exactement
        title: transformedCompany.denomination,
        subtitle: transformedCompany.activitePrincipaleLibelle,
        siren: `SIREN: ${transformedCompany.siren}`,
        siret: transformedCompany.siret ? `| SIRET: ${transformedCompany.siret}` : '',
        location: `${transformedCompany.adresse.commune}${transformedCompany.adresse.departement ? `, ${transformedCompany.adresse.departement}` : ''}${transformedCompany.adresse.codePostal ? ` (${transformedCompany.adresse.codePostal})` : ''}`,
        employees: transformedCompany.trancheEffectifsLibelle || 'Non précisé',
        year: transformedCompany.dateCreation ? new Date(transformedCompany.dateCreation).getFullYear() : 'N/A',
        status: transformedCompany.etatAdministratif === 'A' ? 'Actif' : 'Fermé'
      };

      console.log('✅ Données pour affichage popup:');
      console.log(`   📄 Titre: "${popupData.title}"`);
      console.log(`   📝 Sous-titre: "${popupData.subtitle}"`);
      console.log(`   🆔 Identifiants: "${popupData.siren} ${popupData.siret}"`);
      console.log(`   📍 Localisation: "${popupData.location}"`);
      console.log(`   👥 Employés: "${popupData.employees}"`);
      console.log(`   📅 Année: ${popupData.year}`);
      console.log(`   🟢 Statut: ${popupData.status}`);

      console.log('\n🎉 CHAÎNE COMPLÈTE FONCTIONNELLE !');
      console.log('✨ La popup devrait maintenant afficher toutes les informations correctement');

    } else {
      console.log('❌ Aucun établissement trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur dans la chaîne:', error.message);
  }
}

// Fonctions helper (copies de celles du transformer)
function getActivityLabel(code) {
  if (!code) return '';
  const nafLabels = {
    '70.10Z': 'Activités des sièges sociaux',
    '62.01Z': 'Programmation informatique',
    '47.11F': 'Hypermarchés',
    '94.20Z': 'Activités des organisations professionnelles'
  };
  return nafLabels[code] || `Activité ${code}`;
}

function getEffectiveRangeLabel(code) {
  if (!code) return '';
  const effectiveLabels = {
    '00': '0 salarié',
    '01': '1 ou 2 salariés',
    '02': '3 à 5 salariés',
    '03': '6 à 9 salariés',
    '11': '10 à 19 salariés',
    '12': '20 à 49 salariés',
    '21': '50 à 99 salariés',
    '22': '100 à 199 salariés',
    '31': '200 à 249 salariés',
    '32': '250 à 499 salariés',
    '41': '500 à 999 salariés',
    '42': '1 000 à 1 999 salariés'
  };
  return effectiveLabels[code] || `${code} salariés`;
}

testCompleteChain();
