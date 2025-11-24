# ODE Geometry Development Guidelines

## 5 Core Rules for Claude

### 1. Before You Start Any Task
- Read `GUIDELINES.md` (this file) & `ODE_GEOMETRY_SPEC.md`
- Check project files: `SolveSpace_Web_Refactoring.md`, `新的three_js架构重新实现solvespace_暴露给wasm的几何引擎函数.md`
- Look for `task_XXX_description.md` or `bug_XXX_description.md` files
- Review current WASM API exposure status
- THEN start coding

### 2. Architecture Compliance
**Always maintain separation:**
- **C++ Core (WASM)**: Pure geometry calculations, no UI, no rendering
- **TypeScript Frontend**: All UI, Three.js rendering, user interaction
- **API Bridge**: Embind bindings only, no direct memory manipulation

**File Structure:**
```
/src/wasm/          # C++ headless engine
/src/api/           # TypeScript API wrappers
/src/components/    # React/Three.js components
/src/state/         # Frontend state management
```

### 3. Clean Code Standards
**C++ (WASM Engine):**
```cpp
// NO comments - code must be self-documenting
class GeometryAPI {
public:
    EntityID addPoint(Vector3 position);     // ✅ Clear naming
    // Adds a point to the model            // ❌ No comments
};
```

**TypeScript (Frontend):**
```typescript
// Self-documenting interfaces
interface MeshData {
  vertices: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
}
```

### 4. Summary After Every Change
After EVERY edit, provide:
```
Summary:
- Modified: [files changed]
- Implemented: [features/fixes added]
- API Changes: [new WASM exports if any]
- Status: [working/testing/blocked]
- Next: [immediate next step]
```

### 5. Documentation & Progress Tracking
**Update these files:**
- `CHANGELOG.md` - APPEND ONLY (newest at top)
- `API_EXPORTS.md` - Track all WASM-exposed functions
- `SPEC.md` - Update implementation status
- Task files - Check off completed items

### 6. Stop Doing List
1. ❌ **Avoid changing any code for geometry engine**
2. ❌ **Keep the same interaction**

---

## Task & Bug Management

### Task Files
User creates: `task_XXX_feature.md`
```markdown
## Task 001: Implement mesh export
- [ ] Create getMeshData() in C++
- [ ] Add Embind wrapper
- [ ] Test with Three.js BufferGeometry
- [ ] Update API_EXPORTS.md
```

### Bug Files
User creates: `bug_XXX_issue.md`
```markdown
## Bug 001: WASM memory leak
Error: OOM after 10 model loads
Location: src/wasm/interface.cpp:45
Reproduces: Always when loading >5MB files
```

---

## WASM-Specific Guidelines

### Memory Management
```cpp
// ALWAYS clean up in WASM
EMSCRIPTEN_BINDINGS(geometry_api) {
    class_<MeshExporter>("MeshExporter")
        .constructor<>()
        .function("getVertices", &MeshExporter::getVertices,
                  allow_raw_pointers())  // Explicitly allow
        .function("cleanup", &MeshExporter::cleanup);
}
```

### Data Transfer Patterns
```typescript
// Frontend: Efficient data retrieval
const vertexCount = api.getVertexCount();
const verticesPtr = api.getVerticesPointer();
const vertices = new Float32Array(
  Module.HEAPF32.buffer,
  verticesPtr,
  vertexCount * 3
);
```

---

## API Implementation Checklist

When implementing new WASM API functions:
1. ✅ Add C++ implementation in `/src/wasm/api/`
2. ✅ Create Embind wrapper in `/src/wasm/interface.cpp`
3. ✅ Add TypeScript types in `/src/api/types.ts`
4. ✅ Create wrapper in `/src/api/geometry.ts`
5. ✅ Test with simple Three.js visualization
6. ✅ Update `API_EXPORTS.md`
7. ✅ Add to CHANGELOG.md

---

## Build & Test Commands

```bash
# WASM Build
cd build-wasm
cmake .. -DHEADLESS=ON -DCMAKE_TOOLCHAIN_FILE=$EMSDK/emscripten.cmake
make -j8

# Frontend
pnpm dev                # Development
pnpm build             # Production build
pnpm test:wasm         # Test WASM API
pnpm test:integration  # Full stack tests
```

