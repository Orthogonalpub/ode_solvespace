
## 🎯 Project Mission

Transform **SolveSpace Web** from a monolithic Emscripten port into a modern, decoupled architecture with a headless C++ geometry engine (WASM) and React/Three.js frontend for high-performance browser-based CAD.

---

## 📋 Quick Facts

| | Details |
|---|---------|
| **Name** | ODE Geometry (SolveSpace Web Refactor) |
| **Purpose** | Modern browser-based parametric CAD |
| **Current** | Monolithic C++ → WebGL via Emscripten |
| **Target** | Headless WASM Engine + Three.js Frontend |
| **Stack** | C++ (WASM) + TypeScript + React + Three.js |
| **Build** | CMake + Emscripten + Vite |
| **APIs** | 56 functions across 9 modules |
| **Timeline** | 16 weeks (Phase 1-5) |
| **Status** | Planning → Implementation |

---

## 🏗️ Architecture Transformation

### Current (Monolithic)
```
Browser → Emscripten Glue → C++ UI/Logic → OpenGL → WebGL
         (All logic in C++, including UI rendering)
```

### Target (Decoupled)
```
React UI ←→ Three.js Renderer
    ↕            ↑
Commands    Geometry Data
    ↕            ↑
WASM Geometry Engine (Headless)
```

**Key Change**: C++ becomes pure geometry engine, all UI/rendering moves to JavaScript

---

## 🔧 API Structure (56 Functions)

### Core Modules
1. **System** (5 functions) - Initialize, reset, memory management
2. **File I/O** (8 functions) - Load/save models, import/export formats
3. **Geometry** (10 functions) - Points, lines, circles, splines
4. **Constraints** (11 functions) - Distance, angle, parallel, tangent
5. **Solids** (6 functions) - Extrude, revolve, boolean operations
6. **Interaction** (7 functions) - Hit test, snap, drag
7. **Solver** (4 functions) - Constraint solving, DOF analysis
8. **Rendering** (10 functions) - Mesh/edge data export
9. **Tree** (5 functions) - Entity traversal, groups

**Priority Functions** (Week 1):
- `initialize()` - Start engine
- `loadModelFromBuffer()` - Load files
- `getMeshData()` - Export geometry
- `getEdgeData()` - Export wireframes

---

## 📅 Implementation Timeline

### Phase 1: Infrastructure (Weeks 1-3) 
- Setup HEADLESS build flag
- Create Embind bindings structure
- Initialize React/Three.js project

### Phase 2: Viewer (Weeks 4-5) ✅
- File loading (.slvs format)
- Mesh data export
- Three.js rendering

### Phase 3: Editor (Weeks 6-9) 🚧
- Sketch tools (point, line, circle)
- Constraint system
- Hit testing & drag

### Phase 4: Advanced (Weeks 10-14)
- Solid operations
- Boolean operations
- Undo/redo system

### Phase 5: Polish (Weeks 15-16)
- Performance optimization
- Documentation
- Production release

---

## 📚 Documentation Structure

| File | Purpose | When to Read |
|------|---------|--------------|
| **BRIEF.md** | Project overview (this file) | **READ FIRST** |
| **GUIDELINES.md** | Dev rules & Claude instructions | **READ SECOND** |
| **ODE_GEOMETRY_SPEC.md** | Full technical specification | Reference for APIs |
| **API_EXPORTS.md** | API implementation tracker | Before coding APIs |
| **task_XXX_*.md** | Feature implementation tasks | When building feature |
| **bug_XXX_*.md** | Bug tracking & fixes | When fixing issues |
| **CHANGELOG.md** | Version history | After changes |

### Reference Docs
| File | Content |
|------|---------|
| **SolveSpace_Web_Refactoring.md** | Current architecture analysis |
| **Solvespace目前软件架构.md** | Current code structure |
| **新的three_js架构*.md** | Required API functions list |

---

## ⚡ How to Build

### 1. Setup Environment
```bash
# Install Emscripten
git clone https://github.com/emscripten-core/emsdk.git
./emsdk install latest
./emsdk activate latest

# Clone project
git clone [project-repo]
cd ode-geometry
```

