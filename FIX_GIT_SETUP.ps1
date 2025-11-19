# PowerShell Script to Fix Git Setup
# Run this in D:\Project (root directory)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Git Repository Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERROR: Please run this script from D:\Project (root directory)" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "Step 1: Removing frontend/.git (if exists)..." -ForegroundColor Yellow
if (Test-Path "frontend\.git") {
    Remove-Item -Recurse -Force "frontend\.git"
    Write-Host "  ✓ Removed frontend/.git" -ForegroundColor Green
} else {
    Write-Host "  ✓ No frontend/.git found" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Initializing git in root directory..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "  ⚠ Git already initialized in root" -ForegroundColor Yellow
} else {
    git init
    Write-Host "  ✓ Git initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "  ✓ Files added" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: POS Inventory System (Frontend + Backend)"
Write-Host "  ✓ Commit created" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a NEW repository on GitHub:" -ForegroundColor Yellow
Write-Host "   - Go to https://github.com/new" -ForegroundColor White
Write-Host "   - Name: pos-inventory-system" -ForegroundColor White
Write-Host "   - DO NOT initialize with README" -ForegroundColor White
Write-Host ""
Write-Host "2. Then run these commands:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/KeerthiKrishnaT/pos-inventory-system.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
pause

