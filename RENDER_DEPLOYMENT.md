# Render Deployment Guide

This guide will help you deploy your ReviewGen server to Render.

## 🚀 Quick Deploy to Render

### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `mactavish95/Vmarketing`

### Step 3: Configure the Service
- **Name**: `vmarketing-backend-server`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### Step 4: Set Environment Variables
Click "Environment" tab and add:
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `FRONTEND_URL`: `https://development--vmarketing.netlify.app`
- `NVIDIA_API_KEY`: Your NVIDIA API key

### Step 5: Deploy
Click "Create Web Service"

## 🔧 Troubleshooting

### Build Fails with "nodemon: not found"
**Solution**: The start command should be `npm start`, not `nodemon server-new.js`

### CORS Issues
**Solution**: Make sure `FRONTEND_URL` is set correctly in environment variables

### Port Issues
**Solution**: Render automatically sets `PORT` environment variable, so use `process.env.PORT || 10000`

## 📋 Environment Variables

Required environment variables:
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://development--vmarketing.netlify.app
NVIDIA_API_KEY=your_nvidia_api_key_here
```

## 🧪 Testing Your Deployment

After deployment, test your server:

```bash
# Test health endpoint
curl https://your-app-name.onrender.com/api/health

# Test blog endpoint
curl -X POST https://your-app-name.onrender.com/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","restaurantName":"Test Restaurant","apiKey":"your_key"}'
```

## 🔄 Automatic Deployments

Render will automatically deploy when you:
1. Push to your main branch
2. Make changes to files in the `server/` directory

## 📊 Monitoring

- Check deployment logs in Render dashboard
- Monitor application logs for errors
- Set up alerts for failed deployments

## 🎯 Next Steps

1. Deploy following the steps above
2. Test your endpoints
3. Update your frontend to use the new server URL
4. Monitor logs for any issues 