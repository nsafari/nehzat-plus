#!/usr/bin/env pwsh
#Requires -Version 5.1
<#
.SYNOPSIS
    Install git hooks for nehzat-plus project
.DESCRIPTION
    Copies hook files from scripts/hooks/ to .git/hooks/
    Run from project root: scripts/install-hooks.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
$hooksSource = Join-Path $PSScriptRoot 'hooks'
$hooksTarget = Join-Path (Join-Path $repoRoot '.git') 'hooks'

# Check .git exists
if (-not (Test-Path (Join-Path $repoRoot '.git'))) {
    Write-Error ".git folder not found. Run from project root."
    exit 1
}

# Check source hooks exist
if (-not (Test-Path $hooksSource)) {
    Write-Error "scripts/hooks/ folder not found."
    exit 1
}

# Ensure target directory exists
if (-not (Test-Path $hooksTarget)) {
    New-Item -ItemType Directory -Path $hooksTarget -Force | Out-Null
}

$installed = 0
Get-ChildItem -Path $hooksSource -File | ForEach-Object {
    $target = Join-Path $hooksTarget $_.Name
    Copy-Item $_.FullName -Destination $target -Force

    # Make executable on Unix-like systems
    if ($IsLinux -or $IsMacOS) {
        chmod +x $target 2>$null
    }

    $installed++
    Write-Host "  Installed: $($_.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "$installed hook(s) installed." -ForegroundColor Green
Write-Host "Now every push will auto-archive tags." -ForegroundColor DarkGray