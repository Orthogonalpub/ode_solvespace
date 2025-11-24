# ODE Geometry Development Guidelines for Gemini

## 5 Core Rules for Gemini

### 1. Before You Start Any Task
- Read `GEMINI_GUIDELINES.md` (this file) & `.claude/ODE_GEOMETRY_SPEC.md`
- **Read `COLLABORATION.md`** for multi-agent protocols.
- Check project files: `TASKS.md` (Shared Task List), `PHASE1_SUMMARY.md`
- Look for `task_XXX_description.md` or `bug_XXX_description.md` files (if referenced)
- Review current WASM API exposure status in `.claude/API_EXPORTS.md`
- THEN start coding

### 2. Architecture Compliance
**Always maintain separation:**
- **C++ Core (WASM)**: Pure geometry calculations, no UI, no rendering. Located in `src/wasm/`.
- **TypeScript Frontend**: All UI, Three.js rendering, user interaction. Located in `frontend/`.
- **API Bridge**: Embind bindings only, no direct memory manipulation. Located in `src/wasm/geometry_api.cpp`.

**File Structure:**
```
/src/wasm/          # C++ headless engine & API bindings
/frontend/src/api/  # TypeScript API wrappers
/frontend/src/components/ # React/Three.js components
/frontend/src/store/      # Frontend state management
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
After EVERY significant edit or task completion, provide a summary in the chat or `task.md` update:
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
- `.claude/API_EXPORTS.md` - Track all WASM-exposed functions
- `task.md` - Check off completed items

### 6. Stop Doing List
1. ❌ **Avoid changing any code for geometry engine**
2. ❌ **Keep the same interaction**

---

## Task & Bug Management

### Task Files
Use `task.md` for tracking progress. Break down complex tasks into sub-tasks.

### Bug Files
If a bug is complex, create a reproduction case or description file (e.g., `bug_repro.md`) to track details.

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
1. ✅ Add C++ implementation in `src/wasm/geometry_api.cpp` (or helper classes)
2. ✅ Create Embind wrapper in `src/wasm/geometry_api.cpp`
3. ✅ Add TypeScript types in `frontend/src/types/geometry.ts` (or similar)
4. ✅ Create wrapper in `frontend/src/api/`
5. ✅ Test with simple Three.js visualization
6. ✅ Update `.claude/API_EXPORTS.md`
7. ✅ Add to `CHANGELOG.md`

---

## Build & Test Commands

```bash
# WASM Build
cd build_wasm
cmake .. -DENABLE_HEADLESS=ON -DCMAKE_TOOLCHAIN_FILE=$EMSDK/emscripten.cmake
make -j8

# Frontend
cd frontend
npm run dev            # Development
npm run build          # Production build
```

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
- State: Zustand for UI state

**Key Files to Update:**
- `src/wasm/geometry_api.cpp` - Embind bindings & Implementation
- `frontend/src/api/` - TypeScript wrappers
- `.claude/API_EXPORTS.md` - Function status tracking
- `CHANGELOG.md` - Version history

**Testing Priority:**
1. API function works in isolation
2. Memory is properly managed
3. Three.js can consume the data
4. Performance meets targets
