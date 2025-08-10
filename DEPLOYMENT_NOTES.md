# Notes de Déploiement - Migration vers Fonctions Python Vercel

## Problème Résolu

L'erreur `python3: command not found` sur Vercel a été résolue en migrant vers les fonctions Python Vercel.

## Changements Effectués

### 1. Fonction Vercel Python (Version Optimisée)

- **Fichier**: `/api/process-pdf-light.py` (version légère)
- **Runtime**: `@vercel/python@4.3.1`
- **Dépendances**: PyMuPDF seulement (v1.23.26)
- **Timeout**: 25 secondes max
- **Optimisations**:
  - Suppression de pdfplumber pour réduire la taille
  - Limite à 5 pages maximum par document
  - Résolution d'image réduite (1x au lieu de 2x)
  - Dépendances minimales

### 2. Configuration Vercel

- **Fichier**: `vercel.json`

```json
{
  "functions": {
    "api/process-pdf-light.py": {
      "runtime": "@vercel/python@4.3.1",
      "maxDuration": 25
    }
  }
}
```

### 3. Module Node.js Adapté

- **Fichier**: `/src/lib/pdf-processing-vercel.ts`
- Remplace `/src/lib/pdf-processing-server.ts`
- Appelle la fonction Vercel par HTTP
- Fallback en développement

### 4. APIs Modifiées

- `/api/documents/route.ts` - Import changé
- `/api/validate-document/route.ts` - Import changé

## URL de la Fonction

- **Production**: `https://[domain]/api/process-pdf-light`
- **Développement**: `http://localhost:3000/api/process-pdf-light`

## Test de la Fonction

```bash
curl -X POST https://[domain]/api/process-pdf-light \
  -H "Content-Type: application/json" \
  -d '{"pdf_base64": "base64_encoded_pdf", "output_mode": "hybrid"}'
```

## Problème de Taille Résolu

- **Problème**: Fonction serverless >250MB (limite Vercel)
- **Cause**: pdfplumber + PyMuPDF trop volumineux
- **Solution**: PyMuPDF seul + optimisations
- **Résultat**: Fonction légère compatible Vercel

## Fichiers Ignorés

Via `.vercelignore`:

- `python-pdf-processor.py` (script local)
- `requirements.txt` (racine)
- Scripts de test Python locaux

## Architecture

```
Ancienne: Node.js → exec python3 script.py → PyMuPDF
Nouvelle: Node.js → HTTP → Vercel Python Function → PyMuPDF
```

## Avantages

- ✅ Compatible Vercel
- ✅ Isolation des dépendances Python
- ✅ Scalabilité automatique
- ✅ Timeout configuré
- ✅ Gestion d'erreurs robuste
