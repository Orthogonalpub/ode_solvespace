# Rendering Data Flow: WASM Geometry Engine → Three.js

This document explains how the WASM geometry engine outputs data and how it drives the Three.js rendering pipeline.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WASM Geometry Engine (C++)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Sketch    │  │    Group    │  │    Mesh     │  │   Outline   │        │
│  │  (SK.*)     │  │  displayMesh│  │  triangles  │  │   edges     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Embind API (geometry_api.cpp)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │GetGroupInfo │  │GetTriangle* │  │GetEdge*     │  │GetPoints*   │        │
│  │GetEntityInfo│  │  Vertices   │  │  Vertices   │  │  WithIds    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          │         Float32Array      Float32Array    Array<PointWithId>
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TypeScript Frontend (React)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │useGeometry  │  │GeometryMesh │  │EdgeRenderer │  │PointRenderer│        │
│  │   Store     │  │  .tsx       │  │   .tsx      │  │    .tsx     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Three.js Rendering                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   State     │  │BufferGeom   │  │LineSegments │  │    Mesh     │        │
│  │  (Zustand)  │  │   + Mesh    │  │             │  │  (Spheres)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. WASM Data Structures (C++ Side)

The geometry engine stores data in these key structures:

```cpp
// src/wasm/geometry_api.cpp

// Groups contain display meshes and outlines
Group* g = SK.GetGroup({groupID});
SMesh* mesh = &g->displayMesh;        // Triangulated solid faces
SOutlineList* outlines = &g->displayOutlines;  // Edge lines

// Entities are sketch elements (points, lines, circles, etc.)
Entity* e = &SK.entity[i];
e->h.v          // Entity ID
e->type         // Entity type (point, line, circle, etc.)
e->IsPoint()    // Check if it's a point
e->PointGetNum() // Get 3D position of point
e->construction  // Is it construction geometry?
```

### Key C++ Classes

| Class | Purpose | Location |
|-------|---------|----------|
| `Sketch (SK)` | Global sketch containing all entities, constraints, groups | `solvespace.h` |
| `Group` | A group of operations (extrude, lathe, etc.) | `sketch.h` |
| `Entity` | Individual geometric entity (point, line, circle) | `sketch.h` |
| `SMesh` | Triangulated mesh for solid display | `mesh.h` |
| `SOutlineList` | List of edge outlines for wireframe | `mesh.h` |

---

## 2. API Functions & Data Formats

### Triangle Data (for solid meshes)

```cpp
// GetTriangleVertices returns Float32Array
// Format: [x1,y1,z1, x2,y2,z2, x3,y3,z3, ...] (9 floats per triangle)

val GetTriangleVertices(int groupID) {
    Group* g = SK.GetGroup({(uint32_t)groupID});
    SMesh* mesh = &g->displayMesh;

    for(int i = 0; i < triangleCount; i++) {
        STriangle* tr = &mesh->l[i];
        // Push vertices for triangle corners a, b, c
        // tr->a.x, tr->a.y, tr->a.z
        // tr->b.x, tr->b.y, tr->b.z
        // tr->c.x, tr->c.y, tr->c.z
    }
    return Float32Array;
}
```

**Data Layout:**
```
Triangle 0: [a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]
Triangle 1: [a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]
...
```

### Normal Data (for lighting)

```cpp
// GetTriangleNormals returns Float32Array
// Format: [nx,ny,nz, nx,ny,nz, nx,ny,nz, ...] (same normal for all 3 vertices of each triangle)

val GetTriangleNormals(int groupID) {
    for(int i = 0; i < triangleCount; i++) {
        STriangle* tr = &mesh->l[i];
        Vector n = tr->Normal();  // Calculate face normal
        // Push same normal 3 times (once per vertex)
    }
}
```

### Edge Data (for wireframes)

```cpp
// GetEdgeVertices returns Float32Array
// Format: [x1,y1,z1, x2,y2,z2, ...] (6 floats per edge - start & end point)

val GetEdgeVertices(int groupID) {
    SOutlineList* outlines = &g->displayOutlines;

    for(int i = 0; i < edgeCount; i++) {
        SOutline* e = &outlines->l[i];
        // Push start point: e->a.x, e->a.y, e->a.z
        // Push end point:   e->b.x, e->b.y, e->b.z
    }
    return Float32Array;
}
```

**Data Layout:**
```
Edge 0: [start.x, start.y, start.z, end.x, end.y, end.z]
Edge 1: [start.x, start.y, start.z, end.x, end.y, end.z]
...
```

### Point Data (for vertices/construction points)