---

## What to Tell Claude

### Starting Work
```
"Follow task_001_mesh_export.md"
"Implement getMeshData() API as per SPEC.md"
"Fix bug_001_memory per error log"
```

### During Development
```
"Create Embind wrapper for this function"
"Write TypeScript interface without comments"
"Test with Three.js BufferGeometry"
"Check memory leaks with Chrome DevTools"
```

### After Changes
```
"Summarize what changed"
"Update API_EXPORTS.md with new functions"
"Append to CHANGELOG.md"
"Mark task items complete"
```

---

## Critical API Functions Priority List

**Phase 1 - Must Have (Week 1-2):**
1. `Initialize()` - WASM module setup
2. `LoadModelFromBuffer()` - File loading
3. `GetMeshData()` - Geometry export
4. `GetEdgeData()` - Wireframe export

**Phase 2 - Core Editing (Week 3-4):**
5. `AddPoint()`, `AddLine()`, `AddCircle()`
6. `HitTest()` - Ray casting
7. `DragEntity()` - Real-time manipulation
8. `Solve()` - Constraint solver trigger

**Phase 3 - Advanced (Week 5+):**
9. `AddConstraint()` - All constraint types
10. `Extrude()`, `Revolve()` - Solid operations

---

## Performance Rules

### WASM Optimization
- Pre-allocate buffers for mesh data
- Use SharedArrayBuffer when possible
- Batch geometry updates
- Run solver in Web Worker

### Three.js Optimization
- Use BufferGeometry, not Geometry
- Implement LOD for complex models
- Use instanced rendering for repeated elements
- Dispose of geometries properly

---

## Git Workflow

```bash
# Feature branch
git checkout -b feat/mesh-export

# After implementation
git add -A
git commit -m "feat(wasm): implement mesh data export API"

# If broken
git reset --hard HEAD~1

# Update main
git checkout main
git pull
git merge feat/mesh-export
```

---

## Documentation Structure

### API_EXPORTS.md Format
```markdown
## Geometry Creation
| Function | Status | Test Coverage | Notes |
|----------|--------|---------------|-------|
| addPoint() | ✅ | 100% | Returns EntityID |
| addLine() | 🚧 | 0% | In progress |
```

### CHANGELOG.md Format
```markdown
## [0.2.0] - 2025-01-XX
### Added
- WASM API: getMeshData() function exports triangulated geometry
- Frontend: Three.js mesh renderer component
### Fixed
- Memory leak in geometry buffer allocation
```

---

## Error Handling Pattern

### WASM Side
```cpp
struct Result {
    bool success;
    std::string error;
    val data;
};

Result getMeshData(int groupId) {
    try {
        // Implementation
        return {true, "", meshData};
    } catch (const std::exception& e) {
        return {false, e.what(), val::null()};
    }
}
```

### Frontend Side
```typescript
async function loadMesh(groupId: number): Promise<MeshData> {
  const result = await api.getMeshData(groupId);
  if (!result.success) {
    throw new Error(`Failed to load mesh: ${result.error}`);
  }
  return result.data;
}
```

---

## Golden Rules

✅ **DO:**
- Maintain clean WASM/Frontend separation
- Use Embind for all C++/JS communication  
- Test every API function with Three.js
- Update documentation after each function
- Commit atomic, working changes

❌ **DON'T:**
- Put UI logic in C++ code
- Access WASM memory directly without bounds checking
- Skip error handling in API functions
- Leave console.log or printf debugging
- Modify past CHANGELOG entries

---

## Quick Reference

**Project Structure:**
- Geometry Engine: C++ → WASM (headless, no UI)
- Frontend: TypeScript + React + Three.js
- API Bridge: Embind bindings
- State: Zustand/Redux for UI state

**Key Files to Update:**
- `/src/wasm/interface.cpp` - Embind bindings
- `/src/api/geometry.ts` - TypeScript wrappers
- `API_EXPORTS.md` - Function status tracking
- `CHANGELOG.md` - Version history

**Testing Priority:**
1. API function works in isolation
2. Memory is properly managed
3. Three.js can consume the data
4. Performance meets targets

---

That's your complete guide. Follow this, and we'll build a clean, modern CAD system. 🚀
