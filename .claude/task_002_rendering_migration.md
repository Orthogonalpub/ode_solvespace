# Task 002: Three.js Rendering System Migration

## Overview

Migrate all rendering features from original SolveSpace C++/OpenGL (4,726 lines) to React/Three.js frontend while keeping WASM geometry engine for calculations only.

**Status**: Planning
**Priority**: High
**Created**: 2025-11-25

---

## Current State Assessment

### Completed (Phase 1 - GUI Foundation ~90%)
- [x] React 18 + Vite + TypeScript setup
- [x] Three.js integration (@react-three/fiber + drei)
- [x] Zustand state management
- [x] WASM module loading & file loading
- [x] Basic mesh rendering (solid faces only)
- [x] Camera controls (OrbitControls)
- [x] UI components (Toolbar, PropertyBrowser, ColorPicker)
- [x] Tooltips, hover effects

### Missing (Phase 2 - Rendering System)
- [ ] Edge/wireframe rendering
- [ ] Point rendering
- [ ] Selection visualization
- [ ] Hit testing/picking
- [ ] Construction geometry differentiation
- [ ] Constraint visualization
- [ ] 2D sketch plane view
- [ ] Rendering abstraction layer

---

## Rendering Features from Original C++ Codebase

### A. Geometry Rendering
| Feature | Status | Priority |
|---------|--------|----------|
| Triangulated Meshes | ✅ Done | - |
| Edges/Wireframes | ❌ | P1 |
| Points | ❌ | P1 |
| Surface Contours | ❌ | P2 |
| Bezier Curves | ❌ | P2 |

### B. Selection & Interaction
| Feature | Status | Priority |
|---------|--------|----------|
| Entity Selection Highlight | ❌ | P1 |
| Hover Effect | ❌ | P1 |
| Hit Testing | ❌ | P1 |
| Multi-Select | ❌ | P2 |
| Snap Points | ❌ | P2 |

### C. Sketch & Construction
| Feature | Status | Priority |
|---------|--------|----------|
| Construction Lines (dashed) | ❌ | P2 |
| Work Plane Grid | ❌ | P2 |
| 2D Orthographic View | ❌ | P2 |
| Point/Line/Circle entities | ❌ | P2 |

### D. Constraint Visualization
| Feature | Status | Priority |
|---------|--------|----------|
| Distance Dimensions | ❌ | P3 |
| Angle Dimensions | ❌ | P3 |
| Constraint Symbols | ❌ | P3 |
| Conflict Indicators | ❌ | P3 |

---

## Required WASM API Extensions

### Tier 1: Basic Rendering (Must Have)
```cpp
// Edge data
int GetEdgeCount(int groupID);
emscripten::val GetEdgeVertices(int groupID);

// Point data
int GetPointCount(int groupID);
emscripten::val GetPointPositions(int groupID);

// Bounding box
emscripten::val GetBoundingBox(int groupID);
```

### Tier 2: Selection/Interaction
```cpp
// Hit testing
emscripten::val HitTest(float rayOx, float rayOy, float rayOz,
                        float rayDx, float rayDy, float rayDz,
                        float tolerance);

// Entity info
emscripten::val GetEntityInfo(int entityID);
emscripten::val GetEntityStyle(int entityID);
```

### Tier 3: Constraints/Sketch
```cpp
int GetConstraintCount();
emscripten::val GetConstraintVisuals(int constraintID);
bool IsConstructionGeometry(int entityID);
emscripten::val GetSketchPlaneInfo(int groupID);
```

---

## Implementation Tasks

### Phase 2A: Rendering Foundation (Week 1-2)

- [ ] **2A.1** Create RenderManager abstraction class
  - Scene management (groups, entities)
  - Mesh/Edge/Point rendering pipeline
  - Dispose/cleanup handling

- [ ] **2A.2** Implement Edge Rendering
  - Add GetEdgeCount/GetEdgeVertices to WASM
  - THREE.LineSegments with LineBasicMaterial
  - Support line width and colors

