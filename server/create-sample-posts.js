const { PublishedPost, User } = require('./config/database');

async function createSamplePosts() {
  try {
    // Get the admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    // Create sample published posts
    const samplePosts = [
      {
        postId: 'sample-1',
        userId: adminUser._id,
        platform: 'facebook',
        content: 'Check out our amazing new menu items! 🍜✨ #VietnameseFood #Delicious',
        status: 'published',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        engagement: {
          likes: 45,
          comments: 12,
          shares: 8,
          views: 1200
        },
        hidden: false
      },
      {
        postId: 'sample-2',
        userId: adminUser._id,
        platform: 'instagram',
        content: 'Fresh spring rolls made with love 💚 #FreshFood #Healthy #VietnameseCuisine',
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        engagement: {
          likes: 89,
          comments: 23,
          shares: 15,
          views: 2100
        },
        hidden: false
      },
      {
        postId: 'sample-3',
        userId: adminUser._id,
        platform: 'twitter',
        content: 'Just launched our new summer menu! Come try our signature pho 🍲 #SummerMenu #Pho #Foodie',
        status: 'published',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        engagement: {
          likes: 67,
          comments: 18,
          shares: 22,
          views: 1800
        },
        hidden: false
      },
      {
        postId: 'sample-4',
        userId: adminUser._id,
        platform: 'linkedin',
        content: 'Excited to share our journey in bringing authentic Vietnamese cuisine to Vancouver. #Business #VietnameseFood #Vancouver',
        status: 'published',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        engagement: {
          likes: 34,
          comments: 8,
          shares: 5,
          views: 950
        },
        hidden: false
      },
      {
        postId: 'sample-5',
        userId: adminUser._id,
        platform: 'facebook',
        content: 'Weekend special: Buy 2 get 1 free on all banh mi sandwiches! 🥖 #WeekendSpecial #BanhMi #Deals',
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        engagement: {
          likes: 156,
          comments: 42,
          shares: 31,
          views: 3200
        },
        hidden: true // This one is hidden
      }
    ];

    // Check if posts already exist
    const existingPosts = await PublishedPost.find({ postId: { $in: samplePosts.map(p => p.postId) } });
    if (existingPosts.length > 0) {
      console.log('✅ Sample posts already exist in the database.');
      return;
    }

    // Insert sample posts
    await PublishedPost.insertMany(samplePosts);

    console.log('✅ Created 5 sample published posts!');
    console.log('📊 Sample posts include:');
    console.log('   - Facebook posts (2)');
    console.log('   - Instagram post (1)');
    console.log('   - Twitter post (1)');
    console.log('   - LinkedIn post (1)');
    console.log('   - One hidden post for testing');
    console.log('');
    console.log('🔗 You can now view these posts in the admin panel at:');
    console.log('   http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Error creating sample posts:', error);
  }
}

// Run the script
createSamplePosts(); 