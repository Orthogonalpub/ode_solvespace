# Changelog
All notable changes to the ODE Geometry (SolveSpace Web) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [0.2.2-alpha] - 2025-11-27

#### Added - Three.js Rendering System
- **SolveSpace Color System** (`frontend/src/rendering/colors.ts`):
  - Complete color palette matching original SolveSpace `style.cpp`
  - Colors: BACKGROUND, ACTIVE_GRP, CONSTRUCTION, SELECTED, HOVERED, SOLID_EDGE, etc.
  - Line widths, stipple patterns (continuous, short dash, long dash, freehand)
  - Z-index ordering for depth control
  - Helper functions: `hexToThreeColor()`, `getColorForState()`

- **Material System** (`frontend/src/rendering/materials.ts`):
  - Reusable Three.js materials matching SolveSpace visual style
  - `SolveMaterials` class with edge, point, face, selection, and construction materials
  - Line dashed materials for workplane borders

- **Viewport Components**:
  - `SolveSpaceGrid.tsx` - Grid with minor/major lines on XZ plane, origin axes (red X, blue Z)
  - `Workplane.tsx` - Workplane display with dashed borders, labels, and normal arrows
  - `EdgeRenderer.tsx` - Renders wireframe edges from WASM geometry data
  - `PointRenderer.tsx` - Renders construction points from WASM geometry data
  - `InteractionManager.tsx` - Mouse interaction handler for selection and drawing tools

- **Three Workplanes**: Added XY, YZ, and XZ workplanes matching SolveSpace defaults

- **Mouse Interaction System**:
  - Screen to NDC coordinate conversion
  - Ray casting for entity hit detection
  - Hover state tracking with visual feedback
  - Left-click selection with shift-click multi-select
  - Click on empty space clears selection
  - Crosshair cursor when drawing tools are active

- **Toolbar Command Integration**:
  - Added `Command` enum matching SolveSpace's `ui.h` command IDs
  - Each toolbar tool now maps to corresponding SolveSpace command
  - Keyboard shortcuts: S=Line, C=Circle, R=Rectangle, A=Arc, T=Text, etc.
  - ESC key cancels pending operations

#### Changed
- **Viewport.tsx**: Complete rewrite with proper Three.js/R3F structure
  - Lighting setup matching SolveSpace (ambient + 2 directional lights)
  - Camera at (5,5,5) with 50° FOV
  - OrbitControls with SolveSpace-style mouse buttons (left=orbit, middle=pan, right=zoom)
  - GizmoHelper in bottom-right corner
- **useGeometryStore.ts**: Added tool activation, selection management, and command execution
- **toolDefinitions.ts**: Added `command` property linking each tool to WASM command
- **geometry.ts types**: Extended `WASMModule` interface with new API functions

#### Technical
- WASM API extended with edge/point data export functions
- Stub implementations for headless build (ActivateCommand, SelectEntity, etc.)
- Frontend builds successfully with all new components

### [0.2.1-alpha] - 2025-11-25

#### Added
- **ColorPicker Component**: New floating color picker UI for editing colors
  - HSV color selection with gradient picker and hue slider
  - RGB input field for explicit color values (comma-separated format: "255, 128, 64")
  - Live color preview swatch
  - Preset color swatches grid
  - Click outside to close
  - Integrated with PropertyBrowser configuration page (user colors) and line styles page (background color, style colors)
- **Toolbar Tooltips**: Added hover tooltips for all icons in left toolbar and property browser
  - Custom CSS tooltips using `data-tooltip` attribute with `::after` pseudo-element
  - Shows tool description and keyboard shortcut
  - High z-index (99999) to ensure visibility above all other layers

#### Fixed
- **LineIcon SVG**: Removed erroneous border path that was baked into the SVG from Figma export
  - The Line tool icon no longer shows a permanent border box
  - Only the active/selected tool now displays a border
- **ColorPicker Drag Interference**: Fixed bug where hovering over color picker would trigger PropertyBrowser panel dragging
  - Added `stopPropagation()` on color picker panel mousedown events
