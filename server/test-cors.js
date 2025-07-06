const axios = require('axios');

async function testCORS() {
  const baseURL = process.env.TEST_URL || 'http://localhost:3001';
  const testOrigins = [
    'https://development--vmarketing.netlify.app',
    'https://vmarketing.netlify.app',
    'https://app.netlify.com',
    'http://localhost:3000',
    'https://example.com',
    'https://test.netlify.app'
  ];

  console.log('🧪 Testing CORS Configuration');
  console.log('================================');
  console.log(`📍 Testing against: ${baseURL}`);
  console.log('');

  for (const origin of testOrigins) {
    try {
      console.log(`🔍 Testing origin: ${origin}`);
      
      const response = await axios.get(`${baseURL}/api/health`, {
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        timeout: 5000
      });

      console.log(`✅ SUCCESS: ${origin} - Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      if (error.response) {
        console.log(`❌ FAILED: ${origin} - Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data?.error || error.message}`);
      } else {
        console.log(`❌ FAILED: ${origin} - Network Error: ${error.message}`);
      }
    }
    console.log('');
  }

  // Test preflight request
  console.log('🔄 Testing preflight request...');
  try {
    const preflightResponse = await axios.options(`${baseURL}/api/health`, {
      headers: {
        'Origin': 'https://development--vmarketing.netlify.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      timeout: 5000
    });

    console.log(`✅ Preflight SUCCESS - Status: ${preflightResponse.status}`);
    console.log(`   Headers: ${JSON.stringify(preflightResponse.headers, null, 2)}`);
  } catch (error) {
    console.log(`❌ Preflight FAILED: ${error.message}`);
  }
}

// Run the test
testCORS().catch(console.error); 