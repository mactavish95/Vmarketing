# Blog Endpoint Setup Guide

This guide covers setting up the enhanced blog generation endpoint with image support for both local development and production deployment.

## 🚀 Features

- **Blog Post Generation**: Create engaging, SEO-friendly blog posts for restaurants
- **Image Integration**: Upload and process images with automatic placement suggestions
- **AI-Powered Content**: Uses NVIDIA Llama 3.3 Nemotron Super 49B for high-quality content generation
- **Flexible Configuration**: Support for different tones, lengths, and target audiences
- **Image Analysis**: Automatic caption generation and placement recommendations

## 📋 Prerequisites

1. **NVIDIA API Key**: Get your API key from [NVIDIA API Portal](https://integrate.api.nvidia.com)
2. **Node.js**: Version 14.0.0 or higher
3. **Git**: For version control

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```env
# API Configuration
NVIDIA_API_KEY=your_nvidia_api_key_here

# Server Configuration
PORT=10000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Database (Optional)
MONGO_URI=mongodb://localhost:27017/reviewgen
```

### 3. Start Local Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

### 4. Test Local Endpoint

```bash
# Run the test script
node test-blog-endpoint.js
```

## 🌐 Production Deployment (Render)

### 1. Environment Variables on Render

Set these environment variables in your Render dashboard:

- `NVIDIA_API_KEY`: Your NVIDIA API key
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-app.netlify.app`)
- `PORT`: `10000` (Render will override this)

### 2. Build Configuration

The `package.json` is already configured for Render deployment:

```json
{
  "main": "server-new.js",
  "scripts": {
    "start": "node server-new.js"
  }
}
```

### 3. Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Deploy

## 📡 API Endpoints

### 1. Generate Blog Post

**Endpoint**: `POST /api/blog/generate`

**Request Body**:
```json
{
  "topic": "Our New Seasonal Menu Launch",
  "restaurantName": "Taste of Italy",
  "restaurantType": "restaurant",
  "cuisine": "Italian",
  "location": "Downtown Seattle",
  "targetAudience": "foodies",
  "tone": "enthusiastic",
  "length": "medium",
  "keyPoints": "Fresh ingredients, seasonal specialties",
  "specialFeatures": "Award-winning chef",
  "apiKey": "your_nvidia_api_key",
  "images": [
    {
      "name": "menu.jpg",
      "type": "image/jpeg",
      "size": 2048576,
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "blogPost": "Generated blog content...",
  "wordCount": 750,
  "model": "nvidia/llama-3.3-nemotron-super-49b-v1",
  "imageAnalysis": {
    "totalImages": 2,
    "imageDetails": [
      {
        "id": 1,
        "name": "menu.jpg",
        "suggestedPlacement": "hero-image",
        "suggestedCaption": "Featured image: Menu"
      }
    ],
    "integrationSuggestions": [
      "Use this image as the main hero image for your blog post"
    ]
  },
  "metadata": {
    "topic": "Our New Seasonal Menu Launch",
    "restaurantName": "Taste of Italy",
    "imageCount": 2,
    "generatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Process Images

**Endpoint**: `POST /api/blog/process-images`

**Request Body**:
```json
{
  "images": [
    {
      "name": "image.jpg",
      "type": "image/jpeg",
      "size": 1024000,
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ],
  "apiKey": "your_nvidia_api_key"
}
```

### 3. Get Model Information

**Endpoint**: `GET /api/blog/model`

**Response**:
```json
{
  "success": true,
  "model": {
    "name": "nvidia/llama-3.3-nemotron-super-49b-v1",
    "description": "Optimized for creating engaging, SEO-friendly blog content with detailed thinking",
    "useCase": "blog_generation",
    "strengths": ["Content Creation", "SEO Optimization", "Brand Voice", "Engagement", "Detailed Thinking"],
    "imageSupport": true,
    "maxImages": 10,
    "supportedFormats": ["JPEG", "PNG", "GIF", "WebP"],
    "parameters": {
      "temperature": 0.6,
      "maxTokens": 4096,
      "topP": 0.95,
      "frequencyPenalty": 0,
      "presencePenalty": 0
    },
    "modelInfo": {
      "provider": "NVIDIA",
      "modelType": "nvidia/llama-3.3-nemotron-super-49b-v1",
      "parameters": "49B",
      "maxContextLength": "4096 tokens",
      "capabilities": [
        "Long-form content generation",
        "Detailed reasoning and analysis",
        "SEO-optimized writing",
        "Image integration and captioning",
        "Multi-section blog structuring",
        "Brand voice adaptation"
      ],
      "performance": {
        "responseTime": "Fast",
        "contentQuality": "High",
        "consistency": "Excellent",
        "creativity": "Balanced"
      }
    }
  }
}
```

## 🔧 Configuration Options

### Blog Length Options
- `short`: 300-500 words
- `medium`: 600-800 words (default)
- `long`: 900-1200 words

### Target Audience Options
- `customers`: General customers
- `foodies`: Food enthusiasts
- `families`: Families
- `business`: Business professionals
- `tourists`: Tourists/visitors
- `locals`: Local community

### Tone Options
- `professional`: Professional
- `casual`: Casual & friendly
- `enthusiastic`: Enthusiastic
- `elegant`: Elegant & sophisticated
- `rustic`: Rustic & cozy
- `modern`: Modern & trendy

### Restaurant Type Options
- `restaurant`: Restaurant
- `cafe`: Café
- `pizzeria`: Pizzeria
- `bakery`: Bakery
- `bar`: Bar/Pub
- `food-truck`: Food Truck
- `fine-dining`: Fine Dining
- `fast-casual`: Fast Casual

## 🖼️ Image Support

### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP

### Image Limits
- **Maximum file size**: 5MB per image
- **Maximum images**: 10 per blog post
- **Total payload**: 10MB

### Image Processing Features
- **Automatic placement suggestions**: Hero image, mid-content, gallery
- **Caption generation**: Context-aware captions
- **Integration guidance**: How to use images in the blog post

## 🧪 Testing

### Run All Tests
```bash
node test-blog-endpoint.js
```

### Test Specific Environment
```bash
# Test local server
curl -X POST http://localhost:3001/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","restaurantName":"Test Restaurant","apiKey":"your_key"}'

# Test production server
curl -X POST https://vmarketing-backend-server.onrender.com/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","restaurantName":"Test Restaurant","apiKey":"your_key"}'
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure your NVIDIA API key is valid
   - Check environment variables are set correctly

2. **CORS Errors**
   - Verify `FRONTEND_URL` is set correctly
   - Check CORS configuration in `server-new.js`

3. **Image Upload Issues**
   - Ensure images are under 5MB
   - Check supported file formats
   - Verify base64 encoding is correct

4. **Timeout Errors**
   - Increase timeout for large blog posts
   - Check network connectivity

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

### Health Check

Check server status:
```bash
curl http://localhost:3001/api/health
```

## 📊 Monitoring

### Logs
- Application logs are available in Render dashboard
- Local logs appear in console

### Metrics
- Request count and response times
- Error rates and types
- API key usage

## 🔒 Security

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable in `middleware/security.js`

### Input Validation
- All inputs are validated and sanitized
- File size and type restrictions
- API key validation

### CORS Protection
- Configured for specific origins
- Secure headers with Helmet

## 🚀 Performance Optimization

### Caching
- Model information is cached
- Response compression enabled

### Optimization Tips
- Use appropriate image sizes
- Compress images before upload
- Choose appropriate blog length

## 📚 Additional Resources

- [NVIDIA API Documentation](https://docs.nvidia.com/api/)
- [Express.js Documentation](https://expressjs.com/)
- [Render Deployment Guide](https://render.com/docs)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Test with the provided test script
4. Verify environment configuration 