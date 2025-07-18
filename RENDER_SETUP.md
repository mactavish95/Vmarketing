# Render Deployment Setup Guide

## Required Environment Variables

To fix the authentication issues in production, you need to set these environment variables in your Render dashboard:

### 1. **MONGODB_URI** (CRITICAL)
```
mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
```
- **Why needed:** For persistent session storage
- **Without this:** Authentication will fail and sessions won't persist

### 2. **SESSION_SECRET** (CRITICAL)
```
your-super-secret-random-string-at-least-32-characters-long
```
- **Why needed:** To encrypt session cookies
- **Without this:** Sessions will be insecure

### 3. **BASE_URL** (IMPORTANT)
```
https://your-app-name.onrender.com
```
- **Why needed:** For OAuth callbacks and API endpoints
- **Without this:** OAuth flows will fail

### 4. **FACEBOOK_APP_ID** (For Facebook OAuth)
```
your-facebook-app-id
```

### 5. **FACEBOOK_APP_SECRET** (For Facebook OAuth)
```
your-facebook-app-secret
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add each variable with its value
5. Click **Save Changes**
6. Redeploy your service

## Testing After Setup

1. Check the server logs for these messages:
   ```
   ✅ MONGODB_URI is configured
   ✅ SESSION_SECRET is configured
   🔗 Using MongoDB session store
   ```

2. Test authentication endpoints:
   - `https://your-app.onrender.com/api/auth/session`
   - `https://your-app.onrender.com/api/auth/test-cookie`

## Common Issues

### Issue: "MONGODB_URI not set in production"
**Solution:** Set the MONGODB_URI environment variable in Render

### Issue: "Sessions will not persist"
**Solution:** Ensure MONGODB_URI is set and MongoDB is accessible

### Issue: "OAuth callbacks failing"
**Solution:** Update BASE_URL to your Render app URL

### Issue: "CORS errors"
**Solution:** Make sure your frontend domain is in the allowed origins list 