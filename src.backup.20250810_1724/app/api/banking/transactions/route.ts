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
    const accountId = searchParams.get('accountId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const transactions = await bankingService.getUserBankTransactions(
      userId,
      accountId || undefined,
      limit
    );

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('[BANKING_API] Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bank transactions' },
      { status: 500 }
    );
  }
}
