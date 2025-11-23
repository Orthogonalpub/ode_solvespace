# Technical Specification

## Project: ODE Geometry - SolveSpace Web

### Executive Summary

A complete architectural refactoring of SolveSpace Web, transitioning from a monolithic Emscripten port to a modern, decoupled architecture with a headless C++ geometry engine (WASM) and a React/Three.js frontend.

### Technology Stack

#### Frontend

- **Framework**: React 18 / Vue 3 (TBD)
- **3D Rendering**: Three.js
- **Language**: TypeScript
- **State Management**: Zustand / Redux Toolkit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library

#### Backend (Geometry Engine)

- **Core Language**: C++ (existing SolveSpace kernel)
- **Compilation**: Emscripten (WASM target)
- **Memory Model**: SharedArrayBuffer for zero-copy data transfer
- **API Binding**: Embind for C++/JS interop
- **Build System**: CMake

#### Infrastructure

- **Hosting**: Vercel / Cloudflare Pages
- **CDN**: Cloudflare for WASM binary delivery
- **Storage**: IndexedDB for local file persistence
- **Package Manager**: pnpm
- **Version Control**: Git with conventional commits

---

## Architecture Overview

### Current Architecture (Monolithic)

```
Browser → Emscripten Glue → C++ UI/Logic → OpenGL → WebGL
```

### Target Architecture (Decoupled)

```
React UI → Three.js Renderer
    ↓            ↑
  Commands    Geometry Data
    ↓            ↑
  WASM Geometry Engine (Headless)
```

---

## API Structure

### Core API Modules

#### 1. System Management

**Namespace**: `ODE.System`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`initialize()`|`config?: SystemConfig`|`Promise<void>`|Initialize WASM module and geometry kernel|
|`reset()`|-|`void`|Clear all geometry and reset to empty state|
|`getVersion()`|-|`string`|Return engine version|
|`setUnits()`|`units: 'mm' \| 'inch'`|`void`|Set measurement units|
|`getMemoryUsage()`|-|`MemoryStats`|Get current memory statistics|

#### 2. File I/O

**Namespace**: `ODE.File`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`loadModel()`|`buffer: ArrayBuffer`|`Promise<ModelData>`|Load .slvs file from buffer|
|`saveModel()`|`format?: 'slvs' \| 'step'`|`ArrayBuffer`|Export current model|
|`importSTEP()`|`buffer: ArrayBuffer`|`Promise<void>`|Import STEP file|
|`exportSTL()`|`options: STLOptions`|`ArrayBuffer`|Export as STL mesh|
|`exportDXF()`|`groupId: number`|`ArrayBuffer`|Export 2D sketch as DXF|

#### 3. Geometry Creation

**Namespace**: `ODE.Geometry`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`addPoint()`|`coords: Vector3`|`EntityID`|Create a 3D point|
|`addLine()`|`p1: EntityID, p2: EntityID`|`EntityID`|Create line between points|
|`addCircle()`|`center: EntityID, normal: Vector3, radius: number`|`EntityID`|Create circle|
|`addArc()`|`center: EntityID, start: EntityID, end: EntityID`|`EntityID`|Create arc|
|`addSpline()`|`points: EntityID[], degree?: number`|`EntityID`|Create B-spline|
|`addWorkplane()`|`origin: Vector3, normal: Vector3`|`GroupID`|Create new sketch plane|

#### 4. Constraints System

**Namespace**: `ODE.Constraints`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`addDistance()`|`e1: EntityID, e2: EntityID, value: number`|`ConstraintID`|Distance constraint|
|`addAngle()`|`e1: EntityID, e2: EntityID, degrees: number`|`ConstraintID`|Angle constraint|
|`addParallel()`|`e1: EntityID, e2: EntityID`|`ConstraintID`|Parallel constraint|
|`addPerpendicular()`|`e1: EntityID, e2: EntityID`|`ConstraintID`|Perpendicular constraint|
|`addCoincident()`|`e1: EntityID, e2: EntityID`|`ConstraintID`|Coincident constraint|
|`addTangent()`|`e1: EntityID, e2: EntityID`|`ConstraintID`|Tangent constraint|
|`addSymmetric()`|`e1: EntityID, e2: EntityID, axis: EntityID`|`ConstraintID`|Symmetric constraint|
|`setConstraintValue()`|`id: ConstraintID, value: number`|`void`|Update constraint parameter|

