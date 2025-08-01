// API Route pour l'analyse par agents IA

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MasterCoordinatorAgent } from '@/lib/ai-agents/master-coordinator';
import { AIAgentsTestDataGenerator } from '@/lib/ai-agents/test-data-generator';

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' }, 
        { status: 401 }
      );
    }

    console.log('[AI-AGENTS] Starting analysis for user:', userId);

    // Parsing des paramètres de requête
    const body = await request.json().catch(() => ({}));
    const {
      use_test_data = true,
      analysis_type = 'FULL_ANALYSIS',
      forecast_horizon_days = 30,
      include_external_factors = true
    } = body;

    // Initialisation du coordinateur principal
    const masterCoordinator = new MasterCoordinatorAgent();
    
    // Génération ou récupération des données
    let analysisInput;
    let initialState;

    if (use_test_data) {
      console.log('[AI-AGENTS] Using test data for analysis');
      const testDataGenerator = new AIAgentsTestDataGenerator();
      
      // Génération de données de test complètes
      initialState = testDataGenerator.generateCompleteTestState(180);
      
      // Ajout de produits avec patterns spécifiques pour démonstration
      const volatileProduct = testDataGenerator.generateHighVolatilityProduct();
      const seasonalProduct = testDataGenerator.generateSeasonalProduct();
      const trendingProduct = testDataGenerator.generateTrendingProduct('UP');
      
      initialState.raw_data.sales_history = [
        ...initialState.raw_data.sales_history,
        ...volatileProduct,
        ...seasonalProduct,
        ...trendingProduct
      ];

      analysisInput = {
        sales_history: initialState.raw_data.sales_history,
        inventory_history: initialState.raw_data.current_inventory,
        time_range: {
          start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        forecast_horizon_days,
        external_factors: include_external_factors 
          ? testDataGenerator.generateExternalFactors(forecast_horizon_days)
          : [],
        analysis_type
      };
    } else {
      // TODO: Intégration avec vraies données depuis la base de données
      console.log('[AI-AGENTS] Real data integration not implemented yet');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Intégration avec vraies données pas encore implémentée',
          details: 'Utilisez use_test_data: true pour l\'instant'
        }, 
        { status: 501 }
      );
    }

    console.log('[AI-AGENTS] Analysis input prepared:', {
      salesRecords: analysisInput.sales_history.length,
      inventoryItems: analysisInput.inventory_history.length,
      externalFactors: analysisInput.external_factors?.length || 0,
      timeRange: analysisInput.time_range
    });

    // Exécution de l'analyse par le coordinateur principal
    const startTime = Date.now();
    const analysisResult = await masterCoordinator.run(analysisInput, initialState);
    const executionTime = Date.now() - startTime;

    console.log('[AI-AGENTS] Analysis completed:', {
      success: analysisResult.success,
      executionTime,
      confidence: analysisResult.confidence_score
    });

    if (!analysisResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Échec de l\'analyse par les agents IA',
          details: analysisResult.error || 'Erreur inconnue'
        }, 
        { status: 500 }
      );
    }

    // Formatage de la réponse - Structure corrigée pour frontend
    const workflowResult = analysisResult.output.workflow_result;
    const finalState = workflowResult.final_state;
    
    const response = {
      success: true,
      analysis_id: `analysis_${userId}_${Date.now()}`,
      execution_time_ms: executionTime,
      confidence_score: analysisResult.confidence_score,
      
      // Résultats formatés pour le frontend
      recommendations: analysisResult.output.final_recommendations || [],
      alerts: workflowResult.alerts || [],
      kpis: finalState.metrics || {},
      
      // Insights détaillés
      demand_patterns: finalState.processed_insights?.demand_patterns || [],
      product_segments: finalState.processed_insights?.product_segments || [],
      forecasts: {
        short_term: finalState.forecasts?.short_term?.slice(0, 10) || [],
        medium_term: finalState.forecasts?.medium_term?.slice(0, 10) || [],
        summary: {
          total_forecasts: 
            (finalState.forecasts?.short_term?.length || 0) +
            (finalState.forecasts?.medium_term?.length || 0) +
            (finalState.forecasts?.long_term?.length || 0)
        }
      },
      
      // Résumé d'exécution
      execution_summary: analysisResult.output.execution_summary || 'Analyse complétée avec succès',
      
      // Performance des agents
      agents_performance: workflowResult.performance_summary?.agents_performance || {},
      
      // Données complètes pour debugging (optionnel)
      workflow_result: workflowResult,
      real_time_metrics: analysisResult.output.real_time_metrics,
      
      // Métadonnées
      generated_at: new Date().toISOString(),
      user_id: userId,
      data_period: analysisInput.time_range,
      analysis_parameters: {
        analysis_type,
        forecast_horizon_days,
        include_external_factors,
        use_test_data
      }
    };

    // Log pour monitoring - Structure corrigée
    console.log('[AI-AGENTS] Response prepared:', {
      recommendationsCount: Array.isArray(response.recommendations) ? response.recommendations.length : 0,
      alertsCount: Array.isArray(response.alerts) ? response.alerts.length : 0,
      kpiScore: response.confidence_score,
      totalForecasts: response.forecasts.summary.total_forecasts,
      demandPatternsCount: Array.isArray(response.demand_patterns) ? response.demand_patterns.length : 0,
      productSegmentsCount: Array.isArray(response.product_segments) ? response.product_segments.length : 0
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('[AI-AGENTS] Analysis failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur lors de l\'analyse IA',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Endpoint pour récupérer le statut des agents
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' }, 
        { status: 401 }
      );
    }

    // Initialisation du coordinateur pour récupérer le statut
    const masterCoordinator = new MasterCoordinatorAgent();
    const healthMetrics = masterCoordinator.getHealthMetrics();

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      system_status: {
        overall_health: healthMetrics.status,
        last_execution: healthMetrics.last_execution,
        performance_score: healthMetrics.performance_score,
        error_rate: healthMetrics.error_rate
      },
      capabilities: [
        'demand_pattern_analysis',
        'forecasting_multi_horizon',
        'abc_xyz_segmentation',
        'anomaly_detection',
        'recommendation_generation',
        'kpi_calculation'
      ],
      supported_analysis_types: [
        'PATTERN_DETECTION',
        'SEGMENTATION',
        'TREND_ANALYSIS',
        'FULL_ANALYSIS'
      ],
      limits: {
        max_forecast_horizon_days: 365,
        max_historical_data_days: 730,
        max_products_per_analysis: 1000
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[AI-AGENTS] Status check failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la vérification du statut',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, 
      { status: 500 }
    );
  }
}