```cpp
// GetPointsWithIds returns array of objects
// Format: [{id, x, y, z, construction}, ...]

val GetPointsWithIds(int groupID) {
    val result = val::array();

    for(int i = 0; i < SK.entity.n; i++) {
        Entity* e = &SK.entity[i];
        if((int)e->group.v == groupID && e->IsPoint()) {
            Vector p = e->PointGetNum();
            val point = val::object();
            point.set("id", (int)e->h.v);
            point.set("x", p.x);
            point.set("y", p.y);
            point.set("z", p.z);
            point.set("construction", e->construction);
            result.call<void>("push", point);
        }
    }
    return result;
}
```

**Data Layout (JavaScript):**
```javascript
[
  { id: 1001, x: 0.0, y: 0.0, z: 0.0, construction: false },
  { id: 1002, x: 10.0, y: 0.0, z: 0.0, construction: false },
  { id: 1003, x: 5.0, y: 5.0, z: 0.0, construction: true },
  ...
]
```

---

## 3. Frontend Rendering Components

### GeometryMesh.tsx (Solid Faces)

**Purpose:** Renders triangulated solid bodies as 3D meshes.

```typescript
// frontend/src/components/Viewport/GeometryMesh.tsx

useEffect(() => {
  groups.forEach((group) => {
    // Fetch triangle data from WASM
    const vertices = wasmModule.GetTriangleVertices(group.id);
    const normals = wasmModule.GetTriangleNormals(group.id);

    // Create Three.js BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

    // Store for rendering
    newMeshes.push(geometry);
  });
}, [wasmModule, groups]);

// Render
return (
  <>
    {meshGeometries.map((geometry, index) => (
      <mesh key={index} geometry={geometry} material={meshMaterial} />
    ))}
  </>
);
```

### EdgeRenderer.tsx (Wireframe Lines)

**Purpose:** Renders outline edges as line segments.

```typescript
// frontend/src/components/Viewport/EdgeRenderer.tsx

useEffect(() => {
  groups.forEach((group) => {
    // Fetch edge data from WASM
    const edgeVertices = wasmModule.GetEdgeVertices(group.id);

    // Create line geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(edgeVertices, 3));

    newGeometries.push(geometry);
  });
}, [wasmModule, groups]);

// Render as line segments
return (
  <>
    {edgeGeometries.map((geometry, index) => (
      <lineSegments key={index} geometry={geometry} material={edgeMaterial} />
    ))}
  </>
);
```

### PointRenderer.tsx (Points with Selection)

**Purpose:** Renders points as small spheres with selection/hover support.

```typescript
// frontend/src/components/Viewport/PointRenderer.tsx

useEffect(() => {
  groups.forEach((group) => {
    // Fetch points WITH entity IDs (for selection)
    const pointsWithIds = wasmModule.GetPointsWithIds(group.id);

    pointsWithIds.forEach((p: PointWithId) => {
      allPoints.push({
        id: p.id,
        position: new THREE.Vector3(p.x, p.y, p.z),
        construction: p.construction,
      });
    });
  });
}, [wasmModule, groups]);

// Render each point as a mesh (for raycaster hit detection)
return (
  <group>
    {points.map((point) => (
      <SelectablePoint
        key={point.id}
        point={point}
        isSelected={selectedEntities.includes(point.id)}
        isHovered={hoveredEntity === point.id}
      />
    ))}
  </group>
);

// Individual point component
function SelectablePoint({ point, isSelected, isHovered }) {
  const color = isHovered ? HOVERED : isSelected ? SELECTED : NORMAL;

  return (
    <mesh
      position={[point.position.x, point.position.y, point.position.z]}
      userData={{ entityId: point.id }}  // Critical for hit detection!
    >
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
```

---

## 4. Selection System Flow

```
┌──────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  User Click  │────▶│ InteractionManager │────▶│    Raycaster    │
└──────────────┘     └───────────────────┘     └────────┬────────┘
                                                        │
                                                        ▼
                                               Find mesh with
                                               userData.entityId
                                                        │
                                                        ▼
                                    ┌───────────────────────────────────┐
                                    │ useGeometryStore.selectEntity(id) │
                                    └───────────────────┬───────────────┘
                                                        │
                                                        ▼
                                    ┌───────────────────────────────────┐
                                    │   selectedEntities state updates  │
                                    └───────────────────┬───────────────┘
                                                        │
                                                        ▼
                                    ┌───────────────────────────────────┐
                                    │  PointRenderer re-renders with    │
                                    │  different color for selected     │
                                    └───────────────────────────────────┘
```

