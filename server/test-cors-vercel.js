const { corsOptions } = require('./middleware/security');

// Test origins
const testOrigins = [
  'https://vmarketing-3xttt9qae-ghostwares-projects.vercel.app',
  'https://vmarketing-3xttt9qae-ghostwares-projects.vercel.app/',
  'https://vmarketing.netlify.app',
  'http://localhost:3000',
  'https://malicious-site.com',
  null // No origin (mobile apps, curl requests)
];

console.log('🧪 Testing CORS Configuration for Vercel Support\n');

testOrigins.forEach((origin, index) => {
  console.log(`\n--- Test ${index + 1}: ${origin || 'no-origin'} ---`);
  
  corsOptions.origin(origin, (err, allowed) => {
    if (err) {
      console.log(`❌ BLOCKED: ${origin || 'no-origin'}`);
      console.log(`   Error: ${err.message}`);
    } else {
      console.log(`✅ ALLOWED: ${origin || 'no-origin'}`);
    }
  });
});

console.log('\n🎯 Expected Results:');
console.log('✅ Vercel domains should be allowed');
console.log('✅ Netlify domains should be allowed');
console.log('✅ Localhost should be allowed');
console.log('❌ Malicious sites should be blocked');
console.log('✅ No-origin requests should be allowed (for mobile apps)'); 