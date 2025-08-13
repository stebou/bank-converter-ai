# Analyse des Variables SIRENE - Problèmes de Précision

## Problèmes Identifiés dans Notre Code

### 1. Champs Manquants Importants

**Variables entrepreneurs individuels :**
- ✅ Nous utilisons : `nomUniteLegale`, `prenom1UniteLegale`
- ❌ Manquant : `prenom2UniteLegale`, `prenom3UniteLegale`, `prenom4UniteLegale`, `prenomUsuelUniteLegale`
- ❌ Manquant : `nomUsageUniteLegale` (nom d'usage vs nom de naissance)

**Variables dénomination :**
- ✅ Nous utilisons : `denominationUniteLegale`
- ❌ Manquant : `denominationUsuelle1UniteLegale`, `denominationUsuelle2UniteLegale`, `denominationUsuelle3UniteLegale`
- ❌ Manquant : `sigleUniteLegale`, `pseudonymeUniteLegale`

### 2. Recherche Trop Restrictive

**Problème actuel :**
```typescript
// Notre recherche actuelle
(denominationUniteLegale:TERM* OR nomUniteLegale:TERM*)
```

**Recherche optimisée selon la doc :**
```typescript
// Devrait inclure tous les champs de dénomination
(
  denominationUniteLegale:TERM* OR 
  denominationUsuelle1UniteLegale:TERM* OR 
  denominationUsuelle2UniteLegale:TERM* OR 
  denominationUsuelle3UniteLegale:TERM* OR
  sigleUniteLegale:TERM* OR
  nomUniteLegale:TERM* OR 
  nomUsageUniteLegale:TERM* OR
  prenomUsuelUniteLegale:TERM*
)
```

### 3. Enseignes d'Établissements Manquées

**Variables enseigne non utilisées :**
- `enseigne1Etablissement`, `enseigne2Etablissement`, `enseigne3Etablissement`
- `denominationUsuelleEtablissement`

### 4. Adresse Incomplète

**Variables adresse manquantes :**
- `complementAdresseEtablissement`
- `distributionSpecialeEtablissement`
- `codeCommuneEtablissement` (code géographique officiel)

### 5. Recherche Textuelle Imprécise

**Problème :** Notre formatage avec guillemets peut être trop restrictif
```typescript
// Actuel : terme avec espaces → "JEAN MARTIN"
// Problème : cherche exactement "JEAN MARTIN"
// Solution : terme avec espaces → JEAN* AND MARTIN*
```

## Corrections Recommandées

### 1. Élargir les Champs de Recherche
```typescript
const SEARCH_FIELDS = [
  // Dénominations principales
  'denominationUniteLegale',
  'denominationUsuelle1UniteLegale',
  'denominationUsuelle2UniteLegale', 
  'denominationUsuelle3UniteLegale',
  'sigleUniteLegale',
  // Noms personnes physiques
  'nomUniteLegale',
  'nomUsageUniteLegale',
  'prenomUsuelUniteLegale',
  'prenom1UniteLegale',
  // Enseignes établissement
  'enseigne1Etablissement',
  'enseigne2Etablissement',
  'enseigne3Etablissement',
  'denominationUsuelleEtablissement'
];
```

### 2. Améliorer la Requête de Recherche
```typescript
// Au lieu de OR simple, utiliser une recherche plus fine
function buildAdvancedSearch(term: string): string {
  const cleanTerm = term.trim().toUpperCase();
  
  if (cleanTerm.includes(' ')) {
    // Pour "JEAN MARTIN" → (JEAN* AND MARTIN*) dans tous les champs
    const words = cleanTerm.split(/\s+/);
    const wordQueries = words.map(word => `${word}*`).join(' AND ');
    return `(${SEARCH_FIELDS.map(field => `${field}:(${wordQueries})`).join(' OR ')})`;
  } else {
    // Pour "MARTIN" → MARTIN* dans tous les champs
    return `(${SEARCH_FIELDS.map(field => `${field}:${cleanTerm}*`).join(' OR ')})`;
  }
}
```

### 3. Ajouter Tous les Champs dans les Résultats
```typescript
const COMPLETE_RESPONSE_FIELDS = [
  // Identification
  'siren', 'siret',
  // Unité légale - toutes les dénominations
  'denominationUniteLegale',
  'denominationUsuelle1UniteLegale',
  'denominationUsuelle2UniteLegale',
  'denominationUsuelle3UniteLegale',
  'sigleUniteLegale',
  'pseudonymeUniteLegale',
  // Personnes physiques - tous les noms/prénoms
  'nomUniteLegale',
  'nomUsageUniteLegale',
  'prenom1UniteLegale',
  'prenom2UniteLegale',
  'prenom3UniteLegale',
  'prenom4UniteLegale',
  'prenomUsuelUniteLegale',
  'sexeUniteLegale',
  // Établissement - toutes les enseignes
  'enseigne1Etablissement',
  'enseigne2Etablissement', 
  'enseigne3Etablissement',
  'denominationUsuelleEtablissement',
  // Adresse complète
  'numeroVoieEtablissement',
  'typeVoieEtablissement',
  'libelleVoieEtablissement',
  'complementAdresseEtablissement',
  'codePostalEtablissement',
  'libelleCommuneEtablissement',
  'codeCommuneEtablissement',
  'distributionSpecialeEtablissement'
];
```

## Impact Attendu

1. **Meilleure couverture** : Trouvera plus d'entrepreneurs individuels
2. **Recherche flexible** : Gèrera mieux les espaces et mots multiples
3. **Résultats complets** : Affichera tous les noms/enseignes disponibles
4. **Adresses précises** : Informations d'adresse plus détaillées
