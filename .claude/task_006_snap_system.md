# Task 006: Snap Point System

## Overview

Implement intelligent snapping system that helps users precisely align geometry to existing points, midpoints, centers, intersections, and grid positions during drawing operations.

**Status**: Pending
**Priority**: P2
**Phase**: 2C.3
**Created**: 2025-11-28
**Depends on**: Task 003, Task 004

---

## Background

Snapping is critical for precise CAD modeling. When users draw, they need to:
- Snap to existing endpoints
- Snap to midpoints of lines
- Snap to centers of circles/arcs
- Snap to intersections
- Snap to grid positions

SolveSpace highlights the nearest snap point with a visual indicator and automatically constrains the new geometry to that point.

---

## Current State

### What We Have
- Mouse position tracking in `InteractionManager.tsx`
- World position calculation from screen coordinates
- Entity data with positions
- Grid rendering in `SolveSpaceGrid.tsx`

### What's Missing
- No snap point detection
- No snap visual indicators
- No snap-to-grid functionality
- No WASM API for snap points

---

## Requirements

### 1. Snap Types
| Type | Description | Visual |
|------|-------------|--------|
| Endpoint | Start/end of lines, arcs | Square marker |
| Midpoint | Center of line segments | Triangle marker |
| Center | Center of circles/arcs | Circle marker |
| Intersection | Where entities cross | X marker |
| Grid | Grid line intersections | Dot marker |
| Perpendicular | Perpendicular to line | ⊥ marker |
| Tangent | Tangent point on curve | ○ marker |

### 2. Snap Detection
- Calculate nearest snap point within tolerance
- Prioritize: Endpoint > Midpoint > Center > Intersection > Grid
- Tolerance based on screen pixels (e.g., 10px radius)

### 3. Visual Feedback
- Highlight active snap point
- Show snap type indicator
- Optional: snap guidelines

---

## Implementation Tasks

### Phase 1: Snap Point Calculation

- [ ] **6.1** Create snap point data structure
  ```typescript
  interface SnapPoint {
    type: SnapType;
    position: Vector3;
    entityId?: number;
    priority: number;
  }
  ```

- [ ] **6.2** Implement endpoint snap detection
  - Get all visible points from store
  - Find nearest within tolerance
  - Return snap point or null

- [ ] **6.3** Implement midpoint snap detection
  - Calculate midpoints of all visible line segments
  - Test against mouse position

- [ ] **6.4** Implement center snap detection
  - Get circle/arc centers from WASM
  - Test against mouse position

- [ ] **6.5** Implement grid snap detection
  - Calculate nearest grid intersection
  - Based on current grid settings

### Phase 2: WASM API (Optional)

- [ ] **6.6** Add `GetSnapPoints` to WASM
  ```cpp
  val GetSnapPoints(float x, float y, float z, float tolerance);
  // Returns nearest snap points within tolerance
  ```

- [ ] **6.7** Add intersection calculation
  - Find line-line intersections
  - Find line-circle intersections

### Phase 3: Visual Indicators

- [ ] **6.8** Create `SnapIndicator.tsx` component
  - Different marker shapes per snap type
  - Bright color (yellow or cyan)
  - Size independent of zoom

- [ ] **6.9** Add snap type label
  - Small text showing "Endpoint", "Midpoint", etc.
  - HTML overlay or 3D text

- [ ] **6.10** Add snap guidelines (optional)
  - Dashed lines from snap point to cursor
  - Shows alignment

### Phase 4: Integration

- [ ] **6.11** Update `InteractionManager.tsx`
  - Calculate snap on mouse move
  - Store active snap in state
  - Use snap position for drawing operations

- [ ] **6.12** Add snap toggle
  - Button to enable/disable snapping
  - Keyboard shortcut (e.g., F3)

---

## Technical Details

### Snap Detection Algorithm
```typescript
function findNearestSnap(
  mouseWorld: Vector3,
  entities: Entity[],
  gridSize: number,
  tolerancePixels: number,
  camera: Camera
): SnapPoint | null {
  const candidates: SnapPoint[] = [];

  // Collect all potential snap points
  for (const entity of entities) {
    if (entity.type === 'point') {
      candidates.push({
        type: 'endpoint',
        position: entity.position,
        entityId: entity.id,
        priority: 1,
      });
    }
    if (entity.type === 'line') {
      // Endpoints
      candidates.push({ type: 'endpoint', position: entity.start, ... });
      candidates.push({ type: 'endpoint', position: entity.end, ... });
      // Midpoint
      const mid = entity.start.clone().add(entity.end).multiplyScalar(0.5);
      candidates.push({ type: 'midpoint', position: mid, priority: 2 });
    }
    if (entity.type === 'circle') {
      candidates.push({ type: 'center', position: entity.center, ... });
    }
  }

  // Add grid snap points
  const gridSnap = nearestGridPoint(mouseWorld, gridSize);
  candidates.push({ type: 'grid', position: gridSnap, priority: 5 });

  // Find nearest within tolerance
  const toleranceWorld = pixelsToWorld(tolerancePixels, camera);

  return candidates
    .filter(p => p.position.distanceTo(mouseWorld) < toleranceWorld)
    .sort((a, b) => {
      // Sort by priority, then by distance
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.position.distanceTo(mouseWorld) - b.position.distanceTo(mouseWorld);
    })[0] || null;
}
```

### Snap Indicator Component
```typescript
function SnapIndicator({ snap }: { snap: SnapPoint }) {
  const markerSize = 0.15;

  const MarkerGeometry = () => {
    switch (snap.type) {
      case 'endpoint':
        return <boxGeometry args={[markerSize, markerSize, markerSize]} />;
      case 'midpoint':
        return <coneGeometry args={[markerSize/2, markerSize, 3]} />;
      case 'center':
        return <circleGeometry args={[markerSize/2, 16]} />;
      case 'grid':
        return <sphereGeometry args={[markerSize/3, 8, 8]} />;
      default:
        return <sphereGeometry args={[markerSize/2, 8, 8]} />;
    }
  };

  return (
    <mesh position={snap.position.toArray()}>
      <MarkerGeometry />
      <meshBasicMaterial color="#ffff00" />
    </mesh>
  );
}
```

---

## Visual Reference

```
Snap Indicators:

  Endpoint:    Midpoint:    Center:     Grid:
     ■            ▲           ○          •

  Example during line drawing:

  Start point ●─────────────────┼ Cursor
                               ▲
                            Midpoint snap
                            indicator
```

---

## Success Criteria

- [ ] Endpoint snap works on all visible points
- [ ] Midpoint snap works on line segments
- [ ] Center snap works on circles/arcs
- [ ] Grid snap works at grid intersections
- [ ] Visual indicator shows active snap
- [ ] Snap type is displayed
- [ ] Snapping can be toggled on/off
- [ ] Performance acceptable (no lag on mouse move)

---

## Files to Create/Modify

| File | Changes |
|------|---------|
| `frontend/src/components/Viewport/SnapIndicator.tsx` | NEW: Snap visual |
| `frontend/src/utils/snapDetection.ts` | NEW: Snap algorithms |
| `frontend/src/components/Viewport/InteractionManager.tsx` | Integrate snap |
| `frontend/src/store/useGeometryStore.ts` | Add snap state |
| `frontend/src/components/TopBar/TopBar.tsx` | Snap toggle button |

---

## Estimated Effort

- Snap detection algorithms: 3 hours
- Visual indicators: 2 hours
- Integration: 2 hours
- Grid snap: 1 hour
- Toggle UI: 1 hour
- **Total**: ~9 hours
