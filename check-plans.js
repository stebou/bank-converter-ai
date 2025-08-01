const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPlans() {
  try {
    console.log('Checking plans in database...');
    const plans = await prisma.plan.findMany();
    console.log('Found plans:', JSON.stringify(plans, null, 2));
    
    if (plans.length === 0) {
      console.log('No plans found. Creating sample plans...');
      
      const samplePlans = [
        {
          id: '1',
          name: 'Pack 50 Crédits',
          description: 'Parfait pour un usage occasionnel',
          price: 9.99,
          documentsLimit: 50,
          features: ['50 analyses de documents', 'Support email'],
          stripeProductId: 'prod_sample_50',
          stripePriceId: 'price_sample_50'
        },
        {
          id: '2', 
          name: 'Pack 200 Crédits',
          description: 'Idéal pour les PME',
          price: 29.99,
          documentsLimit: 200,
          features: ['200 analyses de documents', 'Support prioritaire', 'Export CSV'],
          stripeProductId: 'prod_sample_200',
          stripePriceId: 'price_sample_200'
        }
      ];
      
      for (const plan of samplePlans) {
        await prisma.plan.create({ data: plan });
        console.log(`Created plan: ${plan.name}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlans();