# INSEE Sirene API v3.11 - Complete Technical Documentation

## Overview

The INSEE Sirene API provides access to information about companies and establishments registered in the French inter-administrative Sirene directory since its creation in 1973, including closed units. The API allows searches for legal units (SIREN) and establishments (SIRET) with support for unitary, multi-criteria, and phonetic searches covering both current and historical data.

### Important Migration Notice
- **API v3.9 was replaced by API v3.11** in March 2024 as part of the Sirene 4 evolution
- **Old API portal (api.insee.fr) will be permanently closed on September 10, 2025**
- **New portal**: https://portail-api.insee.fr/
- **Current transitional access**: Old portal remains accessible without maintenance until closure

## Base Configuration

### Base URL
```
https://api.insee.fr/entreprises/sirene/V3
```

### Authentication
- **Method**: Bearer Token authentication
- **Header**: `Authorization: Bearer YOUR_TOKEN`
- **Content-Type**: `application/json`
- **Accept**: `application/json`

### Rate Limits
- **Limit**: 30 requests per minute
- **Availability**: 99.5% monthly uptime commitment
- **Token renewal**: Recommended once daily

## API Endpoints

### 1. Legal Unit Query (SIREN)

**Endpoint**: `/siren/{siren_number}`

**Purpose**: Query legal units using SIREN identifier (9 digits)

**Example**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siren/005520135"
```

**With Historical Data**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siren/005520135?date=2018-01-01"
```

### 2. Establishment Query (SIRET)

**Endpoint**: `/siret/{siret_number}`

**Purpose**: Query establishments using SIRET identifier (14 digits)

**Example**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret/39860733300059"
```

### 3. Multi-Criteria Search

**Endpoint**: `/siret` (with query parameters)

**Purpose**: Advanced search across multiple criteria

**Examples**:

**Basic Multi-Criteria Search**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=etablissementSiege:true AND etatAdministratifUniteLegale:A"
```

**Company Name Search**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:\"INSTITUT NATIONAL\" AND etatAdministratifUniteLegale:A"
```

**With Field Selection**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=etablissementSiege:true&champs=siret,denominationUniteLegale,nomUsageUniteLegale,prenom1UniteLegale"
```

## Query Parameters

### Common Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Advanced search query using Lucene syntax | `etablissementSiege:true AND etatAdministratifUniteLegale:A` |
| `date` | string | Historical data point (YYYY-MM-DD) | `2018-01-01` |
| `champs` | string | Comma-separated list of fields to return | `siret,denominationUniteLegale,nomUsageUniteLegale` |
| `nombre` | integer | Number of results to return (max 10,000) | `1000` |

### Advanced Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `AND` | Logical AND | `field1:value1 AND field2:value2` |
| `OR` | Logical OR | `field1:value1 OR field1:value2` |
| `NOT` | Logical NOT | `NOT field1:value1` |
| `*` | Wildcard | `denominationUniteLegale:SOCI*` |
| `""` | Exact phrase | `denominationUniteLegale:"SOCIETE ANONYME"` |

### Field Selection Options

You can specify which fields to return in three ways:
1. **Array of field names**: `["siret", "denominationUniteLegale", "nomUsageUniteLegale"]`
2. **Single field name**: `"siret"`
3. **All fields**: `"all"` (must be explicitly specified)

## Response Structure

### JSON Response Format

```json
{
  "header": {
    "statut": 200,
    "message": "ok"
  },
  "etablissements": [
    {
      "siret": "39860733300059",
      "dateCreationEtablissement": "1998-03-17",
      "denominationUsuelleEtablissement": null,
      "enseigne1Etablissement": null,
      "uniteLegale": {
        "siren": "398607333",
        "denominationUniteLegale": "INSTITUT NATIONAL DE LA STATISTIQUE ET DES ETUDES ECONOMIQUES",
        "sigleUniteLegale": "INSEE",
        "etatAdministratifUniteLegale": "A",
        "categorieJuridiqueUniteLegale": "7120"
      },
      "adresseEtablissement": {
        "numeroVoieEtablissement": "88",
        "typeVoieEtablissement": "AV",
        "libelleVoieEtablissement": "VERDIER",
        "codePostalEtablissement": "92120",
        "libelleCommuneEtablissement": "MONTROUGE"
      },
      "periodesEtablissement": [
        {
          "dateFin": null,
          "dateDebut": "1998-03-17",
          "etatAdministratifEtablissement": "A",
          "denominationUsuelleEtablissement": null
        }
      ]
    }
  ]
}
```

