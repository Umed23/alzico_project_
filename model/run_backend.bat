@echo off
echo ========================================
echo Starting Alzico Backend Server
echo ========================================
echo.

REM Check if virtual environment exists
if not exist ".venv" (
    echo ERROR: Virtual environment not found!
    echo Please run setup_backend.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo Virtual environment activated!
echo Starting Flask server...
echo.
echo Server will run on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
echo ========================================

REM Run the Flask app
python app.py

pause


