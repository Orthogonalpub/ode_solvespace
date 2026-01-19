# Task 008: Rendering Performance Optimization

## Overview

Optimize the rendering system for complex models with thousands of entities. Implement dirty flagging, LOD (Level of Detail), frustum culling, and efficient geometry batching.

**Status**: Pending
**Priority**: P3
**Phase**: 2E
**Created**: 2025-11-28
**Depends on**: All previous rendering tasks

---

## Background

As models grow complex, rendering performance degrades due to:
- Re-rendering unchanged geometry
- Too many draw calls
- Rendering off-screen geometry
- High triangle counts for distant objects

SolveSpace handles this with efficient C++ rendering. Our Three.js frontend needs similar optimizations.

---

## Current State

### What We Have
- Basic rendering working
- React Three Fiber automatic render loop
- Individual mesh/line components

### Problems to Solve
- All geometry re-fetched on any change
- Each entity is a separate Three.js object (many draw calls)
- No frustum culling (off-screen objects still processed)
- No LOD for distant geometry

---

## Requirements

### 1. Dirty Flagging
- Track which groups changed
- Only re-fetch changed geometry from WASM
- Reuse unchanged Three.js objects

### 2. Geometry Batching
- Combine multiple entities into single draw calls
- Instance rendering for repeated geometry
- Reduce Three.js object count

### 3. Frustum Culling
- Skip rendering off-screen geometry
- Use bounding boxes for quick tests
- Hierarchical culling for groups

### 4. Level of Detail (LOD)
- Simplified meshes for distant objects
- Reduce curve tessellation when zoomed out
- Progressive detail loading

---

## Implementation Tasks

### Phase 1: Dirty Flagging

- [ ] **8.1** Add change tracking to store
  ```typescript
  interface GeometryState {
    groups: Group[];
    dirtyGroups: Set<number>;  // Group IDs that changed
    version: number;           // Global version counter
  }
  ```

- [ ] **8.2** Implement WASM change notification
  - Track which groups changed in WASM
  - Only fetch dirty group data

- [ ] **8.3** Update renderers to use dirty flags
  - Check if group is dirty before re-creating geometry
  - Cache Three.js objects by group ID

### Phase 2: Geometry Batching

- [ ] **8.4** Batch edge rendering
  - Combine all edges into single BufferGeometry
  - Use vertex colors for per-edge styling
  - Single draw call for all edges

- [ ] **8.5** Batch point rendering
  - Combine all points into single Points object
  - Use vertex attributes for per-point styling

- [ ] **8.6** Use instanced meshes for repeated geometry
  ```typescript
  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    material,
    count
  );
  ```

### Phase 3: Frustum Culling

- [ ] **8.7** Enable automatic frustum culling
  ```typescript
  mesh.frustumCulled = true;  // Default in Three.js
  ```

- [ ] **8.8** Compute and cache bounding boxes
  - Get bounding box from WASM
  - Store in geometry userData

- [ ] **8.9** Implement group-level culling
  - Cull entire groups if bounding box outside frustum
  - Skip WASM calls for culled groups

### Phase 4: Level of Detail

- [ ] **8.10** Implement curve LOD
  - Fewer segments when zoomed out
  - More segments when zoomed in
  - Based on screen-space curve length

- [ ] **8.11** Implement mesh LOD
  ```typescript
  const lod = new THREE.LOD();
  lod.addLevel(highDetailMesh, 0);    // < 10 units away
  lod.addLevel(mediumDetailMesh, 50); // 10-50 units
  lod.addLevel(lowDetailMesh, 100);   // > 50 units
  ```

- [ ] **8.12** Add WASM support for LOD meshes
  - `GetTriangleVertices(groupID, detail: 'high' | 'medium' | 'low')`
  - Pre-computed simplified meshes

### Phase 5: Memory Optimization

- [ ] **8.13** Dispose unused geometries
  - Clean up when groups deleted
  - Track geometry lifecycle

- [ ] **8.14** Use shared materials
  - Single material instance per style
  - Avoid material recreation

- [ ] **8.15** Implement geometry pooling
  - Reuse BufferGeometry objects
  - Reduce garbage collection

---

## Technical Details

### Dirty Flagging System
```typescript
// In store
onGeometryChange(groupId: number) {
  set(state => {
    state.dirtyGroups.add(groupId);
    state.version++;
  });
}

// In renderer
useEffect(() => {
  const dirtyGroups = useGeometryStore(s => s.dirtyGroups);

  dirtyGroups.forEach(groupId => {
    // Re-fetch and re-create only dirty groups
    const newGeometry = fetchGeometry(groupId);
    geometryCache.set(groupId, newGeometry);
  });

  // Clear dirty flags
  useGeometryStore.getState().clearDirtyFlags();
}, [version]);
```

### Batched Edge Rendering
```typescript
function batchEdges(edges: Edge[]): BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];

  edges.forEach(edge => {
    positions.push(
      edge.start.x, edge.start.y, edge.start.z,
      edge.end.x, edge.end.y, edge.end.z
    );
    const color = getEdgeColor(edge);
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

  return geometry;
}

// Usage: single LineSegments object for all edges
<lineSegments geometry={batchedGeometry}>
  <lineBasicMaterial vertexColors />
</lineSegments>
```

### Frustum Culling Check
```typescript
function isInFrustum(bbox: Box3, camera: Camera): boolean {
  const frustum = new Frustum();
  const matrix = new Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);
  return frustum.intersectsBox(bbox);
}
```

### LOD Configuration
```typescript
const LOD_LEVELS = {
  HIGH: { distance: 0, segments: 64, detail: 1.0 },
  MEDIUM: { distance: 50, segments: 32, detail: 0.5 },
  LOW: { distance: 100, segments: 16, detail: 0.25 },
};
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| FPS | 60 | TBD |
| Draw calls | < 100 | TBD |
| Max entities | 10,000 | TBD |
| Max triangles | 100,000 | TBD |
| Geometry update | < 16ms | TBD |
| Memory | < 200MB | TBD |

---

## Profiling Tools

- **Chrome DevTools Performance**: Frame timing, JS execution
- **Three.js Stats**: FPS, draw calls, triangles
- **React DevTools Profiler**: Component render times
- **`renderer.info`**: WebGL stats

```typescript
// Add stats display
import Stats from 'stats.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

// In render loop
stats.update();
```

---

## Success Criteria

- [ ] 60 FPS with 5,000 entities
- [ ] Incremental updates (dirty flagging works)
- [ ] Draw calls < 100 for typical model
- [ ] Memory stable over time (no leaks)
- [ ] Off-screen geometry not rendered
- [ ] Zoomed-out models render efficiently

---

## Files to Create/Modify

| File | Changes |
|------|---------|
| `frontend/src/store/useGeometryStore.ts` | Add dirty flagging |
| `frontend/src/components/Viewport/BatchedEdgeRenderer.tsx` | NEW: Batched edges |
| `frontend/src/components/Viewport/BatchedPointRenderer.tsx` | NEW: Batched points |
| `frontend/src/utils/geometryCache.ts` | NEW: Geometry caching |
| `frontend/src/utils/lodManager.ts` | NEW: LOD management |
| `frontend/src/components/Viewport/Viewport.tsx` | Add stats display |

---

## Estimated Effort

- Dirty flagging: 3 hours
- Geometry batching: 4 hours
- Frustum culling: 2 hours
- LOD system: 4 hours
- Memory optimization: 2 hours
- Profiling & tuning: 3 hours
- **Total**: ~18 hours (2-3 days)
