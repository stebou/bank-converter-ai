// Test script pour l'intégration OpenAI + External Context Agent
const {
  ExternalContextAgent,
} = require('./src/lib/ai-agents/external-context-agent.ts');

async function testOpenAIIntegration() {
  console.log("🧪 Test de l'intégration OpenAI + External Context Agent");
  console.log('='.repeat(60));

  try {
    const agent = new ExternalContextAgent();

    const testInput = {
      company_profile: {
        industry: 'technology',
        business_type: 'B2C',
        primary_markets: ['France', 'Europe'],
        competitors: ['Apple', 'Samsung', 'Google'],
        product_categories: ['smartphones', 'laptops', 'tablets'],
      },
      analysis_timeframe: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        forecast_horizon_days: 30,
      },
      search_configuration: {
        enable_competitor_monitoring: true,
        enable_market_events: true,
        enable_sentiment_analysis: true,
        enable_trend_analysis: true,
        sources_priority: ['news', 'industry', 'government'],
      },
    };

    const testState = {
      raw_data: { sales_history: [], current_inventory: [], supplier_data: [] },
      processed_insights: {
        demand_patterns: [],
        seasonality: [],
        product_segments: [],
      },
      forecasts: {
        short_term: [],
        medium_term: [],
        long_term: [],
        confidence_intervals: [],
      },
      optimization_results: {
        reorder_points: [],
        safety_stocks: [],
        order_quantities: [],
      },
      alerts: [],
      recommendations: [],
      metrics: {},
      real_time_metrics: {},
    };

    console.log("🔍 Lancement de l'analyse avec OpenAI...");
    const result = await agent.execute(testInput, testState);

    console.log("\n✅ Résultats de l'analyse:");
    console.log(`- Succès: ${result.success}`);
    console.log(`- Confiance: ${(result.confidence_score * 100).toFixed(1)}%`);
    console.log(`- Temps d'exécution: ${result.execution_time_ms}ms`);

    if (result.success && result.output) {
      console.log(
        `\n📊 Insights marché: ${result.output.market_insights?.length || 0}`
      );
      console.log(
        `📈 Analyse concurrentielle: ${result.output.competitor_analysis?.length || 0}`
      );
      console.log(
        `📅 Événements marché: ${result.output.market_events?.length || 0}`
      );
      console.log(
        `😊 Analyse sentiment: ${result.output.sentiment_analysis ? 'Oui' : 'Non'}`
      );

      if (
        result.output.market_insights &&
        result.output.market_insights.length > 0
      ) {
        console.log('\n🎯 Premier insight:');
        const firstInsight = result.output.market_insights[0];
        console.log(`   Titre: ${firstInsight.title}`);
        console.log(
          `   Impact: ${(firstInsight.impact_score * 100).toFixed(1)}%`
        );
        console.log(`   Source: ${firstInsight.source}`);
      }
    }

    console.log('\n🎉 Test complété avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Lancer le test si exécuté directement
if (require.main === module) {
  testOpenAIIntegration();
}

module.exports = { testOpenAIIntegration };
