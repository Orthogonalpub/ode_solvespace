# SolveSpace Web Build and Test Commands

This document lists all the bash commands needed to recompile and test the SolveSpace web version.

## Prerequisites

First, ensure Emscripten SDK is installed and activated:

```bash
# Clone emsdk (if not already done)
git clone https://github.com/emscripten-core/emsdk
cd emsdk

# Install and activate latest version
./emsdk install latest
./emsdk activate latest

# Activate the environment (must be done in each new terminal session)
source ./emsdk_env.sh
cd ..
```

## Clean Build (From Scratch)

```bash
# Remove old build directory
rm -rf build_wasm

# Create new build directory
mkdir build_wasm
cd build_wasm

# Configure with CMake using Emscripten
emcmake cmake .. -DCMAKE_BUILD_TYPE=Release -DENABLE_LTO="ON" -DENABLE_TESTS="OFF" -DENABLE_CLI="OFF" -DENABLE_COVERAGE="OFF"

# Build the project
make

# Return to project root
cd ..
```

## Incremental Build (After Code Changes)

```bash
# Navigate to build directory
cd build_wasm

# Rebuild (only recompiles changed files)
make

# Return to project root
cd ..
```

## Run Local Development Server

After building, you can test the web version locally:

### Option 1: Using emrun (Emscripten's built-in server)

```bash
emrun build_wasm/bin/solvespace.html
```

### Option 2: Using Python HTTP server

```bash
# Navigate to the bin directory
cd build_wasm/bin

# Start Python 3 HTTP server on port 8000
python3 -m http.server 8000

# Open in browser: http://localhost:8000/solvespace.html
```

### Option 3: Using Node.js http-server (if installed)

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to bin directory
cd build_wasm/bin

# Start server
http-server -p 8000

# Open in browser: http://localhost:8000/solvespace.html
```

## Complete Rebuild Workflow

```bash
# 1. Activate Emscripten environment
source emsdk/emsdk_env.sh

# 2. Clean previous build
rm -rf build_wasm

# 3. Create build directory
mkdir build_wasm && cd build_wasm

# 4. Configure
emcmake cmake .. -DCMAKE_BUILD_TYPE=Release -DENABLE_LTO="ON" -DENABLE_TESTS="OFF" -DENABLE_CLI="OFF" -DENABLE_COVERAGE="OFF"

# 5. Build
make

# 6. Return to root
cd ..

# 7. Start test server
python3 -m http.server 8000 -d build_wasm/bin
```

## Quick Rebuild and Test (Single Command)

```bash
# Rebuild and start server in one command
cd build_wasm && make && cd .. && python3 -m http.server 8000 -d build_wasm/bin
```

## Debug Build (For Development)

```bash
# Clean build directory
rm -rf build_wasm
mkdir build_wasm && cd build_wasm

# Configure with Debug mode (instead of Release)
emcmake cmake .. -DCMAKE_BUILD_TYPE=Debug -DENABLE_TESTS="OFF" -DENABLE_CLI="OFF" -DENABLE_COVERAGE="OFF"

# Build
make

cd ..
```

## Build Output Files

After a successful build, these files will be in `build_wasm/bin/`:

- `solvespace.html` - Main HTML file to open in browser
- `solvespace.js` - JavaScript wrapper code
- `solvespace.wasm` - WebAssembly binary
- `solvespace.data` - Embedded resource files
- `solvespaceui.js` - UI JavaScript code
- `solvespaceui.css` - UI stylesheets

## Troubleshooting

### "emcmake: command not found"

Make sure to activate the Emscripten environment:
```bash
source emsdk/emsdk_env.sh
```

### "too many locals" error

This is handled automatically with `-O1` optimization in CMakeLists.txt. If it persists, ensure you're building with Release or Debug mode.

### Port already in use

If port 8000 is already in use, specify a different port:
```bash
python3 -m http.server 8001 -d build_wasm/bin
```
