# 3D CAD Rendering Basics

This document explains the fundamental concepts behind 3D CAD rendering, specifically how geometry data flows from a parametric CAD engine to pixels on your screen.

## The Big Picture

When you're working in a CAD application, there's a pipeline that transforms your design into what you see:

```
User's Mental Model → Parametric Engine → Tessellation → Rendering → Screen
```

### 1. Parametric Engine (SolveSpace)

The CAD engine stores geometry in a **parametric** form - mathematical descriptions rather than raw points:

- **Circle**: center point + radius + normal vector
- **Line**: two endpoints
- **Arc**: center + start angle + end angle + radius
- **Extrusion**: a 2D profile + direction + distance

This representation is compact and precise. A circle is just a few numbers, not thousands of points.

### 2. Tessellation (Converting to Triangles)

GPUs can only render triangles efficiently. So the parametric geometry must be **tessellated** (broken into triangles):

```
Circle → 32 triangles forming a filled disk
Cylinder → Many triangles forming the curved surface
Cube → 12 triangles (2 per face)
```

This is what our WASM module does - it takes the internal SolveSpace representation and outputs:
- **Triangle vertices**: positions of all triangle corners
- **Triangle normals**: surface direction at each vertex (for lighting)
- **Edge vertices**: line segment endpoints for wireframe/outline
- **Point positions**: locations of construction/reference points

### 3. Rendering Pipeline

Three.js/WebGL takes the tessellated data and renders it:

```
World Coordinates → Camera Transform → Projection → Rasterization → Pixels
```

## Data Formats in Detail

### Triangle Mesh Data

For solid surfaces, we need three arrays:

```typescript
// Vertices: [x1, y1, z1, x2, y2, z2, x3, y3, z3, ...]
// Each group of 3 floats is one vertex position
vertices: Float32Array

// Normals: [nx1, ny1, nz1, nx2, ny2, nz2, ...]
// Surface direction at each vertex (for lighting calculations)
normals: Float32Array

// Indices: [0, 1, 2, 2, 3, 0, ...]
// Which vertices form each triangle
indices: Uint32Array
```

**Why indices?** A cube has 8 corners but 12 triangles. Without indices, we'd repeat vertex data. With indices, we store 8 vertices and reference them by index.

### Edge/Line Data

For wireframe and outlines:

```typescript
// Line segments: [x1, y1, z1, x2, y2, z2, ...]
// Pairs of points defining line segment start/end
edges: Float32Array
```

### Point Data

For construction points, vertices, centers:

```typescript
// Points with metadata for selection
points: Array<{
  id: number;        // Entity ID for selection
  x: number;
  y: number;
  z: number;
  construction: boolean;
}>
```

## The Rendering Pipeline Explained

### Step 1: World Coordinates

All geometry exists in "world space" - absolute 3D coordinates. A point at `(1, 2, 3)` is 1 unit along X, 2 along Y, 3 along Z from the origin.

### Step 2: Camera Transform

The camera has a position and orientation. We transform all geometry relative to the camera:

```
World Position → View Matrix → Camera-relative Position
```

Objects behind the camera get negative Z values (and are culled).

### Step 3: Projection

3D coordinates are projected onto a 2D plane:

- **Perspective**: Far objects appear smaller (realistic)
- **Orthographic**: All objects same scale regardless of distance (CAD standard)

```
Camera-relative 3D → Projection Matrix → Normalized 2D (-1 to 1)
```

### Step 4: Rasterization

The GPU determines which pixels each triangle covers and computes their colors based on:
- Material color
- Lighting
- Surface normal (angle to light)

## Lighting and Materials

### Basic Lighting Model

```
Final Color = Ambient + Diffuse + Specular
```

- **Ambient**: Constant base illumination
- **Diffuse**: Light that scatters based on surface angle
- **Specular**: Shiny highlights

### Surface Normals

The **normal** at each vertex tells the renderer which way the surface faces:

```
Light hitting surface head-on → bright
Light hitting at an angle → dimmer
Light from behind surface → dark/unlit
```

Normals are crucial for realistic lighting. That's why our WASM module provides them alongside vertices.

## Our Implementation

### Mock Data Structure

Our mock WASM module simulates the real geometry engine:

```typescript
createMockWASMModule() {
  return {
    // Triangle mesh data
    GetTriangleCount: (groupID) => ...,
    GetTriangleVertices: (groupID) => Float32Array,
    GetTriangleNormals: (groupID) => Float32Array,
    GetTriangleIndices: (groupID) => Uint32Array,

    // Edge data
    GetEdgeCount: (groupID) => ...,
    GetEdgeVertices: (groupID) => Float32Array,

    // Point data with IDs for selection
    GetPointsWithIds: (groupID) => Array<PointWithId>,
  }
}
```

### Renderer Components

Each geometry type has its own renderer:

| Renderer | Data Source | Three.js Object | Purpose |
|----------|-------------|-----------------|---------|
| `GeometryMesh` | Triangles | `<mesh>` | Solid surfaces |
| `EdgeRenderer` | Edges | `<lineSegments>` | Wireframe/outlines |
| `PointRenderer` | Points | `<mesh>` (spheres) | Control points, vertices |

### Selection System

For interactive selection, we need to map screen clicks back to entities:

1. **Raycasting**: Mouse position → 3D ray through scene
2. **Intersection**: Find which meshes the ray hits
3. **Entity ID lookup**: `mesh.userData.entityId` tells us what was clicked
4. **State update**: Store selection in Zustand: `selectedEntities: [entityId]`

This is why points are rendered as individual sphere meshes rather than a single batched `Points` object - we need each point to be independently selectable.

## Color System

Our colors match the SolveSpace visual style:

```typescript
SolveSpaceColors = {
  BACKGROUND: '#e9edf0',    // Light canvas
  ACTIVE_GRP: '#203646',    // Normal geometry
  SELECTED: '#00ff00',      // Selected entities (green)
  HOVERED: '#ffff00',       // Mouse hover (yellow)
  CONSTRUCTION: '#00ffff',  // Construction geometry (cyan)
  SOLID_EDGE: '#203646',    // Mesh outlines
}
```

## Summary

The journey from CAD model to pixels:

1. **Parametric geometry** (mathematical, precise)
2. **Tessellation** → triangles, edges, points (GPU-friendly)
3. **BufferGeometry** → Float32Arrays in GPU memory
4. **Vertex shader** → transform to camera space
5. **Rasterization** → determine which pixels
6. **Fragment shader** → compute pixel colors with lighting
7. **Frame buffer** → final image displayed

Understanding this pipeline helps debug rendering issues:
- No geometry visible? Check if tessellation returned data
- Wrong position? Check coordinate systems and transforms
- Lighting looks wrong? Check normals are correct
- Can't select? Check entity IDs are attached to meshes
