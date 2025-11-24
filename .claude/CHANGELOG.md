# Changelog
All notable changes to the ODE Geometry (SolveSpace Web) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [0.1.0-alpha] - 2025-01-23

#### Added - WASM Geometry Engine
- WASM API: 13 core geometry functions exported via Embind
  - `Initialize()`, `Reset()`, `GetVersion()` - System management
  - `LoadModelFromBuffer()`, `SaveModel()` - File I/O
  - `GetGroupCount()`, `GetGroupInfo()` - Group hierarchy
  - `GetTriangleCount()`, `GetTriangleVertices()`, `GetTriangleNormals()`, `GetTriangleIndices()` - Mesh data export
  - `GetEdgeCount()`, `GetEdgeVertices()` - Wireframe data (stubs)
  - `GetBoundingBox()` - Spatial queries
- Created `/src/wasm/geometry_api.h` and `/src/wasm/geometry_api.cpp` - API implementation
- Added Embind bindings to expose C++ functions to JavaScript

#### Added - Frontend Infrastructure
- React 18 + Vite frontend project structure
- Three.js integration with @react-three/fiber and @react-three/drei
- TypeScript type definitions for WASM API
- Zustand state management with Immer
- WASM module loader with async initialization
- Component architecture matching Figma design:
  - `Viewport` - Three.js 3D canvas with grid, lighting, and orbit controls
  - `GeometryMesh` - Dynamic mesh rendering from WASM data
  - `LeftSidebar` - Task/project navigation
  - `LeftToolbar` - Tool palette with SHAPE, CONSTR, FORM, VIEW sections
  - `TopBar` - View controls and share button
  - `App` - Main layout coordinator

#### Changed - Build System
- CMakeLists.txt: Added `ENABLE_HEADLESS` build flag
- src/CMakeLists.txt: Conditional compilation for headless mode
  - Excludes UI files: draw.cpp, graphicswin.cpp, mouse.cpp, textwin.cpp, toolbar.cpp, etc.
  - Includes core: entity.cpp, generate.cpp, group.cpp, mesh.cpp, constraint.cpp, system.cpp
  - Uses `platform/guinone.cpp` instead of GUI platform files
- src/slvs/CMakeLists.txt: Linked geometry_api.cpp to WASM build
- Emscripten builds automatically use HEADLESS mode

#### Documentation
- Created API_EXPORTS.md - Tracking 13/56 functions (23% complete)
- Updated project structure documentation

#### Technical Notes
- Phase 1 Core Infrastructure: ✅ COMPLETED
- WASM module compiles with HEADLESS flag
- Frontend renders 3D grid and UI layout
- Mesh data pipeline: C++ → Embind → TypeScript → Three.js BufferGeometry

---

### Planning Phase - 2025-01-XX
- Initial project setup
- Architecture design completed
- API specification defined
- Technology stack selected

---

## [0.0.1] - 2025-01-XX

### Added
- Project specification document (ODE_GEOMETRY_SPEC.md)
- Development guidelines (GUIDELINES.md)
- API exports tracking (API_EXPORTS.md)
- Core documentation structure

### Architecture
- Defined separation between C++ geometry engine and TypeScript frontend
- Selected Three.js for 3D rendering
- Chose Embind for WASM/JS communication
- Designed 56 core API functions across 9 modules

### Documentation
- Created comprehensive product specification
- Established coding guidelines for Claude AI
- Set up API tracking system
- Defined task and bug management process

---

## Roadmap

### Phase 1: Core Infrastructure (Weeks 1-3)
- [ ] Setup CMake build system with Emscripten
- [ ] Create HEADLESS compilation flag
- [ ] Implement Embind bindings structure
- [ ] Initialize React/Vite project
- [ ] Integrate Three.js viewport

### Phase 2: Viewer Implementation (Weeks 4-5)  
- [ ] Implement file loading API
- [ ] Create mesh data export functions
- [ ] Build Three.js renderer
- [ ] Add camera controls
- [ ] Implement selection system

### Phase 3: Basic Editing (Weeks 6-9)
- [ ] Implement sketch tools
- [ ] Add constraint system UI
- [ ] Create hit testing
- [ ] Add drag functionality
- [ ] Build property panel

### Phase 4: Advanced Features (Weeks 10-14)
- [ ] Implement solid operations
- [ ] Add boolean operations
- [ ] Create undo/redo system
- [ ] Add dimension annotations
- [ ] Build complete toolbar

### Phase 5: Polish & Optimization (Weeks 15-16)
- [ ] Performance profiling
- [ ] Add keyboard shortcuts
- [ ] Implement auto-save
- [ ] Create tutorial
- [ ] Write user documentation

---

## Version History

| Version | Date | Status | Milestone |
|---------|------|--------|-----------|
| 0.0.1 | 2025-01-XX | Planning | Documentation complete |
| 0.1.0 | TBD | - | Basic viewer working |
| 0.2.0 | TBD | - | 2D sketching enabled |
| 0.3.0 | TBD | - | 3D operations working |
| 0.4.0 | TBD | - | Feature complete |
| 1.0.0 | TBD | - | Production release |

---

## Contributors

- Architecture Design: [Team Lead]
- WASM Development: [C++ Developer]
- Frontend Development: [React Developer]
- 3D Graphics: [Three.js Specialist]
- Testing: [QA Engineer]

---

## Links

- [GitHub Repository](#)
- [Project Specification](./ODE_GEOMETRY_SPEC.md)
- [Development Guidelines](./GUIDELINES.md)
- [API Documentation](./API_EXPORTS.md)
- [Original SolveSpace](https://github.com/solvespace/solvespace)

---

**Note**: This is an append-only document. Never modify past entries, only add new ones at the top of the [Unreleased] section.
