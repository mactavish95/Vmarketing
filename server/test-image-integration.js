const axios = require('axios');

// Test image integration in blog generation
async function testImageIntegration() {
  console.log('🧪 Testing Image Integration in Blog Generation...\n');

  const LOCAL_URL = 'http://localhost:3001/api';
  const PRODUCTION_URL = 'https://vmarketing-backend-server.onrender.com/api';
  
  // Use local URL for testing
  const baseURL = LOCAL_URL;

  // Sample image data (base64 encoded small test image)
  const sampleImageData = {
    name: 'test-restaurant.jpg',
    type: 'image/jpeg',
    size: 102400, // 100KB
    dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A'
  };

  const testData = {
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
    images: [sampleImageData]
  };

  try {
    console.log('📤 Sending request with image data...');
    console.log(`🌐 URL: ${baseURL}/blog/generate`);
    console.log(`📸 Images: ${testData.images.length}`);
    console.log(`🍽️ Restaurant: ${testData.restaurantName}`);
    console.log(`📝 Topic: ${testData.topic}\n`);

    const response = await axios.post(`${baseURL}/blog/generate`, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data.success) {
      console.log('✅ Blog generation successful!');
      console.log(`📊 Word Count: ${response.data.wordCount}`);
      console.log(`🤖 Model Used: ${response.data.model}`);
      console.log(`🤖 Model Type: nvidia/llama-3.3-nemotron-super-49b-v1`);
      console.log(`📸 Image Analysis: ${response.data.imageAnalysis ? 'Yes' : 'No'}`);
      
      if (response.data.imageAnalysis) {
        console.log('\n📸 Image Analysis Details:');
        console.log(`   Total Images: ${response.data.imageAnalysis.totalImages}`);
        console.log('   Image Details:');
        response.data.imageAnalysis.imageDetails.forEach((img, index) => {
          console.log(`     ${index + 1}. ${img.name}`);
          console.log(`        Placement: ${img.suggestedPlacement}`);
          console.log(`        Caption: ${img.suggestedCaption}`);
        });
        
        if (response.data.imageAnalysis.integrationSuggestions.length > 0) {
          console.log('\n   Integration Suggestions:');
          response.data.imageAnalysis.integrationSuggestions.forEach((suggestion, index) => {
            console.log(`     ${index + 1}. ${suggestion}`);
          });
        }
      }
      
      console.log('\n📝 Blog Content Preview:');
      const preview = response.data.blogPost.substring(0, 200) + '...';
      console.log(preview);
      
      console.log('\n🎉 Image integration test completed successfully!');
    } else {
      console.log('❌ Blog generation failed:');
      console.log(response.data.error);
    }

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${error.response.data.error || error.response.statusText}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

// Run the test
if (require.main === module) {
  testImageIntegration();
}

module.exports = { testImageIntegration }; 