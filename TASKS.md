# Project Tasks

<!-- id: 0 -->
## Phase 1: Core Infrastructure (Weeks 1-3)
- [x] Analyze new architecture (React + WASM) <!-- id: 1 -->
- [x] Inspect frontend code (TextWindow.tsx, store, types) <!-- id: 2 -->
- [x] Plan API extensions and frontend integration <!-- id: 3 -->
- [x] Resolve `lib.cpp` Compilation Errors <!-- id: 4 -->
- [x] Resolve `geometry_api.cpp` Linker Errors <!-- id: 5 -->
- [x] Address `solvespace.h` and `dsc.h` Dependencies <!-- id: 6 -->
- [x] Perform Clean Builds <!-- id: 7 -->
- [ ] Implement `GetDOF()` (Future) <!-- id: 8 -->
- [ ] Verify Changes <!-- id: 9 -->

## Phase 2: Viewer Implementation
- [ ] Implement file loading (`.slvs` format)
- [ ] Export mesh data functions
- [ ] Create Three.js mesh renderer
- [ ] Add camera controls
- [ ] Implement selection system

## Phase 3: Basic Editing
- [ ] Implement sketch tools (point, line, circle)
- [ ] Add constraint system UI
- [ ] Implement hit testing and snapping
- [ ] Add drag functionality
- [ ] Create property panel

## Current Status
**2025-11-24**: WASM build is fixed and frontend server is running. `slvs.js` is generated. Next step is to verify the changes and implement `GetDOF()`.
