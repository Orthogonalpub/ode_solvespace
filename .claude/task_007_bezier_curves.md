# Task 007: Bezier Curve Rendering

## Overview

Implement smooth Bezier curve rendering for circles, arcs, and splines. Currently, curved geometry is approximated as line segments. This task adds proper smooth curve visualization.

**Status**: Pending
**Priority**: P2
**Phase**: 2A (Extended)
**Created**: 2025-11-28
**Depends on**: Task 002 (Rendering Migration)

---

## Background

SolveSpace stores curves as mathematical Bezier representations:
- **Circles**: Approximated as multiple cubic Bezier segments
- **Arcs**: Portion of circle as Bezier
- **Splines**: Native cubic B-spline curves

Currently, our rendering tessellates curves into line segments in WASM. For better visual quality and smoother interaction, we should:
1. Keep tessellation for solid geometry (meshes)
2. Add smooth curve rendering for sketch entities

---

## Current State

### What We Have
- `EdgeRenderer.tsx` renders line segments from WASM
- WASM `GetEdgeVertices` returns tessellated lines
- Three.js has `QuadraticBezierCurve3` and `CubicBezierCurve3`

### What's Missing
- No WASM API for Bezier control points
- No curve rendering in Three.js
- No adaptive tessellation based on zoom

---

## Requirements

### 1. WASM API for Curves
```cpp
val GetBezierCurves(int groupID);
// Returns: Array<{
//   type: 'quadratic' | 'cubic',
//   controlPoints: number[],  // [x1,y1,z1, x2,y2,z2, ...]
//   entityId: number
// }>
```

### 2. Curve Rendering Options

**Option A: Client-side tessellation (Recommended)**
- Get Bezier control points from WASM
- Tessellate in JavaScript based on zoom level
- Render as line segments

**Option B: Three.js native curves**
- Use `CatmullRomCurve3` or `CubicBezierCurve3`
- Create tube geometry or line from curve
- More complex, better quality

### 3. Adaptive Detail
- More segments when zoomed in
- Fewer segments when zoomed out
- Maintain smooth appearance

---

## Implementation Tasks

### Phase 1: WASM API

- [ ] **7.1** Add `GetBezierCurves` to WASM
  - Extract Bezier data from SolveSpace entities
  - Return control points and curve type

- [ ] **7.2** Add curve entity types
  ```cpp
  // Return curve info including:
  // - Curve degree (2=quadratic, 3=cubic)
  // - Control points array
  // - Entity ID for selection
  ```

### Phase 2: Curve Rendering

- [ ] **7.3** Create `CurveRenderer.tsx` component
  - Fetch Bezier data from WASM
  - Tessellate curves client-side
  - Render as line segments

- [ ] **7.4** Implement adaptive tessellation
  ```typescript
  function tessellatebezier(
    controlPoints: Vector3[],
    segments: number
  ): Vector3[] {
    // De Casteljau's algorithm
  }
  ```

- [ ] **7.5** Calculate optimal segment count
  - Based on curve length in screen pixels
  - Minimum 8 segments, maximum 64

### Phase 3: Integration

- [ ] **7.6** Integrate with existing edge rendering
  - Separate straight edges from curves
  - Render curves with `CurveRenderer`

- [ ] **7.7** Add curve selection support
  - Store entity ID per curve segment
  - Enable raycasting on curves

### Phase 4: Mock Data

- [ ] **7.8** Add mock Bezier curves
  - Circle approximation
  - Sample spline curve
  - Test rendering

---

## Technical Details

### Bezier Tessellation
```typescript
// De Casteljau's algorithm for cubic Bezier
function evaluateCubicBezier(
  p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3,
  t: number
): Vector3 {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  return new Vector3(
    mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z
  );
}

function tessellate(
  p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3,
  segments: number
): Vector3[] {
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(evaluateCubicBezier(p0, p1, p2, p3, t));
  }
  return points;
}
```

### Adaptive Segment Count
```typescript
function calculateSegments(
  curve: BezierCurve,
  camera: Camera,
  viewport: { width: number; height: number }
): number {
  // Estimate curve length in screen pixels
  const startScreen = projectToScreen(curve.start, camera, viewport);
  const endScreen = projectToScreen(curve.end, camera, viewport);
  const screenLength = startScreen.distanceTo(endScreen);

  // More segments for longer curves
  const segments = Math.max(8, Math.min(64, Math.ceil(screenLength / 5)));
  return segments;
}
```

### Three.js Curve Option
```typescript
import { CubicBezierCurve3, BufferGeometry, Line } from 'three';

function createCurveLine(
  p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3
) {
  const curve = new CubicBezierCurve3(p0, p1, p2, p3);
  const points = curve.getPoints(50);
  const geometry = new BufferGeometry().setFromPoints(points);
  return new Line(geometry, material);
}
```

---

## Circle as Bezier

A circle is typically approximated with 4 cubic Bezier segments:

```
        P1
       /   \
   C1 /     \ C2
     /       \
P0--●---------●--P2
     \       /
   C4 \     / C3
       \   /
        P3

Each quarter uses:
  Start: P0
  Control1: C1 (offset by kappa * radius)
  Control2: C2 (offset by kappa * radius)
  End: P1

Where kappa ≈ 0.5522847498
```

---

## Success Criteria

- [ ] Circles render as smooth curves (not polygons)
- [ ] Arcs render smoothly
- [ ] Splines render smoothly
- [ ] Curves adapt detail based on zoom
- [ ] Curves are selectable
- [ ] Performance: 60fps with 100+ curves
- [ ] Visual quality matches original SolveSpace

---

## Files to Create/Modify

| File | Changes |
|------|---------|
| `src/wasm/geometry_api.cpp` | Add `GetBezierCurves` |
| `frontend/src/components/Viewport/CurveRenderer.tsx` | NEW: Curve rendering |
| `frontend/src/utils/bezier.ts` | NEW: Tessellation algorithms |
| `frontend/src/utils/mockGeometryData.ts` | Add mock curves |
| `frontend/src/types/geometry.ts` | Add curve types |

---

## Estimated Effort

- WASM API: 2 hours
- Bezier math: 2 hours
- CurveRenderer: 3 hours
- Adaptive tessellation: 2 hours
- Mock data: 1 hour
- **Total**: ~10 hours