#### 5. Solid Operations

**Namespace**: `ODE.Solid`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`extrude()`|`sketch: GroupID, distance: number`|`GroupID`|Extrude sketch|
|`revolve()`|`sketch: GroupID, axis: EntityID, angle: number`|`GroupID`|Revolve sketch|
|`loft()`|`sketches: GroupID[]`|`GroupID`|Loft between sketches|
|`boolean()`|`type: 'union' \| 'difference' \| 'intersection', g1: GroupID, g2: GroupID`|`GroupID`|Boolean operation|
|`fillet()`|`edges: EntityID[], radius: number`|`void`|Apply fillet|
|`chamfer()`|`edges: EntityID[], distance: number`|`void`|Apply chamfer|

#### 6. Interaction Helpers

**Namespace**: `ODE.Interaction`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`hitTest()`|`ray: Ray, filter?: EntityType[]`|`HitResult`|Raycast against geometry|
|`snapToGrid()`|`point: Vector2, gridSize: number`|`Vector2`|Snap to nearest grid point|
|`snapToEntity()`|`point: Vector3, tolerance: number`|`SnapResult`|Find nearest snap point|
|`dragEntity()`|`id: EntityID, delta: Vector3`|`void`|Drag entity (real-time)|
|`getHoverInfo()`|`id: EntityID`|`EntityInfo`|Get entity details for tooltip|

#### 7. Solver Operations

**Namespace**: `ODE.Solver`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`solve()`|`options?: SolverOptions`|`SolverResult`|Run constraint solver|
|`getDOF()`|`groupId?: GroupID`|`number`|Get degrees of freedom|
|`getConflicts()`|-|`ConstraintID[]`|Get conflicting constraints|
|`relaxConstraint()`|`id: ConstraintID`|`void`|Temporarily disable constraint|

#### 8. Rendering Data Access

**Namespace**: `ODE.Render`

|Function|Parameters|Returns|Description|
|---|---|---|---|
|`getMeshData()`|`groupId: GroupID`|`MeshData`|Get triangulated mesh|
|`getEdgeData()`|`groupId: GroupID`|`EdgeData`|Get edge/wireframe data|
|`getNormals()`|`groupId: GroupID`|`Float32Array`|Get vertex normals|
|`getConstraintVisuals()`|-|`ConstraintVisual[]`|Get constraint annotations|
|`getBoundingBox()`|`entities?: EntityID[]`|`BoundingBox`|Calculate AABB|
|`getTesselation()`|`entity: EntityID, tolerance: number`|`Float32Array`|Get curve tessellation|

---

## Data Types

### Core Types

```typescript
type EntityID = number;
type GroupID = number;
type ConstraintID = number;
type Vector3 = { x: number; y: number; z: number };
type Vector2 = { x: number; y: number };
type Ray = { origin: Vector3; direction: Vector3 };

interface MeshData {
  vertices: Float32Array;      // x,y,z triplets
  normals: Float32Array;       // nx,ny,nz triplets  
  indices: Uint32Array;        // triangle indices
  colors?: Float32Array;       // r,g,b,a quadruplets
}

interface EdgeData {
  vertices: Float32Array;      // line segment vertices
  colors?: Float32Array;       // per-vertex colors
}

interface HitResult {
  hit: boolean;
  entityId?: EntityID;
  point?: Vector3;
  distance?: number;
  normal?: Vector3;
}

interface SnapResult {
  snapped: boolean;
  point: Vector3;
  entityId?: EntityID;
  type: 'endpoint' | 'midpoint' | 'center' | 'intersection' | 'grid';
}

interface SolverResult {
  success: boolean;
  iterations: number;
  error?: number;
  failedConstraints?: ConstraintID[];
}

interface EntityInfo {
  id: EntityID;
  type: 'point' | 'line' | 'circle' | 'arc' | 'spline' | 'face';
  group: GroupID;
  construction: boolean;
  selected: boolean;
  parameters: Record<string, number>;
}
```

