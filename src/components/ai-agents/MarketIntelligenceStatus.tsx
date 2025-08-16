'use client';

import React from 'react';
import { type MarketIntelligence } from '../../types/ai-agents';

interface MarketIntelligenceStatusProps {
  marketData: MarketIntelligence;
  hasRealData: boolean;
}

export const MarketIntelligenceStatus: React.FC<MarketIntelligenceStatusProps> = ({ 
  marketData, 
  hasRealData 
}) => {
  return (
    <div className="rounded-lg bg-[#ecf0f1] p-4">
      <h4 className="font-montserrat mb-3 font-medium text-[#2c3e50]">
        🌐 État Intelligence Marché
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h5 className="font-montserrat mb-2 text-sm font-medium text-[#2c3e50]">
            📊 Données Actuelles
          </h5>
          <ul className="font-open-sans space-y-1 text-sm text-[#34495e]">
            {hasRealData ? (
              <>
                <li>
                  • Sentiment global:{' '}
                  {typeof marketData.sentiment_analysis.overall_sentiment === 'number'
                    ? `${(marketData.sentiment_analysis.overall_sentiment * 100).toFixed(0)}% positif`
                    : marketData.sentiment_analysis.overall_sentiment}
                </li>
                <li>
                  • Événements détectés: {marketData.market_events?.length || 0}{' '}
                  événements
                </li>
                <li>
                  • Insights marché: {marketData.market_insights?.length || 0}{' '}
                  insights
                </li>
                <li>• Recherches web: Données temps réel intégrées</li>
              </>
            ) : (
              <>
                <li>• SerpAPI: Intégrée et opérationnelle</li>
                <li>• OpenAI GPT-4: Intelligence d'analyse</li>
                <li>• Recherches temps réel: Prêt pour activation</li>
                <li>• Concurrence: Surveillance automatisée</li>
              </>
            )}
          </ul>
        </div>
        <div>
          <h5 className="font-montserrat mb-2 text-sm font-medium text-[#2c3e50]">
            🎯 Prochaines Actions
          </h5>
          <ul className="font-open-sans space-y-1 text-sm text-[#34495e]">
            {hasRealData &&
            marketData.contextual_recommendations &&
            marketData.contextual_recommendations.length > 0 ? (
              marketData.contextual_recommendations
                .slice(0, 4)
                .map((rec, idx) => <li key={idx}>• {rec}</li>)
            ) : (
              <>
                <li>• Prochaine analyse: Recherches web complètes</li>
                <li>• Intelligence marché: Données temps réel</li>
                <li>• Surveillance concurrence: Automatique</li>
                <li>• Ajustements prévisions: Basés sur web</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
