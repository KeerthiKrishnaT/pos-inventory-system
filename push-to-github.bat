@echo off
echo ========================================
echo   Push to GitHub - POS Inventory System
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files...
git add .
echo.

REM Check if there are changes
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No changes to commit.
    echo.
) else (
    echo Creating commit...
    git commit -m "Update: POS Inventory System"
    echo.
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   IMPORTANT: Set up GitHub Repository
    echo ========================================
    echo.
    echo 1. Go to https://github.com and create a new repository
    echo 2. Copy the repository URL
    echo 3. Run this command:
    echo    git remote add origin YOUR_REPO_URL
    echo.
    echo Example:
    echo    git remote add origin https://github.com/yourusername/pos-inventory-system.git
    echo.
    pause
    exit /b
)

REM Show current remote
echo Current remote repository:
git remote get-url origin
echo.

REM Ask for confirmation
set /p confirm="Push to GitHub? (Y/N): "
if /i "%confirm%" neq "Y" (
    echo Cancelled.
    pause
    exit /b
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Successfully pushed to GitHub!
    echo ========================================
    echo.
) else (
    echo.
    echo ========================================
    echo   Push failed. Common issues:
    echo ========================================
    echo.
    echo 1. Branch might be named 'master' instead of 'main'
    echo    Try: git push -u origin master
    echo.
    echo 2. Authentication required
    echo    - Use GitHub Personal Access Token
    echo    - Or use GitHub Desktop app
    echo.
    echo 3. Remote URL might be incorrect
    echo    Check: git remote -v
    echo.
)

pause

