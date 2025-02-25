@echo off
set "NODE_PATH=%~dp0node-v20.11.1-win-x64"
set "PATH=%NODE_PATH%;%PATH%"
cd /d "%~dp0"

echo.
echo ===== Testing Node.js installation =====
"%NODE_PATH%\node.exe" --version
if errorlevel 1 (
    echo Error: Node.js not found or not working
    echo Please check if Node.js is correctly installed at: %NODE_PATH%
    pause
    exit /b 1
)

echo.
echo ===== Testing npm installation =====
"%NODE_PATH%\npm.cmd" --version
if errorlevel 1 (
    echo Error: npm not found or not working
    echo Please check if npm is correctly installed at: %NODE_PATH%
    pause
    exit /b 1
)

echo.
echo ===== Cleaning npm cache =====
"%NODE_PATH%\npm.cmd" cache clean --force
if errorlevel 1 (
    echo Warning: Failed to clean npm cache
    echo Continuing anyway...
)

echo.
echo ===== Removing node_modules =====
if exist node_modules (
    rmdir /s /q node_modules
    if errorlevel 1 (
        echo Warning: Failed to remove node_modules
        echo Continuing anyway...
    )
)

echo.
echo ===== Installing dependencies =====
"%NODE_PATH%\npm.cmd" install
if errorlevel 1 (
    echo Error: Failed to install dependencies
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ===== Starting development server =====
echo Server will start at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

"%NODE_PATH%\npm.cmd" run dev

if errorlevel 1 (
    echo Error: Development server failed to start
    echo Please check the error messages above
    pause
    exit /b 1
)

pause
