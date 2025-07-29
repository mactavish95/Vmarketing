const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../config/database');
const PublishedPost = require('../models/PublishedPost');
const adminAuth = require('../middleware/adminAuth');

// Setup endpoint to create first admin (only works if no admin exists)
router.post('/setup', async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        error: 'Admin user already exists. Setup is not allowed.' 
      });
    }

    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = new User({
      email,
      password: hashedPassword,
      name: name || 'Admin User',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();

    res.json({ 
      success: true, 
      message: 'Admin user created successfully.',
      user: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('❌ Admin setup error:', error);
    res.status(500).json({ success: false, error: 'Failed to create admin user.' });
  }
});

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Admin login attempt:', {
      email: req.body.email,
      hasPassword: !!req.body.password,
      origin: req.headers.origin
    });
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Admin user not found:', email);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('❌ Non-admin user attempted admin login:', email);
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      console.log('❌ Inactive admin user attempted login:', email);
      return res.status(403).json({ success: false, error: 'Account is deactivated.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Admin password mismatch for user:', email);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    // Ensure user object has 'id' field for session compatibility
    user.id = user._id.toString();
    
    console.log('✅ Admin login successful for user:', { id: user.id, email: user.email });
    
    req.login(user, (err) => {
      if (err) {
        console.error('❌ Admin login error:', err);
        return res.status(500).json({ success: false, error: 'Failed to log in.' });
      }
      
      console.log('✅ Admin session created:', {
        sessionID: req.sessionID,
        userID: req.user?.id
      });
      
      res.json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ success: false, error: 'Failed to log in.' });
  }
});

// Get all posts (admin only)
router.get('/posts', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      platform, 
      status, 
      userId,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    // Filter by platform
    if (platform) {
      query.platform = platform;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by user ID
    if (userId) {
      query.userId = userId;
    }

    // Search in content
    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const posts = await PublishedPost.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await PublishedPost.countDocuments(query);

    // Get user information for posts
    const userIds = [...new Set(posts.map(post => post.userId))];
    const users = await User.find({ _id: { $in: userIds } }, 'email name').lean();
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Add user info to posts
    const postsWithUserInfo = posts.map(post => ({
      ...post,
      user: userMap[post.userId] || { email: 'Unknown', name: 'Unknown' }
    }));

    res.json({
      success: true,
      posts: postsWithUserInfo,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching admin posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts.' });
  }
});

// Get post statistics (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const stats = await PublishedPost.getAnalyticsSummary(null, null, period);
    
    // Get additional stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPosts = await PublishedPost.countDocuments();
    const postsByPlatform = await PublishedPost.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);
    
    const postsByStatus = await PublishedPost.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        ...stats,
        totalUsers,
        totalPosts,
        postsByPlatform: postsByPlatform.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        postsByStatus: postsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics.' });
  }
});

// Hide/Show post (admin only)
router.patch('/posts/:postId/visibility', adminAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { hidden } = req.body;

    const post = await PublishedPost.findOne({ postId });
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    // Add hidden field if it doesn't exist
    if (typeof post.hidden === 'undefined') {
      post.hidden = false;
    }

    post.hidden = hidden;
    await post.save();

    res.json({
      success: true,
      message: `Post ${hidden ? 'hidden' : 'shown'} successfully.`,
      post: {
        postId: post.postId,
        hidden: post.hidden,
        content: post.content.substring(0, 100) + '...'
      }
    });
  } catch (error) {
    console.error('❌ Error updating post visibility:', error);
    res.status(500).json({ success: false, error: 'Failed to update post visibility.' });
  }
});

// Delete post (admin only)
router.delete('/posts/:postId', adminAuth, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PublishedPost.findOne({ postId });
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    await PublishedPost.deleteOne({ postId });

    res.json({
      success: true,
      message: 'Post deleted successfully.',
      postId
    });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({ success: false, error: 'Failed to delete post.' });
  }
});

// Get users list (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query, '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    // Get post counts for each user
    const userIds = users.map(user => user._id.toString());
    const postCounts = await PublishedPost.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);

    const postCountMap = {};
    postCounts.forEach(item => {
      postCountMap[item._id] = item.count;
    });

    const usersWithPostCounts = users.map(user => ({
      ...user,
      postCount: postCountMap[user._id.toString()] || 0
    }));

    res.json({
      success: true,
      users: usersWithPostCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users.' });
  }
});

// Create admin user (protected endpoint - only existing admins can create new admins)
router.post('/users', adminAuth, async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be "user" or "admin".' });
    }

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      email, 
      password: hashedPassword, 
      name,
      role
    });
    await user.save();

    res.json({ 
      success: true, 
      message: `${role} account created successfully.`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create account.' });
  }
});

// Update user status (admin only)
router.patch('/users/:userId/status', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id && !isActive) {
      return res.status(400).json({ success: false, error: 'Cannot deactivate your own account.' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    res.status(500).json({ success: false, error: 'Failed to update user status.' });
  }
});

// Admin session check
router.get('/session', adminAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    },
    authenticated: true
  });
});

module.exports = router; 