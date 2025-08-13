import {
    bankingAnalystAgent,
    cashFlowAnalystAgent,
    fraudDetectionAgent,
    runBankingAgent
} from '@/lib/agents/banking/agents';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, data, analysisType = 'comprehensive' } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Missing document data' },
        { status: 400 }
      );
    }

    let agent;
    let prompt;

    switch (type) {
      case 'fraud':
        agent = fraudDetectionAgent;
        prompt = `Analyze this banking document for potential fraud and suspicious activities: ${JSON.stringify(data)}`;
        break;
      
      case 'cashflow':
        agent = cashFlowAnalystAgent;
        prompt = `Perform cash flow analysis on this banking data: ${JSON.stringify(data)}`;
        break;
      
      case 'comprehensive':
      default:
        agent = bankingAnalystAgent;
        prompt = `Perform a comprehensive analysis of this banking document. Extract transactions, detect anomalies, and provide insights: ${JSON.stringify(data)}`;
        break;
    }

    const result = await runBankingAgent(agent, prompt, data);

    return NextResponse.json({
      success: true,
      analysisType: type || 'comprehensive',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Banking analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Banking Analysis API',
    version: '1.0.0',
    availableTypes: [
      'comprehensive', // Default: Full banking analysis
      'fraud',         // Fraud detection focused
      'cashflow'       // Cash flow analysis focused
    ],
    status: 'operational'
  });
}
