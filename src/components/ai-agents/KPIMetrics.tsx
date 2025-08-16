'use client';

import React from 'react';
import { type KPIs } from '../../types/ai-agents';

interface KPIMetricsProps {
  kpis: KPIs;
}

export const KPIMetrics: React.FC<KPIMetricsProps> = ({ kpis }) => {
  // Métriques principales avec icônes et couleurs
  const metrics = [
    {
      name: 'Précision des Prévisions',
      value: kpis.demand_forecast_accuracy,
      icon: '🎯',
      color: 'text-green-600',
      format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    {
      name: 'Précision Stock',
      value: kpis.stock_accuracy,
      icon: '�',
      color: 'text-blue-600',
      format: (value: number) => `${(value * 100).toFixed(0)}%`,
    },
    {
      name: 'Rotation Inventaire',
      value: kpis.inventory_turnover,
      icon: '�',
      color: 'text-purple-600',
      format: (value: number) => `${value.toFixed(1)}x`,
    },
    {
      name: 'Marge Profit',
      value: kpis.profit_margin,
      icon: '💰',
      color: 'text-green-600',
      format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="rounded-lg bg-[#ecf0f1] p-4 text-center"
        >
          <div className="mb-2 flex justify-center">
            <span className="text-lg">{metric.icon}</span>
          </div>
          <p className="font-montserrat text-sm font-medium text-[#2c3e50]">
            {metric.name}
          </p>
          <p
            className={`text-xl font-bold ${metric.color} font-montserrat`}
          >
            {metric.format(metric.value)}
          </p>
        </div>
      ))}
    </div>
  );
};
