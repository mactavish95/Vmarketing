const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection (optional for development)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reviewgen';

// Only connect to MongoDB if it's available
const connectToMongoDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');

    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed');
    console.warn(`   Error: ${err.message}`);
    console.warn('   The server will run without database features');
    console.warn('');
    console.warn('🔧 To enable database features:');
    console.warn('   1. Start MongoDB: sudo service mongodb start');
    console.warn('   2. Or start manually: mongod --dbpath /data/db');
    console.warn('   3. Or use a cloud MongoDB service');
    console.warn('');
    console.warn('📝 Note: Social media posts and reviews will not be saved');
    console.warn('   but the API will still work for generating content');
  }
};

// Review Schema and Model
const reviewSchema = new mongoose.Schema({
  review: { type: String, required: true },
  sentiment: { type: String, required: true },
  aiResponse: { type: String },
  createdAt: { type: Date, default: Date.now },
  handledBy: { type: String, default: 'AI' },
  type: { type: String, default: 'customer_service' },
  extra: { type: mongoose.Schema.Types.Mixed }, // for any extra data
});

const Review = mongoose.model('Review', reviewSchema);

// Social Media Post Schema and Model (global history)
const socialMediaPostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  original: { type: String, required: true },
  enhanced: { type: String, required: true },
  platform: { type: String, required: true },
  postType: { type: String },
  tone: { type: String },
  targetAudience: { type: String },
  contentStructure: { type: String },
  engagementGoal: { type: String },
  length: { type: Number },
  brandVoiceIntensity: { type: String },
  situation: { type: String },
  timestamp: { type: Date, default: Date.now }
});

socialMediaPostSchema.index({ userId: 1 });

const SocialMediaPost = mongoose.model('SocialMediaPost', socialMediaPostSchema);

// Blog Post Schema and Model - Updated for frontend compatibility
const blogPostSchema = new mongoose.Schema({
  // Core blog information
  topic: { type: String, required: true },
  mainName: { type: String, required: true }, // New field name (was restaurantName)
  type: { type: String, default: 'business' }, // New field name (was restaurantType)
  industry: { type: String, default: '' }, // New field name (was cuisine)
  location: { type: String, default: '' },
  targetAudience: { type: String, default: 'general' },
  tone: { type: String, default: 'professional' },
  length: { type: String, default: 'medium' },
  keyPoints: { type: String, default: '' },
  specialFeatures: { type: String, default: '' },
  
  // Generated content
  blogPost: { type: String, required: true },
  
  // Media and analysis
  images: { 
    type: Array, 
    default: [] 
  }, // Array of image objects: { id, name, type, size, dataUrl }
  imageAnalysis: { 
    type: Object, 
    default: null 
  }, // Image analysis results
  
  // Generation metadata
  model: { type: String, default: 'nvidia/llama-3.3-nemotron-super-49b-v1' },
  wordCount: { type: Number, default: 0 },
  metadata: { 
    type: Object, 
    default: {} 
  }, // Additional generation metadata
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
blogPostSchema.index({ topic: 1, createdAt: -1 });
blogPostSchema.index({ mainName: 1, createdAt: -1 });
blogPostSchema.index({ type: 1, industry: 1 });
blogPostSchema.index({ createdAt: -1 });

// Virtual for backward compatibility
blogPostSchema.virtual('restaurantName').get(function() {
  return this.mainName;
});

blogPostSchema.virtual('restaurantType').get(function() {
  return this.type;
});

blogPostSchema.virtual('cuisine').get(function() {
  return this.industry;
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// User Schema and Model (for local registration)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // hashed
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.warn('⚠️  MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection disconnected');
});

// Helper function to check if MongoDB is available
const isMongoDBAvailable = () => {
  return mongoose.connection.readyState === 1;
};

// Helper function to safely save data
const safeSave = async (model, data) => {
  if (!isMongoDBAvailable()) {
    console.warn('⚠️  MongoDB not available, skipping save');
    return null;
  }
  
  try {
    const result = await model.create(data);
    console.log('💾 Data saved to MongoDB successfully');
    return result;
  } catch (error) {
    console.warn('⚠️  Failed to save to MongoDB:', error.message);
    return null;
  }
};

// Migration function to update existing blog posts to new schema
const migrateBlogPosts = async () => {
  if (!isMongoDBAvailable()) {
    console.warn('⚠️  MongoDB not available, skipping migration');
    return;
  }

  try {
    console.log('🔄 Starting blog posts migration...');
    
    // Get all blog posts to check for migration needs
    const allBlogPosts = await BlogPost.find({});
    console.log(`📊 Found ${allBlogPosts.length} total blog posts to check`);

    let migratedCount = 0;

    for (const blog of allBlogPosts) {
      const updateData = {};

      // Check if we need to set defaults for new required fields
      if (!blog.targetAudience) updateData.targetAudience = 'general';
      if (!blog.tone) updateData.tone = 'professional';
      if (!blog.length) updateData.length = 'medium';
      if (!blog.keyPoints) updateData.keyPoints = '';
      if (!blog.specialFeatures) updateData.specialFeatures = '';
      if (!blog.images) updateData.images = [];
      if (!blog.imageAnalysis) updateData.imageAnalysis = null;
      if (!blog.model) updateData.model = 'nvidia/llama-3.3-nemotron-super-49b-v1';
      if (!blog.wordCount) updateData.wordCount = 0;
      if (!blog.metadata) updateData.metadata = {};

      // Check for legacy field migration (using raw document access)
      const blogDoc = blog.toObject();
      
      // Migrate old field names to new ones if they exist in the document
      if (blogDoc.restaurantName && !blog.mainName) {
        updateData.mainName = blogDoc.restaurantName;
      }
      if (blogDoc.restaurantType && !blog.type) {
        updateData.type = blogDoc.restaurantType;
      }
      if (blogDoc.cuisine && !blog.industry) {
        updateData.industry = blogDoc.cuisine;
      }

      if (Object.keys(updateData).length > 0) {
        await BlogPost.findByIdAndUpdate(blog._id, updateData);
        migratedCount++;
        console.log(`✅ Migrated blog post: ${blog.topic}`);
      }
    }

    console.log(`✅ Blog posts migration completed successfully. Migrated ${migratedCount} posts.`);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
};

// Auto-run migration on startup
const runMigrations = async () => {
  if (isMongoDBAvailable()) {
    await migrateBlogPosts();
  }
};

module.exports = {
  connectToMongoDB,
  Review,
  mongoose,
  SocialMediaPost,
  BlogPost,
  isMongoDBAvailable,
  safeSave,
  migrateBlogPosts,
  runMigrations,
  User // Export User model
}; 