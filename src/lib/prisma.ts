import { PrismaClient } from '@prisma/client';

// Prévenir la création de multiples instances en développement
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper pour gérer les déconnexions proprement
export async function disconnectPrisma() {
  await prisma.$disconnect();
}