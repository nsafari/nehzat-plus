param(
  [switch]$Seed,
  [switch]$FrontendOnly,
  [switch]$BackendOnly
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n=== Nehzat Plus — Dev Servers ===" -ForegroundColor Green

# Start backend
if (-not $FrontendOnly) {
  $backendArgs = @('run', '--project', "$root\backend\src\EducationalPlatform.Nehzat.API", '--launch-profile', 'http')
  if ($Seed) { $backendArgs += '--seed' }
  $backendJob = Start-Process -WindowStyle Normal -FilePath 'dotnet' -ArgumentList $backendArgs -PassThru -NoNewWindow:$false
  Write-Host "Backend PID:  $($backendJob.Id)  → http://localhost:3000" -ForegroundColor Cyan
}

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend
if (-not $BackendOnly) {
  $frontendProcess = Start-Process -WindowStyle Normal -FilePath 'npx.cmd' -ArgumentList @('ng', 'serve', '--port', '4200') -WorkingDirectory "$root\frontend" -PassThru -NoNewWindow:$false
  Write-Host "Frontend PID: $($frontendProcess.Id) → http://localhost:4200" -ForegroundColor Cyan
}

Write-Host "`nServers are running in separate windows." -ForegroundColor Green
Write-Host "Close the server windows to stop them.`n" -ForegroundColor Yellow
