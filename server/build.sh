#!/bin/bash

echo "🚀 Starting Render Build Process"
echo "================================"

# Show current directory
echo "📁 Current directory: $(pwd)"
echo "📁 Directory contents:"
ls -la

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory"
    echo "🔍 Looking for package.json in subdirectories..."
    find . -name "package.json" -type f 2>/dev/null
    exit 1
fi

echo "✅ package.json found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if express was installed
if [ ! -d "node_modules/express" ]; then
    echo "❌ Express not found after npm install"
    echo "🔍 Node modules contents:"
    ls -la node_modules/ 2>/dev/null || echo "node_modules directory not found"
    exit 1
fi

echo "✅ Express installed successfully"

# Show installed packages
echo "📦 Installed packages:"
npm list --depth=0

echo "✅ Build completed successfully" 