### InteractionManager.tsx

```typescript
// frontend/src/components/Viewport/InteractionManager.tsx

const handleMouseDown = useCallback((event: MouseEvent) => {
  if (event.button === 0) {  // Left click
    const ndc = screenToNDC(event.clientX, event.clientY);
    const intersections = findIntersections(ndc);

    if (intersections.length > 0) {
      const first = intersections[0];
      const entityId = first.object.userData?.entityId;

      if (entityId !== undefined) {
        if (event.shiftKey) {
          selectEntity(entityId);  // Add to selection
        } else {
          deselectAll();
          selectEntity(entityId);  // Replace selection
        }
      }
    } else if (!event.shiftKey) {
      deselectAll();  // Click on empty space
    }
  }
}, [...]);
```

---

## 5. Data Refresh Cycle

When geometry changes (load file, create entity, modify, etc.):

```typescript
// Triggered by: file load, entity creation, constraint solving, etc.
useGeometryStore.refreshGeometry()
    │
    ├── loadGroups()
    │       │
    │       └── for i in 0..GetGroupCount():
    │               GetGroupInfo(i) → { id, name, visible, order }
    │
    └── state.groups = newGroups
            │
            │  (React detects groups change)
            │
            ├── GeometryMesh useEffect triggers
            │       └── GetTriangleVertices(group.id)
            │       └── GetTriangleNormals(group.id)
            │
            ├── EdgeRenderer useEffect triggers
            │       └── GetEdgeVertices(group.id)
            │
            └── PointRenderer useEffect triggers
                    └── GetPointsWithIds(group.id)
```

---

## 6. Summary Table

| Data Type | WASM Function | Return Format | Three.js Object | File |
|-----------|---------------|---------------|-----------------|------|
| Solid Faces | `GetTriangleVertices` | `Float32Array [x,y,z,...]` | `<mesh>` with BufferGeometry | GeometryMesh.tsx |
| Normals | `GetTriangleNormals` | `Float32Array [nx,ny,nz,...]` | BufferAttribute | GeometryMesh.tsx |
| Edges | `GetEdgeVertices` | `Float32Array [x1,y1,z1,x2,y2,z2,...]` | `<lineSegments>` | EdgeRenderer.tsx |
| Points | `GetPointsWithIds` | `Array<{id,x,y,z,construction}>` | `<mesh>` spheres | PointRenderer.tsx |
| Groups | `GetGroupInfo` | `{id, name, visible, order}` | Controls visibility | useGeometryStore.ts |
| Entities | `GetEntityInfoByIndex` | `{id, type, groupID, construction}` | Metadata for selection | useGeometryStore.ts |

---

## 7. File Locations

### C++ (WASM)
- `src/wasm/geometry_api.h` - API function declarations
- `src/wasm/geometry_api.cpp` - API implementations + Embind bindings

### TypeScript (Frontend)
- `frontend/src/types/geometry.ts` - TypeScript interfaces for WASM data
- `frontend/src/store/useGeometryStore.ts` - Zustand store, calls WASM API
- `frontend/src/components/Viewport/GeometryMesh.tsx` - Solid mesh rendering
- `frontend/src/components/Viewport/EdgeRenderer.tsx` - Wireframe rendering
- `frontend/src/components/Viewport/PointRenderer.tsx` - Point rendering with selection
- `frontend/src/components/Viewport/InteractionManager.tsx` - Mouse interaction

---

## 8. Adding New Geometry Types

To add a new geometry type (e.g., curves, constraints):

1. **C++ Side:**
   ```cpp
   // In geometry_api.h
   emscripten::val GetCurveData(int groupID);

   // In geometry_api.cpp
   val GetCurveData(int groupID) {
       // Extract curve data from SolveSpace
       // Return as Float32Array or object array
   }

   // In EMSCRIPTEN_BINDINGS
   function("GetCurveData", &GeometryAPI::GetCurveData);
   ```

2. **TypeScript Side:**
   ```typescript
   // In types/geometry.ts
   export interface CurveData {
       controlPoints: Float32Array;
       degree: number;
   }

   // In WASMModule interface
   GetCurveData: (groupID: GroupID) => CurveData;
   ```

3. **Renderer Component:**
   ```typescript
   // Create frontend/src/components/Viewport/CurveRenderer.tsx
   export function CurveRenderer() {
       const wasmModule = useGeometryStore(state => state.wasmModule);
       // Fetch and render curves
   }
   ```

4. **Add to Viewport:**
   ```typescript
   // In Viewport.tsx
   <CurveRenderer />
   ```
