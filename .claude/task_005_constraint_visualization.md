# Task 005: Constraint Visualization

## Overview

Implement visual display of geometric constraints (dimensions, angles, parallel/perpendicular symbols) in the viewport. This is essential for users to understand and edit the parametric relationships in their sketches.

**Status**: Pending
**Priority**: P2
**Phase**: 2D
**Created**: 2025-11-28
**Depends on**: Task 003, Task 004

---

## Background

Constraints are the core of parametric CAD. SolveSpace displays:
- **Dimension lines** with numeric values (distance, diameter, angle)
- **Constraint symbols** (parallel lines, perpendicular icon, tangent marker)
- **Reference lines** connecting constraint to geometry
- **Color coding** (magenta for constraints, red for conflicts)

Users interact with constraints by:
- Clicking to select and edit values
- Double-clicking to change dimension
- Seeing conflicts highlighted in red

---

## Current State

### What We Have
- Basic entity rendering (points, edges, meshes)
- Selection system with highlighting
- Color system including `CONSTRAINT` color (#ff1aff magenta)

### What's Missing
- No WASM API to get constraint data
- No dimension line rendering
- No constraint symbol rendering
- No text labels for values
- No constraint selection/editing

---

## Requirements

### 1. WASM API for Constraints
```cpp
int GetConstraintCount();
val GetConstraintInfo(int constraintIndex);
val GetConstraintVisuals(int constraintID);
```

### 2. Dimension Lines
- Lines with arrows at endpoints
- Numeric label showing value and unit
- Extension lines to referenced geometry
- Editable on double-click

### 3. Constraint Symbols
- Parallel: Two parallel lines icon
- Perpendicular: Right angle symbol
- Tangent: Tangent curve marker
- Coincident: Overlapping point marker
- Equal: "=" symbol
- Horizontal/Vertical: "H" or "V" indicator

### 4. Visual States
- Normal: Magenta color
- Selected: Yellow highlight
- Conflict: Red color
- Hovered: Bright magenta

---

## Implementation Tasks

### Phase 1: WASM API

- [ ] **5.1** Add constraint query functions to WASM
  ```cpp
  int GetConstraintCount();
  val GetConstraintInfo(int index);
  // Returns: {id, type, entityA, entityB, value, reference, hasConflict}
  ```

- [ ] **5.2** Add constraint visual data function
  ```cpp
  val GetConstraintVisuals(int constraintID);
  // Returns: {
  //   lines: [{start, end}],
  //   label: {position, text, rotation},
  //   symbols: [{type, position, rotation}]
  // }
  ```

### Phase 2: Dimension Lines

- [ ] **5.3** Create `DimensionRenderer.tsx` component
  - Render dimension lines as Three.js Line objects
  - Add arrow heads at endpoints (cone geometry or triangles)
  - Draw extension lines to geometry

- [ ] **5.4** Implement text labels
  - Option A: HTML overlay with CSS positioning
  - Option B: `@react-three/drei` Text component
  - Show value with unit (e.g., "25.4 mm")
  - Rotate to face camera (billboarding)

- [ ] **5.5** Add arrow head geometry
  - Small triangles or cones at line endpoints
  - Proper orientation based on line direction

### Phase 3: Constraint Symbols

- [ ] **5.6** Create constraint icon sprites/meshes
  - Parallel: Two vertical lines
  - Perpendicular: "⊥" shaped lines
  - Tangent: Curve touching line
  - Equal: "=" text or lines

- [ ] **5.7** Create `ConstraintSymbolRenderer.tsx`
  - Position symbols at constraint reference point
  - Scale to maintain screen size (size attenuation off)

### Phase 4: Interaction

- [ ] **5.8** Add constraint selection
  - Raycaster hit detection on dimension lines
  - Store selected constraint ID
  - Highlight selected constraints

- [ ] **5.9** Add constraint editing (future)
  - Double-click to edit value
  - Input field for new dimension
  - Update WASM and re-solve

---

## Technical Details

### Constraint Data Structure
```typescript
interface ConstraintInfo {
  id: number;
  type: ConstraintType;
  entityA: number;
  entityB?: number;
  value: number;
  reference: Vector3;  // Where to show symbol/label
  hasConflict: boolean;
}

enum ConstraintType {
  DISTANCE = 0,
  ANGLE = 1,
  PARALLEL = 2,
  PERPENDICULAR = 3,
  TANGENT = 4,
  COINCIDENT = 5,
  EQUAL = 6,
  HORIZONTAL = 7,
  VERTICAL = 8,
  // ... more
}

interface ConstraintVisuals {
  lines: Array<{ start: Vector3; end: Vector3 }>;
  label?: {
    position: Vector3;
    text: string;
    rotation: number;
  };
  symbol?: {
    type: string;
    position: Vector3;
    rotation: number;
  };
}
```

### Dimension Line Rendering
```typescript
// Dimension line with arrows
function DimensionLine({ start, end, label, offset }) {
  const direction = end.clone().sub(start).normalize();
  const perpendicular = new Vector3(-direction.y, direction.x, 0);

  // Offset dimension line from geometry
  const lineStart = start.clone().add(perpendicular.multiplyScalar(offset));
  const lineEnd = end.clone().add(perpendicular.multiplyScalar(offset));

  return (
    <group>
      {/* Main dimension line */}
      <Line points={[lineStart, lineEnd]} color={CONSTRAINT_COLOR} />

      {/* Extension lines */}
      <Line points={[start, lineStart]} color={CONSTRAINT_COLOR} dashed />
      <Line points={[end, lineEnd]} color={CONSTRAINT_COLOR} dashed />

      {/* Arrow heads */}
      <ArrowHead position={lineStart} direction={direction} />
      <ArrowHead position={lineEnd} direction={direction.negate()} />

      {/* Label */}
      <Text position={midpoint} fontSize={0.3}>{label}</Text>
    </group>
  );
}
```

### Text Label Options

**Option A: HTML Overlay (Recommended for crisp text)**
```typescript
import { Html } from '@react-three/drei';

<Html position={labelPosition} center>
  <div className="dimension-label">25.4 mm</div>
</Html>
```

**Option B: 3D Text (Scales with scene)**
```typescript
import { Text } from '@react-three/drei';

<Text
  position={labelPosition}
  fontSize={0.3}
  color={CONSTRAINT_COLOR}
  anchorX="center"
  anchorY="middle"
>
  25.4 mm
</Text>
```

---

## Visual Reference

```
Dimension Line:
    ←──────────────→
    |    25.4 mm   |
    ●              ●
  (point A)    (point B)

Angle Dimension:
         ╱
        ╱ 45°
       ╱___________

Parallel Symbol:
    ║
    ║  (placed between parallel lines)

Perpendicular Symbol:
    ┐
    │  (placed at right angle)
```

---

## Success Criteria

- [ ] Distance dimensions display with value labels
- [ ] Angle dimensions show degree values
- [ ] Constraint symbols render at correct positions
- [ ] Conflicting constraints show in red
- [ ] Constraints selectable via click
- [ ] Text labels remain readable at all zoom levels
- [ ] Performance acceptable with 50+ constraints

---

## Files to Create/Modify

| File | Changes |
|------|---------|
| `src/wasm/geometry_api.cpp` | Add constraint query functions |
| `frontend/src/components/Viewport/ConstraintRenderer.tsx` | NEW: Main constraint renderer |
| `frontend/src/components/Viewport/DimensionLine.tsx` | NEW: Dimension line component |
| `frontend/src/components/Viewport/ConstraintSymbol.tsx` | NEW: Symbol sprites |
| `frontend/src/utils/mockGeometryData.ts` | Add mock constraint data |
| `frontend/src/types/geometry.ts` | Add constraint types |

---

## Estimated Effort

- WASM API: 3 hours
- Dimension lines: 4 hours
- Text labels: 2 hours
- Constraint symbols: 3 hours
- Selection: 2 hours
- **Total**: ~14 hours (2 days)
