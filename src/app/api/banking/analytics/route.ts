import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { bankingService } from '@/lib/banking';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';

    const analytics = await bankingService.getFinancialAnalytics(userId, timeframe);

    return NextResponse.json({
      success: true,
      analytics,
      timeframe,
    });
  } catch (error) {
    console.error('[BANKING_API] Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate financial analytics' },
      { status: 500 }
    );
  }
}