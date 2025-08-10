// Types pour les outils d'inventaire
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

// Tool pour analyser les niveaux de stock
export const analyzeStockLevelsTool = {
  type: "function" as const,
  function: {
    name: "analyze_stock_levels",
    description: "Analyze current inventory levels and identify issues",
    parameters: {
      type: "object",
      properties: {
        inventory: {
          type: "array",
          description: "Current inventory data"
        },
        salesHistory: {
          type: "array",
          description: "Historical sales data"
        },
        analysisType: {
          type: "string",
          enum: ["overstock", "understock", "turnover", "comprehensive"],
          description: "Type of analysis to perform"
        }
      },
      required: ["inventory"]
    }
  }
};

// Tool pour optimiser l'inventaire
export const optimizeInventoryTool = {
  type: "function" as const,
  function: {
    name: "optimize_inventory",
    description: "Optimize inventory levels and reorder policies",
    parameters: {
      type: "object",
      properties: {
        inventory: {
          type: "array",
          description: "Current inventory items"
        },
        salesData: {
          type: "array",
          description: "Historical sales data"
        },
        constraints: {
          type: "object",
          properties: {
            maxInvestment: { type: "number" },
            serviceLevel: { type: "number" },
            storageCapacity: { type: "number" }
          }
        },
        optimizationGoal: {
          type: "string",
          enum: ["minimize_cost", "maximize_service", "balance_both"],
          description: "Optimization objective"
        }
      },
      required: ["inventory", "salesData"]
    }
  }
};

// Tool pour prévisions de demande
export const forecastDemandTool = {
  type: "function" as const,
  function: {
    name: "forecast_demand",
    description: "Forecast future demand based on historical data",
    parameters: {
      type: "object",
      properties: {
        salesHistory: {
          type: "array",
          description: "Historical sales data"
        },
        forecastHorizon: {
          type: "number",
          description: "Number of periods to forecast"
        },
        seasonality: {
          type: "boolean",
          description: "Whether to account for seasonal patterns"
        },
        externalFactors: {
          type: "array",
          description: "External factors that might affect demand"
        }
      },
      required: ["salesHistory", "forecastHorizon"]
    }
  }
};

// Tool pour détecter les articles à rotation lente
export const detectSlowMovingItemsTool = {
  type: "function" as const,
  function: {
    name: "detect_slow_moving_items",
    description: "Identify slow-moving and obsolete inventory",
    parameters: {
      type: "object",
      properties: {
        inventory: {
          type: "array",
          description: "Current inventory items"
        },
        salesHistory: {
          type: "array",
          description: "Sales history for analysis"
        },
        thresholds: {
          type: "object",
          properties: {
            daysWithoutSale: { type: "number" },
            minimumTurnover: { type: "number" },
            agingPeriods: { type: "array" }
          }
        }
      },
      required: ["inventory", "salesHistory"]
    }
  }
};

// Tool pour générer des rapports d'inventaire
export const generateInventoryReportTool = {
  type: "function" as const,
  function: {
    name: "generate_inventory_report",
    description: "Generate comprehensive inventory analysis report",
    parameters: {
      type: "object",
      properties: {
        inventory: {
          type: "array",
          description: "Current inventory data"
        },
        analysis: {
          type: "object",
          description: "Analysis results"
        },
        optimizations: {
          type: "array",
          description: "Optimization recommendations"
        },
        reportType: {
          type: "string",
          enum: ["executive", "operational", "detailed"],
          description: "Type of report to generate"
        }
      },
      required: ["inventory"]
    }
  }
};

