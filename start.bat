@echo off
echo ======================================
echo Audio Protection Platform - Starting
echo ======================================
echo.

echo Installing Python dependencies...
cd python-service
pip install -r requirements.txt
cd ..

echo.
echo Installing Node dependencies...
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)

echo.
echo ======================================
echo Starting all services...
echo ======================================
echo.
echo 1. Python Adversarial Service (port 5000)
echo 2. Node.js Backend API (port 3001)
echo 3. React Frontend (port 5173)
echo.
echo Press Ctrl+C to stop all services
echo.

npm run dev
