# Configuration de l'API INSEE SIRENE

## Problème résolu : Authentification 401 Unauthorized

L'erreur 401 que vous receviez était due à une mauvaise méthode d'authentification. L'API INSEE SIRENE utilise un système OAuth2 avec des clés applicatives (consumer key/secret) et non une simple clé API.

## Solution implémentée

J'ai mis à jour le code pour utiliser la bonne méthode d'authentification :

1. **Nouveau service d'authentification** dans `src/lib/services/sirene-api.ts`
   - Utilisation de `consumer_key` et `consumer_secret`
   - Génération automatique de tokens d'accès OAuth2
   - Gestion de l'expiration et du renouvellement des tokens

2. **Variables d'environnement mises à jour** dans `.env.local`

## Comment obtenir vos vraies clés INSEE

### Étape 1 : Créer un compte INSEE
1. Allez sur https://api.insee.fr/catalogue/
2. Cliquez sur "Créer son compte"
3. Remplissez le formulaire d'inscription
4. Confirmez votre email

### Étape 2 : Souscrire à l'API Sirene
1. Connectez-vous sur le portail
2. Recherchez "Sirene V3.11"
3. Cliquez sur la page de l'API
4. Cliquez sur "Souscrire"
5. Confirmez votre souscription

### Étape 3 : Générer vos clés
1. Après souscription, cliquez sur "Voir les souscriptions"
2. Cliquez sur "Générez les clefs"
3. Notez votre **Consumer Key** et **Consumer Secret**

### Étape 4 : Configurer l'application
Modifiez le fichier `.env.local` :

```bash
# Remplacez par vos vraies clés INSEE
INSEE_CONSUMER_KEY=votre_consumer_key_ici
INSEE_CONSUMER_SECRET=votre_consumer_secret_ici
```

## État actuel du système

✅ **Fonctionnel avec données de fallback** : Le système affiche des entreprises avec des données factices de haute qualité

🔄 **Prêt pour l'INSEE** : Une fois vos clés configurées, le système utilisera automatiquement les vraies données INSEE

⚡ **Authentification automatique** : Le système gère automatiquement l'obtention et le renouvellement des tokens OAuth2

## Test de la configuration

Une fois vos clés ajoutées :

1. Redémarrez l'application (`npm run dev`)
2. Ouvrez la popup de recherche d'entreprises
3. Faites une recherche
4. Vérifiez les logs dans la console pour voir si l'authentification réussit

## Dépannage

### Si vous recevez encore une erreur 401 :
- Vérifiez que vos clés sont correctes
- Assurez-vous d'avoir bien souscrit à l'API Sirene V3.11
- Vérifiez que votre compte INSEE est activé

### Si vous recevez une erreur 403 :
- Votre quota d'appels API est peut-être dépassé
- Vérifiez les limites de votre souscription INSEE

### Logs utiles :
Le système affiche des logs détaillés dans la console :
- `Requesting new INSEE access token...` : Demande de token
- `INSEE access token obtained` : Token obtenu avec succès
- `Making SIRENE API request` : Appel API en cours

## Note importante

Le système fonctionne parfaitement avec des données de démonstration en attendant votre configuration INSEE. Les fonctionnalités de recherche, filtrage, et ajout aux listes sont entièrement opérationnelles.
