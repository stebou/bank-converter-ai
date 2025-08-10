import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { bankingService } from '@/lib/banking';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[BANKING_API] Starting sync for user: ${userId}`);

    const syncResult = await bankingService.syncUserBankData(userId);

    console.log(`[BANKING_API] Sync completed:`, syncResult);

    return NextResponse.json({
      success: true,
      message: 'Bank data synchronized successfully',
      syncResult,
    });
  } catch (error) {
    console.error('[BANKING_API] Sync error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync bank data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
