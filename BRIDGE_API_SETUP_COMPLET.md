# 🌉 Configuration Bridge API - Guide Détaillé

## Étape 1: Inscription sur Bridge API

### 1. Créer un compte

1. Allez sur [https://dashboard.bridgeapi.io/signup](https://dashboard.bridgeapi.io/signup)
2. Inscrivez-vous avec votre email professionnel
3. Confirmez votre email

### 2. Créer une application

1. Connectez-vous au dashboard Bridge
2. Cliquez sur "Create App" ou "Nouvelle Application"
3. Choisissez "Sandbox" pour les tests
4. Nommez votre app (ex: "Bank-IA Development")

### 3. Récupérer les credentials

Dans le dashboard, vous obtiendrez :

- **Client ID** (ex: `client_123abc`)
- **Client Secret** (ex: `secret_456def`)

## Étape 2: Configuration dans votre app

### 1. Créer le fichier .env.local

```bash
# Dans votre dossier racine, créez .env.local avec :

# Bridge API - SANDBOX
BRIDGE_CLIENT_ID="votre_client_id_ici"
BRIDGE_CLIENT_SECRET="votre_client_secret_ici"
BRIDGE_API_URL="https://api.bridgeapi.io/v3"
BRIDGE_ENVIRONMENT="sandbox"

# Clé de chiffrement (générez une clé de 32 caractères)
BANKING_ENCRYPTION_KEY="votre_cle_32_caracteres_minimum_ici"
```

### 2. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## Étape 3: Test avec Bridge API

### 1. Tester l'authentification

Une fois configuré, le bouton "Synchroniser" devrait fonctionner.

### 2. Banques de test disponibles

En mode sandbox, Bridge API simule ces banques :

- Crédit Agricole (test)
- BNP Paribas (test)
- Société Générale (test)
- LCL (test)
- Banque Populaire (test)

### 3. Comptes de test

Bridge fournit des comptes de test avec :

- Données bancaires simulées
- Transactions fictives mais réalistes
- Soldes de test

## Étape 4: Passer en production

### 1. Créer une app production

Dans le dashboard Bridge :

1. Créez une nouvelle app "Production"
2. Soumettez votre app pour validation
3. Attendez l'approbation de Bridge

### 2. Mettre à jour les variables

```bash
# Pour la production
BRIDGE_CLIENT_ID="votre_client_id_production"
BRIDGE_CLIENT_SECRET="votre_client_secret_production"
BRIDGE_ENVIRONMENT="production"
```

## Notes importantes

### Sécurité

- ⚠️ **Jamais** de credentials en dur dans le code
- ⚠️ **Jamais** commiter le fichier .env.local
- ✅ Utilisez des variables d'environnement

### Limites Sandbox

- Données fictives uniquement
- Certaines fonctionnalités limitées
- Taux de requêtes réduit

### Support

- Documentation : [https://docs.bridgeapi.io](https://docs.bridgeapi.io)
- Support : contact@bridgeapi.io

---

## Alternative : Continuez avec les données de test

Si vous voulez juste développer l'interface sans Bridge API :

1. Utilisez le bouton **"Données Test"**
2. Développez toutes les fonctionnalités UI
3. Configurez Bridge API plus tard
