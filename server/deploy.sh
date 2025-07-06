#!/bin/bash

# Deployment script for Render
echo "🚀 Starting deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if express is installed
if [ ! -d "node_modules/express" ]; then
    echo "❌ Express not found, installing all dependencies..."
    npm install
fi

# Check if the server file exists
if [ ! -f "server-new.js" ]; then
    echo "❌ server-new.js not found!"
    ls -la
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo "🚀 Starting server with: npm start"

# Start the server
npm start 