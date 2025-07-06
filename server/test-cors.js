const axios = require('axios');

async function testCORS() {
  const baseURL = 'https://vmarketing-backend-server.onrender.com';
  const testOrigin = 'https://development--vmarketing.netlify.app';
  
  console.log('🧪 Testing CORS configuration...');
  console.log(`Base URL: ${baseURL}`);
  console.log(`Test Origin: ${testOrigin}`);
  
  try {
    // Test preflight request
    console.log('\n1. Testing preflight request...');
    const preflightResponse = await axios.options(`${baseURL}/api/health`, {
      headers: {
        'Origin': testOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ Preflight request successful');
    console.log('Response headers:', preflightResponse.headers);
    
    // Test actual request
    console.log('\n2. Testing actual request...');
    const response = await axios.get(`${baseURL}/api/health`, {
      headers: {
        'Origin': testOrigin
      }
    });
    
    console.log('✅ Actual request successful');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ CORS test failed');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCORS(); 