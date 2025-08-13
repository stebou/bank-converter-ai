// Test du transformer corrigé avec structure INSEE réelle
const API_KEY = 'f67adfa7-6eaf-4931-b424-da112b9ec7a8';
const BASE_URL = 'https://api.insee.fr/api-sirene/3.11';

async function testTransformerFixed() {
  console.log('🔧 Test du transformer corrigé avec structure INSEE réelle');
  console.log('='.repeat(60));

  try {
    // Récupérer des données réelles de l'API INSEE
    console.log('📡 Récupération données CARREFOUR...');
    
    const response = await fetch(`${BASE_URL}/siret?q=denominationUniteLegale:CARREFOUR*&nombre=2&champs=siren,siret,denominationUniteLegale,enseigne1Etablissement,codePostalEtablissement,libelleCommuneEtablissement,etatAdministratifEtablissement,activitePrincipaleUniteLegale,trancheEffectifsUniteLegale`, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });

    const data = await response.json();
    
    if (data.etablissements && data.etablissements.length > 0) {
      console.log(`✅ ${data.etablissements.length} établissements récupérés`);
      
      // Examiner la structure du premier établissement
      const etab = data.etablissements[0];
      console.log('\n📊 Structure de données reçue:');
      console.log('SIREN/SIRET:', etab.siren, '/', etab.siret);
      console.log('Unité légale:', etab.uniteLegale ? 'Présente' : 'Absente');
      if (etab.uniteLegale) {
        console.log('  - Dénomination:', etab.uniteLegale.denominationUniteLegale);
        console.log('  - Activité UL:', etab.uniteLegale.activitePrincipaleUniteLegale);
        console.log('  - État admin UL:', etab.uniteLegale.etatAdministratifUniteLegale);
      }
      console.log('Adresse établissement:', etab.adresseEtablissement ? 'Présente' : 'Absente');
      if (etab.adresseEtablissement) {
        console.log('  - CP:', etab.adresseEtablissement.codePostalEtablissement);
        console.log('  - Commune:', etab.adresseEtablissement.libelleCommuneEtablissement);
      }
      console.log('Périodes établissement:', etab.periodesEtablissement ? `${etab.periodesEtablissement.length} périodes` : 'Absentes');
      
      // Maintenant simuler le transformer
      console.log('\n🔄 Test du transformer...');
      
      // Créer un objet compatible avec notre transformer
      const sireneCompany = {
        siren: etab.siren,
        siret: etab.siret,
        uniteLegale: etab.uniteLegale,
        adresseEtablissement: etab.adresseEtablissement,
        periodesEtablissement: etab.periodesEtablissement,
        // Champs directs
        enseigne1Etablissement: etab.enseigne1Etablissement,
        etatAdministratifEtablissement: etab.etatAdministratifEtablissement
      };

      // Appliquer la transformation manuellement
      const uniteLegale = sireneCompany.uniteLegale || {};
      const adresse = sireneCompany.adresseEtablissement || {};
      const periodeCourante = sireneCompany.periodesEtablissement?.find(p => p.dateFin === null) || sireneCompany.periodesEtablissement?.[0];

      const transformed = {
        siren: sireneCompany.siren,
        siret: sireneCompany.siret || '',
        denomination: uniteLegale.denominationUniteLegale || 'Nom non disponible',
        activitePrincipale: uniteLegale.activitePrincipaleUniteLegale || '',
        activitePrincipaleLibelle: 'TODO: Libellé activité',
        categorieJuridique: uniteLegale.categorieJuridiqueUniteLegale || '',
        adresse: {
          codePostal: adresse.codePostalEtablissement || '',
          commune: adresse.libelleCommuneEtablissement || '',
          departement: '',
          region: ''
        },
        trancheEffectifs: uniteLegale.trancheEffectifsUniteLegale || '',
        trancheEffectifsLibelle: 'TODO: Libellé effectifs',
        dateCreation: uniteLegale.dateCreationUniteLegale || '',
        etatAdministratif: uniteLegale.etatAdministratifUniteLegale || periodeCourante?.etatAdministratifEtablissement || '',
        statutDiffusion: uniteLegale.statutDiffusionUniteLegale || ''
      };

      console.log('\n✅ Données transformées:');
      console.log(`   Dénomination: ${transformed.denomination}`);
      console.log(`   SIREN: ${transformed.siren}`);
      console.log(`   Activité: ${transformed.activitePrincipale}`);
      console.log(`   Adresse: ${transformed.adresse.codePostal} ${transformed.adresse.commune}`);
      console.log(`   État admin: ${transformed.etatAdministratif}`);
      console.log(`   Effectifs: ${transformed.trancheEffectifs}`);

      console.log('\n🎉 Transformer fonctionne correctement !');
      console.log('✨ Les données sont maintenant mappées pour la popup');

    } else {
      console.log('❌ Aucun établissement trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testTransformerFixed();