### 2. Build WASM Engine
```bash
mkdir build-wasm && cd build-wasm
cmake .. -DHEADLESS=ON -DCMAKE_TOOLCHAIN_FILE=$EMSDK/emscripten.cmake
make -j8
```

### 3. Build Frontend
```bash
cd frontend
pnpm install
pnpm dev        # Development
pnpm build      # Production
```

---

## 🚀 Getting Started with Claude

```
"Read GUIDELINES.md first, then check for any task_XXX or bug_XXX files.

For new API implementation:
1. Check API_EXPORTS.md for function signature
2. Implement C++ function in /src/wasm/api/
3. Create Embind wrapper
4. Add TypeScript interface
5. Test with Three.js
6. Update API_EXPORTS.md status
7. Append to CHANGELOG.md

Write clean code without comments.
Provide summary after each change."
```

---

## 🎯 Success Criteria

### Week 1 Goals ✅
- [ ] WASM module compiles with HEADLESS flag
- [ ] Basic initialization working
- [ ] Can load .slvs file
- [ ] Can export mesh data

### Week 5 Goals (Viewer)
- [ ] Three.js renders loaded models
- [ ] Camera controls working
- [ ] 60 FPS performance
- [ ] No memory leaks

### Final Goals (Week 16)
- [ ] All 56 API functions implemented
- [ ] Full 2D/3D CAD functionality
- [ ] < 50ms mesh export for 10k triangles
- [ ] < 100ms solver for 100 constraints
- [ ] Complete documentation
- [ ] Production ready

---

## 🔄 Task System

When you see `task_XXX_feature.md`:

### What It Means
- A specific feature to implement
- Has checklist & success criteria
- Updates tracking files when done

### Example
```
task_001_mesh_export.md:
- [ ] Create getMeshData() in C++
- [ ] Add Embind wrapper
- [ ] Test with Three.js
- [ ] Update API_EXPORTS.md
```

---

## 🔑 Key Technical Details

### Memory Management
- Use SharedArrayBuffer for zero-copy
- Explicit cleanup functions required
- Monitor with Chrome DevTools

### Performance Targets
- Mesh export: < 50ms (10k triangles)
- Solver: < 100ms (100 constraints)  
- Hit test: < 5ms per ray
- Maintain 60 FPS

### API Pattern
```cpp
// C++ (WASM)
EMSCRIPTEN_BINDINGS(api) {
    function("getMeshData", &getMeshData);
}

// TypeScript
const meshData = await api.getMeshData(groupId);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', vertices);
```

---

## 📊 Current Status

| Component | Status | Progress |
|-----------|--------|----------|
| **Build System** | 🟡 Setup | CMake config needed |
| **WASM Engine** | 🔴 Planning | 0/56 APIs |
| **Embind Wrapper** | 🔴 Not Started | - |
| **React Frontend** | 🔴 Not Started | - |
| **Three.js Viewer** | 🔴 Not Started | - |
| **Documentation** | 🟢 Complete | Specs ready |

**Next Priority**: 
1. Setup HEADLESS build
2. Implement `initialize()` and `loadModelFromBuffer()`
3. Create first Embind wrapper
4. Test with simple Three.js scene

---

## 📝 Quick Commands

```bash
# Check API status
grep "✅" API_EXPORTS.md | wc -l  # Count implemented

# Test WASM memory
pnpm test:wasm

# Profile performance  
pnpm profile

# Clean build
rm -rf build-wasm && mkdir build-wasm
```

---

## 🚨 Common Issues

### Memory Leaks
- Always call `Module._free()` on pointers
- Dispose Three.js geometries
- See `bug_001_memory_leak.md`

### Build Errors
- Ensure Emscripten is activated
- Check CMake version >= 3.16
- Verify HEADLESS flag set

### Performance
- Use Web Workers for solver
- Implement LOD for complex models
- Profile with Chrome DevTools

---

**Project**: ODE Geometry  
**Phase**: Implementation Start  
**Current Task**: Build system setup  
**Ready**: Yes 🚀