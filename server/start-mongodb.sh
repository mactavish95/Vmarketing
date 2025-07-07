#!/bin/bash

echo "🚀 MongoDB Startup Script for WSL2"
echo "=================================="

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running"
    echo "Process ID: $(pgrep -x "mongod")"
    exit 0
fi

echo "📦 Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed"
    echo "Please install MongoDB first:"
    echo "sudo apt update && sudo apt install mongodb"
    exit 1
fi

echo "✅ MongoDB is installed"

# Create data directory if it doesn't exist
echo "📁 Setting up data directory..."
sudo mkdir -p /data/db
sudo chown -R $USER:$USER /data/db
echo "✅ Data directory ready: /data/db"

# Try to start MongoDB service first
echo "🔧 Attempting to start MongoDB service..."
if sudo service mongodb start 2>/dev/null; then
    echo "✅ MongoDB service started successfully"
    sleep 2
    
    # Check if it's running
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
        echo "Process ID: $(pgrep -x "mongod")"
        echo "Connection: mongodb://localhost:27017"
        exit 0
    else
        echo "⚠️  Service started but process not found, trying manual start..."
    fi
else
    echo "⚠️  Service start failed, trying manual start..."
fi

# Manual start as fallback
echo "🔧 Starting MongoDB manually..."
mongod --dbpath /data/db --fork --logpath /tmp/mongodb.log

if [ $? -eq 0 ]; then
    echo "✅ MongoDB started successfully"
    echo "Process ID: $(pgrep -x "mongod")"
    echo "Connection: mongodb://localhost:27017"
    echo "Log file: /tmp/mongodb.log"
else
    echo "❌ Failed to start MongoDB manually"
    echo "Trying without fork option..."
    
    # Start without fork to see errors
    echo "🔧 Starting MongoDB in foreground (press Ctrl+C to stop)..."
    mongod --dbpath /data/db
fi 