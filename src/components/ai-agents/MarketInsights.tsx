'use client';

import React from 'react';
import { type MarketIntelligence } from '../../types/ai-agents';

interface MarketInsightsProps {
  marketData: MarketIntelligence;
  hasRealData: boolean;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ 
  marketData, 
  hasRealData 
}) => {
  return (
    <div className="mb-6">
      <h4 className="font-montserrat mb-4 font-semibold text-[#2c3e50]">
        💡 Insights Marché
      </h4>
      <div className="space-y-3">
        {hasRealData && marketData.market_insights && marketData.market_insights.length > 0 ? (
          marketData.market_insights.slice(0, 5).map((insight, index) => (
            <div key={index} className="rounded-lg bg-[#ecf0f1] p-4">
              <div className="mb-2 flex items-start justify-between">
                <h5 className="font-montserrat flex-1 font-medium text-[#2c3e50]">
                  {insight.description}
                </h5>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg border px-2 py-1 text-xs font-medium ${
                      insight.confidence > 0.8
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : insight.confidence > 0.6
                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {insight.confidence > 0.8
                      ? 'Haute Confiance'
                      : insight.confidence > 0.6
                      ? 'Confiance Moyenne'
                      : 'Faible Confiance'}
                  </span>
                  <span className="font-open-sans text-xs text-[#34495e]">
                    {(insight.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="font-open-sans mb-2 text-sm text-[#34495e]">
                {insight.category} • Impact: {insight.impact_level}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="font-open-sans text-[#34495e]">
                  Période: {insight.timeframe}
                </span>
                <span className="font-open-sans text-[#34495e]">
                  Direction: {insight.trend_direction}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {insight.related_keywords && insight.related_keywords.slice(0, 3).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-white px-2 py-1 text-xs text-[#34495e]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="font-open-sans text-sm text-gray-600">
              Insights marché disponibles après activation de la recherche
              web premium. Configuration SerpAPI et OpenAI détectées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
