import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { bankingService } from '@/lib/banking';
import {
  logSecurityEvent,
  rateLimitCheck,
  maskSensitiveFields,
} from '@/lib/banking-security';

export async function GET(request: NextRequest) {
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;

    if (!userId) {
      logSecurityEvent('unauthorized_access_attempt', 'unknown', {
        endpoint: '/api/banking/accounts',
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    if (!rateLimitCheck(userId, 'fetch')) {
      logSecurityEvent('rate_limit_exceeded', userId, {
        endpoint: '/api/banking/accounts',
      });
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    logSecurityEvent('accounts_access', userId);
    const accounts = await bankingService.getUserBankAccounts(userId);

    // Masquer les données sensibles pour les logs
    const maskedAccounts = accounts.map(maskSensitiveFields);

    return NextResponse.json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.error('[BANKING_API] Get accounts error:', error);
    logSecurityEvent('accounts_fetch_error', userId || 'unknown', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Failed to fetch bank accounts' },
      { status: 500 }
    );
  }
}
