# 🔍 Recherche par Nom Propre - Guide d'utilisation

## 📋 Vue d'ensemble

Le système de recherche supporte maintenant la recherche par nom propre pour les entrepreneurs individuels, auto-entrepreneurs, et professions libérales. Cette fonctionnalité recherche dans les champs `prenom1UniteLegale` et `nomUniteLegale` de l'API INSEE Sirene.

## 🎯 Types de recherche supportés

### 1. Dénomination sociale classique
```typescript
// Recherche d'entreprise par nom commercial
await companyService.searchCompanies({ nom: "Apple" });
await companyService.searchCompanies({ nom: "Total Energies" });
```

### 2. Nom propre (Prénom Nom)
```typescript
// Recherche d'entrepreneur individuel
await companyService.searchCompanies({ nom: "Jean Dupont" });
await companyService.searchCompanies({ nom: "Marie Martin" });
await companyService.searchCompanies({ nom: "Pierre-Louis Durand" });
```

### 3. Nom propre inversé (Nom Prénom)
```typescript
// Le système teste aussi l'ordre inversé automatiquement
await companyService.searchCompanies({ nom: "Dupont Jean" });
await companyService.searchCompanies({ nom: "Martin Marie" });
```

### 4. Recherche par un seul mot
```typescript
// Recherche dans prénom, nom ET dénomination
await companyService.searchCompanies({ nom: "Marie" });
// Trouvera :
// - Marie Dupont (prénom)
// - Jean Marie (nom de famille)
// - Boulangerie Marie (dénomination)
```

## 🔄 Stratégie de recherche intelligente

### Recherche initiale
Le système commence par une recherche optimisée qui combine :
1. **Dénomination sociale** avec recherche exacte ou wildcard
2. **Nom propre** avec différentes combinaisons prenom/nom
3. **Logique OR** entre toutes les possibilités

### Fallback automatique (si aucun résultat)
Si la recherche initiale ne donne rien, le système active automatiquement :
1. **Recherche par mots-clés** dans la dénomination
2. **Recherche croisée prenom/nom** dans les deux sens
3. **Recherche floue** dans tous les champs (dénomination, prénom, nom)

## 📊 Exemples concrets

### Entrepreneur individuel
```typescript
// Recherche : "Jean Dupont"
// Requêtes générées :
// 1. denominationUniteLegale:"Jean Dupont"
// 2. (prenom1UniteLegale:Jean* AND nomUniteLegale:Dupont*)
// 3. (prenom1UniteLegale:Dupont* AND nomUniteLegale:Jean*)
// 4. (prenom1UniteLegale:Jean* OR nomUniteLegale:Jean*)
```

### Auto-entrepreneur
```typescript
// Recherche : "Marie Martin Conseil"
// Trouvera :
// - Marie MARTIN (EI avec activité conseil)
// - MARTIN Marie Conseil (SARL)
// - Conseil Marie Martin (entreprise)
```

### Profession libérale
```typescript
// Recherche : "Dr Benoit"
// Trouvera :
// - BENOIT (prénom: Dr, nom: Benoit)  
// - Dr BENOIT SAS
// - Cabinet Dr Benoit
```

## 🚀 Avantages

1. **Recherche exhaustive** : Couvre tous les cas de figure
2. **Tolérance aux erreurs** : Fonctionne même si l'ordre prénom/nom est inversé
3. **Fallback intelligent** : Trouve des résultats même pour des recherches partielles
4. **Performance optimisée** : Recherche exacte en priorité, puis fallback si nécessaire

## 🔧 Configuration dans l'interface

L'interface utilisateur peut utiliser cette fonctionnalité de manière transparente :

```typescript
// Dans votre composant React
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = async () => {
  // Cette recherche fonctionnera pour :
  // - "Apple" (entreprise)
  // - "Jean Dupont" (entrepreneur)
  // - "Dupont Jean" (entrepreneur, ordre inversé)
  const results = await companyService.searchCompanies({ 
    nom: searchQuery 
  });
};
```

## 📝 Logs de débogage

Le système affiche des logs détaillés pour suivre le processus :

```
🔍 URL API INSEE: [requête initiale]
📊 Statut réponse INSEE: 200/404
🔄 Tentative de recherche alternative avec mots séparés et nom propre...
📊 Statut réponse alternative: 200
✅ Recherche alternative réussie !
📊 Résultats INSEE: X bruts → Y après déduplication
```

## 🎪 Cas d'usage typiques

- **Notaires** : "Maître Dupont", "Jean Dupont Notaire"
- **Médecins** : "Dr Martin", "Marie Martin"  
- **Consultants** : "Pierre Conseil", "Jean-Luc Expert"
- **Artisans** : "Michel Plombier", "Marie Coiffure"
- **Commerçants** : "Boulangerie Dupont", "Jean Boulanger"

Cette fonctionnalité enrichit considérablement la capacité de recherche du système en couvrant tous les types d'entreprises françaises, des multinationales aux micro-entrepreneurs ! 🎯
