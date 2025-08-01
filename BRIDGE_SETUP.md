# 🌉 Configuration Bridge API - Guide Complet

## 1. Création du compte Bridge API

### Étapes :
1. **Inscription** : Allez sur [Bridge Dashboard](https://dashboard.bridgeapi.io/signup)
2. **Vérification** : Confirmez votre email
3. **Création d'application** : Créez une nouvelle application sandbox
4. **Récupération des credentials** :
   - `Client ID` (public)
   - `Client Secret` (privé - à garder secret)

## 2. Configuration des environnements

### URLs de base :
- **Sandbox** : `https://api.bridgeapi.io/v3` (recommandé pour tests)
- **Production** : `https://api.bridgeapi.io/v3` (même URL, différents credentials)

### Variables d'environnement à ajouter

Ajoutez dans votre `.env.local` :

```env
# Bridge API - Configuration Sandbox
BRIDGE_CLIENT_ID="your_sandbox_client_id"
BRIDGE_CLIENT_SECRET="your_sandbox_client_secret"
BRIDGE_API_URL="https://api.bridgeapi.io/v3"
BRIDGE_ENVIRONMENT="sandbox"

# Clé de chiffrement pour données bancaires
BANKING_ENCRYPTION_KEY="votre_cle_32_caracteres_minimum"
```

## 3. Endpoints principaux Bridge API

### Authentification
- **POST** `/auth/token` - Obtenir un token d'accès

### Comptes bancaires  
- **GET** `/accounts` - Liste des comptes
- **GET** `/accounts/{id}` - Détails d'un compte

### Transactions
- **GET** `/accounts/{id}/transactions` - Transactions d'un compte
- **GET** `/transactions` - Toutes les transactions

### Utilisateurs
- **POST** `/users` - Créer un utilisateur
- **GET** `/users/{id}` - Détails utilisateur

## 4. Test avec Postman

Bridge API fournit une collection Postman :
1. Téléchargez la collection depuis le dashboard
2. Configurez vos credentials sandbox
3. Testez les endpoints avant intégration

## 5. Banques de test disponibles (Sandbox)

En mode sandbox, Bridge API simule plusieurs banques :
- **Crédit Agricole** (test)
- **BNP Paribas** (test) 
- **Société Générale** (test)
- **LCL** (test)
- Etc.

Credentials de test fournis par Bridge dans le dashboard.