import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { seedTestBankingData } from '@/lib/banking-test-data';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Vérifier qu'on est en mode développement
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test data seeding not allowed in production' },
        { status: 403 }
      );
    }

    console.log(`[BANKING_API] Seeding test data for user: ${userId}`);

    const result = await seedTestBankingData(userId);

    return NextResponse.json({
      success: true,
      message: 'Test banking data created successfully',
      result,
    });
  } catch (error) {
    console.error('[BANKING_API] Seed test data error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create test banking data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
