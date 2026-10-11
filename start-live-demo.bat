@echo off
title PrepPilot Live Demo Runner
echo ========================================================
echo   Starting PrepPilot Production Web Server ^& Live Tunnel
echo ========================================================
set PATH=C:\Program Files\nodejs;%PATH%

:: Kill any existing process on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

:: Start Next.js in background
start "PrepPilot Web Server" /min cmd /c "npm run start"
timeout /t 3 >nul

:: Start Cloudflare Public Tunnel
echo Exposing live demo to public internet...
"%TEMP%\cloudflared.exe" tunnel --url http://localhost:3000
pause
