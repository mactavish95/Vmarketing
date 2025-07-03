#!/usr/bin/env node

async function testIntegration() {
  console.log('🧪 Testing ReviewGen Integration...\n');

  // Test 1: Backend Health Check
  console.log('1️⃣ Testing Backend Health...');
  try {
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'OK') {
      console.log('✅ Backend is healthy');
      console.log(`   API Key configured: ${healthData.apiKeyConfigured}`);
      console.log(`   Environment: ${healthData.environment}`);
    } else {
      console.log('❌ Backend health check failed');
      return;
    }
  } catch (error) {
    console.log('❌ Backend is not running on port 3001');
    console.log('   Please start the backend with: cd server && npm run dev');
    return;
  }

  // Test 2: Frontend Availability
  console.log('\n2️⃣ Testing Frontend...');
  try {
    const frontendResponse = await fetch('http://localhost:3000');
    if (frontendResponse.ok) {
      console.log('✅ Frontend is running on port 3000');
    } else {
      console.log('❌ Frontend is not responding properly');
    }
  } catch (error) {
    console.log('❌ Frontend is not running on port 3000');
    console.log('   Please start the frontend with: npm start');
    return;
  }

  // Test 3: Llama API Integration
  console.log('\n3️⃣ Testing Llama API Integration...');
  try {
    const llamaResponse = await fetch('http://localhost:3001/api/llama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Say "Hello from ReviewGen!" in a friendly way',
        apiKey: 'test-key'
      })
    });

    const llamaData = await llamaResponse.json();
    
    if (llamaData.success) {
      console.log('✅ Llama API integration working');
      console.log(`   Response: ${llamaData.response.substring(0, 100)}...`);
      console.log(`   Tokens used: ${llamaData.usage?.total_tokens || 'unknown'}`);
    } else {
      console.log('❌ Llama API integration failed');
      console.log(`   Error: ${llamaData.error}`);
    }
  } catch (error) {
    console.log('❌ Llama API test failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Voice Analysis Integration
  console.log('\n4️⃣ Testing Voice Analysis Integration...');
  try {
    const voiceAnalysisResponse = await fetch('http://localhost:3001/api/voice/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript: 'I had an amazing experience at this restaurant. The food was delicious and the service was excellent.',
        apiKey: 'test-key'
      })
    });

    const voiceAnalysisData = await voiceAnalysisResponse.json();
    
    if (voiceAnalysisData.success) {
      console.log('✅ Voice Analysis integration working');
      console.log(`   Sentiment: ${voiceAnalysisData.analysis.sentiment}`);
      console.log(`   Confidence: ${Math.round(voiceAnalysisData.analysis.confidence * 100)}%`);
      console.log(`   Key Points: ${voiceAnalysisData.analysis.keyPoints.length}`);
      console.log(`   Tokens used: ${voiceAnalysisData.usage?.total_tokens || 'unknown'}`);
    } else {
      console.log('❌ Voice Analysis integration failed');
      console.log(`   Error: ${voiceAnalysisData.error}`);
    }
  } catch (error) {
    console.log('❌ Voice Analysis test failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 5: Voice Review Generation
  console.log('\n5️⃣ Testing Voice Review Generation...');
  try {
    const reviewGenerationResponse = await fetch('http://localhost:3001/api/voice/generate-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript: 'The food was amazing and the staff was very friendly.',
        analysis: {
          sentiment: 'positive',
          confidence: 0.9,
          keyPoints: ['Amazing food', 'Friendly staff'],
          topics: ['Restaurant', 'Food quality', 'Service'],
          tone: 'enthusiastic',
          summary: 'Positive restaurant experience'
        },
        apiKey: 'test-key',
        reviewType: 'restaurant'
      })
    });

    const reviewGenerationData = await reviewGenerationResponse.json();
    
    if (reviewGenerationData.success) {
      console.log('✅ Voice Review Generation working');
      console.log(`   Review length: ${reviewGenerationData.review.length} characters`);
      console.log(`   Tokens used: ${reviewGenerationData.usage?.total_tokens || 'unknown'}`);
    } else {
      console.log('❌ Voice Review Generation failed');
      console.log(`   Error: ${reviewGenerationData.error}`);
    }
  } catch (error) {
    console.log('❌ Voice Review Generation test failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 6: CORS Configuration
  console.log('\n6️⃣ Testing CORS Configuration...');
  try {
    const corsResponse = await fetch('http://localhost:3001/api/llama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        text: 'Test CORS',
        apiKey: 'test-key'
      })
    });

    if (corsResponse.ok) {
      console.log('✅ CORS is properly configured');
    } else {
      console.log('❌ CORS configuration issue');
    }
  } catch (error) {
    console.log('❌ CORS test failed');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n🎉 Integration Test Complete!');
  console.log('\n📱 To use the app:');
  console.log('   1. Open http://localhost:3000 in your browser');
  console.log('   2. Navigate to the Voice Review section');
  console.log('   3. Enter your NVIDIA API key');
  console.log('   4. Start recording voice reviews!');
  console.log('\n🔑 Get your NVIDIA API key from: https://integrate.api.nvidia.com');
  console.log('\n🎤 Voice Features:');
  console.log('   • Voice recognition and transcription');
  console.log('   • AI-powered voice analysis (sentiment, key points, topics)');
  console.log('   • Professional review generation from voice input');
  console.log('   • Location attachment support');
  console.log('   • Multiple review types (restaurant, hotel, product, etc.)');
}

// Run the test
testIntegration().catch(console.error); 