// Tools d'inventaire migrés vers OpenAI Agents SDK officiel
import { tool } from '@openai/agents';
import { z } from 'zod';

// Schémas réutilisables pour l'inventaire - Optimisé Zod
const InventoryItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  currentStock: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
  maxStock: z.number().int().min(0),
  unitCost: z.number().min(0),
  sellingPrice: z.number().min(0),
  supplier: z.string(),
  leadTimeDays: z.number().int().min(0),
  lastOrderDate: z.string().nullable().optional(),
  lastSaleDate: z.string().nullable().optional(),
});

const SalesHistorySchema = z.object({
  itemId: z.string(),
  date: z.string(),
  quantity: z.number().int().min(0),
  revenue: z.number().min(0),
});

// Types pour les données d'inventaire
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  leadTimeDays: number;
  lastOrderDate?: string;
  lastSaleDate?: string;
}

export interface SalesData {
  itemId: string;
  date: string;
  quantity: number;
  revenue: number;
}

export interface DemandForecast {
  itemId: string;
  forecastPeriod: string;
  predictedDemand: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface OptimizationResult {
  itemId: string;
  currentStock: number;
  recommendedReorderPoint: number;
  recommendedMaxStock: number;
  suggestedOrderQuantity: number;
  expectedSavings: number;
  reasoning: string;
}

// Tool pour analyser les niveaux de stock - SDK officiel
export const analyzeStockLevelsTool = tool({
  name: 'analyze_stock_levels',
  description: 'Analyze current inventory levels and identify stock issues',
  parameters: z.object({
    inventory: z.array(InventoryItemSchema).describe('Current inventory data'),
    salesHistory: z.array(SalesHistorySchema).default([]).describe('Historical sales data'),
    analysisType: z.enum(['overstock', 'understock', 'turnover', 'comprehensive']).default('comprehensive').describe('Type of analysis to perform'),
  }),
  async execute({ inventory, salesHistory = [], analysisType = 'comprehensive' }) {
    console.log(`📉 Analyzing stock levels for ${inventory.length} items...`);
    
    try {
      const analysis = {
        overstocked: [],
        understocked: [],
        optimal: [],
        slowMoving: [],
        metrics: {
          totalValue: 0,
          averageTurnover: 0,
          stockoutRisk: 0,
        },
      };

      inventory.forEach((item: InventoryItem) => {
        const itemSales = salesHistory.filter(
          (sale: SalesData) => sale.itemId === item.id
        );
        const recentSales = itemSales.filter((sale: SalesData) => {
          const saleDate = new Date(sale.date);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return saleDate >= thirtyDaysAgo;
        });

        const monthlyDemand = recentSales.reduce(
          (sum: number, sale: SalesData) => sum + sale.quantity,
          0
        );
        const daysOfStock =
          monthlyDemand > 0 ? (item.currentStock / monthlyDemand) * 30 : Infinity;

        analysis.metrics.totalValue += item.currentStock * item.unitCost;

        if (daysOfStock > 90) {
          analysis.overstocked.push({
            ...item,
            daysOfStock,
            recommendation: 'Consider reducing stock levels',
          });
        } else if (daysOfStock < 15) {
          analysis.understocked.push({
            ...item,
            daysOfStock,
            recommendation: 'Reorder immediately',
          });
        } else {
          analysis.optimal.push({
            ...item,
            daysOfStock,
            status: 'Optimal level',
          });
        }

        if (recentSales.length === 0) {
          analysis.slowMoving.push({
            ...item,
            lastSale: item.lastSaleDate || 'Unknown',
            recommendation: 'Consider liquidation',
          });
        }
      });

      console.log(`✅ Stock analysis completed: ${analysis.overstocked.length} overstocked, ${analysis.understocked.length} understocked`);
      
      return JSON.stringify({
        success: true,
        analysis,
        analyzedAt: new Date().toISOString(),
        summary: {
          totalItems: inventory.length,
          overstockedCount: analysis.overstocked.length,
          understockedCount: analysis.understocked.length,
          optimalCount: analysis.optimal.length,
          slowMovingCount: analysis.slowMoving.length,
          totalValue: analysis.metrics.totalValue,
        },
      });
    } catch (error) {
      console.error('❌ Error in stock analysis:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        analysis: null,
      });
    }
  },
});

