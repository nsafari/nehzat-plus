@echo off
title Nehzat Plus - Frontend (port 4200)
cd /d "%~dp0frontend"
echo Starting Angular dev server on http://localhost:4200 ...
npx ng serve --port 4200
