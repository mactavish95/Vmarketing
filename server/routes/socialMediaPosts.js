const express = require('express');
const router = express.Router();
const { SocialMediaPost, mongoose, isMongoDBAvailable, safeSave } = require('../config/database');

// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' });
}

// POST /social-posts - Save a new social media post
router.post('/social-posts', ensureAuthenticated, async (req, res) => {
  try {
    const postData = req.body;
    // Attach user ID to the post
    postData.userId = req.user?._id?.toString() || req.user?.id;
    console.log('DEBUG req.user:', req.user);
    
    if (!isMongoDBAvailable()) {
      console.warn('⚠️  MongoDB not available, cannot save post');
      return res.status(503).json({ 
        success: false, 
        error: 'Database not available',
        message: 'Post cannot be saved. MongoDB is not running.',
        code: 'DB_UNAVAILABLE'
      });
    }
    
    const newPost = await safeSave(SocialMediaPost, postData);
    
    if (newPost) {
      res.json({ success: true, post: newPost });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to save post to database',
        code: 'SAVE_ERROR'
      });
    }
  } catch (error) {
    console.error('Social post save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save post',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /social-posts - Get all social media posts (user's history, latest first, limit 100)
router.get('/social-posts', ensureAuthenticated, async (req, res) => {
  try {
    // Only fetch posts for the authenticated user
    const userId = req.user?.id;
    const posts = await SocialMediaPost.find({ userId }).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Social posts fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch posts',
      code: 'FETCH_ERROR'
    });
  }
});

// DELETE /social-posts/:id - Delete a post by id (only if owned by user)
router.delete('/social-posts/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    // Only allow deletion if the post belongs to the user
    const result = await SocialMediaPost.findOneAndDelete({ _id: id, userId });
    if (result) {
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Post not found or not authorized',
        code: 'NOT_FOUND_OR_UNAUTHORIZED'
      });
    }
  } catch (error) {
    console.error('Social post delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete post',
      code: 'DELETE_ERROR'
    });
  }
});

module.exports = router; 