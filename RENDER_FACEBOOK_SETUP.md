# Facebook OAuth Setup for Render Deployment

## 🔧 Environment Variables Required in Render

Set these in your Render dashboard → Environment tab:

### **Required Variables:**
```bash
# Backend URL (for OAuth callbacks)
BASE_URL=https://your-app-name.onrender.com

# Frontend URL (for redirects after login)
FRONTEND_URL=https://your-frontend-domain.com

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Session management
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
SESSION_SECRET=your-super-secret-random-string-32-chars-min

# Other OAuth (optional)
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## 📱 Facebook App Configuration

### **1. Facebook Developer Console Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to **Products** → **Facebook Login** → **Settings**

### **2. Valid OAuth Redirect URIs:**
Add these URLs:
```
https://your-app-name.onrender.com/api/auth/facebook/callback
https://your-app-name.onrender.com/api/auth/instagram/callback
https://your-app-name.onrender.com/api/auth/twitter/callback
https://your-app-name.onrender.com/api/auth/linkedin/callback
```

### **3. App Domains:**
Add your Render domain:
```
your-app-name.onrender.com
```

### **4. Site URL:**
Set to your frontend URL:
```
https://your-frontend-domain.com
```

### **5. App Status:**
- **Development:** Only you and test users can log in
- **Live:** Anyone can log in (requires Facebook review)

## 🔍 Testing Steps

### **1. Check Environment Variables:**
Visit: `https://your-app-name.onrender.com/api/auth/debug`
Should show:
```json
{
  "facebook_app_id": "SET",
  "facebook_app_secret": "SET",
  "base_url": "https://your-app-name.onrender.com",
  "session_secret": "SET",
  "strategies": {
    "facebook": "LOADED"
  }
}
```

### **2. Test OAuth Flow:**
1. Go to your frontend
2. Click "Connect Facebook"
3. Should redirect to Facebook login
4. After login, should redirect back to your frontend dashboard

### **3. Check Render Logs:**
Look for these messages:
```
✅ Facebook OAuth successful, redirecting to: https://your-frontend-domain.com/dashboard
🔗 Using MongoDB session store
✅ MONGODB_URI is configured
```

## 🚨 Common Issues & Solutions

### **Issue: "Facebook is not available on this browser"**
**Solution:** Use a standard browser (Chrome, Firefox, Safari, Edge)

### **Issue: Callback URL mismatch**
**Solution:** 
- Check Facebook app settings
- Ensure `BASE_URL` is set correctly in Render

### **Issue: Session not persisting**
**Solution:**
- Set `MONGODB_URI` in Render
- Check logs for "Using MongoDB session store"

### **Issue: Redirects to localhost**
**Solution:**
- Set `FRONTEND_URL` in Render environment variables
- Code now uses dynamic redirects

### **Issue: CORS errors**
**Solution:**
- Frontend domain must be in CORS allowed origins
- Both frontend and backend must use HTTPS

## 📋 Deployment Checklist

- [ ] Set all environment variables in Render
- [ ] Update Facebook app OAuth redirect URIs
- [ ] Set Facebook app to "Live" (or add test users)
- [ ] Test OAuth flow from frontend
- [ ] Check Render logs for success messages
- [ ] Verify session persistence

## 🔗 Useful URLs

- **Render Dashboard:** https://dashboard.render.com
- **Facebook Developers:** https://developers.facebook.com/
- **Debug Endpoint:** `https://your-app-name.onrender.com/api/auth/debug`
- **Health Check:** `https://your-app-name.onrender.com/api/health` 