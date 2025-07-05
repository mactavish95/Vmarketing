const axios = require('axios');

// Configuration
const LOCAL_URL = 'http://localhost:3001/api';
const PRODUCTION_URL = 'https://vmarketing-backend-server.onrender.com/api';

// Test data
const testBlogData = {
  topic: 'Our New Seasonal Menu Launch',
  restaurantName: 'Taste of Italy',
  restaurantType: 'restaurant',
  cuisine: 'Italian',
  location: 'Downtown Seattle',
  targetAudience: 'foodies',
  tone: 'enthusiastic',
  length: 'medium',
  keyPoints: 'Fresh ingredients, seasonal specialties, chef recommendations',
  specialFeatures: 'Award-winning chef, farm-to-table ingredients',
  apiKey: process.env.NVIDIA_API_KEY || 'your-api-key-here',
  images: [
    {
      name: 'seasonal-menu.jpg',
      type: 'image/jpeg',
      size: 2048576,
      dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A'
    },
    {
      name: 'chef-special.jpg',
      type: 'image/jpeg',
      size: 1536000,
      dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A'
    }
  ]
};

async function testBlogEndpoint(baseURL, environment) {
  console.log(`\n🧪 Testing Blog Endpoint - ${environment}`);
  console.log(`📍 URL: ${baseURL}/blog/generate`);
  
  try {
    // Test 1: Blog generation without images
    console.log('\n📝 Test 1: Blog generation without images');
    const blogDataWithoutImages = { ...testBlogData };
    delete blogDataWithoutImages.images;
    
    const response1 = await axios.post(`${baseURL}/blog/generate`, blogDataWithoutImages, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
    
    if (response1.data.success) {
      console.log('✅ Blog generation without images: SUCCESS');
      console.log(`   Word count: ${response1.data.wordCount}`);
      console.log(`   Model: ${response1.data.model}`);
      console.log(`   Model type: nvidia/llama-3.3-nemotron-super-49b-v1`);
    } else {
      console.log('❌ Blog generation without images: FAILED');
      console.log(`   Error: ${response1.data.error}`);
    }
    
    // Test 2: Blog generation with images
    console.log('\n📸 Test 2: Blog generation with images');
    const response2 = await axios.post(`${baseURL}/blog/generate`, testBlogData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
    
    if (response2.data.success) {
      console.log('✅ Blog generation with images: SUCCESS');
      console.log(`   Word count: ${response2.data.wordCount}`);
      console.log(`   Model: ${response2.data.model}`);
      console.log(`   Model type: nvidia/llama-3.3-nemotron-super-49b-v1`);
      console.log(`   Images processed: ${response2.data.imageAnalysis ? response2.data.imageAnalysis.totalImages : 0}`);
      
      if (response2.data.imageAnalysis) {
        console.log('   Image analysis:');
        response2.data.imageAnalysis.imageDetails.forEach(img => {
          console.log(`     - ${img.name}: ${img.suggestedPlacement} (${img.suggestedCaption})`);
        });
      }
    } else {
      console.log('❌ Blog generation with images: FAILED');
      console.log(`   Error: ${response2.data.error}`);
    }
    
    // Test 3: Model info endpoint
    console.log('\n🤖 Test 3: Model info endpoint');
    const response3 = await axios.get(`${baseURL}/blog/model`, {
      timeout: 10000
    });
    
    if (response3.data.success) {
      console.log('✅ Model info: SUCCESS');
      console.log(`   Model: ${response3.data.model.name}`);
      console.log(`   Model type: nvidia/llama-3.3-nemotron-super-49b-v1`);
      console.log(`   Provider: ${response3.data.model.modelInfo?.provider || 'NVIDIA'}`);
      console.log(`   Parameters: ${response3.data.model.modelInfo?.parameters || '49B'}`);
      console.log(`   Max context: ${response3.data.model.modelInfo?.maxContextLength || '4096 tokens'}`);
      console.log(`   Image support: ${response3.data.model.imageSupport}`);
      console.log(`   Max images: ${response3.data.model.maxImages}`);
      console.log(`   Max tokens: ${response3.data.model.parameters?.maxTokens || 'N/A'}`);
      
      if (response3.data.model.modelInfo?.capabilities) {
        console.log('   Capabilities:');
        response3.data.model.modelInfo.capabilities.forEach(cap => {
          console.log(`     - ${cap}`);
        });
      }
    } else {
      console.log('❌ Model info: FAILED');
      console.log(`   Error: ${response3.data.error}`);
    }
    
    // Test 4: Image processing endpoint
    console.log('\n🖼️ Test 4: Image processing endpoint');
    const response4 = await axios.post(`${baseURL}/blog/process-images`, {
      images: testBlogData.images,
      apiKey: testBlogData.apiKey
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });
    
    if (response4.data.success) {
      console.log('✅ Image processing: SUCCESS');
      console.log(`   Images processed: ${response4.data.imageAnalysis.totalImages}`);
    } else {
      console.log('❌ Image processing: FAILED');
      console.log(`   Error: ${response4.data.error}`);
    }
    
  } catch (error) {
    console.log(`❌ ${environment} test failed:`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data.error || error.message}`);
    } else if (error.request) {
      console.log(`   Network error: ${error.message}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Blog Endpoint Tests');
  console.log('================================');
  
  // Test local server
  await testBlogEndpoint(LOCAL_URL, 'LOCAL SERVER');
  
  // Test production server
  await testBlogEndpoint(PRODUCTION_URL, 'PRODUCTION SERVER');
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBlogEndpoint, runTests }; 