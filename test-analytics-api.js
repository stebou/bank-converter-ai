// Test des analytics directement via l'API endpoint
const { NextRequest } = require('next/server');

async function testAnalyticsAPI() {
  // Simuler la fonction
  const clerkUserId = 'user_30SwglBEGH3n7gem5BJUqO1c5T4';
  const timeframe = '1y';
  
  const { bankingService } = require('./src/lib/banking');
  
  console.log('Testing analytics API...');
  console.log('User ID:', clerkUserId);
  console.log('Timeframe:', timeframe);
  
  try {
    const analytics = await bankingService.getFinancialAnalytics(clerkUserId, timeframe);
    
    console.log('\n=== API ANALYTICS RESULT ===');
    console.log(JSON.stringify(analytics, null, 2));
    
    // Test la structure de réponse exacte de l'API
    const apiResponse = {
      success: true,
      analytics,
      timeframe,
    };
    
    console.log('\n=== FULL API RESPONSE ===');
    console.log(JSON.stringify(apiResponse, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAnalyticsAPI();