---

## Frontend Components

### 3D Viewport

**Path**: `src/components/Viewport/` **Responsibilities**:

- Three.js scene management
- Camera controls (orbit, pan, zoom)
- Render loop optimization
- Selection highlighting
- Grid and axis helpers

### Toolbar

**Path**: `src/components/Toolbar/` **Categories**:

- **Sketch Tools**: Point, Line, Circle, Arc, Spline, Rectangle, Polygon
- **Constraint Tools**: Distance, Angle, Parallel, Perpendicular, Tangent
- **Solid Tools**: Extrude, Revolve, Loft, Boolean operations
- **Modify Tools**: Move, Rotate, Scale, Mirror, Array

### Property Panel

**Path**: `src/components/PropertyPanel/` **Features**:

- Entity properties editor
- Constraint value input
- Material assignment
- Layer management

### Browser Tree

**Path**: `src/components/BrowserTree/` **Structure**:

- Groups/Sketches hierarchy
- Entity listing per group
- Constraint listing
- Visibility toggles
- Context menus

### Command Palette

**Path**: `src/components/CommandPalette/` **Features**:

- Fuzzy search for commands
- Keyboard shortcuts display
- Recent commands history
- Command chaining support

---

## State Management

### Application State

```typescript
interface AppState {
  // Document
  document: {
    id: string;
    name: string;
    modified: boolean;
    units: 'mm' | 'inch';
  };
  
  // Selection
  selection: {
    entities: EntityID[];
    constraints: ConstraintID[];
    groups: GroupID[];
  };
  
  // Tool
  activeTool: {
    type: ToolType;
    state: 'idle' | 'active' | 'preview';
    tempEntities: EntityID[];
  };
  
  // View
  viewport: {
    camera: CameraState;
    grid: GridSettings;
    rendering: RenderSettings;
  };
  
  // History
  history: {
    past: Command[];
    future: Command[];
    recording: boolean;
  };
}
```

### Command Pattern

```typescript
interface Command {
  id: string;
  type: CommandType;
  execute(): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
  canExecute(): boolean;
}
```

---

## Performance Optimization

### WASM Optimization

- **SharedArrayBuffer**: Zero-copy mesh data transfer
- **Memory Pooling**: Pre-allocated geometry buffers
- **Lazy Loading**: Load WASM module on-demand
- **Web Workers**: Solver runs in worker thread

### Rendering Optimization

- **Level of Detail (LOD)**: Simplified meshes for distant objects
- **Frustum Culling**: Skip rendering off-screen geometry
- **Instanced Rendering**: Batch similar geometry
- **Dirty Flagging**: Only re-tessellate modified geometry

### Interaction Optimization

- **Debounced Solving**: Delay solver during drag operations
- **Preview Mode**: Show wireframe during complex operations
- **Spatial Indexing**: Octree for fast hit testing
- **Incremental Updates**: Only send changed data to WASM

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-3)

- [ ] Setup build pipeline (CMake + Emscripten)
- [ ] Create HEADLESS build configuration
- [ ] Implement Embind API bindings
- [ ] Setup React/Vite project structure
- [ ] Integrate Three.js viewport

**Deliverable**: Basic WASM module loadable in browser

### Phase 2: Viewer Implementation (Weeks 4-5)

- [ ] Implement file loading (`.slvs` format)
- [ ] Export mesh data functions
- [ ] Create Three.js mesh renderer
- [ ] Add camera controls
- [ ] Implement selection system