- [ ] **2A.3** Implement Point Rendering
  - Add GetPointCount/GetPointPositions to WASM
  - THREE.Points with PointsMaterial
  - Different styles for construction points

- [ ] **2A.4** Create Material System
  - Solid face materials (normal, selected, hovered)
  - Edge materials (normal, selected, construction)
  - Point materials (normal, selected, construction)

### Phase 2B: Selection & Interaction (Week 3)

- [ ] **2B.1** Implement Hit Testing
  - THREE.Raycaster integration
  - Optional: WASM HitTest API for accuracy
  - Return closest entity

- [ ] **2B.2** Selection State Management
  - Extend Zustand store with selection state
  - selectedEntities[], hoveredEntity
  - Selection actions

- [ ] **2B.3** Selection Visualization
  - Highlight selected with material swap
  - Outline effect for meshes
  - Hover feedback on mouse move

### Phase 2C: Sketch Geometry (Week 4)

- [ ] **2C.1** Construction Geometry
  - Dashed line material for construction
  - Different color for construction points
  - isConstruction flag in entity data

- [ ] **2C.2** 2D Sketch Plane View
  - Toggle perspective/orthographic camera
  - Align camera to sketch plane
  - Lock rotation in 2D mode

- [ ] **2C.3** Grid & Snap Visualization
  - Grid on active sketch plane
  - Snap point indicators
  - Highlight nearest snap

### Phase 2D: Constraint Visualization (Week 5-6)

- [ ] **2D.1** Constraint Data API
  - Add GetConstraintVisuals to WASM
  - Return type, position, label, value

- [ ] **2D.2** Dimension Line Rendering
  - Lines with arrows
  - Text labels (HTML overlay or canvas)
  - Intelligent positioning

- [ ] **2D.3** Constraint Symbols
  - Icons for parallel, perpendicular, etc.
  - Position at constraint location

### Phase 2E: Optimization (Week 7)

- [ ] **2E.1** Dirty Flagging
  - Track changed groups
  - Only update changed geometry

- [ ] **2E.2** LOD System
  - Simplified meshes for distant objects
  - THREE.LOD class

- [ ] **2E.3** Frustum Culling
  - Skip off-screen geometry

---

## File Structure

```
frontend/src/
├── rendering/
│   ├── RenderManager.ts      # Main coordinator
│   ├── MeshRenderer.ts       # Solid faces
│   ├── EdgeRenderer.ts       # Wireframes
│   ├── PointRenderer.ts      # Points
│   ├── ConstraintRenderer.ts # Constraints
│   ├── HitTester.ts          # Selection
│   ├── materials.ts          # Material defs
│   └── types.ts              # Types
├── components/Viewport/
│   ├── Viewport.tsx          # Canvas (existing)
│   ├── SceneRenderer.tsx     # Uses RenderManager
│   └── SelectionOverlay.tsx  # Selection visuals
└── store/
    └── useGeometryStore.ts   # Extended with selection
```

---

## Success Criteria

### Phase 2A Complete
- [ ] Edges render for all groups
- [ ] Points render at entity positions
- [ ] Material system supports states

### Phase 2B Complete
- [ ] Click to select entities
- [ ] Selection highlights visually
- [ ] Hover effect works

### Phase 2C Complete
- [ ] Construction geometry different style
- [ ] Orthographic view toggle
- [ ] Sketch plane grid visible

### Phase 2D Complete
- [ ] Distance constraints show dimensions
- [ ] Constraint symbols render

### Phase 2E Complete
- [ ] 60fps on complex models
- [ ] Memory stable over time

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 2A | 2 weeks | Edges, points, materials |
| 2B | 1 week | Hit testing, selection |
| 2C | 1 week | Construction, 2D view |
| 2D | 2 weeks | Constraint visualization |
| 2E | 1 week | Optimization |
| **Total** | **7 weeks** | Complete rendering |

---

## Notes

- Start with frontend-only hit testing (faster iteration)
- Use HTML overlay for dimension text (simpler than canvas texture)
- WASM API work can be parallel with frontend development
- Weekly progress reviews recommended
