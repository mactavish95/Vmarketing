# Deployment Guide - CORS Fix

## 🚨 Current Issue
The production server is experiencing CORS errors with Netlify preview URLs, specifically `https://development--vmarketing.netlify.app`.

## 🔧 Solutions

### Option 1: Deploy Simple Server (Recommended for immediate fix)

The simple server (`server-simple.js`) has permissive CORS that allows all origins. This is the quickest solution.

#### Steps:
1. **Update Render deployment**:
   - Go to your Render dashboard
   - Find your backend service
   - Update the **Start Command** to: `npm run simple`
   - Deploy

2. **Verify deployment**:
   ```bash
   curl -H "Origin: https://development--vmarketing.netlify.app" https://vmarketing-backend-server.onrender.com/api/health
   ```

### Option 2: Deploy Debug Server (For testing)

The debug server (`server-debug.js`) has enhanced logging and permissive CORS.

#### Steps:
1. **Update Render deployment**:
   - Start Command: `npm run debug`
   - Deploy

### Option 3: Update Production Server (Long-term solution)

Update the main server (`server-new.js`) with the improved CORS configuration.

#### Steps:
1. **The CORS configuration has been updated** in `middleware/security.js`
2. **Deploy the updated code** to Render
3. **Use the regular start command**: `npm start`

## 🧪 Testing

### Test CORS Configuration
```bash
# Test local server
node test-cors.js

# Test production server
TEST_URL=https://vmarketing-backend-server.onrender.com node test-cors.js
```

### Test Specific Origin
```bash
curl -H "Origin: https://development--vmarketing.netlify.app" https://vmarketing-backend-server.onrender.com/api/health
```

## 📋 CORS Configuration Details

### Updated CORS Logic
The new CORS configuration in `middleware/security.js` includes:

1. **Exact matches** for known origins
2. **Netlify domain detection** (`.netlify.app`)
3. **Preview URL detection** (URLs with `--`, `deploy-preview`, etc.)
4. **General Netlify detection** (any URL containing `netlify`)

### Allowed Origins
- `http://localhost:3000`
- `https://vmarketing.netlify.app`
- `https://development--vmarketing.netlify.app`
- `https://app.netlify.com`
- Any `.netlify.app` domain
- Any URL containing `netlify`

## 🚀 Quick Deployment Commands

### For Render Dashboard:
1. **Simple Server**: `npm run simple`
2. **Debug Server**: `npm run debug`
3. **Production Server**: `npm start`

### Environment Variables:
Make sure these are set in Render:
- `NVIDIA_API_KEY`: Your NVIDIA API key
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://vmarketing.netlify.app`

## 🔍 Troubleshooting

### If CORS errors persist:
1. **Check server logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Test with simple server** first
4. **Check frontend URL** configuration

### Common Issues:
- **Port conflicts**: Make sure no other service is using port 3001
- **Environment variables**: Ensure all required variables are set
- **Network issues**: Check if Render service is accessible

## 📞 Support

If issues persist:
1. Check Render logs for detailed error messages
2. Test with the simple server configuration
3. Verify all environment variables are set correctly
4. Test CORS with the provided test script

---

**Note**: The simple server configuration allows all origins and is recommended for immediate deployment to resolve the CORS issue. 