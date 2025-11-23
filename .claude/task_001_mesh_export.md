# Task 001: Implement Basic Mesh Export

**Priority**: 🔴 Critical Path  
**Estimated Time**: 2 days  
**Dependencies**: WASM build system setup  

## Objective
Implement the core mesh data export functionality to enable Three.js to render geometry from the C++ engine.

## Checklist

### C++ Implementation
- [ ] Create `getMeshData()` function in `src/wasm/api/mesh_export.cpp`
- [ ] Add `getTriangleCount()` helper function
- [ ] Add `getTriangleVertices()` to export vertex data
- [ ] Add `getEdgeCount()` helper function  
- [ ] Add `getEdgeVertices()` to export wireframe data
- [ ] Handle memory allocation for large meshes

### Embind Wrapper
- [ ] Add binding in `src/wasm/interface.cpp`:
  ```cpp
  function("getMeshData", &getMeshData)
  function("getTriangleCount", &getTriangleCount)
  function("getTriangleVertices", &getTriangleVertices, allow_raw_pointers())
  ```
- [ ] Test memory transfer with SharedArrayBuffer

### TypeScript Interface
- [ ] Define types in `src/api/types.ts`:
  ```typescript
  interface MeshData {
    vertices: Float32Array;
    normals: Float32Array;
    indices: Uint32Array;
  }
  ```
- [ ] Create wrapper in `src/api/geometry.ts`
- [ ] Add error handling for failed exports

### Three.js Integration
- [ ] Create test component `src/components/MeshViewer.tsx`
- [ ] Test with BufferGeometry:
  ```javascript
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  ```
- [ ] Verify normals for lighting
- [ ] Test with complex model (>10k triangles)

### Documentation
- [ ] Update `API_EXPORTS.md` - mark functions as implemented
- [ ] Add to `CHANGELOG.md` - document new features
- [ ] Write usage example in component

### Testing
- [ ] Unit test for C++ functions
- [ ] Test memory leaks with Valgrind/Chrome DevTools
- [ ] Performance test: measure time for 10k triangle mesh
- [ ] Integration test: load model → export mesh → render

## Success Criteria
- [ ] Can export mesh from loaded .slvs file
- [ ] Three.js successfully renders the geometry
- [ ] No memory leaks detected
- [ ] Export time < 50ms for 10k triangles

## Notes
- Start with simple box model for testing
- Use `Module.HEAPF32` for efficient memory access
- Consider using Web Workers for large models

## Code References
- Original mesh generation: `src/generate.cpp`
- Surface triangulation: `src/srf/surface.cpp`
- Current OpenGL rendering: `src/draw.cpp`

## Status Updates

### Day 1 - [Date]
```
Summary:
- Modified: [files]
- Implemented: [features]
- Status: [progress]
- Next: [next step]
```

### Day 2 - [Date]
```
Summary:
- Modified: [files]
- Implemented: [features]
- Status: [progress]
- Next: [next step]
```

---

**When Complete**: 
- [ ] All checklist items marked
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] File can be moved to `completed/task_001_mesh_export.md`
