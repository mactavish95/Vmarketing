#!/bin/bash

# Blog Endpoint Quick Start Script
# This script helps you quickly set up and test the blog endpoint

echo "🚀 Blog Endpoint Quick Start"
echo "============================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found. Creating one..."
    cat > .env << EOF
# API Configuration
NVIDIA_API_KEY=your_nvidia_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Database (Optional)
MONGO_URI=mongodb://localhost:27017/reviewgen
EOF
    echo "✅ Created .env file"
    echo "⚠️  Please update NVIDIA_API_KEY in .env file with your actual API key"
else
    echo "✅ .env file already exists"
fi

# Check if NVIDIA API key is set
if grep -q "your_nvidia_api_key_here" .env; then
    echo ""
    echo "⚠️  Please update your NVIDIA API key in the .env file"
    echo "   Get your API key from: https://integrate.api.nvidia.com"
    echo ""
    read -p "Do you want to continue without setting the API key? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please update the .env file and run this script again."
        exit 1
    fi
fi

# Start the server
echo ""
echo "🌐 Starting server..."
echo "   Local URL: http://localhost:3001"
echo "   Health check: http://localhost:3001/api/health"
echo "   Blog endpoint: http://localhost:3001/api/blog/generate"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server in the background
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Test the health endpoint
echo "🧪 Testing server health..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Server is running and healthy"
else
    echo "❌ Server health check failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Test the blog model endpoint
echo "🧪 Testing blog model endpoint..."
if curl -s http://localhost:3001/api/blog/model > /dev/null; then
    echo "✅ Blog model endpoint is working"
else
    echo "❌ Blog model endpoint failed"
fi

echo ""
echo "🎉 Setup complete! Your blog endpoint is ready."
echo ""
echo "📝 Next steps:"
echo "   1. Update your NVIDIA API key in .env file"
echo "   2. Test the endpoint with: node test-blog-endpoint.js"
echo "   3. Deploy to production when ready"
echo ""
echo "📚 Documentation: BLOG_ENDPOINT_SETUP.md"

# Keep the script running and handle Ctrl+C
trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; exit 0" INT

# Wait for the server process
wait $SERVER_PID 