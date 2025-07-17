const express = require('express');
const router = express.Router();
const passport = require('passport');
const SocialAccount = require('../models/SocialAccount');
const bcrypt = require('bcrypt');
const { User, mongoose } = require('../config/database');

// Debug endpoint to check environment variables
router.get('/debug', (req, res) => {
  res.json({
    facebook_app_id: process.env.FACEBOOK_APP_ID ? 'SET' : 'NOT SET',
    facebook_app_secret: process.env.FACEBOOK_APP_SECRET ? 'SET' : 'NOT SET',
    base_url: process.env.BASE_URL || 'NOT SET',
    session_secret: process.env.SESSION_SECRET ? 'SET' : 'NOT SET',
    strategies: {
      facebook: passport._strategies.facebook ? 'LOADED' : 'NOT LOADED',
      instagram: passport._strategies.instagram ? 'LOADED' : 'NOT LOADED',
      twitter: passport._strategies.twitter ? 'LOADED' : 'NOT LOADED',
      linkedin: passport._strategies.linkedin ? 'LOADED' : 'NOT LOADED'
    }
  });
});

// OAuth Configuration
const oauthConfig = {
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
    scope: ['public_profile', 'email']
  },
  instagram: {
    clientID: process.env.INSTAGRAM_APP_ID,
    clientSecret: process.env.INSTAGRAM_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/instagram/callback`,
    scope: ['instagram_basic', 'instagram_content_publish']
  },
  twitter: {
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/twitter/callback`
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/linkedin/callback`,
    scope: ['w_member_social']
  }
};

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
  scope: oauthConfig.facebook.scope
}));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/auth/failed' }),
  async (req, res) => {
    try {
      const { user } = req;
      const accessToken = user.accessToken;
      
      // Save account info with basic permissions first
      await SocialAccount.findOneAndUpdate(
        { userId: user.id, platform: 'facebook' },
        {
          userId: user.id,
          platform: 'facebook',
          accessToken: accessToken,
          refreshToken: user.refreshToken,
          expiresAt: new Date(Date.now() + user.expiresIn * 1000),
          accountInfo: {
            id: user.id,
            name: user.displayName,
            email: user.emails?.[0]?.value,
            profileImage: user.photos?.[0]?.value
          },
          pages: [] // Will be populated later if page permissions are granted
        },
        { upsert: true, new: true }
      );

      res.redirect('http://localhost:3000/social-media-integration?connected=facebook');
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      res.redirect('http://localhost:3000/social-media-integration?error=facebook_auth_failed');
    }
  }
);

// Instagram OAuth
router.get('/instagram', passport.authenticate('instagram', {
  scope: oauthConfig.instagram.scope
}));

router.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/auth/failed' }),
  async (req, res) => {
    try {
      const { user } = req;
      const accessToken = user.accessToken;
      
      // Get Instagram account info
      const accountResponse = await fetch(`https://graph.instagram.com/v18.0/me?fields=id,username,account_type&access_token=${accessToken}`);
      const accountData = await accountResponse.json();
      
      await SocialAccount.findOneAndUpdate(
        { userId: user.id, platform: 'instagram' },
        {
          userId: user.id,
          platform: 'instagram',
          accessToken: accessToken,
          refreshToken: user.refreshToken,
          expiresAt: new Date(Date.now() + user.expiresIn * 1000),
          accountInfo: {
            id: accountData.id,
            username: accountData.username,
            accountType: accountData.account_type
          }
        },
        { upsert: true, new: true }
      );

      res.redirect('http://localhost:3000/social-media-integration?connected=instagram');
    } catch (error) {
      console.error('Instagram OAuth error:', error);
      res.redirect('http://localhost:3000/social-media-integration?error=instagram_auth_failed');
    }
  }
);

// Twitter OAuth
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/auth/failed' }),
  async (req, res) => {
    try {
      const { user } = req;
      
      await SocialAccount.findOneAndUpdate(
        { userId: user.id, platform: 'twitter' },
        {
          userId: user.id,
          platform: 'twitter',
          accessToken: user.accessToken,
          accessTokenSecret: user.accessTokenSecret,
          accountInfo: {
            id: user.id,
            username: user.username,
            name: user.displayName,
            profileImage: user.photos?.[0]?.value
          }
        },
        { upsert: true, new: true }
      );

      res.redirect('http://localhost:3000/social-media-integration?connected=twitter');
    } catch (error) {
      console.error('Twitter OAuth error:', error);
      res.redirect('http://localhost:3000/social-media-integration?error=twitter_auth_failed');
    }
  }
);