// Tool pour optimiser l'inventaire - SDK officiel
export const optimizeInventoryTool = tool({
  name: 'optimize_inventory',
  description: 'Optimize inventory levels and reorder policies using EOQ calculations',
  parameters: z.object({
    inventory: z.array(InventoryItemSchema).describe('Current inventory items'),
    salesData: z.array(SalesHistorySchema).describe('Historical sales data'),
    constraints: z.object({
      maxInvestment: z.number().min(0).nullable().optional(),
      serviceLevel: z.number().min(0).max(1).default(0.95),
      storageCapacity: z.number().min(0).nullable().optional(),
    }).default({}),
    optimizationGoal: z.enum(['minimize_cost', 'maximize_service', 'balance_both']).default('balance_both').describe('Optimization objective'),
  }),
  async execute({ inventory, salesData, constraints = {}, optimizationGoal = 'balance_both' }) {
    console.log(`🎯 Optimizing inventory for ${inventory.length} items with goal: ${optimizationGoal}...`);
    
    try {
      const optimizations: OptimizationResult[] = [];

      inventory.forEach((item: InventoryItem) => {
        const itemSales = salesData.filter(
          (sale: SalesData) => sale.itemId === item.id
        );

        // Calcul simple de la demande moyenne
        const totalDemand = itemSales.reduce(
          (sum: number, sale: SalesData) => sum + sale.quantity,
          0
        );
        const averageDemand = totalDemand / Math.max(itemSales.length, 1);

        // EOQ calculation simplifiée
        const orderingCost = 50; // Coût fixe de commande
        const holdingCost = item.unitCost * 0.25; // 25% du coût unitaire
        const eoq = Math.sqrt((2 * averageDemand * orderingCost) / holdingCost);

        // Point de commande avec stock de sécurité
        const leadTimeDemand = averageDemand * (item.leadTimeDays / 30);
        const safetyStock = leadTimeDemand * 0.5; // 50% de sécurité
        const reorderPoint = leadTimeDemand + safetyStock;

        const currentCost = item.currentStock * item.unitCost * 0.25;
        const optimizedCost = (eoq / 2 + safetyStock) * item.unitCost * 0.25;
        const expectedSavings = Math.max(currentCost - optimizedCost, 0);

        optimizations.push({
          itemId: item.id,
          currentStock: item.currentStock,
          recommendedReorderPoint: Math.round(reorderPoint),
          recommendedMaxStock: Math.round(reorderPoint + eoq),
          suggestedOrderQuantity: Math.round(eoq),
          expectedSavings,
          reasoning: `Based on average demand of ${averageDemand.toFixed(1)} units and EOQ calculation`,
        });
      });

      const totalSavings = optimizations.reduce((sum, opt) => sum + opt.expectedSavings, 0);
      
      console.log(`✅ Optimization completed: ${optimizations.length} items optimized, potential savings: $${totalSavings.toFixed(2)}`);
      
      return JSON.stringify({
        success: true,
        optimizations,
        optimizedAt: new Date().toISOString(),
        summary: {
          itemsOptimized: optimizations.length,
          totalPotentialSavings: totalSavings,
          goal: optimizationGoal,
          constraints: constraints,
        },
      });
    } catch (error) {
      console.error('❌ Error in inventory optimization:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        optimizations: [],
      });
    }
  },
});

