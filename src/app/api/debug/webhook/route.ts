// Route de debug pour tester le webhook et la DB
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment_variables: {
      DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET ? 'PRESENT' : 'MISSING',
    },
    database_test: null as any,
    prisma_version: null as any,
  };

  try {
    // Test de connexion Prisma
    console.log('[DEBUG] Testing Prisma connection...');
    await prisma.$connect();
    console.log('[DEBUG] Prisma connected successfully');
    
    // Test de lecture des utilisateurs
    const users = await prisma.user.findMany({ take: 2 });
    console.log('[DEBUG] Found users:', users.length);
    
    results.database_test = {
      status: 'SUCCESS',
      users_count: users.length,
      sample_users: users.map(u => ({ 
        id: u.id, 
        clerkId: u.clerkId, 
        email: u.email 
      }))
    };
    
  } catch (error: any) {
    console.error('[DEBUG] Database error:', error);
    results.database_test = {
      status: 'ERROR',
      error: error.message,
      code: error.code
    };
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json(results, { status: 200 });
}

export async function POST(req: NextRequest) {
  console.log('[DEBUG] POST request received');
  
  try {
    // Test de création d'un utilisateur fictif
    const testUser = await prisma.user.create({
      data: {
        clerkId: 'debug_' + Date.now(),
        email: 'debug@test.com',
        name: 'Debug User'
      }
    });
    
    console.log('[DEBUG] Test user created:', testUser.id);
    
    // Suppression immédiate
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    console.log('[DEBUG] Test user deleted');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database operations successful' 
    });
    
  } catch (error: any) {
    console.error('[DEBUG] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}