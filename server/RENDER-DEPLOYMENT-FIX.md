# Render Deployment Fix

## 🚨 Current Issues
1. **`nodemon: not found`** - Render is trying to use nodemon in production
2. **`Cannot find module 'express'`** - Dependencies not installing properly

## 🔧 Immediate Fix

### Option 1: Update Render Dashboard Settings

1. **Go to your Render dashboard**
2. **Find your backend service**
3. **Update these settings**:

#### Build Command:
```bash
npm install
```

#### Start Command:
```bash
npm start
```

#### Root Directory:
```
server
```

### Option 2: Use Simple Server (Recommended for immediate fix)

1. **Update Start Command** to:
```bash
npm run simple
```

This uses `server-simple.js` which has permissive CORS and no complex dependencies.

### Option 3: Use Debug Server

1. **Update Start Command** to:
```bash
npm run debug
```

## 📋 Environment Variables

Make sure these are set in Render:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `FRONTEND_URL` | `https://vmarketing.netlify.app` |
| `NVIDIA_API_KEY` | Your NVIDIA API key |

## 🚀 Quick Deployment Steps

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Go to Settings tab**
4. **Update Start Command** to: `npm run simple`
5. **Click Deploy**

## 🔍 Troubleshooting

### If dependencies still fail:
1. **Check Build Command**: Should be `npm install`
2. **Check Root Directory**: Should be `server`
3. **Check Node Version**: Should be 14+ (set in package.json engines)

### If CORS issues persist:
1. **Use simple server**: `npm run simple`
2. **Check environment variables**
3. **Verify frontend URL**

## 📞 Support

The simple server (`npm run simple`) is the most reliable option for immediate deployment as it:
- ✅ Allows all origins (fixes CORS)
- ✅ Has minimal dependencies
- ✅ Uses `node` instead of `nodemon`
- ✅ Includes all necessary middleware

---

**Recommended**: Use `npm run simple` as your start command in Render for immediate deployment. 