- **Tool Type System**: Fixed TypeScript type restriction that prevented all tool types from working correctly
  - Changed `Tool.type` from limited union type to `string` to support all tools defined in toolDefinitions
- **WASM Build**: Resolved persistent C++ compilation and linker errors for the `slvs-wasm` target
  - Refactored `src/slvs/lib.cpp` to use `auto` and `decltype` for `ENTITY` and `CONSTRAINT` types
  - Added `using namespace SolveSpace` to `src/slvs/lib.cpp` to fix undeclared identifier errors
  - Implemented comprehensive stubs in `src/wasm/geometry_api.cpp`
  - Added `src/platform/platform.cpp` to the HEADLESS build configuration

#### Changed
- **Toolbar Hover Effect**: Made hover background darker (0.08 → 0.24 opacity) for better visibility on both left toolbar and PropertyBrowser toolbar icons
- **Font Styling**:
  - Changed "Default Task Name" font-weight from 600 to 400 (no bold)
  - Changed FloatingMenu font-weight from 600 to 400 for all menu items
- **History Page**: Refined PropertyBrowser home/history view to match Figma design
  - Added tree view guidelines (vertical lines and corner connectors)
  - Added group checkboxes and status labels (ok/err/dof count)
  - Added filter buttons with slash dividers (show all / only unconstrained / hide all)
- **Left Toolbar Icons**: Converted all 34 toolbar icons from Figma URLs to inline SVGs for reliability
  - Icons no longer depend on external Figma asset URLs (which expire after 7 days)
  - Organized into 4 sections with Figma node IDs documented for each icon:
    - SHAPE section: 11 icons
    - CONSTR section: 12 icons
    - FORM section: 9 icons
    - VIEW section: 2 icons
- **Right Sidebar (PropertyBrowser)**: Updated toolbar icons to use inline SVGs from Figma design
- **Icon Architecture**: All icons now use inline SVG approach for permanent, offline-capable rendering

#### Removed
- **StatusBar**: Removed bottom status bar component from App.tsx

---

### [0.2.0-alpha] - 2025-11-25

#### Added - PropertyBrowser Component
- New `PropertyBrowser` component replacing old TextWindow
  - Modern design matching Figma specifications
  - 4 view modes: Main, Line Styles, View Settings, Configuration
  - 380px width with clean #f8f9fa background
  - Toolbar with 11 icon buttons for quick actions
  - Tab key toggle functionality (same as old SolveSpace)
  - Smooth transitions and hover states
  - Custom scrollbar styling
- Main view features:
  - Active plane display
  - Group status with checkboxes (ok/err/DOF count)
  - Filter links (show all/only unconstrained/hide all)
  - Navigation buttons to sub-views
- Line Styles view:
  - 15 predefined color styles with swatches
  - Background color editor
  - Create custom style and load defaults options
- View Settings:
  - 3D view parameters configuration
  - Scale factor, origin, and projection settings
  - Light direction and ambient lighting controls
  - Perspective factor and explode distance
- Configuration view:
  - User color settings with color swatches
  - Export options with checkboxes
  - Distance settings and SI prefix toggle
  - Canvas size selection (fixed/auto)

#### Changed - UI Components
- Updated color scheme to modern palette:
  - Primary blue: #0969da (from #0066cc)
  - Background: #f8f9fa (from #ffffff)
  - Borders: #dee2e6 (from #e0e0e0)
  - Text colors: #212529, #495057, #6c757d
- Improved typography:
  - Base font size: 14px (from 13px)
  - System font stack for better cross-platform support
  - Better line-height (1.5) for readability
- Enhanced interactions:
  - Smoother transitions (0.2s ease)
  - Active button states with translateY effect
  - Refined hover states with background changes

#### Removed
- `TextWindow` component - Replaced by PropertyBrowser
- `ViewControls` component - Old horizontal toolbar with icon buttons
- All references to old text-window styling

#### Fixed
- Menu text updated from "Show Text Window" to "Show Property Browser"
- Removed duplicate dev server instances
- Cleared all Vite cache issues

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
