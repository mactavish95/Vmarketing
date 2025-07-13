const mongoose = require('mongoose');

const publishedPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'instagram', 'twitter', 'linkedin'],
    index: true
  },
  accountId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true,
    unique: true
  },
  postUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed', 'deleted'],
    default: 'published'
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  scheduledFor: {
    type: Date
  },
  metadata: {
    // Platform-specific metadata
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    }
  },
  analytics: {
    // Detailed analytics data
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    hourlyStats: [{
      hour: Number,
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number
    }],
    dailyStats: [{
      date: Date,
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number,
      reach: Number,
      impressions: Number
    }]
  },
  tags: [{
    type: String
  }],
  hashtags: [{
    type: String
  }],
  mentions: [{
    type: String
  }],
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'gif', 'story']
    },
    url: String,
    thumbnail: String,
    altText: String,
    duration: Number // for videos
  }],
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  campaign: {
    id: String,
    name: String
  },
  audience: {
    type: String,
    enum: ['public', 'friends', 'followers', 'custom']
  },
  tone: {
    type: String
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'carousel', 'story', 'reel']
  },
  error: {
    code: String,
    message: String,
    timestamp: Date
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
publishedPostSchema.index({ userId: 1, platform: 1, publishedAt: -1 });
publishedPostSchema.index({ userId: 1, status: 1 });
publishedPostSchema.index({ publishedAt: -1 });
publishedPostSchema.index({ 'metadata.engagement': -1 });

// Virtual for engagement rate
publishedPostSchema.virtual('engagementRate').get(function() {
  if (!this.metadata.reach || this.metadata.reach === 0) return 0;
  return (this.metadata.engagement / this.metadata.reach) * 100;
});

// Virtual for total interactions
publishedPostSchema.virtual('totalInteractions').get(function() {
  return this.metadata.likes + this.metadata.comments + this.metadata.shares;
});

// Virtual for post age
publishedPostSchema.virtual('ageInHours').get(function() {
  return Math.floor((new Date() - this.publishedAt) / (1000 * 60 * 60));
});

// Virtual for post age in days
publishedPostSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.publishedAt) / (1000 * 60 * 60 * 24));
});

// Method to update analytics
publishedPostSchema.methods.updateAnalytics = async function(analyticsData) {
  this.metadata = {
    ...this.metadata,
    ...analyticsData
  };
  this.analytics.lastUpdated = new Date();
  await this.save();
};

// Method to add hourly stats
publishedPostSchema.methods.addHourlyStats = async function(stats) {
  const hour = new Date().getHours();
  const existingHourlyStat = this.analytics.hourlyStats.find(s => s.hour === hour);
  
  if (existingHourlyStat) {
    Object.assign(existingHourlyStat, stats);
  } else {
    this.analytics.hourlyStats.push({
      hour,
      ...stats
    });
  }
  
  await this.save();
};

// Method to add daily stats
publishedPostSchema.methods.addDailyStats = async function(stats) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingDailyStat = this.analytics.dailyStats.find(s => 
    s.date.getTime() === today.getTime()
  );
  
  if (existingDailyStat) {
    Object.assign(existingDailyStat, stats);
  } else {
    this.analytics.dailyStats.push({
      date: today,
      ...stats
    });
  }
  
  await this.save();
};

// Method to mark as failed
publishedPostSchema.methods.markAsFailed = async function(error) {
  this.status = 'failed';
  this.error = {
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'Unknown error occurred',
    timestamp: new Date()
  };
  this.retryCount += 1;
  await this.save();
};

// Method to retry publishing
publishedPostSchema.methods.retry = async function() {
  if (this.retryCount >= this.maxRetries) {
    throw new Error('Maximum retry attempts exceeded');
  }
  
  this.status = 'draft';
  this.error = null;
  await this.save();
};

// Static method to find posts by date range
publishedPostSchema.statics.findByDateRange = function(userId, startDate, endDate, platform = null) {
  const query = {
    userId,
    publishedAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (platform) {
    query.platform = platform;
  }
  
  return this.find(query).sort({ publishedAt: -1 });
};

// Static method to find top performing posts
publishedPostSchema.statics.findTopPerforming = function(userId, platform = null, limit = 10) {
  const query = { userId };
  if (platform) {
    query.platform = platform;
  }
  
  return this.find(query)
    .sort({ 'metadata.engagement': -1 })
    .limit(limit);
};

// Static method to get analytics summary
publishedPostSchema.statics.getAnalyticsSummary = async function(userId, platform = null, period = '30d') {
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
  
  const posts = await this.find(query);
  
  const summary = {
    totalPosts: posts.length,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalViews: 0,
    totalReach: 0,
    totalImpressions: 0,
    averageEngagement: 0,
    postsByPlatform: {},
    postsByDay: {}
  };
  
  posts.forEach(post => {
    summary.totalLikes += post.metadata.likes || 0;
    summary.totalComments += post.metadata.comments || 0;
    summary.totalShares += post.metadata.shares || 0;
    summary.totalViews += post.metadata.views || 0;
    summary.totalReach += post.metadata.reach || 0;
    summary.totalImpressions += post.metadata.impressions || 0;
    
    // Count by platform
    summary.postsByPlatform[post.platform] = (summary.postsByPlatform[post.platform] || 0) + 1;
    
    // Count by day
    const day = post.publishedAt.toISOString().split('T')[0];
    summary.postsByDay[day] = (summary.postsByDay[day] || 0) + 1;
  });
  
  if (posts.length > 0) {
    summary.averageEngagement = (summary.totalLikes + summary.totalComments + summary.totalShares) / posts.length;
  }
  
  return summary;
};

// Pre-save middleware
publishedPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('PublishedPost', publishedPostSchema); 