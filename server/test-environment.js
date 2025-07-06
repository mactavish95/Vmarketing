require('dotenv').config();

console.log('🔧 Server Environment Check');
console.log('==========================');

console.log('\n📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('NVIDIA_API_KEY:', process.env.NVIDIA_API_KEY ? `${process.env.NVIDIA_API_KEY.substring(0, 10)}...` : 'NOT SET');

console.log('\n🌐 CORS Configuration Test:');
const { corsOptions } = require('./middleware/security');

// Test CORS with your frontend URL
const testOrigin = 'https://development--vmarketing.netlify.app';
console.log('Testing origin:', testOrigin);

corsOptions.origin(testOrigin, (err, allowed) => {
  if (err) {
    console.log('❌ CORS Error:', err.message);
  } else {
    console.log('✅ CORS Result:', allowed ? 'ALLOWED' : 'BLOCKED');
  }
});

console.log('\n📦 Package Info:');
const packageJson = require('./package.json');
console.log('Main entry:', packageJson.main);
console.log('Start script:', packageJson.scripts.start);

console.log('\n🔍 Server Files Check:');
const fs = require('fs');
const serverFiles = ['server-new.js', 'server-debug.js', 'server-simple.js'];
serverFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${file}: ${exists ? '✅' : '❌'}`);
}); 