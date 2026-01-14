@echo off
echo Initializing Git repository and pushing to GitHub...
echo.

REM Navigate to project directory
cd /d "C:\Users\Harsh Gupta\OneDrive\Desktop\watshibooo-master (1)\watshibooo-master"

REM Initialize git if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
) else (
    echo Git repository already initialized
)

REM Add all files
echo Adding files...
git add .

REM Commit
echo Committing changes...
git commit -m "feat: Add fully optimized WatshiBo AI platform with performance improvements"

REM Rename branch to main
echo Renaming branch to main...
git branch -M main

REM Add remote (remove existing if present)
echo Setting up remote...
git remote remove origin 2>nul
git remote add origin https://github.com/krishna0dev0s/krishna.git

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force

echo.
echo Done! Check https://github.com/krishna0dev0s/krishna
pause