### Key Response Fields

#### Legal Unit Fields (uniteLegale)
- `siren`: 9-digit legal unit identifier
- `denominationUniteLegale`: Company name
- `sigleUniteLegale`: Company acronym/abbreviation
- `etatAdministratifUniteLegale`: Administrative status (A=Active, C=Closed)
- `categorieJuridiqueUniteLegale`: Legal category code
- `nomUsageUniteLegale`: Usage name
- `prenom1UniteLegale`: First name (for individuals)

#### Establishment Fields (etablissement)
- `siret`: 14-digit establishment identifier
- `dateCreationEtablissement`: Creation date
- `denominationUsuelleEtablissement`: Usual denomination
- `enseigne1Etablissement`: Business sign
- `etablissementSiege`: Boolean indicating if headquarters

#### Address Fields (adresseEtablissement)
- `numeroVoieEtablissement`: Street number
- `typeVoieEtablissement`: Street type (AV, RUE, etc.)
- `libelleVoieEtablissement`: Street name
- `codePostalEtablissement`: Postal code
- `libelleCommuneEtablissement`: City name

#### Historical Periods (periodesEtablissement)
- `dateDebut`: Period start date
- `dateFin`: Period end date (null for current)
- `etatAdministratifEtablissement`: Administrative status during period

## Error Codes and Handling

### HTTP Status Codes

| Code | Description | Action |
|------|-------------|--------|
| 200 | Success | Process response data |
| 400 | Bad Request | Check query syntax and parameters |
| 401 | Unauthorized | Verify authentication token |
| 403 | Forbidden | Check API subscription and limits |
| 404 | Not Found | SIREN/SIRET not found in database |
| 429 | Too Many Requests | Implement rate limiting (30/min) |
| 500 | Internal Server Error | Retry or contact support |

### Error Response Format

```json
{
  "header": {
    "statut": 400,
    "message": "La syntaxe de la requête est incorrecte."
  }
}
```

## Advanced Search Examples

### 1. Active Companies in Specific Postal Code
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=codePostalEtablissement:75001 AND etatAdministratifUniteLegale:A"
```

### 2. Companies by Legal Category
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=categorieJuridiqueUniteLegale:5710 AND etatAdministratifUniteLegale:A"
```

### 3. Headquarters Only
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=etablissementSiege:true"
```

### 4. Companies with Specific Activity Code (NAF)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=activitePrincipaleEtablissement:62.01Z"
```

### 5. Partial Name Search with Wildcards
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:SOCI* AND etatAdministratifUniteLegale:A"
```

## Pagination

### Default Behavior
- **Default results per page**: 20
- **Maximum results**: 10,000 per request
- **Page parameter**: Use `nombre` parameter to control results

### Pagination Example
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "https://api.insee.fr/entreprises/sirene/V3/siret?q=etatAdministratifUniteLegale:A&nombre=100"
```

## Data Privacy and Compliance

### GDPR Compliance
- API complies with GDPR and French data protection laws (Law 78-17)
- Some entities have partial diffusion status (`P`) due to opposition requests
- Personal information of individuals with partial status is masked

### Restricted Data Fields
For entities with diffusion status `P`:
- Identity information is masked
- Address information is limited
- Geolocation data is unavailable

### Usage Restrictions
- No redistribution of personal information for entities with partial status
- No use for prospecting purposes for protected entities
- Respect for individual privacy rights

## Implementation Examples

### Next.js API Route Example

