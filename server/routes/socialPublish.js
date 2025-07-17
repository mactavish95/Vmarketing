const express = require('express');
const router = express.Router();
const SocialAccount = require('../models/SocialAccount');
const PublishedPost = require('../models/PublishedPost');

// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, error: 'Authentication required', code: 'AUTH_REQUIRED' });
}

// Publish content to social media platforms
router.post('/publish', ensureAuthenticated, async (req, res) => {
  try {
    const { platform, content, accountId } = req.body;
    const userId = req.user?.id;

    // Get account credentials
    const account = await SocialAccount.findOne({ 
      userId, 
      platform,
      'accountInfo.id': accountId 
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if token is expired
    if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Access token expired. Please reconnect your account.' });
    }

    let publishResult;

    switch (platform) {
      case 'facebook':
        publishResult = await publishToFacebook(account, content);
        break;
      case 'instagram':
        publishResult = await publishToInstagram(account, content);
        break;
      case 'twitter':
        publishResult = await publishToTwitter(account, content);
        break;
      case 'linkedin':
        publishResult = await publishToLinkedIn(account, content);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    // Save published post to database
    const publishedPost = new PublishedPost({
      userId,
      platform,
      accountId: account.accountInfo.id,
      content,
      postId: publishResult.id,
      postUrl: publishResult.url,
      publishedAt: new Date(),
      status: 'published'
    });
    await publishedPost.save();

    res.json({
      success: true,
      postId: publishResult.id,
      postUrl: publishResult.url,
      message: `Successfully published to ${platform}`
    });

  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: 'Failed to publish content' });
  }
});

// Publish to Facebook
async function publishToFacebook(account, content) {
  try {
    // For Facebook, we need to publish to a page
    const pageId = account.pages?.[0]?.id || account.accountInfo.id;
    
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: content,
        access_token: account.accessToken
      })
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      id: result.id,
      url: `https://facebook.com/${result.id}`
    };
  } catch (error) {
    throw new Error(`Facebook publish failed: ${error.message}`);
  }
}

// Publish to Instagram
async function publishToInstagram(account, content) {
  try {
    // Instagram requires a media container first
    const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${account.accountInfo.id}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: 'https://via.placeholder.com/1080x1080/FF6B6B/FFFFFF?text=Generated+Post',
        caption: content,
        access_token: account.accessToken
      })
    });

    const containerResult = await containerResponse.json();
    
    if (containerResult.error) {
      throw new Error(containerResult.error.message);
    }

    // Publish the media
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${account.accountInfo.id}/media_publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creation_id: containerResult.id,
        access_token: account.accessToken
      })
    });

    const publishResult = await publishResponse.json();
    
    if (publishResult.error) {
      throw new Error(publishResult.error.message);
    }

    return {
      id: publishResult.id,
      url: `https://instagram.com/p/${publishResult.id}`
    };
  } catch (error) {
    throw new Error(`Instagram publish failed: ${error.message}`);
  }
}

// Publish to Twitter
async function publishToTwitter(account, content) {
  try {
    // Twitter API v2
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: content.substring(0, 280) // Twitter character limit
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return {
      id: result.data.id,
      url: `https://twitter.com/user/status/${result.data.id}`
    };
  } catch (error) {
    throw new Error(`Twitter publish failed: ${error.message}`);
  }
}

// Publish to LinkedIn
async function publishToLinkedIn(account, content) {
  try {
    // LinkedIn requires a specific format for posts
    const postData = {
      author: `urn:li:person:${account.accountInfo.id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    const result = await response.json();
    
    if (result.errorCode) {
      throw new Error(result.message);
    }

    return {
      id: result.id,
      url: `https://linkedin.com/feed/update/${result.id}`
    };
  } catch (error) {
    throw new Error(`LinkedIn publish failed: ${error.message}`);
  }
}

// Get published posts
router.get('/posts', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { platform, limit = 20, offset = 0 } = req.query;

    const query = { userId };
    if (platform) {
      query.platform = platform;
    }

    const posts = await PublishedPost.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await PublishedPost.countDocuments(query);

    res.json({
      posts,
      total,
      hasMore: total > parseInt(offset) + posts.length
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get specific post
router.get('/post/:postId', ensureAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    const post = await PublishedPost.findOne({ _id: postId, userId });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Delete published post
router.delete('/post/:postId', ensureAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    const post = await PublishedPost.findOne({ _id: postId, userId });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Attempt to delete from social platform
    try {
      await deleteFromPlatform(post);
    } catch (platformError) {
      console.error('Failed to delete from platform:', platformError);
      // Continue with local deletion even if platform deletion fails
    }

    await PublishedPost.findByIdAndDelete(postId);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Delete post from platform
async function deleteFromPlatform(post) {
  const account = await SocialAccount.findOne({
    userId: post.userId,
    platform: post.platform,
    'accountInfo.id': post.accountId
  });

  if (!account) {
    throw new Error('Account not found');
  }

  switch (post.platform) {
    case 'facebook':
      await fetch(`https://graph.facebook.com/v18.0/${post.postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_token: account.accessToken
        })
      });
      break;
      
    case 'twitter':
      await fetch(`https://api.twitter.com/2/tweets/${post.postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${account.accessToken}`
        }
      });
      break;
      
    // Instagram and LinkedIn don't support post deletion via API
    default:
      throw new Error('Post deletion not supported for this platform');
  }
}

// Get publishing analytics
router.get('/analytics', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { platform, period = '30d' } = req.query;

    const query = { userId };
    if (platform) {
      query.platform = platform;
    }

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

    query.publishedAt = { $gte: startDate };

    const posts = await PublishedPost.find(query);
    
    // Calculate analytics
    const analytics = {
      totalPosts: posts.length,
      postsByPlatform: {},
      postsByDay: {},
      averagePostsPerDay: 0
    };

    posts.forEach(post => {
      // Count by platform
      analytics.postsByPlatform[post.platform] = 
        (analytics.postsByPlatform[post.platform] || 0) + 1;
      
      // Count by day
      const day = post.publishedAt.toISOString().split('T')[0];
      analytics.postsByDay[day] = (analytics.postsByDay[day] || 0) + 1;
    });

    const daysInPeriod = Math.ceil((now - startDate) / (24 * 60 * 60 * 1000));
    analytics.averagePostsPerDay = analytics.totalPosts / daysInPeriod;

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router; 