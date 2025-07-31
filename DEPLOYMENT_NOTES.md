# Notes de Déploiement - Migration vers Fonctions Python Vercel

## Problème Résolu
L'erreur `python3: command not found` sur Vercel a été résolue en migrant vers les fonctions Python Vercel.

## Changements Effectués

### 1. Fonction Vercel Python
- **Fichier**: `/api/process-pdf-vercel.py`
- **Runtime**: `@vercel/python@4.3.1`
- **Dépendances**: PyMuPDF + pdfplumber
- **Timeout**: 30 secondes max

### 2. Configuration Vercel
- **Fichier**: `vercel.json`
```json
{
  "functions": {
    "api/process-pdf-vercel.py": {
      "runtime": "@vercel/python@4.3.1",
      "maxDuration": 30
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
- **Production**: `https://[domain]/api/process-pdf-vercel`
- **Développement**: `http://localhost:3000/api/process-pdf-vercel`

## Test de la Fonction
```bash
curl -X POST https://[domain]/api/process-pdf-vercel \
  -H "Content-Type: application/json" \
  -d '{"pdf_base64": "base64_encoded_pdf", "output_mode": "hybrid"}'
```

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