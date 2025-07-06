# Server Deployment Guide

This guide will help you deploy your ReviewGen server to various cloud platforms.

## 🚀 Quick Deploy Options

### Option 1: Render (Recommended - Free Tier Available)

1. **Sign up for Render** at [render.com](https://render.com)
2. **Connect your GitHub repository**:
   - Go to your Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository: `mactavish95/Vmarketing`

3. **Configure the service**:
   - **Name**: `vmarketing-backend-server`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Set Environment Variables**:
   - `NVIDIA_API_KEY`: Your NVIDIA API key
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://vmarketing.netlify.app`)

5. **Deploy**: Click "Create Web Service"

### Option 2: Railway (Recommended - Free Tier Available)

1. **Sign up for Railway** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**:
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository: `mactavish95/Vmarketing`

3. **Configure the service**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**:
   - `NVIDIA_API_KEY`: Your NVIDIA API key
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your frontend URL

5. **Deploy**: Railway will automatically deploy

### Option 3: Heroku (Paid)

1. **Sign up for Heroku** at [heroku.com](https://heroku.com)
2. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**:
   ```bash
   heroku login
   ```

4. **Create Heroku app**:
   ```bash
   cd server
   heroku create vmarketing-backend-server
   ```

5. **Set environment variables**:
   ```bash
   heroku config:set NVIDIA_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://vmarketing.netlify.app
   ```

6. **Deploy**:
   ```bash
   git push heroku development:main
   ```

## 🔧 GitHub Actions Setup

### 1. Set up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `NVIDIA_API_KEY`: Your NVIDIA API key
- `RENDER_TOKEN`: Your Render API token (if using Render)
- `RENDER_SERVICE_ID`: Your Render service ID (if using Render)
- `RAILWAY_TOKEN`: Your Railway token (if using Railway)
- `HEROKU_API_KEY`: Your Heroku API key (if using Heroku)
- `HEROKU_APP_NAME`: Your Heroku app name (if using Heroku)

### 2. Enable GitHub Actions

The workflow file `.github/workflows/deploy-server.yml` is already created. It will:
- Run tests on every push to development/main branches
- Deploy to your chosen platform when tests pass
- Only trigger when server files are changed

## 📋 Environment Variables

Make sure to set these environment variables in your deployment platform:

```env
# Required
NVIDIA_API_KEY=your_nvidia_api_key_here

# Optional
NODE_ENV=production
FRONTEND_URL=https://vmarketing.netlify.app
PORT=10000
MONGO_URI=your_mongodb_connection_string
```

## 🧪 Testing Your Deployment

After deployment, test your server:

```bash
# Test health endpoint
curl https://your-server-url.com/api/health

# Test blog endpoint
curl -X POST https://your-server-url.com/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","restaurantName":"Test Restaurant","apiKey":"your_key"}'
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails**: Check if all dependencies are in `package.json`
2. **Environment variables not set**: Verify all required env vars are configured
3. **Port issues**: Make sure your platform uses the correct port (usually `process.env.PORT`)
4. **CORS errors**: Update `FRONTEND_URL` to match your frontend domain

### Debug Commands:

```bash
# Check server logs
heroku logs --tail  # For Heroku
railway logs        # For Railway
# Check Render logs in dashboard

# Test locally
cd server
npm start
```

## 📊 Monitoring

- **Render**: Built-in monitoring in dashboard
- **Railway**: Built-in monitoring and logs
- **Heroku**: Use `heroku logs --tail` for real-time logs

## 🔄 Continuous Deployment

Once set up, your server will automatically deploy when you:
1. Push to the `development` or `main` branch
2. Make changes to files in the `server/` directory

## 🎯 Next Steps

1. Choose your preferred deployment platform
2. Set up the deployment following the guide above
3. Configure environment variables
4. Test your deployment
5. Update your frontend to use the new server URL

## 📞 Support

If you encounter issues:
1. Check the platform's documentation
2. Review server logs for error messages
3. Verify environment variables are set correctly
4. Test locally first to ensure the server works 