const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

// Security middleware
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log('CORS check for origin:', origin);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://vmarketing.netlify.app',
      'https://development--vmarketing.netlify.app',
      'https://app.netlify.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Check if origin matches any allowed origins exactly
    const isExactMatch = allowedOrigins.includes(origin);
    
    // Check for any Netlify.app domain (including subdomains)
    const isNetlifyDomain = origin.includes('.netlify.app');
    
    // Check for Netlify preview URLs (more comprehensive)
    const isNetlifyPreview = origin.includes('netlify.app') && (
      origin.includes('--') || // Preview URLs like development--app.netlify.app
      origin.includes('deploy-preview') || // Deploy preview URLs
      origin.includes('branch-deploy') || // Branch deploy URLs
      origin.includes('pr-') || // Pull request previews
      origin.includes('feature-') || // Feature branch previews
      origin.includes('staging-') || // Staging previews
      origin.includes('preview-') // General preview URLs
    );
    
    // Check for any Netlify-related domain
    const isAnyNetlifyDomain = origin.includes('netlify');
    
    console.log('CORS check results:', {
      origin,
      allowedOrigins,
      isExactMatch,
      isNetlifyDomain,
      isNetlifyPreview,
      isAnyNetlifyDomain,
      frontendUrl: process.env.FRONTEND_URL
    });
    
    // Allow if any of these conditions are met
    if (isExactMatch || isNetlifyDomain || isNetlifyPreview || isAnyNetlifyDomain) {
      console.log('CORS: Allowing origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      console.log('Is exact match:', isExactMatch);
      console.log('Is Netlify domain:', isNetlifyDomain);
      console.log('Is Netlify preview:', isNetlifyPreview);
      console.log('Is any Netlify domain:', isAnyNetlifyDomain);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
};

// Compression middleware
const compressionMiddleware = compression();

// Logging middleware
const loggingMiddleware = morgan('combined');

module.exports = {
  securityMiddleware,
  limiter,
  corsOptions,
  compressionMiddleware,
  loggingMiddleware
}; 