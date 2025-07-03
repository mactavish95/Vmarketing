@echo off
REM ReviewGen Development Startup Script for Windows
REM This script starts both the frontend and backend servers

echo 🚀 Starting ReviewGen Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Check if .env file exists in server directory
if not exist "server\.env" (
    echo ⚠️  No .env file found in server directory.
    echo 📝 Creating .env file from template...
    if exist "server\env.example" (
        copy "server\env.example" "server\.env" >nul
        echo ✅ Created server\.env file
        echo 🔑 Please edit server\.env and add your NVIDIA API key
        echo    NVIDIA_API_KEY=your_actual_api_key_here
    ) else (
        echo ❌ env.example file not found. Please create server\.env manually
        pause
        exit /b 1
    )
)

REM Check if NVIDIA API key is set
findstr "your_nvidia_api_key_here" server\.env >nul
if not errorlevel 1 (
    echo ⚠️  Please update your NVIDIA API key in server\.env
    echo    Get your API key from: https://integrate.api.nvidia.com
)

REM Install backend dependencies if needed
if not exist "server\node_modules" (
    echo 📦 Installing backend dependencies...
    cd server
    npm install
    cd ..
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

echo ✅ Dependencies installed

REM Start backend server in background
echo 🤖 Starting backend server on port 3001...
cd server
start "ReviewGen Backend" cmd /c "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo ✅ Backend server started

REM Start frontend server
echo 📱 Starting frontend server on port 3000...
start "ReviewGen Frontend" cmd /c "npm start"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

echo ✅ Frontend server started

echo.
echo 🎉 ReviewGen Development Environment Started!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🤖 Backend:  http://localhost:3001
echo 📊 Health:   http://localhost:3001/api/health
echo.
echo Press any key to stop this script (servers will continue running)
pause >nul 