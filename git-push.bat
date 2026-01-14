@echo off
echo ============================================
echo Git Push Script to GitHub
echo ============================================
echo.

cd /d "c:\Users\Harsh Gupta\OneDrive\Desktop\watshibooo-master (1)\watshibooo-master"

echo Step 1: Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Error: Failed to initialize git repository
    pause
    exit /b 1
)

echo.
echo Step 2: Adding all files to staging...
git add .
if %errorlevel% neq 0 (
    echo Error: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: Voice-based interview platform"
if %errorlevel% neq 0 (
    echo Error: Failed to commit files
    pause
    exit /b 1
)

echo.
echo Step 4: Renaming branch to main...
git branch -M main
if %errorlevel% neq 0 (
    echo Error: Failed to rename branch
    pause
    exit /b 1
)

echo.
echo Step 5: Adding remote origin...
git remote add origin https://github.com/krishna0dev0s/krishna.git
if %errorlevel% neq 0 (
    echo Warning: Remote might already exist, trying to set URL...
    git remote set-url origin https://github.com/krishna0dev0s/krishna.git
)

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo Error: Failed to push to GitHub
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Authentication failed
    echo 3. Network issues
    echo.
    echo Please create the repository on GitHub first if it doesn't exist.
    pause
    exit /b 1
)

echo.
echo ============================================
echo SUCCESS! Code pushed to GitHub!
echo ============================================
echo Repository: https://github.com/krishna0dev0s/krishna
echo.
pause
