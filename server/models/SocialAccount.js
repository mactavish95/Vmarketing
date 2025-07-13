const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
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
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  accessTokenSecret: {
    type: String // For Twitter OAuth 1.0a
  },
  expiresAt: {
    type: Date
  },
  accountInfo: {
    id: {
      type: String,
      required: true
    },
    name: String,
    username: String,
    email: String,
    profileImage: String,
    accountType: String // For Instagram business/personal accounts
  },
  pages: [{
    id: String,
    name: String,
    accessToken: String,
    category: String
  }],
  permissions: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
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

// Compound index for unique user-platform combinations
socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

// Virtual for checking if token is expired
socialAccountSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual for checking if account is valid
socialAccountSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired;
});

// Method to refresh token
socialAccountSchema.methods.refreshAccessToken = async function() {
  if (!this.refreshToken) {
    throw new Error('No refresh token available');
  }

  // This would be implemented based on the platform
  // For now, we'll just update the lastUsed timestamp
  this.lastUsed = new Date();
  await this.save();
  
  return this;
};

// Method to revoke access
socialAccountSchema.methods.revokeAccess = async function() {
  this.isActive = false;
  this.accessToken = null;
  this.refreshToken = null;
  this.accessTokenSecret = null;
  await this.save();
};

// Static method to find valid accounts for a user
socialAccountSchema.statics.findValidAccounts = function(userId) {
  return this.find({
    userId,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to find accounts by platform
socialAccountSchema.statics.findByPlatform = function(userId, platform) {
  return this.findOne({
    userId,
    platform,
    isActive: true
  });
};

// Pre-save middleware to update lastUsed
socialAccountSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to encrypt sensitive data (in production)
socialAccountSchema.pre('save', function(next) {
  // In production, you should encrypt access tokens and secrets
  // For now, we'll just pass through
  next();
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema); 