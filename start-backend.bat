@echo off
echo ===================================
echo  Starting Alzico Backend Server
echo ===================================
echo.

cd model
echo [INFO] Starting backend on http://localhost:5000
echo [INFO] Demo credentials: demo@alzico.com / password123
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

