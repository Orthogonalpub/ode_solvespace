#!/bin/bash

# SolveSpace Web - Rebuild and Test Script
# This script rebuilds the project and starts a local test server

set -e  # Exit on error

echo "==================================="
echo "SolveSpace Web - Rebuild and Test"
echo "==================================="

# Check if emsdk is activated
if ! command -v emcmake &> /dev/null; then
    echo "Error: Emscripten not found. Activating emsdk..."
    if [ -d "emsdk" ]; then
        source emsdk/emsdk_env.sh
    else
        echo "Error: emsdk directory not found. Please install Emscripten first."
        echo "Run: git clone https://github.com/emscripten-core/emsdk"
        exit 1
    fi
fi

# Navigate to build directory
echo ""
echo "Step 1: Navigating to build directory..."
cd build_wasm

# Rebuild the project
echo ""
echo "Step 2: Rebuilding project..."
make

# Return to project root
cd ..

# Kill any existing server on port 8000
echo ""
echo "Step 3: Checking for existing server on port 8000..."
SERVER_PID=$(lsof -ti:8000 2>/dev/null || true)
if [ ! -z "$SERVER_PID" ]; then
    echo "Found existing server (PID: $SERVER_PID), stopping it..."
    kill -9 $SERVER_PID 2>/dev/null || true
    sleep 1
    echo "Existing server stopped."
else
    echo "No existing server found."
fi

# Start the test server
echo ""
echo "Step 4: Starting development server..."
echo "==================================="
echo "Server starting at http://localhost:8000"
echo "Open http://localhost:8000/solvespace.html in your browser"
echo "Press Ctrl+C to stop the server"
echo "==================================="
echo ""

python3 -m http.server 8000 -d build_wasm/bin
