#!/bin/bash

# ReviewGen Development Startup Script
# This script starts both the frontend and backend servers

echo "🚀 Starting ReviewGen Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using port $1 first."
        return 1
    fi
    return 0
}

# Check if ports are available
echo "🔍 Checking port availability..."
if ! check_port 3000; then
    exit 1
fi

if ! check_port 3001; then
    exit 1
fi

# Check if .env file exists in server directory
if [ ! -f "server/.env" ]; then
    echo "⚠️  No .env file found in server directory."
    echo "📝 Creating .env file from template..."
    if [ -f "server/env.example" ]; then
        cp server/env.example server/.env
        echo "✅ Created server/.env file"
        echo "🔑 Please edit server/.env and add your NVIDIA API key"
        echo "   NVIDIA_API_KEY=your_actual_api_key_here"
    else
        echo "❌ env.example file not found. Please create server/.env manually"
        exit 1
    fi
fi

# Check if NVIDIA API key is set
if grep -q "your_nvidia_api_key_here" server/.env; then
    echo "⚠️  Please update your NVIDIA API key in server/.env"
    echo "   Get your API key from: https://integrate.api.nvidia.com"
fi

# Install backend dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Start backend server in background
echo "🤖 Starting backend server on port 3001..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ! check_port 3001; then
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend server started (PID: $BACKEND_PID)"

# Start frontend server
echo "📱 Starting frontend server on port 3000..."
npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ! check_port 3000; then
    echo "❌ Frontend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 ReviewGen Development Environment Started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🤖 Backend:  http://localhost:3001"
echo "📊 Health:   http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 