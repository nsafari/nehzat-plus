$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$root\frontend"
Write-Host "Starting Angular dev server on http://localhost:4200 ..." -ForegroundColor Green
npx ng serve --port 4200