// Tool pour prévisions de demande - SDK officiel
export const forecastDemandTool = tool({
  name: 'forecast_demand',
  description: 'Forecast future demand using trend analysis and regression',
  parameters: z.object({
    salesHistory: z.array(SalesHistorySchema).describe('Historical sales data'),
    forecastHorizon: z.number().int().min(1).describe('Number of periods to forecast'),
    seasonality: z.boolean().default(false).describe('Whether to account for seasonal patterns'),
    externalFactors: z.array(z.string()).default([]).describe('External factors that might affect demand'),
  }),
  async execute({ salesHistory, forecastHorizon, seasonality = false, externalFactors = [] }) {
    console.log(`🔮 Forecasting demand for ${forecastHorizon} periods from ${salesHistory.length} historical records...`);
    
    try {
      const forecasts: DemandForecast[] = [];

      // Grouper par article
      const itemGroups = salesHistory.reduce((acc: any, sale: SalesData) => {
        if (!acc[sale.itemId]) acc[sale.itemId] = [];
        acc[sale.itemId].push(sale);
        return acc;
      }, {});

      Object.entries(itemGroups).forEach(([itemId, sales]: [string, any]) => {
        // Tri par date
        sales.sort(
          (a: SalesData, b: SalesData) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Calcul de tendance simple
        const quantities = sales.map((s: SalesData) => s.quantity);
        const n = quantities.length;

        if (n < 2) {
          forecasts.push({
            itemId,
            forecastPeriod: `Next ${forecastHorizon} periods`,
            predictedDemand: quantities[0] || 0,
            confidence: 0.3,
            trend: 'stable',
          });
          return;
        }

        // Régression linéaire simple
        const xValues = quantities.map((_: number, i: number) => i);
        const yValues = quantities;

        const xMean = xValues.reduce((a: number, b: number) => a + b, 0) / n;
        const yMean = yValues.reduce((a: number, b: number) => a + b, 0) / n;

        let numerator = 0,
          denominator = 0;
        for (let i = 0; i < n; i++) {
          numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
          denominator += (xValues[i] - xMean) ** 2;
        }

        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = yMean - slope * xMean;

        const nextPeriodForecast = slope * n + intercept;
        const trend =
          slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';

        // Calcul de confiance basé sur la variabilité
        const variance =
          quantities.reduce(
            (acc: number, val: number) => acc + (val - yMean) ** 2,
            0
          ) / n;
        const confidence = Math.max(
          0.1,
          Math.min(0.9, 1 - Math.sqrt(variance) / yMean)
        );

        forecasts.push({
          itemId,
          forecastPeriod: `Next ${forecastHorizon} periods`,
          predictedDemand: Math.max(0, nextPeriodForecast * forecastHorizon),
          confidence,
          trend,
        });
      });

      console.log(`✅ Demand forecast completed for ${forecasts.length} items`);
      
      return JSON.stringify({
        success: true,
        forecasts,
        forecastedAt: new Date().toISOString(),
        parameters: {
          horizon: forecastHorizon,
          seasonality,
          externalFactors,
        },
        summary: {
          itemsForecasted: forecasts.length,
          averageConfidence: forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length,
          trendDistribution: {
            increasing: forecasts.filter(f => f.trend === 'increasing').length,
            decreasing: forecasts.filter(f => f.trend === 'decreasing').length,
            stable: forecasts.filter(f => f.trend === 'stable').length,
          },
        },
      });
    } catch (error) {
      console.error('❌ Error in demand forecasting:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        forecasts: [],
      });
    }
  },
});

