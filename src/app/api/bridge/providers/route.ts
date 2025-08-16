import { NextRequest, NextResponse } from 'next/server';

const BRIDGE_API_URL = 'https://api.bridgeapi.io/v3';

// Cache simple pour éviter les appels répétés à Bridge API
let providersCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * API pour récupérer la liste des banques supportées par Bridge
 * Migré vers API Bridge v3 - 2025
 * Avec cache pour éviter les appels répétés
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[BRIDGE_PROVIDERS] Récupération des banques...');
    
    // Vérifier le cache
    const now = Date.now();
    if (providersCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[BRIDGE_PROVIDERS] Utilisation du cache serveur');
      return NextResponse.json(providersCache, {
        headers: {
          'Cache-Control': 'public, s-maxage=300', // Cache 5 minutes
        },
      });
    }

    console.log(
      '[BRIDGE_PROVIDERS] Client ID:',
      process.env.BRIDGE_CLIENT_ID ? 'Configuré' : 'Manquant'
    );
    console.log(
      '[BRIDGE_PROVIDERS] Client Secret:',
      process.env.BRIDGE_CLIENT_SECRET ? 'Configuré' : 'Manquant'
    );

    // Données de démonstration avec nouveau format Bridge v3
    const demoProviders = [
      {
        id: 574,
        name: 'Demo Bank (Démo)',
        logo: 'https://via.placeholder.com/40x40/667eea/white?text=DB',
        country: 'FR',
        supported: true,
        demo: true,
        aggregation_metadata: {
          capabilities: ['accounts', 'transactions'],
          health_status: 'operational'
        }
      },
      {
        id: 1,
        name: 'BNP Paribas',
        logo: 'https://via.placeholder.com/40x40/00875A/white?text=BNP',
        country: 'FR',
        supported: true,
        demo: false,
        aggregation_metadata: {
          capabilities: ['accounts', 'transactions'],
          health_status: 'operational'
        }
      },
      {
        id: 2,
        name: 'Crédit Agricole',
        logo: 'https://via.placeholder.com/40x40/00A651/white?text=CA',
        country: 'FR',
        supported: true,
        demo: false,
        aggregation_metadata: {
          capabilities: ['accounts', 'transactions'],
          health_status: 'operational'
        }
      },
      {
        id: 3,
        name: 'Bred',
        logo: 'https://via.placeholder.com/40x40/E20019/white?text=BR',
        country: 'FR',
        supported: true,
        demo: false,
        aggregation_metadata: {
          capabilities: ['accounts', 'transactions'],
          health_status: 'operational'
        }
      },
      {
        id: 4,
        name: 'Revolut',
        logo: 'https://via.placeholder.com/40x40/0075EB/white?text=RV',
        country: 'EU',
        supported: true,
        demo: false,
        aggregation_metadata: {
          capabilities: ['accounts', 'transactions'],
          health_status: 'operational'
        }
      },
    ];

    // Vérifier si les clés Bridge sont configurées
    if (!process.env.BRIDGE_CLIENT_SECRET || !process.env.BRIDGE_CLIENT_ID) {
      console.log(
        '[BRIDGE_PROVIDERS] Clés Bridge manquantes, retour données démo'
      );
      return NextResponse.json({ providers: demoProviders });
    }

    console.log('[BRIDGE_PROVIDERS] Appel API Bridge v3...');
    
    // Appel à l'API Bridge v3 avec nouvelle authentification
    const response = await fetch(`${BRIDGE_API_URL}/providers`, {
      method: 'GET',
      headers: {
        'Client-Id': process.env.BRIDGE_CLIENT_ID,
        'Client-Secret': process.env.BRIDGE_CLIENT_SECRET,
        'Bridge-Version': '2025-01-15',
        'Accept': 'application/json',
      },
    });    console.log('[BRIDGE_PROVIDERS] Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        '[BRIDGE_PROVIDERS] Erreur API:',
        response.status,
        errorText
      );

      
      // Gestion d'erreurs spécifiques v3
      if (response.status === 401 || response.status === 403) {
        console.log('[BRIDGE_PROVIDERS] Problème d\'authentification - vérifier les credentials');
      }
      
      console.log('[BRIDGE_PROVIDERS] Retour aux données de démonstration');
      const fallbackResponse = { providers: demoProviders };
      
      // Mettre en cache même en cas d'erreur d'auth
      providersCache = fallbackResponse;
      cacheTimestamp = Date.now();
      
      return NextResponse.json(fallbackResponse, {
        headers: {
          'Cache-Control': 'public, s-maxage=60', // Cache court pour les erreurs
        },
      });
    }

    const data = await response.json();
    
    // Adapter le format Bridge v3 pour notre interface
    const providers = data.resources || data.providers || [];
    
    const formattedProviders = providers.map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      logo: provider.logo_url || 
        `https://via.placeholder.com/40x40/667eea/white?text=${provider.name.charAt(0)}`,
      country: provider.country_code || 'FR',
      supported: provider.aggregation_metadata?.capabilities?.includes('accounts') || false,
      demo: false,
      aggregation_metadata: provider.aggregation_metadata,
      payment_metadata: provider.payment_metadata
    }));

    console.log(`[BRIDGE_PROVIDERS] ${formattedProviders.length} providers récupérés`);
    
    const successResponse = { providers: formattedProviders };
    
    // Mettre en cache la réponse réussie
    providersCache = successResponse;
    cacheTimestamp = Date.now();
    
    return NextResponse.json(successResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=300', // Cache 5 minutes
      },
    });

  } catch (error) {
    console.error('[BRIDGE_PROVIDERS] Erreur:', error);
    console.log('[BRIDGE_PROVIDERS] Retour aux données de démonstration');
    
    // Fallback en cas d'erreur avec données démo
    const fallbackProviders = [
      {
        id: 574,
        name: 'Demo Bank (Démo)',
        logo: 'https://via.placeholder.com/40x40/667eea/white?text=DB',
        country: 'FR',
        supported: true,
        demo: true,
        aggregation_metadata: {
          capabilities: ['accounts', 'transactions'],
          health_status: 'operational'
        }
      },
    ];
    
    const errorResponse = { providers: fallbackProviders };
    
    // Mettre en cache même en cas d'erreur (cache court)
    providersCache = errorResponse;
    cacheTimestamp = Date.now();
    
    return NextResponse.json(errorResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=60', // Cache court pour les erreurs
      },
    });
  }
}
