const express = require('express');
const router = express.Router();
const { Review, mongoose, isMongoDBAvailable } = require('../config/database');

// Fetch all reviews and customer service responses
router.get('/reviews', async (req, res) => {
  try {
    if (isMongoDBAvailable()) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json({ success: true, reviews });
    } else {
      console.warn('⚠️  MongoDB not available, returning empty reviews list');
      res.json({ 
        success: true, 
        reviews: [],
        message: 'Database not available. No reviews can be retrieved.',
        code: 'DB_UNAVAILABLE',
        instructions: [
          'To enable database features:',
          '1. Start MongoDB: sudo service mongodb start',
          '2. Or start manually: mongod --dbpath /data/db',
          '3. Or use a cloud MongoDB service'
        ]
      });
    }
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router; 