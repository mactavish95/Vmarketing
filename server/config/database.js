const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection (optional for development)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reviewgen';

// Only connect to MongoDB if it's available
const connectToMongoDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`📡 Connection URI: ${MONGO_URI}`);
    
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

const SocialMediaPost = mongoose.model('SocialMediaPost', socialMediaPostSchema);

// Blog Post Schema and Model
const blogPostSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  restaurantName: { type: String, required: true },
  restaurantType: { type: String },
  cuisine: { type: String },
  location: { type: String },
  targetAudience: { type: String },
  tone: { type: String },
  length: { type: String },
  keyPoints: { type: String },
  specialFeatures: { type: String },
  blogPost: { type: String, required: true },
  images: { type: Array }, // Array of image objects (name, type, size, dataUrl)
  imageAnalysis: { type: Object },
  model: { type: String },
  wordCount: { type: Number },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

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

module.exports = {
  connectToMongoDB,
  Review,
  mongoose,
  SocialMediaPost,
  BlogPost,
  isMongoDBAvailable,
  safeSave
}; 