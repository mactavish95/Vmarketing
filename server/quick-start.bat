@echo off
setlocal enabledelayedexpansion

REM Blog Endpoint Quick Start Script for Windows
REM This script helps you quickly set up and test the blog endpoint

echo 🚀 Blog Endpoint Quick Start
echo ============================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 14+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: !NODE_VERSION!

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: !NPM_VERSION!

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Check if .env file exists
if not exist .env (
    echo.
    echo ⚠️  No .env file found. Creating one...
    (
        echo # API Configuration
        echo NVIDIA_API_KEY=your_nvidia_api_key_here
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo NODE_ENV=development
        echo.
        echo # CORS Configuration
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # Database ^(Optional^)
        echo MONGO_URI=mongodb://localhost:27017/reviewgen
    ) > .env
    echo ✅ Created .env file
    echo ⚠️  Please update NVIDIA_API_KEY in .env file with your actual API key
) else (
    echo ✅ .env file already exists
)

REM Check if NVIDIA API key is set
findstr /c:"your_nvidia_api_key_here" .env >nul
if %errorlevel% equ 0 (
    echo.
    echo ⚠️  Please update your NVIDIA API key in the .env file
    echo    Get your API key from: https://integrate.api.nvidia.com
    echo.
    set /p CONTINUE="Do you want to continue without setting the API key? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        echo Please update the .env file and run this script again.
        pause
        exit /b 1
    )
)

REM Start the server
echo.
echo 🌐 Starting server...
echo    Local URL: http://localhost:3001
echo    Health check: http://localhost:3001/api/health
echo    Blog endpoint: http://localhost:3001/api/blog/generate
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server in the background
start /b npm start

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Test the health endpoint
echo 🧪 Testing server health...
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is running and healthy
) else (
    echo ❌ Server health check failed
    echo Please check if the server started correctly
    pause
    exit /b 1
)

REM Test the blog model endpoint
echo 🧪 Testing blog model endpoint...
curl -s http://localhost:3001/api/blog/model >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Blog model endpoint is working
) else (
    echo ❌ Blog model endpoint failed
)

echo.
echo 🎉 Setup complete! Your blog endpoint is ready.
echo.
echo 📝 Next steps:
echo    1. Update your NVIDIA API key in .env file
echo    2. Test the endpoint with: node test-blog-endpoint.js
echo    3. Deploy to production when ready
echo.
echo 📚 Documentation: BLOG_ENDPOINT_SETUP.md
echo.
echo The server is now running. Press any key to stop it...
pause >nul

REM Stop the server
taskkill /f /im node.exe >nul 2>&1
echo 🛑 Server stopped.
pause 