// Tool pour détecter les articles à rotation lente - SDK officiel
export const detectSlowMovingItemsTool = tool({
  name: 'detect_slow_moving_items',
  description: 'Identify slow-moving and obsolete inventory items',
  parameters: z.object({
    inventory: z.array(InventoryItemSchema).describe('Current inventory items'),
    salesHistory: z.array(SalesHistorySchema).describe('Sales history for analysis'),
    thresholds: z.object({
      daysWithoutSale: z.number().int().min(1).default(90),
      minimumTurnover: z.number().min(0).default(2),
      agingPeriods: z.array(z.number().int().min(1)).default([30, 60, 90, 180]),
    }).default({}),
  }),
  async execute({ inventory, salesHistory, thresholds = {} }) {
    console.log(`🐌 Detecting slow-moving items from ${inventory.length} inventory items...`);
    
    try {
      const {
        daysWithoutSale = 90,
        minimumTurnover = 2,
        agingPeriods = [30, 60, 90, 180],
      } = thresholds;
      
      const slowMovingItems: Array<
        InventoryItem & {
          daysSinceLastSale: number;
          turnoverRate: string;
          agingCategory: string;
          value: number;
          recommendation: string;
        }
      > = [];
      const today = new Date();

      inventory.forEach((item: InventoryItem) => {
        const itemSales = salesHistory.filter(
          (sale: SalesData) => sale.itemId === item.id
        );

        // Dernière vente
        const lastSale = itemSales.reduce(
          (latest: SalesData | null, sale: SalesData) => {
            if (!latest) return sale;
            return new Date(sale.date) > new Date(latest.date) ? sale : latest;
          },
          null
        );

        const daysSinceLastSale = lastSale
          ? Math.floor(
              (today.getTime() - new Date(lastSale.date).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : Infinity;

        // Calcul du taux de rotation
        const annualSales = itemSales.reduce(
          (sum: number, sale: SalesData) => sum + sale.quantity,
          0
        );
        const turnoverRate =
          item.currentStock > 0 ? annualSales / item.currentStock : 0;

        // Classification par période de vieillissement
        let agingCategory = 'current';
        for (const period of agingPeriods.sort(
          (a: number, b: number) => a - b
        )) {
          if (daysSinceLastSale >= period) {
            agingCategory = `${period}+ days`;
          }
        }

        const isSlowMoving =
          daysSinceLastSale >= daysWithoutSale ||
          turnoverRate < minimumTurnover;

        if (isSlowMoving) {
          slowMovingItems.push({
            ...item,
            daysSinceLastSale,
            turnoverRate: turnoverRate.toFixed(2),
            agingCategory,
            value: item.currentStock * item.unitCost,
            recommendation:
              daysSinceLastSale > 180
                ? 'Consider liquidation or promotion'
                : 'Monitor closely and consider promotion',
          });
        }
      });
      
      const totalValue = slowMovingItems.reduce((sum, item) => sum + item.value, 0);
      
      console.log(`✅ Slow-moving analysis completed: ${slowMovingItems.length} items identified, total value: $${totalValue.toFixed(2)}`);

      return JSON.stringify({
        success: true,
        slowMovingItems,
        analyzedAt: new Date().toISOString(),
        thresholds: {
          daysWithoutSale,
          minimumTurnover,
          agingPeriods,
        },
        summary: {
          totalSlowMovingItems: slowMovingItems.length,
          totalValue,
          averageDaysSinceLastSale:
            slowMovingItems.length > 0
              ? slowMovingItems.reduce(
                  (sum: number, item: any) => sum + item.daysSinceLastSale,
                  0
                ) / slowMovingItems.length
              : 0,
          agingBreakdown: agingPeriods.reduce((acc, period) => {
            acc[`${period}+ days`] = slowMovingItems.filter(
              item => item.daysSinceLastSale >= period
            ).length;
            return acc;
          }, {} as Record<string, number>),
        },
      });
    } catch (error) {
      console.error('❌ Error in slow-moving items detection:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        slowMovingItems: [],
      });
    }
  },
});

// Tool pour générer des rapports d'inventaire - SDK officiel
export const generateInventoryReportTool = tool({
  name: 'generate_inventory_report',
  description: 'Generate comprehensive inventory analysis report with insights',
  parameters: z.object({
    inventory: z.array(InventoryItemSchema).describe('Current inventory data'),
    analysis: z.record(z.unknown()).nullable().optional().describe('Analysis results from other tools'),
    optimizations: z.array(z.record(z.unknown())).default([]).describe('Optimization recommendations'),
    reportType: z.enum(['executive', 'operational', 'detailed']).default('operational').describe('Type of report to generate'),
  }),
  async execute({ inventory, analysis = {}, optimizations = [], reportType = 'operational' }) {
    console.log(`📈 Generating ${reportType} inventory report for ${inventory.length} items...`);
    
    try {
      const totalItems = inventory.length;
      const totalValue = inventory.reduce(
        (sum: number, item: InventoryItem) =>
          sum + item.currentStock * item.unitCost,
        0
      );

      const categories = inventory.reduce((acc: any, item: InventoryItem) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      const report = {
        reportType,
        generatedAt: new Date().toISOString(),
        summary: {
          totalItems,
          totalValue,
          categoriesCount: Object.keys(categories).length,
          averageItemValue: totalValue / totalItems,
        },
        categoryBreakdown: categories,
        keyFindings: [],
        recommendations: [],
        analysis: analysis,
        optimizations: optimizations.slice(0, 10), // Top 10 optimizations
      };

      // Générer des insights automatiques
      if (analysis.overstocked && analysis.overstocked.length > 0) {
        report.keyFindings.push(
          `${analysis.overstocked.length} items are overstocked`
        );
        report.recommendations.push(
          'Review overstocked items for potential liquidation'
        );
      }

      if (analysis.understocked && analysis.understocked.length > 0) {
        report.keyFindings.push(
          `${analysis.understocked.length} items need immediate reordering`
        );
        report.recommendations.push('Expedite orders for understocked items');
      }

      const potentialSavings = optimizations.reduce(
        (sum: number, opt: OptimizationResult) => sum + opt.expectedSavings,
        0
      );

      if (potentialSavings > 0) {
        report.keyFindings.push(
          `Potential annual savings: $${potentialSavings.toFixed(2)}`
        );
        report.recommendations.push(
          'Implement optimization recommendations to reduce holding costs'
        );
      }
      
      // Ajout d'insights selon le type de rapport
      if (reportType === 'executive') {
        report.keyFindings.push(`Total inventory value: $${totalValue.toFixed(2)}`);
        report.keyFindings.push(`Portfolio diversification: ${Object.keys(categories).length} categories`);
      } else if (reportType === 'detailed') {
        // Ajouter des métriques détaillées
        const lowStockItems = inventory.filter(item => item.currentStock <= item.reorderPoint);
        report.keyFindings.push(`${lowStockItems.length} items below reorder point`);
      }
      
      console.log(`✅ ${reportType} report generated with ${report.keyFindings.length} key findings`);

      return JSON.stringify(report);
    } catch (error) {
      console.error('❌ Error generating inventory report:', error);
      return JSON.stringify({
        success: false,
        error: error.message,
        reportType,
        generatedAt: new Date().toISOString(),
      });
    }
  },
});