// Implémentations des fonctions outils
export const toolImplementations = {
  analyze_stock_levels: async (params: any) => {
    const { inventory, salesHistory = [], analysisType = "comprehensive" } = params;
    
    const analysis: {
      overstocked: Array<InventoryItem & { daysOfStock: number; recommendation: string }>;
      understocked: Array<InventoryItem & { daysOfStock: number; recommendation: string }>;
      optimal: Array<InventoryItem & { daysOfStock: number; status: string }>;
      slowMoving: Array<InventoryItem & { lastSale: string; recommendation: string }>;
      metrics: { totalValue: number; averageTurnover: number; stockoutRisk: number };
    } = {
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
      const itemSales = salesHistory.filter((sale: SalesData) => sale.itemId === item.id);
      const recentSales = itemSales.filter((sale: SalesData) => {
        const saleDate = new Date(sale.date);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= thirtyDaysAgo;
      });
      
      const monthlyDemand = recentSales.reduce((sum: number, sale: SalesData) => sum + sale.quantity, 0);
      const daysOfStock = monthlyDemand > 0 ? (item.currentStock / monthlyDemand) * 30 : Infinity;
      
      analysis.metrics.totalValue += item.currentStock * item.unitCost;
      
      if (daysOfStock > 90) {
        analysis.overstocked.push({
          ...item,
          daysOfStock,
          recommendation: "Consider reducing stock levels"
        });
      } else if (daysOfStock < 15) {
        analysis.understocked.push({
          ...item,
          daysOfStock,
          recommendation: "Reorder immediately"
        });
      } else {
        analysis.optimal.push({
          ...item,
          daysOfStock,
          status: "Optimal level"
        });
      }
      
      if (recentSales.length === 0) {
        analysis.slowMoving.push({
          ...item,
          lastSale: item.lastSaleDate || "Unknown",
          recommendation: "Consider liquidation"
        });
      }
    });
    
    return analysis;
  },

  optimize_inventory: async (params: any): Promise<OptimizationResult[]> => {
    const { 
      inventory, 
      salesData, 
      constraints = {}, 
      optimizationGoal = "balance_both" 
    } = params;
    
    const optimizations: OptimizationResult[] = [];
    
    inventory.forEach((item: InventoryItem) => {
      const itemSales = salesData.filter((sale: SalesData) => sale.itemId === item.id);
      
      // Calcul simple de la demande moyenne
      const totalDemand = itemSales.reduce((sum: number, sale: SalesData) => sum + sale.quantity, 0);
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
        reasoning: `Based on average demand of ${averageDemand.toFixed(1)} units and EOQ calculation`
      });
    });
    
    return optimizations;
  },

  forecast_demand: async (params: any): Promise<DemandForecast[]> => {
    const { 
      salesHistory, 
      forecastHorizon, 
      seasonality = false, 
      externalFactors = [] 
    } = params;
    
    const forecasts: DemandForecast[] = [];
    
    // Grouper par article
    const itemGroups = salesHistory.reduce((acc: any, sale: SalesData) => {
      if (!acc[sale.itemId]) acc[sale.itemId] = [];
      acc[sale.itemId].push(sale);
      return acc;
    }, {});
    
    Object.entries(itemGroups).forEach(([itemId, sales]: [string, any]) => {
      // Tri par date
      sales.sort((a: SalesData, b: SalesData) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calcul de tendance simple
      const quantities = sales.map((s: SalesData) => s.quantity);
      const n = quantities.length;
      
      if (n < 2) {
        forecasts.push({
          itemId,
          forecastPeriod: `Next ${forecastHorizon} periods`,
          predictedDemand: quantities[0] || 0,
          confidence: 0.3,
          trend: 'stable'
        });
        return;
      }
      
      // Régression linéaire simple
      const xValues = quantities.map((_: number, i: number) => i);
      const yValues = quantities;
      
      const xMean = xValues.reduce((a: number, b: number) => a + b, 0) / n;
      const yMean = yValues.reduce((a: number, b: number) => a + b, 0) / n;
      
      let numerator = 0, denominator = 0;
      for (let i = 0; i < n; i++) {
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        denominator += (xValues[i] - xMean) ** 2;
      }
      
      const slope = denominator !== 0 ? numerator / denominator : 0;
      const intercept = yMean - slope * xMean;
      
      const nextPeriodForecast = slope * n + intercept;
      const trend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';
      
      // Calcul de confiance basé sur la variabilité
      const variance = quantities.reduce(
        (acc: number, val: number) => acc + (val - yMean) ** 2,
        0
      ) / n;
      const confidence = Math.max(0.1, Math.min(0.9, 1 - (Math.sqrt(variance) / yMean)));
      
      forecasts.push({
        itemId,
        forecastPeriod: `Next ${forecastHorizon} periods`,
        predictedDemand: Math.max(0, nextPeriodForecast * forecastHorizon),
        confidence,
        trend
      });
    });
    
    return forecasts;
  },

  detect_slow_moving_items: async (params: any) => {
    const { 
      inventory, 
      salesHistory, 
      thresholds = {
        daysWithoutSale: 90,
        minimumTurnover: 2,
        agingPeriods: [30, 60, 90, 180]
      }
    } = params;
    
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
      const itemSales = salesHistory.filter((sale: SalesData) => sale.itemId === item.id);
      
      // Dernière vente
      const lastSale = itemSales.reduce((latest: SalesData | null, sale: SalesData) => {
        if (!latest) return sale;
        return new Date(sale.date) > new Date(latest.date) ? sale : latest;
      }, null);
      
      const daysSinceLastSale = lastSale 
        ? Math.floor((today.getTime() - new Date(lastSale.date).getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;
      
      // Calcul du taux de rotation
      const annualSales = itemSales.reduce((sum: number, sale: SalesData) => sum + sale.quantity, 0);
      const turnoverRate = item.currentStock > 0 ? annualSales / item.currentStock : 0;
      
      // Classification par période de vieillissement
      let agingCategory = 'current';
      for (const period of thresholds.agingPeriods.sort((a: number, b: number) => a - b)) {
        if (daysSinceLastSale >= period) {
          agingCategory = `${period}+ days`;
        }
      }
      
      const isSlowMoving = daysSinceLastSale >= thresholds.daysWithoutSale || 
                          turnoverRate < thresholds.minimumTurnover;
      
      if (isSlowMoving) {
        slowMovingItems.push({
          ...item,
          daysSinceLastSale,
          turnoverRate: turnoverRate.toFixed(2),
          agingCategory,
          value: item.currentStock * item.unitCost,
          recommendation: daysSinceLastSale > 180 
            ? 'Consider liquidation or promotion' 
            : 'Monitor closely and consider promotion'
        });
      }
    });
    
    return {
      slowMovingItems,
      summary: {
        totalSlowMovingItems: slowMovingItems.length,
        totalValue: slowMovingItems.reduce((sum: number, item: any) => sum + item.value, 0),
        averageDaysSinceLastSale: slowMovingItems.length > 0 
          ? slowMovingItems.reduce((sum: number, item: any) => sum + item.daysSinceLastSale, 0) / slowMovingItems.length 
          : 0
      }
    };
  },

  generate_inventory_report: async (params: any) => {
    const { 
      inventory, 
      analysis = {}, 
      optimizations = [], 
      reportType = "operational" 
    } = params;
    
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum: number, item: InventoryItem) => 
      sum + (item.currentStock * item.unitCost), 0);
    
    const categories = inventory.reduce((acc: any, item: InventoryItem) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    const report: {
      reportType: string;
      generatedAt: string;
      summary: {
        totalItems: number;
        totalValue: number;
        categoriesCount: number;
        averageItemValue: number;
      };
      categoryBreakdown: Record<string, number>;
      keyFindings: string[];
      recommendations: string[];
      analysis: any;
      optimizations: OptimizationResult[];
    } = {
      reportType,
      generatedAt: new Date().toISOString(),
      summary: {
        totalItems,
        totalValue,
        categoriesCount: Object.keys(categories).length,
        averageItemValue: totalValue / totalItems
      },
      categoryBreakdown: categories,
      keyFindings: [],
      recommendations: [],
      analysis: analysis,
      optimizations: optimizations.slice(0, 10) // Top 10 optimizations
    };
    
    // Générer des insights automatiques
    if (analysis.overstocked && analysis.overstocked.length > 0) {
      report.keyFindings.push(`${analysis.overstocked.length} items are overstocked`);
      report.recommendations.push("Review overstocked items for potential liquidation");
    }
    
    if (analysis.understocked && analysis.understocked.length > 0) {
      report.keyFindings.push(`${analysis.understocked.length} items need immediate reordering`);
      report.recommendations.push("Expedite orders for understocked items");
    }
    
    const potentialSavings = optimizations.reduce((sum: number, opt: OptimizationResult) => 
      sum + opt.expectedSavings, 0);
    
    if (potentialSavings > 0) {
      report.keyFindings.push(`Potential annual savings: $${potentialSavings.toFixed(2)}`);
      report.recommendations.push("Implement optimization recommendations to reduce holding costs");
    }
    
    return report;
  }
};
