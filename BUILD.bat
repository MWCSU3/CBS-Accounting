@echo off
echo ============================================
echo   CBS Accounting - One Click Build
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Download it from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building Next.js app...
call npx next build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Next.js build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Preparing Electron package...
call node scripts/prepare-electron.js
if %ERRORLEVEL% neq 0 (
    echo ERROR: Electron preparation failed
    pause
    exit /b 1
)

echo.
echo [4/4] Building Windows installer...
call npx electron-builder --win
if %ERRORLEVEL% neq 0 (
    echo ERROR: Electron builder failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo   BUILD COMPLETE!
echo ============================================
echo.
echo Your installer is at:
echo   dist-electron\CBS-Accounting-Setup-1.0.0.exe
echo.
echo Your portable version is at:
echo   dist-electron\CBS-Accounting-Portable-1.0.0.exe
echo.
echo Double-click either to install/run!
echo.

:: Open the output folder
explorer dist-electron

pause
