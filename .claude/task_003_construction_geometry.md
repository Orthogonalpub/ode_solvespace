# Task 003: Construction Geometry Visualization

## Overview

Implement visual differentiation for construction geometry (dashed lines, distinct colors) to distinguish construction entities from regular geometry in the viewport.

**Status**: Pending
**Priority**: P1
**Phase**: 2C.1
**Created**: 2025-11-28
**Depends on**: Task 002 (Rendering Migration) - Completed

---

## Background

In CAD applications, construction geometry serves as reference lines/points that help define the design but are not part of the final output. SolveSpace uses:
- **Dashed lines** for construction edges
- **Cyan color** (`#00ffff`) for construction entities
- Construction geometry is excluded from exports (STL, STEP, etc.)

Currently, our renderers treat all geometry the same. We need to visually differentiate construction geometry.

---

## Current State

### What We Have
- `PointRenderer.tsx` already handles `construction` flag from `GetPointsWithIds`
- `SolveSpaceColors.CONSTRUCTION` defined as `#1ab31a` (green)
- `LineDashedMaterial` available in Three.js
- `StipplePatterns` defined in `colors.ts`

### What's Missing
- Edge renderer doesn't distinguish construction vs regular edges
- No WASM API to get construction flag for edges
- No dashed line rendering for edges

---

## Requirements

### 1. WASM API Extension
```cpp
// Add to geometry_api.cpp
val GetEdgesWithIds(int groupID);
// Returns: Array<{id, startX, startY, startZ, endX, endY, endZ, construction}>
```

### 2. Edge Renderer Update
- Separate construction edges from regular edges
- Render construction edges with `LineDashedMaterial`
- Use `SolveSpaceColors.CONSTRUCTION` color

### 3. Point Renderer (Already Done)
- ✅ Construction points already use different color

---

## Implementation Tasks

- [ ] **3.1** Add `GetEdgesWithIds` to WASM API
  - Return edge data with entity ID and construction flag
  - Similar pattern to `GetPointsWithIds`

- [ ] **3.2** Update `EdgeRenderer.tsx`
  - Fetch edges with IDs and construction flags
  - Separate into two geometry groups
  - Regular edges: `LineBasicMaterial` with solid line
  - Construction edges: `LineDashedMaterial` with dashed pattern

- [ ] **3.3** Update mock data
  - Add construction edges to `mockGeometryData.ts`
  - Test visual differentiation

- [ ] **3.4** Verify colors match SolveSpace
  - Construction: cyan/green dashed
  - Regular: solid dark gray

---

## Technical Details

### Three.js Dashed Lines
```typescript
// LineDashedMaterial requires computeLineDistances()
const material = new THREE.LineDashedMaterial({
  color: SolveSpaceColors.CONSTRUCTION,
  dashSize: 0.1,
  gapSize: 0.05,
});

// After creating geometry
lineSegments.computeLineDistances();
```

### Edge Data Structure
```typescript
interface EdgeWithId {
  id: number;
  start: { x: number; y: number; z: number };
  end: { x: number; y: number; z: number };
  construction: boolean;
}
```

---

## Success Criteria

- [ ] Construction edges render with dashed lines
- [ ] Construction edges use distinct color (cyan/green)
- [ ] Regular edges remain solid
- [ ] Mock data demonstrates both types
- [ ] No performance regression

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/wasm/geometry_api.cpp` | Add `GetEdgesWithIds` function |
| `src/wasm/geometry_api.h` | Declare `GetEdgesWithIds` |
| `frontend/src/components/Viewport/EdgeRenderer.tsx` | Handle construction edges |
| `frontend/src/utils/mockGeometryData.ts` | Add construction edge data |
| `frontend/src/types/geometry.ts` | Add `EdgeWithId` type |

---

## Estimated Effort

- WASM API: 1 hour
- EdgeRenderer update: 2 hours
- Mock data + testing: 1 hour
- **Total**: ~4 hours
