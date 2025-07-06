const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

// Security middleware (debug version with permissive CORS)
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

// Rate limiting (more permissive for debugging)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for debugging
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration (debug version - very permissive)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for debugging
    console.log('DEBUG CORS: Allowing all origins for debugging');
    console.log('DEBUG CORS: Origin:', origin);
    callback(null, true);
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

// Logging middleware (more verbose for debugging)
const loggingMiddleware = morgan('dev');

module.exports = {
  securityMiddleware,
  limiter,
  corsOptions,
  compressionMiddleware,
  loggingMiddleware
}; 