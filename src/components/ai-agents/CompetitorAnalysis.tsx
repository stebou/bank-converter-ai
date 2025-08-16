'use client';

import React from 'react';
import { type MarketIntelligence } from '../../types/ai-agents';

interface CompetitorAnalysisProps {
  marketData: MarketIntelligence;
  hasRealData: boolean;
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ 
  marketData, 
  hasRealData 
}) => {
  return (
    <div className="mb-6">
      <h4 className="font-montserrat mb-4 font-semibold text-[#2c3e50]">
        🏢 Analyse Concurrentielle
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {hasRealData && marketData.competitor_analysis && marketData.competitor_analysis.length > 0 ? (
          marketData.competitor_analysis
            .slice(0, 6)
            .map((competitor, index) => (
              <div key={index} className="rounded-lg bg-[#ecf0f1] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="font-montserrat font-medium text-[#2c3e50]">
                    {competitor.competitor_name}
                  </h5>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      competitor.threat_level === 'high'
                        ? 'bg-red-500'
                        : competitor.threat_level === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  ></span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-open-sans text-[#34495e]">
                    Parts de marché: {(competitor.market_share * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2">
                  <span
                    className={`rounded-lg px-2 py-1 text-xs ${
                      competitor.threat_level === 'high'
                        ? 'bg-red-100 text-red-700'
                        : competitor.threat_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    Menace {competitor.threat_level}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <div className="col-span-3 rounded-lg bg-gray-50 p-4 text-center">
            <p className="font-open-sans text-sm text-gray-600">
              Analyse concurrentielle disponible avec les données temps réel.
              Intelligence marché prête pour activation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