```typescript
// /api/sirene/search.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const fields = searchParams.get('champs');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  try {
    const url = new URL('https://api.insee.fr/entreprises/sirene/V3/siret');
    url.searchParams.set('q', query);
    if (fields) url.searchParams.set('champs', fields);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.INSEE_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`INSEE API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('INSEE API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}
```

### React Hook for INSEE API

```typescript
// hooks/useInseeApi.ts
import { useState, useCallback } from 'react';

interface InseeSearchParams {
  query: string;
  fields?: string;
  maxResults?: number;
}

interface InseeApiResponse {
  header: {
    statut: number;
    message: string;
  };
  etablissements?: Array<{
    siret: string;
    uniteLegale: {
      siren: string;
      denominationUniteLegale: string;
      etatAdministratifUniteLegale: string;
    };
    adresseEtablissement: {
      codePostalEtablissement: string;
      libelleCommuneEtablissement: string;
    };
  }>;
}

export const useInseeApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = useCallback(async (params: InseeSearchParams): Promise<InseeApiResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL('/api/sirene/search', window.location.origin);
      url.searchParams.set('q', params.query);
      if (params.fields) url.searchParams.set('champs', params.fields);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSiretInfo = useCallback(async (siret: string): Promise<InseeApiResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sirene/siret/${siret}`);
      
      if (!response.ok) {
        throw new Error(`SIRET lookup failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchCompanies,
    getSiretInfo,
    loading,
    error,
  };
};
```

### Environment Variables

```bash
# .env.local
INSEE_API_TOKEN=your_insee_api_token_here
```

## Best Practices

### 1. Authentication Management
- Store API tokens securely in environment variables
- Implement token renewal mechanism (daily recommended)
- Handle authentication errors gracefully

### 2. Rate Limiting
- Implement client-side rate limiting (30 requests/minute)
- Use queuing for batch operations
- Add retry logic with exponential backoff

### 3. Error Handling
- Always check HTTP status codes
- Parse error messages from API responses
- Implement fallback mechanisms for service unavailability

### 4. Data Caching
- Cache frequently accessed company data
- Respect data freshness requirements
- Implement cache invalidation strategies

### 5. Query Optimization
- Use field selection to reduce response size
- Construct specific queries to minimize results
- Leverage historical date parameters when needed

### 6. Privacy Compliance
- Check diffusion status before processing personal data
- Respect partial diffusion restrictions
- Implement data retention policies

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Verify API token validity
   - Check token has not expired
   - Ensure proper Bearer token format

2. **400 Bad Request**
   - Validate query syntax (Lucene format)
   - Check parameter names and values
   - Verify SIREN/SIRET format (9/14 digits)

3. **429 Rate Limit Exceeded**
   - Implement request queuing
   - Add delays between requests
   - Monitor request frequency

4. **Empty Results**
   - Verify search criteria are not too restrictive
   - Check for typos in company names
   - Try wildcard searches for partial matches

### Performance Optimization

1. **Request Optimization**
   - Use field selection to reduce payload size
   - Batch related queries when possible
   - Implement request caching

2. **Response Processing**
   - Parse only needed fields from responses
   - Implement streaming for large result sets
   - Use efficient data structures

## Migration Notes

### From API v3.9 to v3.11
- Update base URL references
- Review field names for any changes
- Test all existing integrations
- Update documentation and code comments

### Preparing for Portal Migration
- Plan migration to new portal (https://portail-api.insee.fr/)
- Update authentication mechanisms if required
- Review any API changes in new portal
- Set migration deadline before September 10, 2025

## Additional Resources

- **New API Portal**: https://portail-api.insee.fr/
- **Current Portal**: https://api.insee.fr/catalogue/
- **Data Privacy Documentation**: Check GDPR compliance requirements
- **Support**: Contact form available on API portal for technical questions

## Legal Notice

This API provides access to official French administrative data. Users must comply with:
- General Data Protection Regulation (GDPR)
- French Law 78-17 of January 6, 1978 (CNIL Law)
- Restrictions on personal data redistribution
- Respect for partial diffusion status requests

**Last Updated**: August 2025
**API Version**: v3.11
**Documentation Version**: 1.0

