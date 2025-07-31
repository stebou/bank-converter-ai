import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test des types disponibles
async function testTypes() {
  // Ceci devrait fonctionner si le modèle payment existe
  const payment = await prisma.payment.findFirst();
  
  console.log('Payment model accessible:', !!payment);
}

// Afficher tous les modèles disponibles
console.log('Available Prisma models:');
console.log(Object.getOwnPropertyNames(prisma).filter(prop => 
  typeof (prisma as any)[prop] === 'object' && 
  (prisma as any)[prop] && 
  typeof (prisma as any)[prop].create === 'function'
));

export {};