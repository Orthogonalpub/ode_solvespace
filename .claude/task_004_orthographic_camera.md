# Task 004: 2D Sketch Plane View & Orthographic Camera

## Overview

Implement orthographic camera mode and sketch plane alignment for 2D editing workflows. Users need to switch between 3D perspective view and 2D orthographic view aligned to sketch planes.

**Status**: Pending
**Priority**: P1
**Phase**: 2C.2
**Created**: 2025-11-28
**Depends on**: Task 002 (Rendering Migration) - Completed

---

## Background

CAD workflows often require switching between:
1. **3D Perspective View** - For visualizing the overall model
2. **2D Orthographic View** - For precise sketching on a plane

SolveSpace provides:
- Toggle between perspective and orthographic projection
- "View Normal To" workplane alignment
- Locked rotation when in 2D mode
- Standard views (Front, Top, Right, Isometric)

---

## Current State

### What We Have
- `OrbitControls` for camera manipulation
- `PerspectiveCamera` in Viewport
- Three workplanes defined (XY, YZ, XZ)
- `Workplane.tsx` component with normal vectors

### What's Missing
- No orthographic camera option
- No "View Normal To" workplane alignment
- No rotation lock in 2D mode
- No standard view buttons (Front, Top, Right)

---

## Requirements

### 1. Camera Mode Toggle
- Button to switch between Perspective and Orthographic
- Smooth animated transition between modes
- Maintain view center during transition

### 2. View Alignment
- "View Normal To" action aligns camera perpendicular to active workplane
- Standard view buttons: Front (XZ), Top (XY), Right (YZ), Isometric
- Keyboard shortcuts: Numpad keys or F/T/R/I

### 3. 2D Mode Behavior
- Lock camera rotation (pan and zoom only)
- Show grid on active workplane
- Optionally hide geometry behind workplane

---

## Implementation Tasks

- [ ] **4.1** Add `OrthographicCamera` support
  - Create camera state in store (`perspective` | `orthographic`)
  - Dynamically switch camera type in Viewport
  - Calculate ortho frustum from current view

- [ ] **4.2** Implement camera transition animation
  - Smooth interpolation between camera states
  - Use `@react-three/drei` camera controls or custom TWEEN

- [ ] **4.3** Add "View Normal To" function
  - Get workplane normal from store
  - Animate camera to align with normal
  - Set camera up vector correctly

- [ ] **4.4** Add standard view presets
  - Front: Camera at (0, 0, +Z), looking at origin
  - Top: Camera at (0, +Y, 0), looking down
  - Right: Camera at (+X, 0, 0), looking at origin
  - Isometric: Camera at (1, 1, 1) normalized

- [ ] **4.5** Implement 2D mode rotation lock
  - Disable orbit rotation in OrbitControls
  - Enable only pan and zoom
  - Visual indicator showing "2D Mode"

- [ ] **4.6** Add UI controls
  - Camera mode toggle button in TopBar or Viewport
  - Standard view dropdown or buttons
  - Keyboard shortcuts

---

## Technical Details

### Camera State
```typescript
interface CameraState {
  mode: 'perspective' | 'orthographic';
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov: number;        // For perspective
  zoom: number;       // For orthographic
  is2DMode: boolean;  // Lock rotation
}
```

### Orthographic Camera Setup
```typescript
// Calculate ortho frustum based on viewport and distance
const aspect = width / height;
const frustumSize = distance * Math.tan((fov * Math.PI) / 360) * 2;
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2,
  frustumSize * aspect / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  1000
);
```

### View Alignment
```typescript
function alignToWorkplane(workplane: Workplane) {
  const normal = new THREE.Vector3(...workplane.normal);
  const distance = 10; // View distance
  const newPosition = normal.clone().multiplyScalar(distance);

  // Animate camera
  gsap.to(camera.position, {
    x: newPosition.x,
    y: newPosition.y,
    z: newPosition.z,
    duration: 0.5,
  });
}
```

---

## UI Design

### TopBar Addition
```
[Perspective ▼] [Front] [Top] [Right] [Iso] [View Normal To]
```

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `5` | Toggle Perspective/Ortho |
| `1` | Front View |
| `7` | Top View |
| `3` | Right View |
| `0` | Isometric View |
| `V` | View Normal To active workplane |

---

## Success Criteria

- [ ] Can toggle between perspective and orthographic camera
- [ ] Camera transition is smooth (animated)
- [ ] "View Normal To" aligns camera to workplane
- [ ] Standard views work (Front, Top, Right, Isometric)
- [ ] 2D mode locks rotation, allows pan/zoom only
- [ ] Keyboard shortcuts functional
- [ ] UI buttons accessible

---

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/components/Viewport/Viewport.tsx` | Dual camera support |
| `frontend/src/store/useGeometryStore.ts` | Camera state management |
| `frontend/src/components/TopBar/TopBar.tsx` | View controls UI |
| `frontend/src/components/Viewport/CameraController.tsx` | NEW: Camera animation |

---

## Estimated Effort

- Camera mode toggle: 2 hours
- View alignment: 2 hours
- Standard views: 1 hour
- 2D mode lock: 1 hour
- UI controls: 2 hours
- **Total**: ~8 hours