// LinkedIn OAuth
router.get('/linkedin', passport.authenticate('linkedin', {
  scope: oauthConfig.linkedin.scope
}));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/auth/failed' }),
  async (req, res) => {
    try {
      const { user } = req;
      const accessToken = user.accessToken;
      
      // Get LinkedIn profile
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const profileData = await profileResponse.json();
      
      await SocialAccount.findOneAndUpdate(
        { userId: user.id, platform: 'linkedin' },
        {
          userId: user.id,
          platform: 'linkedin',
          accessToken: accessToken,
          refreshToken: user.refreshToken,
          expiresAt: new Date(Date.now() + user.expiresIn * 1000),
          accountInfo: {
            id: profileData.id,
            name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
            email: user.emails?.[0]?.value
          }
        },
        { upsert: true, new: true }
      );

      res.redirect('http://localhost:3000/social-media-integration?connected=linkedin');
    } catch (error) {
      console.error('LinkedIn OAuth error:', error);
      res.redirect('http://localhost:3000/social-media-integration?error=linkedin_auth_failed');
    }
  }
);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name = '' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }
    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    // Ensure user object has 'id' field for session compatibility
    user.id = user._id.toString();
    res.json({ success: true, message: 'Account created successfully.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Failed to create account.' });
  }
});

// Local login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    // Ensure user object has 'id' field for session compatibility
    user.id = user._id.toString();
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, error: 'Failed to log in.' });
      }
      res.json({ success: true });
    });
  } catch (error) {
    console.error('Local login error:', error);
    res.status(500).json({ success: false, error: 'Failed to log in.' });
  }
});

// Session check endpoint for frontend
router.get('/session', (req, res) => {
  res.json({ user: req.user || null, authenticated: !!req.user });
});

// Get connected accounts
router.get('/accounts', async (req, res) => {
  try {
    // In a real app, you'd get userId from session/auth
    const userId = req.user?.id || 'demo-user';
    
    const accounts = await SocialAccount.find({ userId });
    const accountsMap = {};
    
    accounts.forEach(account => {
      accountsMap[account.platform] = {
        id: account.accountInfo.id,
        name: account.accountInfo.name,
        username: account.accountInfo.username,
        profileImage: account.accountInfo.profileImage,
        expiresAt: account.expiresAt,
        isExpired: account.expiresAt && new Date(account.expiresAt) < new Date()
      };
    });
    
    res.json(accountsMap);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Disconnect account
router.delete('/disconnect/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user?.id || 'demo-user';
    
    await SocialAccount.findOneAndDelete({ userId, platform });
    
    res.json({ success: true, message: `${platform} account disconnected` });
  } catch (error) {
    console.error('Error disconnecting account:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
});

// Refresh token endpoint
router.post('/refresh/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user?.id || 'demo-user';
    
    const account = await SocialAccount.findOne({ userId, platform });
    if (!account || !account.refreshToken) {
      return res.status(404).json({ error: 'Account not found or no refresh token' });
    }
    
    // Implement token refresh logic based on platform
    let newAccessToken;
    
    switch (platform) {
      case 'facebook':
        const fbResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'fb_exchange_token',
            client_id: oauthConfig.facebook.clientID,
            client_secret: oauthConfig.facebook.clientSecret,
            fb_exchange_token: account.accessToken
          })
        });
        const fbData = await fbResponse.json();
        newAccessToken = fbData.access_token;
        break;
        
      case 'linkedin':
        const liResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: oauthConfig.linkedin.clientID,
            client_secret: oauthConfig.linkedin.clientSecret,
            refresh_token: account.refreshToken
          })
        });
        const liData = await liResponse.json();
        newAccessToken = liData.access_token;
        break;
        
      default:
        return res.status(400).json({ error: 'Token refresh not supported for this platform' });
    }
    
    // Update account with new token
    account.accessToken = newAccessToken;
    account.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days
    await account.save();
    
    res.json({ success: true, message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router; 