const express = require('express');
const router = express.Router();
const { SocialMediaPost, mongoose, isMongoDBAvailable, safeSave } = require('../config/database');

// POST /social-posts - Save a new social media post
router.post('/social-posts', async (req, res) => {
  try {
    const postData = req.body;
    
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

// GET /social-posts - Get all social media posts (global history, latest first, limit 100)
router.get('/social-posts', async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      console.warn('⚠️  MongoDB not available, returning empty posts list');
      return res.json({ 
        success: true, 
        posts: [],
        message: 'Database not available. No posts can be retrieved.',
        code: 'DB_UNAVAILABLE'
      });
    }
    
    const posts = await SocialMediaPost.find().sort({ timestamp: -1 }).limit(100);
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

// DELETE /social-posts/:id - Delete a post by id
router.delete('/social-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isMongoDBAvailable()) {
      console.warn('⚠️  MongoDB not available, cannot delete post');
      return res.status(503).json({ 
        success: false, 
        error: 'Database not available',
        message: 'Post cannot be deleted. MongoDB is not running.',
        code: 'DB_UNAVAILABLE'
      });
    }
    
    const result = await SocialMediaPost.findByIdAndDelete(id);
    
    if (result) {
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Post not found',
        code: 'NOT_FOUND'
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