**Deliverable**: Read-only 3D model viewer

### Phase 3: Basic Editing (Weeks 6-9)

- [ ] Implement sketch tools (point, line, circle)
- [ ] Add constraint system UI
- [ ] Implement hit testing and snapping
- [ ] Add drag functionality
- [ ] Create property panel

**Deliverable**: Basic 2D sketching capability

### Phase 4: Advanced Features (Weeks 10-14)

- [ ] Implement solid operations (extrude, revolve)
- [ ] Add boolean operations
- [ ] Implement undo/redo system
- [ ] Add dimension annotations
- [ ] Create toolbar and menus

**Deliverable**: Feature-complete CAD editor

### Phase 5: Polish & Optimization (Weeks 15-16)

- [ ] Performance profiling and optimization
- [ ] Add keyboard shortcuts
- [ ] Implement auto-save
- [ ] Create onboarding tutorial
- [ ] Write documentation

**Deliverable**: Production-ready application

---

## Testing Strategy

### Unit Tests

- **Geometry Engine**: Test each API function
- **Constraint Solver**: Test solver convergence
- **File I/O**: Test import/export formats

### Integration Tests

- **API Communication**: Test JS ↔ WASM bridge
- **State Synchronization**: Test frontend ↔ backend sync
- **Command System**: Test undo/redo chains

### E2E Tests

- **User Workflows**: Test complete modeling tasks
- **Performance**: Test with complex models
- **Browser Compatibility**: Test on Chrome, Firefox, Safari

---

## Security Considerations

### WASM Security

- Validate all input buffers before passing to WASM
- Implement memory bounds checking
- Use Content Security Policy headers

### File Handling

- Validate file formats before parsing
- Limit file size uploads
- Scan for malicious patterns

---

## Browser Requirements

### Minimum Requirements

- **Chrome**: 91+ (SharedArrayBuffer support)
- **Firefox**: 89+ (SharedArrayBuffer support)
- **Safari**: 15.2+ (SharedArrayBuffer support)
- **Edge**: 91+ (Chromium-based)

### Required Web APIs

- WebAssembly
- SharedArrayBuffer
- WebGL 2.0
- IndexedDB
- Web Workers

---

## Deployment

### Build Pipeline

```yaml
stages:
  - build-wasm:
      - Configure CMake with HEADLESS flag
      - Compile with Emscripten
      - Optimize with wasm-opt
      
  - build-frontend:
      - Install dependencies (pnpm)
      - Type check (tsc)
      - Build with Vite
      - Generate source maps
      
  - deploy:
      - Upload to CDN
      - Deploy to Vercel/Cloudflare
      - Invalidate cache
```

### Environment Variables

```env
VITE_WASM_URL=https://cdn.example.com/geometry-engine.wasm
VITE_API_ENDPOINT=https://api.example.com
VITE_TELEMETRY_KEY=analytics-key
```

---

## Monitoring & Analytics

### Performance Metrics

- WASM load time
- Solver execution time
- Frame rate (FPS)
- Memory usage
- File load/save time

### User Analytics

- Tool usage frequency
- Common workflows
- Error tracking
- Feature adoption

---

## License & Attribution

### Core Engine

- Original SolveSpace: GPLv3
- WASM Bindings: GPLv3
- Three.js: MIT

### Frontend

- React Components: MIT
- Custom UI Code: MIT

---

## Status

**Project Start**: January 2025  
**Current Phase**: Planning  
**Target Release**: Q2 2025  
**Version**: 0.1.0-alpha

### Completed

- [x] Architecture design
- [x] API specification
- [x] Technology stack selection

### In Progress

- [ ] Build system setup
- [ ] WASM module compilation
- [ ] API implementation

### Pending

- [ ] Frontend development
- [ ] Testing suite
- [ ] Documentation
- [ ] Deployment pipeline