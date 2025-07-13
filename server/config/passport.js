const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    scope: ['pages_manage_posts', 'pages_read_engagement']
  }, (accessToken, refreshToken, profile, done) => {
    // Store user info and tokens
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      photos: profile.photos,
      emails: profile.emails,
      accessToken,
      refreshToken,
      expiresIn: 5184000 // 60 days in seconds
    };
    
    return done(null, user);
  }));
}

// Instagram OAuth Strategy
if (process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET) {
  passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_APP_ID,
    clientSecret: process.env.INSTAGRAM_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/instagram/callback`,
    scope: ['instagram_basic', 'instagram_content_publish']
  }, (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      photos: profile.photos,
      accessToken,
      refreshToken,
      expiresIn: 5184000
    };
    
    return done(null, user);
  }));
}

// Twitter OAuth Strategy
if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/twitter/callback`,
    includeEmail: true
  }, (token, tokenSecret, profile, done) => {
    const user = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      photos: profile.photos,
      accessToken: token,
      accessTokenSecret: tokenSecret
    };
    
    return done(null, user);
  }));
}

// LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/linkedin/callback`,
    scope: ['r_liteprofile', 'w_member_social'],
    state: true
  }, (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      photos: profile.photos,
      emails: profile.emails,
      accessToken,
      refreshToken,
      expiresIn: 5184000
    };
    
    return done(null, user);
  }));
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport; 