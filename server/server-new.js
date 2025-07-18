require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');

// Import modules
const { connectToMongoDB, mongoose } = require('./config/database');
const { 
  securityMiddleware, 
  limiter, 
  corsOptions, 
  compressionMiddleware, 
  loggingMiddleware 
} = require('./middleware/security');

// Import routes
const llamaRoutes = require('./routes/llama');
const voiceRoutes = require('./routes/voice');
const reviewsRoutes = require('./routes/reviews');
const healthRoutes = require('./routes/health');
const enhancedLLMRoutes = require('./routes/enhancedLLM');
const modelsRoutes = require('./routes/models');
const blogRoutes = require('./routes/blog');
const socialMediaPostsRoutes = require('./routes/socialMediaPosts');
const socialAuthRoutes = require('./routes/socialAuth');
const socialPublishRoutes = require('./routes/socialPublish');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for rate limiting (fixes X-Forwarded-For warning)
app.set('trust proxy', 1);

// Connect to MongoDB
connectToMongoDB();

// Apply security middleware
app.use(securityMiddleware);

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Apply CORS with error handling
app.use((req, res, next) => {
  console.log('🌐 CORS middleware processing request:', {
    method: req.method,
    origin: req.headers.origin,
    url: req.url
  });
  
  // Apply CORS
  cors(corsOptions)(req, res, (err) => {
    if (err) {
      console.error('CORS error:', err);
      return res.status(500).json({
        success: false,
        error: 'CORS configuration error',
        code: 'CORS_ERROR'
      });
    }
    next();
  });
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  console.log('🔄 Handling preflight request for:', req.url);
  cors(corsOptions)(req, res, () => {
    res.status(200).end();
  });
});

// Apply compression
app.use(compressionMiddleware);

// Apply logging
app.use(loggingMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 24 hours in seconds
    autoRemove: 'native' // Use MongoDB's TTL index
  }),
  cookie: {
    secure: true, // Always use secure cookies for cross-site
    sameSite: 'none', // Required for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // Prevent XSS attacks
    // Don't set domain - let the browser handle it automatically
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount routes
app.use('/api', llamaRoutes);
app.use('/api', voiceRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', healthRoutes);
app.use('/api', enhancedLLMRoutes);
app.use('/api', modelsRoutes);
app.use('/api', blogRoutes);
app.use('/api', socialMediaPostsRoutes);
//app.use('/api/auth', socialAuthRoutes);
app.use('/api/auth', require('./routes/socialAuth'));
app.use('/api/social', socialPublishRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ReviewGen Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Llama API: http://localhost:${PORT}/api/llama`);
  console.log(`🔗 Social Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📱 Social Publish: http://localhost:${PORT}/api/social`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.NVIDIA_API_KEY) {
    console.warn('⚠️  NVIDIA_API_KEY not found in environment variables');
  }
});

// Export the app for potential external use
module.exports = app;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 