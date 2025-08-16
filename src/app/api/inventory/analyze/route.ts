import {
  demandForecastAgent,
  inventoryAnalystAgent,
  runInventoryAgent,
  stockOptimizationAgent,
} from '@/lib/agents/inventory/agents';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, data, analysisType = 'comprehensive' } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Missing inventory data' },
        { status: 400 }
      );
    }

    let agent;
    let prompt;

    switch (type) {
      case 'optimization':
        agent = stockOptimizationAgent;
        prompt = `Optimize inventory levels and reorder policies for this data: ${JSON.stringify(data)}`;
        break;

      case 'forecast':
        agent = demandForecastAgent;
        prompt = `Analyze demand patterns and create forecasts based on this inventory data: ${JSON.stringify(data)}`;
        break;

      case 'comprehensive':
      default:
        agent = inventoryAnalystAgent;
        prompt = `Perform a comprehensive inventory analysis. Analyze stock levels, detect slow-moving items, and provide optimization recommendations: ${JSON.stringify(data)}`;
        break;
    }

    const result = await runInventoryAgent(agent, prompt, data);

    return NextResponse.json({
      success: true,
      analysisType: type || 'comprehensive',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Inventory analysis error:', error);

    return NextResponse.json(
      {
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Inventory Analysis API',
    version: '1.0.0',
    availableTypes: [
      'comprehensive', // Default: Full inventory analysis
      'optimization', // Stock optimization focused
      'forecast', // Demand forecasting focused
    ],
    status: 'operational',
  });
}
