#!/bin/bash

# Audio Protection Platform - Quick Start Script
# This script starts all services needed for full protection (metadata + adversarial)

echo "======================================"
echo "Audio Protection Platform - Starting"
echo "======================================"
echo ""

# Check if Python dependencies are installed
echo "Checking Python dependencies..."
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing Python dependencies..."
    cd python-service
    pip install -r requirements.txt
    cd ..
fi

# Check if Node dependencies are installed
echo "Checking Node dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client
    npm install
    cd ..
fi

echo ""
echo "======================================"
echo "Starting all services..."
echo "======================================"
echo ""
echo "1. Python Adversarial Service (port 5000)"
echo "2. Node.js Backend API (port 3001)"
echo "3. React Frontend (port 5173)"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start all services using npm dev script
npm run dev
