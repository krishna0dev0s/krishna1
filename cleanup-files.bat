@echo off
echo Removing all PDF and MD files from project root...
echo.

cd /d "c:\Users\Harsh Gupta\OneDrive\Desktop\watshibooo-master (1)\watshibooo-master"

echo Removing PDF files...
del /Q "*.pdf" 2>nul
if %errorlevel%==0 (
    echo PDF files removed successfully!
) else (
    echo No PDF files found or already removed.
)

echo.
echo Removing MD files...
del /Q "*.md" 2>nul
if %errorlevel%==0 (
    echo MD files removed successfully!
) else (
    echo No MD files found or already removed.
)

echo.
echo Cleanup complete!
echo.
pause
