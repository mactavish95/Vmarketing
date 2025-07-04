# Netlify + Render Deployment Guide

## 🚀 Deploy Backend to Render

### 1. Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `mactavish95/Vmarketing-backend-server`
4. Configure the service:
   - **Name**: `reviewgen-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2. Add Environment Variables on Render
- `NVIDIA_API_KEY` = your NVIDIA API key
- `NODE_ENV` = `production`
- `FRONTEND_URL` = your Netlify URL (we'll get this later)

### 3. Deploy and Get Your Backend URL
- Click "Create Web Service"
- Wait for deployment to complete
- Copy your backend URL (e.g., `https://reviewgen-backend.onrender.com`)

---

## 🌐 Deploy Frontend to Netlify

### 1. Build the Frontend
```bash
npm run build
```

### 2. Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Deploy manually"
3. Drag and drop your `build` folder
4. Wait for deployment to complete
5. Copy your Netlify URL (e.g., `https://your-app.netlify.app`)

### 3. Configure Environment Variables on Netlify
1. Go to Site settings → Environment variables
2. Add: `REACT_APP_API_URL` = `https://your-render-app.onrender.com/api`
3. Redeploy the site

### 4. Update CORS on Render Backend
1. Go back to your Render dashboard
2. Update the `FRONTEND_URL` environment variable to your Netlify URL
3. Redeploy the backend

---

## 🔗 Connect Frontend to Backend

### Update API Configuration
The frontend is now configured to use environment variables:

- **Development**: Uses `localhost:3001`
- **Production**: Uses `REACT_APP_API_URL` from environment variables

### Test the Connection
1. Visit your Netlify site
2. Try using any AI feature
3. Check the browser console for any CORS errors
4. If there are CORS issues, update the `FRONTEND_URL` in Render

---

## 📝 Environment Variables Summary

### Render (Backend)
```
NVIDIA_API_KEY=your_nvidia_api_key
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
```

### Netlify (Frontend)
```
REACT_APP_API_URL=https://your-render-app.onrender.com/api
```

---

## 🎉 You're Done!
Your app is now live with:
- **Frontend**: Netlify (fast, global CDN)
- **Backend**: Render (reliable Node.js hosting)
- **Database**: MongoDB (if configured)

Both services offer free tiers and are production-ready! 