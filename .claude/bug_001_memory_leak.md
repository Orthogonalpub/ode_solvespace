# Bug 001: WASM Memory Leak on Model Reload

**Severity**: 🔴 Critical  
**Discovered**: 2025-01-XX  
**Environment**: Chrome 120, Firefox 121  
**Status**: 🚧 In Progress  

## Error Log
```
Uncaught RangeError: WebAssembly.Memory(): could not allocate memory
    at geometry.wasm:0x12345
    at Module._loadModelFromBuffer (geometry.js:234:5)
    at GeometryAPI.loadModel (api.ts:45:12)
    
Chrome DevTools Memory:
- Initial: 50 MB
- After 1st load: 120 MB
- After 2nd load: 190 MB
- After 3rd load: 260 MB
- After 10th load: OOM Error
```

## Reproduction Steps
1. Load application
2. Load a model file (>2MB .slvs)
3. Click "New Model" or load another file
4. Repeat 10 times
5. Browser crashes with OOM error

## Expected Behavior
Memory should be freed when loading a new model, maintaining stable memory usage around 120MB.

## Investigation

### Findings
- [ ] Memory allocated in `getMeshData()` not being freed
- [ ] Embind is holding references to old mesh objects
- [ ] `Module._free()` not being called on pointer arrays
- [ ] Three.js geometries not being disposed

### Potential Causes
1. **C++ Side**: Mesh buffers allocated but never deleted
2. **Embind**: Objects not being garbage collected
3. **JS Side**: Float32Arrays holding WASM memory references
4. **Three.js**: Old geometries still in scene graph

## Fix Attempts

### Attempt 1 - Add cleanup function
```cpp
// src/wasm/api/mesh_export.cpp
void cleanupMeshData(int meshId) {
    delete meshBuffers[meshId];
    meshBuffers.erase(meshId);
}
```
**Result**: ❌ Still leaking

### Attempt 2 - Manual memory management
```javascript
// src/api/geometry.ts
const ptr = Module._getVerticesPointer();
const vertices = new Float32Array(Module.HEAPF32.buffer, ptr, count);
// Use vertices...
Module._free(ptr); // Add this
```
**Result**: 🚧 Testing...

### Attempt 3 - Three.js disposal
```javascript
// src/components/MeshViewer.tsx
useEffect(() => {
    return () => {
        geometry.dispose();
        material.dispose();
    };
}, [geometry]);
```
**Result**: ⏳ Not tested yet

## Solution

### Root Cause
[To be determined after investigation]

### Fix Implementation
```cpp
// Code fix here
```

```typescript
// TypeScript fix here
```

### Verification
- [ ] Memory stays stable after 20+ reloads
- [ ] Chrome DevTools shows proper GC
- [ ] No memory growth in heap snapshots
- [ ] Performance profile shows no leaks

## Prevention

### Code Changes
- [ ] Add `cleanup()` method to all WASM API functions
- [ ] Document memory management in GUIDELINES.md
- [ ] Add memory leak test to CI pipeline

### Best Practices
1. Always pair allocate/free in WASM
2. Use RAII in C++ code
3. Dispose Three.js objects explicitly
4. Test with Chrome Memory Profiler

## Test Case
```javascript
// tests/memory-leak.test.js
describe('Memory Management', () => {
    it('should not leak memory on model reload', async () => {
        const initialMemory = performance.memory.usedJSHeapSize;
        
        for (let i = 0; i < 20; i++) {
            await api.loadModel(testModel);
            await api.reset();
        }
        
        // Force GC if available
        if (global.gc) global.gc();
        
        const finalMemory = performance.memory.usedJSHeapSize;
        const growth = finalMemory - initialMemory;
        
        expect(growth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
    });
});
```

## References
- [Emscripten Memory Management](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management)
- [Three.js Memory Management](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)
- Similar issue: [#1234 in original SolveSpace](#)

## Status Updates

### 2025-01-XX
```
Summary:
- Identified leak in getMeshData()
- Added cleanup function (not working yet)
- Next: Test Attempt 2 with manual memory management
```

---

**When Fixed**:
- [ ] Root cause identified
- [ ] Fix implemented and tested
- [ ] No memory leaks in 50+ reload test
- [ ] Documentation updated
- [ ] Move to `resolved/bug_001_memory_leak.md`
