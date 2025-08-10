# Recherche en temps réel - Base entreprises

## Fonctionnalités implémentées

### 1. Recherche automatique par nom d'entreprise ✅
- Tapez simplement le nom d'une entreprise dans la barre de recherche
- La recherche se déclenche automatiquement après 500ms (debounce)
- Minimum 2 caractères pour déclencher la recherche

### 2. Recherche à chaque frappe ✅
- Système de debouncing intelligent pour éviter trop d'appels API
- Annulation automatique des recherches précédentes
- Indicateur visuel pendant la recherche

### 3. Affichage des résultats limités ✅
- Maximum 5 résultats par défaut pour un aperçu rapide
- Message indiquant le nombre total disponible
- Bouton pour effacer les résultats (X dans la barre de recherche)

### 4. Logs détaillés dans la console ✅
- Tous les événements de recherche sont loggés avec horodatage
- Détails des paramètres de recherche
- Temps de réponse de l'API INSEE
- Informations d'enrichissement des données

## Comment utiliser

1. **Recherche par nom** : Tapez "Renault" ou "BNP Paribas"
2. **Recherche par SIREN** : Tapez un SIREN à 9 chiffres (ex: "552120222")
3. **Recherche par SIRET** : Tapez un SIRET à 14 chiffres
4. **Effacer** : Cliquez sur le X dans la barre de recherche

## Logs de débogage

Ouvrez la console du navigateur (F12) pour voir les logs en temps réel :

- `[CompanyData HH:MM:SS] Recherche en temps réel programmée`
- `[CompanyData HH:MM:SS] Déclenchement recherche automatique`
- `[CompanyData HH:MM:SS] Résultats de recherche INSEE`
- `[CompanyData HH:MM:SS] Enrichissement entreprise`
- `[CompanyData HH:MM:SS] Recherche terminée avec succès`

## Fonctionnalités supprimées

- ❌ Bouton "Test API INSEE" (remplacé par recherche automatique)
- ❌ Recherche manuelle avec bouton "Entrée" (remplacé par temps réel)

## Configuration

- **Debounce** : 500ms (configurable dans useCompanyData)
- **Limite résultats** : 5 par défaut pour la recherche temps réel
- **Minimum caractères** : 2 pour déclencher la recherche
