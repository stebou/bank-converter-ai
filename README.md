This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Intégration API SIRENE (INSEE)

La recherche d'entreprises s'appuie sur l'API officielle SIRENE (version 3.11).

Configuration requise :

1. Obtenez une clé d'intégration INSEE (mode Integration) sur le portail développeur.
2. Ajoutez la variable d'environnement suivante dans `.env.local` :

```
NEXT_PUBLIC_INSEE_API_KEY=VotreCleIci
```

3. L'authentification s'effectue uniquement via l'en-tête :

```
X-INSEE-Api-Key-Integration: <votre_clé>
```

### Endpoint interne

Route Next.js : `GET /api/company-search`

Paramètres supportés (query string) :

- `q` : recherche texte libre (dénomination ou enseigne) – joker implicite `*` ajouté côté serveur.
- `denomination`, `siren`, `siret`
- `codePostal`, `commune`, `departement`
- `activitePrincipale` (code NAF complet)
- `trancheEffectifs` (codes INSEE : 00,01,02,...,53)
- `etatAdministratif` (A ou F)
- `limit` (nombre, max 1000), `page` (1-based)

### Format de réponse

```json
{
	"results": [ { "siren": "...", "denomination": "...", "adresse": { ... } } ],
	"pagination": { "page": 1, "limit": 20, "total": 123, "totalPages": 7 },
	"source": "sirene",
	"meta": { "total": 123, "debut": 0, "nombre": 20, "endpoint": "/siret", "q": "..." }
}
```

En cas d'échec (401/400), un fallback de démonstration peut être retourné (`source: "mock"`).

### Construction de la requête SIRENE

La logique de construction (`buildQueryFromCriteria`) :

- Combine les filtres avec `AND`.
- Utilise `OR` uniquement entre `denominationUniteLegale` et `enseigne1Etablissement` pour la recherche libre.
- Évite les parenthèses superflues pour se conformer à la syntaxe INSEE.
- Force `etatAdministratifEtablissement:A` par défaut si aucun état n'est fourni.

### Optimisation SIREN / SIRET

Si la recherche est un SIREN pur (9 chiffres), une interrogation unitaire `/siren/{siren}` est effectuée pour un retour plus rapide.

### Prochaines améliorations possibles

- Pagination incrémentale avec préchargement.
- Enrichissement (libellés codes NAF / catégories juridiques étendus).
- Gestion des erreurs plus granulaire (codes spécifiques INSEE).

