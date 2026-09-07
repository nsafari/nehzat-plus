@echo off
title Nehzat Plus - Dev Servers
echo ============================================
echo   Nehzat Plus - Starting Backend + Frontend
echo ============================================
echo.

:: Start Backend in new window
echo [1/2] Starting Backend (port 3000)...
start "Backend - Nehzat Plus (port 3000)" cmd /c "cd /d "%~dp0backend" && dotnet run --project src\EducationalPlatform.Nehzat.API --launch-profile http"

:: Wait for backend to initialize
timeout /t 5 /nobreak >nul

:: Start Frontend in new window
echo [2/2] Starting Frontend (port 4200)...
start "Frontend - Nehzat Plus (port 4200)" cmd /c "cd /d "%~dp0frontend" && npx ng serve --port 4200"

echo.
echo ============================================
echo   Both servers are starting:
echo     Backend:  http://localhost:3000
echo     Frontend: http://localhost:4200
echo ============================================
echo.
echo Close this window anytime - servers run independently.
echo To stop: close the Backend/Frontend windows or run:
echo   taskkill /FI "WINDOWTITLE eq Backend*" /F
echo   taskkill /FI "WINDOWTITLE eq Frontend*" /F
echo.
pause
