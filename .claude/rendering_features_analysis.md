# SolveSpace Rendering Features Analysis

## Executive Summary

This document provides a comprehensive analysis of all rendering features in the original SolveSpace C++ implementation (approximately 4,726 lines of rendering code). This serves as the reference specification for migrating rendering capabilities to the Three.js/React frontend.

**Purpose**: Both AI and human developers can use this document to understand exactly what each rendering feature does, why it exists, and how it should be implemented in Three.js.

---

## 1. Rendering Architecture

### 1.1 Core Abstraction Pattern

**What it is**: SolveSpace uses a backend-agnostic Canvas abstraction defined in `src/render/render.h`.

**Why it exists**: This design pattern allows the same drawing code to work with multiple rendering backends without modification. The application code calls abstract methods like `DrawLine()`, and each backend implements these methods using its specific graphics API.

**How it works**:
1. All drawing commands go through the abstract `Canvas` interface
2. At runtime, a concrete implementation (OpenGL, Cairo, etc.) handles the actual rendering
3. This separation allows adding new backends without changing application code

| Backend | File | Purpose | When Used |
|---------|------|---------|-----------|
| OpenGL 3.0+ | `rendergl3.cpp` | Modern desktop rendering | Primary rendering on modern systems |
| OpenGL 1.0 | `rendergl1.cpp` | Legacy system support | Fallback for older graphics cards |
| Cairo | `rendercairo.cpp` | 2D export/document rendering | PDF, SVG, image export |
| ObjectPicker | `render.h` | Selection/hit testing | Mouse click detection |
| SurfaceRenderer | `render2d.cpp` | 2D view rendering | Orthographic projections |

**Three.js Migration**: In Three.js, we don't need multiple backends. Instead, we'll create a single rendering system that maps SolveSpace concepts to Three.js objects.

### 1.2 Key Source Files

| File | Lines | Purpose | Key Classes/Functions |
|------|-------|---------|----------------------|
| `render/render.h` | ~385 | Canvas interface, Camera, Lighting classes | `Canvas`, `Camera`, `Lighting`, `Stroke`, `Fill` |
| `render/render.cpp` | ~200 | Camera transformations, Stroke/Fill caching | `ProjectPoint()`, `GetStroke()` |
| `render/rendergl3.cpp` | ~2000 | Modern OpenGL 3.0+ implementation | `OpenGl3Renderer` |
| `render/gl3shader.h/.cpp` | ~800 | GL3 shader implementations | `MeshRenderer`, `EdgeRenderer` |
| `draw.cpp` | ~954 | Main rendering coordinator | `Paint()`, `Draw()`, `DrawSnapGrid()` |
| `drawentity.cpp` | ~863 | Entity-specific drawing | `Entity::Draw()` |
| `drawconstraint.cpp` | ~1380 | Constraint visualization | `Constraint::Draw()` |
| `style.cpp` | ~600 | Style system and colors | `Style::Defaults[]` |

---

## 2. Canvas Interface

### 2.1 Drawing Primitives

**What they are**: The fundamental drawing operations that all rendering backends must implement.

**Why they exist**: These primitives cover all the geometric shapes needed in a CAD application - from simple lines to complex meshes.

**Visual Overview of All Primitives**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DRAWING PRIMITIVES REFERENCE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DrawLine:           DrawEdges:              DrawBeziers:                    │
│  a●─────────●b       ●───●  ●───●            ●                               │
│  (single segment)    │      │                 ╲                              │
│                      ●───●  ●───●               ╲___●                        │
│                      (batch of edges)               ╲                        │
│                                                      ●                       │
│                                                   (smooth curves)            │
│                                                                              │
│  DrawOutlines:       DrawPoint:              DrawQuad:                       │
│   ╭───────╮          ●  ●  ●                 a●───────●b                     │
│  │  mesh  │          ● ● ● ●                  │▓▓▓▓▓▓▓│                      │
│   ╰───────╯          (markers)                │▓▓▓▓▓▓▓│                      │
│  (silhouette)                                d●───────●c                     │
│                                              (textured rect)                 │
│                                                                              │
│  DrawPolygon:        DrawMesh:               DrawVectorText:                 │
│   ●───────●          ╱╲    ╱╲                                                │
│  ╱ ▓▓▓▓▓▓▓ ╲        ╱──╲__╱──╲               "25.4 mm"                       │
│ ●▓▓▓▓▓▓▓▓▓▓●       ╱────────────╲            (scalable)                      │
│  ╲ ▓▓▓▓▓▓▓ ╱       ╲────────────╱                                            │
│   ●───────●         (3D triangles)                                           │
│  (filled shape)                                                              │
│                                                                              │
│  DrawPixmap:                                                                 │
│  ┌────────────┐                                                              │
│  │  ░░▒▒▓▓██  │    Image/texture                                             │
│  │  ▓▓██░░▒▒  │    in 3D space                                               │
│  └────────────┘                                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

```cpp
// LINES AND EDGES
// ================

virtual void DrawLine(const Vector &a, const Vector &b, hStroke hcs) = 0;
// Purpose: Draw a single line segment between two 3D points
// Use case: Dimension lines, construction lines, single edges
// Parameters:
//   - a, b: 3D endpoints of the line
//   - hcs: Handle to stroke style (color, width, pattern)

virtual void DrawEdges(const SEdgeList &el, hStroke hcs) = 0;
// Purpose: Draw multiple line segments efficiently as a batch
// Use case: Wireframe rendering, entity outlines
// Parameters:
//   - el: List of edge segments (pairs of vertices)
//   - hcs: Handle to stroke style
// Performance: Batching edges is much faster than individual DrawLine calls

virtual bool DrawBeziers(const SBezierList &bl, hStroke hcs) = 0;
// Purpose: Draw smooth Bézier curves (quadratic or cubic)
// Use case: Circles, arcs, splines, smooth curves
// Parameters:
//   - bl: List of Bézier curve segments
//   - hcs: Handle to stroke style
// Returns: true if backend supports native Bézier rendering
//          false if curves must be converted to line segments

virtual void DrawOutlines(const SOutlineList &ol, hStroke hcs, DrawOutlinesAs drawAs) = 0;
// Purpose: Draw silhouette edges of 3D meshes
// Use case: Edge highlighting on solid bodies, visual separation
// Parameters:
//   - ol: List of outline edges with surface normal info
//   - hcs: Handle to stroke style
//   - drawAs: Which outlines to draw (emphasized, contour, or both)

// POINTS
// ======

virtual void DrawPoint(const Vector &o, hStroke hcs) = 0;
// Purpose: Draw a point marker at a 3D position
// Use case: Sketch points, construction points, snap points
// Parameters:
//   - o: 3D position of the point
//   - hcs: Handle to stroke style (determines point size and color)
// Note: Points are drawn as small squares, not dots, for visibility

// FILLED SHAPES
// =============

virtual void DrawQuad(const Vector &a, const Vector &b, const Vector &c, const Vector &d, hFill hcf) = 0;
// Purpose: Draw a filled quadrilateral
// Use case: Image rendering, UI elements, simple filled shapes
// Parameters:
//   - a,b,c,d: Four corners of the quad (in order)
//   - hcf: Handle to fill style (color, pattern, texture)

virtual void DrawPolygon(const SPolygon &p, hFill hcf) = 0;
// Purpose: Draw a filled polygon with arbitrary number of vertices
// Use case: 2D sketch regions, cross-section fills
// Parameters:
//   - p: Polygon with vertex list and holes
//   - hcf: Handle to fill style

virtual void DrawMesh(const SMesh &m, hFill hcfFront, hFill hcfBack = {}) = 0;
// Purpose: Draw a triangulated 3D mesh with lighting
// Use case: Solid body rendering, extruded shapes, imported geometry
// Parameters:
//   - m: Mesh containing triangle list with per-vertex normals
//   - hcfFront: Fill style for front faces
//   - hcfBack: Fill style for back faces (optional, for debugging)
// Note: Back faces rendered in red indicate inside-out geometry

virtual void DrawFaces(const SMesh &m, const std::vector<uint32_t> &faces, hFill hcf) = 0;
// Purpose: Draw specific faces from a mesh (for selection highlighting)
// Use case: Highlighting selected faces on a solid body
// Parameters:
//   - m: The full mesh
//   - faces: Indices of faces to draw
//   - hcf: Fill style (usually with selection color)

// TEXT AND IMAGES
// ===============

virtual void DrawVectorText(const std::string &text, double height,
                           const Vector &o, const Vector &u, const Vector &v, hStroke hcs) = 0;
// Purpose: Draw text using vector fonts (not bitmap fonts)
// Use case: Dimension labels, constraint values, entity names
// Parameters:
//   - text: The string to render
//   - height: Text height in model units
//   - o: Origin point (bottom-left of text)
//   - u: Direction vector for text baseline (usually right)
//   - v: Direction vector for text height (usually up)
//   - hcs: Handle to stroke style
// Note: Vector text scales properly with zoom and can be rotated

virtual void DrawPixmap(std::shared_ptr<const Pixmap> pm,
                       const Vector &o, const Vector &u, const Vector &v,
                       const Point2d &ta, const Point2d &tb, hFill hcf) = 0;
// Purpose: Draw a bitmap image in 3D space
// Use case: Reference images, textures, imported pictures
// Parameters:
//   - pm: The pixel data
//   - o: Origin corner of the image quad
//   - u, v: Direction vectors defining image orientation and size
//   - ta, tb: Texture coordinates (for partial image rendering)
//   - hcf: Fill style (for tinting)
```

### 2.2 Layer System

**What it is**: A depth-ordering system that controls which geometry appears in front of or behind other geometry.

**Why it exists**: In a CAD application, some elements must always be visible (like selection highlights), while others should be hidden when occluded (like normal geometry). The layer system provides this control.

**How it works**: Each piece of geometry is assigned to a layer. The renderer processes layers in order, using depth testing and stencil operations to achieve the desired visibility.

```cpp
enum class Layer {
    BACK,       // Always drawn first, behind everything else
                // Use case: Background grid, reference planes
                // Implementation: Rendered first, no depth test

    DEPTH_ONLY, // Writes to depth buffer but not color buffer
                // Use case: Occluding geometry that shouldn't be visible
                // Implementation: colorWrite = false, depthWrite = true

    NORMAL,     // Standard 3D rendering with depth testing
                // Use case: All regular geometry (meshes, edges, etc.)
                // Implementation: Standard depth test (GL_LESS)

    OCCLUDED,   // Only visible where hidden by NORMAL geometry
                // Use case: Hidden line rendering (dashed lines behind solids)
                // Implementation: Depth test inverted (GL_GREATER)

    FRONT       // Always drawn last, on top of everything
                // Use case: Selection highlights, hover effects, UI overlays
                // Implementation: Rendered last, no depth test
};
```

**Visual Example**:
```
Layer order (back to front):
┌─────────────────────────────────────────┐
│ BACK: Grid lines                        │ ← Drawn first
├─────────────────────────────────────────┤
│ NORMAL: 3D mesh, edges, points          │ ← Standard depth-tested
├─────────────────────────────────────────┤
│ OCCLUDED: Hidden edges (dashed)         │ ← Only where behind NORMAL
├─────────────────────────────────────────┤
│ FRONT: Selection highlight, hover       │ ← Always on top
└─────────────────────────────────────────┘
```

**Three.js Implementation**:
```javascript
// Layer mapping to Three.js renderOrder
const LAYER_RENDER_ORDER = {
  BACK: -100,
  DEPTH_ONLY: -50,  // Also set material.colorWrite = false
  NORMAL: 0,
  OCCLUDED: 50,     // Custom shader needed
  FRONT: 100        // Also set material.depthTest = false
};
```

### 2.3 Outline Classification

**What it is**: A system for classifying which edges of a 3D mesh should be drawn as outlines.

**Why it exists**: Mesh silhouettes make 3D shapes more readable. Some edges are always important (emphasized), while others only matter at the boundary between visible and hidden surfaces (contour).

**How it works**: Each outline edge stores the surface normals of its two adjacent faces. By comparing these normals with the view direction, the renderer determines which edges are visible silhouettes.

```cpp
enum class DrawOutlinesAs {
    EMPHASIZED_AND_CONTOUR      = 0,
    // Draw both types of outlines
    // Use case: Full wireframe overlay on shaded mesh
    // Visual: All important edges visible

    EMPHASIZED_WITHOUT_CONTOUR  = 1,
    // Draw only edges where surface curvature changes abruptly
    // Use case: Showing sharp edges/creases on smooth surfaces
    // Visual: Only hard edges, not silhouette

    CONTOUR_ONLY                = 2
    // Draw only edges at the silhouette boundary
    // Use case: Clean silhouette rendering
    // Visual: Only the outer profile of the shape
};
```

**Visual Example - Outline Classification on Different Shapes**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       OUTLINE CLASSIFICATION EXAMPLES                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CUBE - All edges are EMPHASIZED (sharp corners):                             │
│                                                                               │
│      EMPHASIZED_AND_CONTOUR:   EMPHASIZED_ONLY:      CONTOUR_ONLY:            │
│           ┌─────┐                  ┌─────┐              ┌─────┐               │
│          ╱│    ╱│                 ╱│    ╱│             ╱      │               │
│         ┌─────┐ │                ┌─────┐ │            ┌       │               │
│         │ │   │ │                │ │   │ │            │       │               │
│         │ └───│─┘                │ └───│─┘            │       ┘               │
│         │╱    │╱                 │╱    │╱             │╱                      │
│         └─────┘                  └─────┘              └──────                 │
│        (all 12 edges)           (all 12 edges)       (only visible           │
│                                 (same for cube)        silhouette)            │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CYLINDER - Mix of sharp (top/bottom) and smooth (side):                      │
│                                                                               │
│      EMPHASIZED_AND_CONTOUR:   EMPHASIZED_ONLY:      CONTOUR_ONLY:            │
│          ╭───────╮               ╭───────╮                                    │
│          │       │               │       │              │       │             │
│          │       │               ╰───────╯              │       │             │
│          │       │               (only top              │       │             │
│          ╰───────╯                and bottom)           (only sides)          │
│        (top + bottom              circles)                                    │
│         + silhouette)                                                         │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  SPHERE - No emphasized edges (all smooth):                                   │
│                                                                               │
│      EMPHASIZED_AND_CONTOUR:   EMPHASIZED_ONLY:      CONTOUR_ONLY:            │
│            ╭───╮                                          ╭───╮               │
│           ╱     ╲                  (nothing)             ╱     ╲              │
│          │       │                                      │       │             │
│           ╲     ╱                                        ╲     ╱              │
│            ╰───╯                                          ╰───╯               │
│        (just silhouette)                               (same)                 │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  HOW CONTOUR DETECTION WORKS:                                                 │
│                                                                               │
│                Eye/Camera                                                     │
│                    │                                                          │
│                    │ view direction                                           │
│                    ▼                                                          │
│               ╭─────────╮                                                     │
│         nl↗  │         │  ↖nr                                                 │
│      ────────●─────────●─────────                                             │
│              ↑                                                                │
│         Contour edge                                                          │
│                                                                               │
│   If (nl · view > 0) and (nr · view < 0):                                     │
│      This is a CONTOUR edge (one face visible, one hidden)                    │
│                                                                               │
│   If angle between nl and nr > threshold:                                     │
│      This is an EMPHASIZED edge (sharp crease)                                │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Stroke and Fill System

### 3.1 Stroke Properties

**What it is**: A complete description of how to render a line or curve.

**Why it exists**: Different types of geometry need different visual treatment - construction lines should look different from solid edges, selected items need highlighting, etc.

**How it works**: Strokes are cached and deduplicated using handles. When you request a stroke with certain properties, the system returns a handle that references a cached stroke definition.

```cpp
class Stroke {
    hStroke h;              // Unique handle for this stroke configuration
                            // Purpose: Allows efficient batching of geometry with same style
                            // Implementation: Hash-based lookup in stroke cache

    Layer layer;            // Which rendering layer (BACK, NORMAL, FRONT, etc.)
                            // Purpose: Controls depth ordering
                            // Example: Selection highlights use FRONT

    int zIndex;             // Z-ordering within the same layer
                            // Purpose: Fine-grained control over draw order
                            // Range: 0-10 typically, higher = drawn later (on top)
                            // Example: Points have zIndex 6 (highest), edges have 1

    RgbaColor color;        // RGBA color (0-255 per channel)
                            // Purpose: Line color with optional transparency
                            // Example: SELECTED = red (255, 0, 0, 255)

    double width;           // Line thickness
                            // Purpose: Visual weight of the line
                            // Range: 0.5 to 8.0 typically

    Unit unit;              // How to interpret width
                            // MM = width in millimeters (scales with zoom)
                            // PX = width in pixels (constant on screen)
                            // Example: Grid lines use PX, sketch lines use MM

    StipplePattern stipplePattern;  // Dashed/dotted pattern
                                    // Purpose: Differentiate line types visually
                                    // Example: DASH for hidden edges, CONTINUOUS for visible

    double stippleScale;    // Scale factor for stipple pattern
                            // Purpose: Adjust dash length
                            // Default: 15.0 for most patterns
};
```

**Unit System Explained**:
```
Width in MM (model units):
┌────────────────────────────────────┐
│  Zoomed out: ─────                 │  Lines appear thinner
│  Zoomed in:  ═══════════           │  Lines appear thicker
│  (Line width scales with model)    │
└────────────────────────────────────┘

Width in PX (screen pixels):
┌────────────────────────────────────┐
│  Zoomed out: ═══════════           │  Lines stay same thickness
│  Zoomed in:  ═══════════           │  Lines stay same thickness
│  (Line width constant on screen)   │
└────────────────────────────────────┘
```

### 3.2 Fill Properties

**What it is**: A complete description of how to render a filled surface.

**Why it exists**: Meshes, polygons, and quads need fill styles for shading, selection indication, and texturing.

```cpp
class Fill {
    hFill h;                // Unique handle for deduplication
                            // Same purpose as stroke handles

    Layer layer;            // Rendering layer
                            // Usually NORMAL for solid geometry

    int zIndex;             // Z-ordering within layer
                            // Less important for fills than strokes

    RgbaColor color;        // Fill color with alpha
                            // Purpose: Base color for shading
                            // Note: Alpha < 255 enables transparency

    FillPattern pattern;    // Fill pattern type
                            // SOLID = uniform color
                            // CHECKERED_A = checkerboard pattern (selection)
                            // CHECKERED_B = offset checkerboard (hover)

    std::shared_ptr<const Pixmap> texture;  // Optional texture map
                                             // Purpose: Image-based fills
                                             // Use case: Reference images in sketch
};
```

**Fill Patterns Explained**:
```
SOLID:          CHECKERED_A:        CHECKERED_B:
┌──────────┐    ┌──────────┐        ┌──────────┐
│██████████│    │█ █ █ █ █ │        │ █ █ █ █ █│
│██████████│    │ █ █ █ █ █│        │█ █ █ █ █ │
│██████████│    │█ █ █ █ █ │        │ █ █ █ █ █│
│██████████│    │ █ █ █ █ █│        │█ █ █ █ █ │
└──────────┘    └──────────┘        └──────────┘
(normal fill)   (selected face)     (hovered face)

Note: The two checkered patterns are offset so users can
distinguish between selected and hovered faces when both apply.
```

### 3.3 Stipple Patterns

**What they are**: Predefined dash/dot patterns for line rendering.

**Why they exist**: Different line types (construction, hidden, centerline) are conventionally shown with different patterns in engineering drawings.

```cpp
enum class StipplePattern : uint32_t {
    CONTINUOUS   = 0,   // ────────────────────
                        // Use: Normal visible edges, active geometry

    SHORT_DASH   = 1,   // ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                        // Use: Construction geometry, temporary lines

    DASH         = 2,   // ── ── ── ── ── ── ──
                        // Use: Hidden edges, projected lines

    LONG_DASH    = 3,   // ──── ──── ──── ────
                        // Use: Centerlines, phantom lines

    DASH_DOT     = 4,   // ──·──·──·──·──·──·──
                        // Use: Centerlines (ISO standard)

    DASH_DOT_DOT = 5,   // ──··──··──··──··──··
                        // Use: Boundary lines, cutting planes

    DOT          = 6,   // · · · · · · · · · · ·
                        // Use: Projection lines, reference lines

    FREEHAND     = 7,   // ∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼
                        // Use: Break lines, irregular boundaries

    ZIGZAG       = 8    // /\/\/\/\/\/\/\/\/\/\
                        // Use: Break lines (alternative style)
};
```

**Visual Example - All Stipple Patterns at Scale**:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    STIPPLE PATTERN VISUAL REFERENCE                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 0: CONTINUOUS (solid line)                                           │
│  ════════════════════════════════════════════════════════════════════════     │
│  Use: Active geometry, visible edges, dimension lines                         │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 1: SHORT_DASH (1:2 ratio)                                            │
│  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─        │
│  │1│  2  │1│  2  │1│  2  │                                                    │
│  Use: Construction geometry, workplane borders, temporary lines               │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 2: DASH (3:2 ratio)                                                  │
│  ───  ───  ───  ───  ───  ───  ───  ───  ───  ───  ───  ───  ───             │
│  │ 3 │ 2 │ 3 │ 2 │ 3 │                                                        │
│  Use: Hidden edges, lines behind solid geometry                               │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 3: LONG_DASH (6:2 ratio)                                             │
│  ──────  ──────  ──────  ──────  ──────  ──────  ──────  ──────               │
│  │  6   │2│  6   │2│                                                          │
│  Use: Phantom lines, alternate positions, symmetry axes                       │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 4: DASH_DOT (4:2:0.5:2)                                              │
│  ────·────·────·────·────·────·────·────·────·────·────·────·                 │
│  │ 4  │2│·│2│ 4  │2│·│2│                                                      │
│  Use: Centerlines (ISO/ANSI standard), axes of symmetry                       │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 5: DASH_DOT_DOT (4:2:0.5:2:0.5:2)                                    │
│  ────··────··────··────··────··────··────··────··────··                       │
│  │ 4  │2│·│2│·│2│ 4  │                                                        │
│  Use: Cutting planes, section lines, boundary lines                           │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 6: DOT (0.5:2 ratio)                                                 │
│  · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·          │
│  │·│ 2 │·│ 2 │                                                                │
│  Use: Projection lines, reference lines, grid (dense)                         │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 7: FREEHAND                                                          │
│  ∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼∼                    │
│  Use: Break lines, irregular boundaries, hand-drawn style                     │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pattern 8: ZIGZAG                                                            │
│  /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\             │
│  Use: Break lines (mechanical drawings), material boundaries                  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Pattern Usage in Context**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STIPPLE PATTERNS IN A DRAWING                             │
│                                                                              │
│     CONTINUOUS (visible edges)                                               │
│         ┌═══════════════════════════════════════┐                           │
│         │                                       │                           │
│         │    DASH_DOT (centerline)             │                           │
│         │    ────·────·────·────·────          │                           │
│         │              │                        │                           │
│         │              │                        │                           │
│         │    ╭────────────────────╮             │                           │
│         │    │        ○          │             │                           │
│         │    │                   │             │                           │
│         │    ╰────────────────────╯             │                           │
│         │                                       │                           │
│         │    DASH (hidden edges)               │                           │
│         │    ─ ─ ─ ─ ─ ─ ─ ─ ─                 │                           │
│         │                                       │                           │
│         └═══════════════════════════════════════┘                           │
│                                                                              │
│         SHORT_DASH (construction/workplane)                                  │
│         ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pattern Definitions** (dash lengths in units where 1.0 = one "unit"):
```cpp
// Each pattern defined as array of [dash, gap, dash, gap, ...]
CONTINUOUS:   []                    // No gaps
SHORT_DASH:   [1, 2]                // 1 unit dash, 2 unit gap
DASH:         [3, 2]                // 3 unit dash, 2 unit gap
LONG_DASH:    [6, 2]                // 6 unit dash, 2 unit gap
DASH_DOT:     [4, 2, 0.5, 2]        // 4 dash, 2 gap, 0.5 dot, 2 gap
DASH_DOT_DOT: [4, 2, 0.5, 2, 0.5, 2]// 4 dash, 2 gap, dot, gap, dot, gap
DOT:          [0.5, 2]              // 0.5 unit dot, 2 unit gap
```

**Three.js Implementation**:
```javascript
// Use LineDashedMaterial for dashed lines
const dashedMaterial = new THREE.LineDashedMaterial({
  color: 0x808080,
  dashSize: 3,      // Length of dash
  gapSize: 2,       // Length of gap
  scale: 1          // Overall scale factor
});

// Important: Must call computeLineDistances() on the geometry
lineGeometry.computeLineDistances();
```

---

## 4. Style System

### 4.1 Predefined Styles

**What they are**: Named style presets that define the visual appearance of different geometry types.

**Why they exist**: Consistent visual language helps users understand what they're looking at - construction lines should always look the same, selected items should always be highlighted the same way.

**How they work**: Each style has a unique ID. When drawing an entity, the system looks up its style and creates a Stroke or Fill with those properties.

| Style | ID | Color RGB | Width | Z-Index | Stipple | Purpose & Usage |
|-------|-----|-----------|-------|---------|---------|-----------------|
| **ACTIVE_GRP** | 1 | (255, 255, 255) White | 1.5 | 4 | Continuous | **Entities in the currently active group.** These are the items the user is working on. White color provides maximum contrast on dark backgrounds. |
| **CONSTRUCTION** | 2 | (26, 179, 26) Light Green | 1.5 | 0 | Continuous | **Construction/reference geometry.** Lines, circles, and points used as guides but not part of the final model. Green distinguishes from final geometry. |
| **INACTIVE_GRP** | 3 | (128, 77, 0) Orange | 1.5 | 3 | Continuous | **Entities in non-active groups.** Visible for reference but not editable. Orange indicates "background" status. |
| **DATUM** | 4 | (0, 204, 0) Dark Green | 1.5 | 0 | Continuous | **Datum points and reference points.** Origin points, snap points, sketch points. Green family but darker than construction. |
| **SOLID_EDGE** | 5 | (204, 204, 204) Light Gray | 1.0 | 2 | Continuous | **Edges of solid bodies.** The edges of extruded, revolved, or imported geometry. Neutral gray doesn't compete with sketch geometry. |
| **CONSTRAINT** | 6 | (255, 26, 255) Magenta | 1.0 | 0 | Continuous | **Constraint annotations.** Distance dimensions, angle markers, constraint symbols. Magenta stands out from all geometric colors. |
| **SELECTED** | 7 | (255, 0, 0) Red | 1.5 | 0 | Continuous | **Currently selected items.** Universal "selected" indicator. Red is highly visible and conventionally means "active selection." |
| **HOVERED** | 8 | (255, 255, 0) Yellow | 1.5 | 0 | Continuous | **Item under mouse cursor.** Preview of what would be selected on click. Yellow is visible and less "committed" than red. |
| **CONTOUR_FILL** | 9 | (0, 26, 26) Dark Cyan | 1.0 | 0 | Continuous | **Fill color for closed contours.** When showing filled sketch regions. Dark so it doesn't obscure edge lines. |
| **NORMALS** | 10 | (0, 102, 102) Teal | 1.0 | 0 | Continuous | **Normal vectors and workplane indicators.** Direction arrows, coordinate system axes (when dimmed). |
| **ANALYZE** | 11 | (0, 255, 255) Cyan | 3.0 | 0 | Continuous | **Analysis results and indicators.** Unconstrained degrees of freedom, measurement results. Bright cyan for high visibility. Thick line (3.0). |
| **DRAW_ERROR** | 12 | (255, 0, 0) Red | 8.0 | 0 | Continuous | **Errors and problems.** Unclosed contours, self-intersecting geometry. Very thick (8.0) for immediate visibility. |
| **DIM_SOLID** | 13 | (26, 26, 26) Dark Gray | 1.0 | 0 | Continuous | **Dimmed solid geometry.** Background solid bodies when editing a sketch. Very dark to minimize distraction. |
| **HIDDEN_EDGE** | 14 | (204, 204, 204) Gray | 1.0 | 1 | **Dash** | **Hidden/occluded edges.** Edges behind solid surfaces. Dashed pattern is universal convention for hidden lines. |
| **OUTLINE** | 15 | (204, 204, 204) Gray | 3.0 | 5 | Continuous | **Emphasized mesh outlines.** Silhouette edges of solid bodies. Thick line (3.0) for visibility. Highest z-index (5) to appear on top. |

### 4.2 Z-Index Assignments

**What it is**: A numeric priority for draw order within the same layer.

**Why it exists**: When multiple items overlap at the same depth, z-index determines which appears on top. This ensures important items (like points) are always visible.

```cpp
// From drawentity.cpp:518-527
// Z-index calculation for entities:

if (IsPoint())                    zIndex = 6;  // Highest: points always on top
else if (how == DrawAs::HIDDEN)   zIndex = 2;  // Low: hidden lines in back
else if (group != activeGroup)    zIndex = 3;  // Medium: inactive groups
else if (hs.v == CONSTRUCTION)    zIndex = 4;  // Higher: construction visible
else                              zIndex = 5;  // High: active geometry
```

**Visual Stacking Order**:
```
Z-Index  Content              Visibility
───────  ──────────────────   ──────────────────────────────────
   6     Points               Always visible (topmost)
   5     Active group lines   Normal active geometry
   4     Construction lines   Construction geometry
   3     Inactive group       Background reference
   2     Hidden edges         Behind solid surfaces
   1     Edges                Base level (SOLID_EDGE style)
   0     (default)            Everything else
```

---

## 5. Entity Types and Visualization

### 5.1 Entity Type Definitions

**What they are**: All the geometric objects that can exist in a SolveSpace model.

**Why so many point types?**: Points can be created directly (POINT_IN_3D) or derived through transformations (POINT_N_TRANS for translation, POINT_N_ROT for rotation). Each transformation type needs different handling for solving and display.

```cpp
enum class Type : uint32_t {
    // ═══════════════════════════════════════════════════════════════
    // POINT TYPES - Represent locations in space
    // ═══════════════════════════════════════════════════════════════

    POINT_IN_3D            = 2000,
    // A point with explicit (x, y, z) coordinates in 3D space
    // Use: Standalone points, imported geometry vertices
    // Parameters: 3 (x, y, z coordinates)
    // Draggable: Yes, in all directions

    POINT_IN_2D            = 2001,
    // A point constrained to a workplane with (u, v) coordinates
    // Use: Sketch points on a workplane
    // Parameters: 2 (u, v coordinates in workplane)
    // Draggable: Yes, within the workplane

    POINT_N_TRANS          = 2010,
    // A point created by translating another point
    // Use: Step-and-repeat patterns, translated copies
    // Parameters: References source point + translation vector
    // Draggable: Only if source is draggable

    POINT_N_ROT_TRANS      = 2011,
    // A point created by rotation and translation
    // Use: Polar patterns, rotated copies
    // Parameters: References source + rotation + translation
    // Draggable: Only if source is draggable

    POINT_N_COPY           = 2012,
    // A numeric copy of a point (for linked files)
    // Use: Imported/linked geometry
    // Parameters: Stores (x, y, z) directly
    // Draggable: No (it's a fixed copy)

    POINT_N_ROT_AA         = 2013,
    // Point rotated by axis-angle representation
    // Use: Advanced rotation operations

    POINT_N_ROT_AXIS_TRANS = 2014,
    // Point rotated around axis then translated
    // Use: Helix patterns, screw operations

    // ═══════════════════════════════════════════════════════════════
    // NORMAL TYPES - Represent orientations/directions
    // ═══════════════════════════════════════════════════════════════

    NORMAL_IN_3D           = 3000,
    // A direction vector in 3D space (quaternion storage)
    // Use: Workplane orientation, extrusion direction
    // Display: Arrow with arrowhead

    NORMAL_IN_2D           = 3001,
    // A direction constrained to a workplane
    // Use: 2D orientation (like text rotation)

    NORMAL_N_COPY          = 3010,
    // Numeric copy of a normal

    NORMAL_N_ROT           = 3011,
    // Rotated copy of a normal

    NORMAL_N_ROT_AA        = 3012,
    // Axis-angle rotated normal

    // ═══════════════════════════════════════════════════════════════
    // DISTANCE TYPES - Store length values (not drawn)
    // ═══════════════════════════════════════════════════════════════

    DISTANCE               = 4000,
    // A parametric distance value
    // Use: Circle radius, arc radius
    // Display: None (data only)

    DISTANCE_N_COPY        = 4001,
    // Numeric copy of a distance

    // ═══════════════════════════════════════════════════════════════
    // FACE TYPES - Represent planar surfaces (for selection)
    // ═══════════════════════════════════════════════════════════════

    FACE_NORMAL_PT         = 5000,
    // A face defined by a normal and a point on it
    // Use: Extrusion end faces, planar surfaces

    FACE_XPROD             = 5001,
    // A face defined by cross product of two vectors

    FACE_N_ROT_TRANS       = 5002,
    // Transformed face

    // ... more face types for different transformations

    // ═══════════════════════════════════════════════════════════════
    // DRAWABLE ENTITY TYPES - Actual geometric shapes
    // ═══════════════════════════════════════════════════════════════

    WORKPLANE              = 10000,
    // A 2D drawing plane in 3D space
    // Display: Dashed rectangle with name label
    // Size: 45% of viewport
    // Purpose: Defines the plane for 2D sketching

    LINE_SEGMENT           = 11000,
    // A straight line between two points
    // Display: Solid or dashed line (based on style)
    // Required: Two endpoint points

    CUBIC                  = 12000,
    // An open cubic spline through control points
    // Display: Smooth curve rendered as Béziers
    // Required: Start point, end point, control points

    CUBIC_PERIODIC         = 12001,
    // A closed cubic spline (loop)
    // Display: Smooth closed curve
    // Required: Multiple control points (minimum 3)

    CIRCLE                 = 13000,
    // A full circle
    // Display: Circular curve (4 Bézier arcs)
    // Required: Center point, normal, radius (distance)

    ARC_OF_CIRCLE          = 14000,
    // A partial circular arc
    // Display: Arc curve (1-4 Bézier arcs depending on angle)
    // Required: Center, start point, end point, normal

    TTF_TEXT               = 15000,
    // TrueType font text
    // Display: Vector text using TTF outlines
    // Required: Position, text string, font, height

    IMAGE                  = 16000
    // A bitmap image placed in the model
    // Display: Textured quad
    // Required: Four corner points, image file path
};
```

### 5.2 Entity Drawing Modes

**What they are**: Different visual states for the same entity.

**Why they exist**: An entity looks different when selected vs. hovered vs. hidden. These modes control which appearance to use.

```cpp
enum class DrawAs {
    DEFAULT,
    // Normal appearance based on entity's style
    // When: Standard rendering of non-interactive entities
    // Layer: NORMAL
    // Color: From style (ACTIVE_GRP, CONSTRUCTION, etc.)

    OVERLAY,
    // Drawn on top regardless of depth
    // When: drawOccludedAs == VISIBLE setting
    // Layer: FRONT
    // Color: From style
    // Purpose: Show all geometry even if behind solids

    HIDDEN,
    // Drawn with stippled/dashed pattern
    // When: Entity is behind solid geometry and drawOccludedAs == STIPPLED
    // Layer: OCCLUDED
    // Color: From style
    // Stipple: DASH pattern forced
    // Purpose: Show hidden edges as dashed lines

    HOVERED,
    // Mouse cursor is over this entity
    // When: Entity == hover.entity
    // Layer: FRONT
    // Color: HOVERED style (yellow)
    // Purpose: Visual feedback for what would be selected

    SELECTED
    // Entity is in the selection set
    // When: Entity in selection list
    // Layer: FRONT
    // Color: SELECTED style (red)
    // Purpose: Show which items are selected
};
```

### 5.3 Entity-Specific Rendering Details

#### 5.3.1 Points (`drawentity.cpp:571-617`)

**What it does**: Renders point entities as visible markers.

**Visual Representation**:
```
Normal Point:          Free Point (unconstrained):
     ┌─┐                    ╔═══╗
     │█│ 7px               ║███║ 14px, cyan
     └─┘                   ║███║ (with ANALYZE style)
                           ╚═══╝
```

**Implementation Details**:
```cpp
// Points are drawn as square markers, not circular dots
// Size is specified in pixels (Unit::PX) so they're always visible

Canvas::Stroke pointStroke = {};
pointStroke.layer  = Canvas::Layer::FRONT;  // Always on top
pointStroke.zIndex = 6;                      // Highest z-index
pointStroke.color  = stroke.color;           // From style
pointStroke.width  = 7.0;                    // 7 pixel square
pointStroke.unit   = Canvas::Unit::PX;       // Pixels, not mm

// For unconstrained ("free") points, draw an extra larger marker
if(free) {
    Canvas::Stroke analyzeStroke = Style::Stroke(Style::ANALYZE);
    analyzeStroke.width = 14.0;  // 14px, twice as large
    analyzeStroke.layer = Canvas::Layer::FRONT;
    canvas->DrawPoint(p, hcsAnalyze);  // Cyan background
}
canvas->DrawPoint(p, hcsPoint);  // Normal point on top
```

**Special Behaviors**:
- Points are never drawn in HIDDEN mode (would be invisible anyway)
- "Free" points (unconstrained DOF) get an extra cyan highlight
- Points always render on FRONT layer with highest z-index

#### 5.3.2 Normals (`drawentity.cpp:619-698`)

**What it does**: Renders normal/direction vectors as arrows.

**Visual Representation**:
```
                 tip
                  ↑
                 /│\
                / │ \  12px arrowhead
               /  │  \
              ────┴────
                  │
                  │  50px length
                  │
                  │
                  ●  tail (at origin point)
```

**Implementation Details**:
```cpp
// Normals are drawn as arrows showing direction
// Reference normals (XY, YZ, ZX planes) are always visible in corner

// Reference normal colors (RGB axes convention):
if(hr == Request::HREQUEST_REFERENCE_XY) {
    stroke.color = RgbaColor::From(0, 0, luma);      // Blue (Z axis)
} else if(hr == Request::HREQUEST_REFERENCE_YZ) {
    stroke.color = RgbaColor::From(luma, 0, 0);      // Red (X axis)
} else if(hr == Request::HREQUEST_REFERENCE_ZX) {
    stroke.color = RgbaColor::From(0, luma, 0);      // Green (Y axis)
}

// Arrow construction:
Vector v = (q.RotationN()).WithMagnitude(50.0 / camera.scale);  // 50px length
Vector tip = tail.Plus(v);
canvas->DrawLine(tail, tip, hcs);  // Main shaft

// Arrowhead:
v = v.WithMagnitude(12.0 / camera.scale);  // 12px arrowhead
Vector axis = q.RotationV();
canvas->DrawLine(tip, tip.Minus(v.RotatedAbout(axis,  0.6)), hcs);  // Left wing
canvas->DrawLine(tip, tip.Minus(v.RotatedAbout(axis, -0.6)), hcs);  // Right wing
```

**Special Behaviors**:
- Reference normals appear in two places: at origin AND in screen corner
- Corner reference axes are always visible (useful for orientation)
- Colors follow RGB = XYZ convention
- "Free" normals (unconstrained rotation) get cyan highlight

#### 5.3.3 Workplanes (`drawentity.cpp:706-748`)

**What it does**: Renders workplane entities as dashed rectangles with labels.

**Visual Representation**:
```
    ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
    ╎                                 ╎
    ╎                                 ╎
    ╎      "g0002-Sketch in XY"       ╎  ← Text label
    ╎                                 ╎
    ╎                                 ╎
    └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
         ↑
    Dashed border (SHORT_DASH pattern)
```

**Implementation Details**:
```cpp
// Workplane size scales with viewport (45% of smaller dimension)
double s = (std::min(camera.width, camera.height)) * 0.45 / camera.scale;

// Create rectangle from center point and U/V directions
Vector us = u.ScaledBy(s);  // Half-width in U direction
Vector vs = v.ScaledBy(s);  // Half-height in V direction

Vector pp = p.Plus(us).Plus(vs);   // ++
Vector pm = p.Plus(us).Minus(vs);  // +-
Vector mm = p.Minus(us).Minus(vs); // --
Vector mp = p.Minus(us).Plus(vs);  // -+

// Border style: dashed
Canvas::Stroke strokeBorder = stroke;
strokeBorder.stipplePattern = StipplePattern::SHORT_DASH;
strokeBorder.stippleScale   = 8.0;

// Draw rectangle edges
canvas->DrawLine(pp, pm, hcsBorder);  // Right edge
canvas->DrawLine(mm, pm, hcsBorder);  // Bottom edge
canvas->DrawLine(mm, mp, hcsBorder);  // Left edge
canvas->DrawLine(pp, mp, hcsBorder);  // Top edge

// Draw description text in corner
canvas->DrawVectorText(shortDesc, textHeight, o, u, v, hcs);
```

**Special Behaviors**:
- Size adapts to viewport (always 45% of screen)
- Group workplanes have a notch in the corner for the label
- Text is positioned inside bottom-left corner

#### 5.3.4 Curves: Line, Circle, Arc, Cubic (`drawentity.cpp:750-801`)

**What they are**: All curve entities (lines, circles, arcs, splines).

**How they're rendered**: Curves are stored as mathematical Bézier curves, then converted to line segments for display.

**Bézier Curve Generation** (`drawentity.cpp:387-492`):
```cpp
// LINE_SEGMENT: Single linear Bézier (degree 1)
case Type::LINE_SEGMENT: {
    Vector a = point[0]->PointGetNum();
    Vector b = point[1]->PointGetNum();
    sb = SBezier::From(a, b);  // Linear: just two endpoints
}

// CIRCLE/ARC: Rational quadratic Béziers (4 segments for full circle)
case Type::CIRCLE:
case Type::ARC_OF_CIRCLE: {
    // Circles can't be exactly represented by polynomial Béziers
    // Use rational quadratic Béziers (weighted control points)

    // Split circle into 90° arcs (maximum curvature per segment)
    // Each arc uses weight = cos(angle/2) on middle control point

    for(each 90° segment) {
        SBezier sb = SBezier::From(p0, p1, p2);
        sb.weight[1] = cos(dtheta/2);  // Rational weight
        sbl->l.Add(&sb);
    }
}

// CUBIC: Interpolating spline through control points
case Type::CUBIC:
case Type::CUBIC_PERIODIC: {
    // C2-continuous cubic spline through all control points
    // Uses tridiagonal matrix solver for smooth interpolation
    ComputeInterpolatingSpline(sbl, periodic);
}
```

**Rendering Pipeline**:
```
Bézier Curves → Piecewise Linear → Edge List → DrawEdges()
     │                 │                │
     │                 │                └── Final rendering
     │                 │
     │                 └── Subdivide until chord tolerance met
     │
     └── Exact mathematical curves
```

**Chord Tolerance**: Curves are subdivided until the maximum distance from the approximation to the true curve is less than `SS.ChordTolMm()` (typically 0.5mm).

#### 5.3.5 Images (`drawentity.cpp:803-849`)

**What it does**: Renders bitmap images placed in the model.

**Visual Representation**:
```
Normal:                    Selected:                  Missing:
┌──────────────────┐      ┌──────────────────┐       ┌──────────────────┐
│ [actual image]   │      │█ █ █ █ █ █ █ █ █ │       │╲                ╱│
│                  │      │ █ █ █ █ █ █ █ █ █│       │  ╲            ╱  │
│                  │      │█ █ █ █ █ █ █ █ █ │       │    ╲        ╱    │
│                  │      │ █ █ █ █ █ █ █ █ █│       │      ╲    ╱      │
└──────────────────┘      └──────────────────┘       │        ╳        │
                          (checkered overlay)        │      ╱    ╲      │
                                                     └────╱────────╲────┘
                                                     (error X pattern)
```

**Implementation Details**:
```cpp
switch(how) {
    case DrawAs::HOVERED: {
        fill.color   = Style::Color(Style::HOVERED).WithAlpha(180);
        fill.pattern = Canvas::FillPattern::CHECKERED_A;
        fill.zIndex  = 2;
        break;
    }
    case DrawAs::SELECTED: {
        fill.color   = Style::Color(Style::SELECTED).WithAlpha(180);
        fill.pattern = Canvas::FillPattern::CHECKERED_B;
        fill.zIndex  = 1;
        break;
    }
    default:
        fill.color = RgbaColor::FromFloat(1.0f, 1.0f, 1.0f);
        pixmap     = SS.images[file];  // Load from cache
        break;
}

// If image file is missing, draw error X
if(how == DrawAs::DEFAULT && pixmap == NULL) {
    canvas->DrawLine(v[0], v[2], hs);  // Diagonal
    canvas->DrawLine(v[1], v[3], hs);  // Other diagonal
    // Plus border rectangle
}
```

---

## 6. Constraint Visualization

### 6.1 Constraint Types Overview

**What constraints are**: Mathematical relationships between entities that the solver enforces.

**Why they're visualized**: Users need to see what constraints exist and their values. Visualization helps understand why geometry behaves a certain way.

```cpp
// ═══════════════════════════════════════════════════════════════
// COINCIDENCE CONSTRAINTS - Points at the same location
// ═══════════════════════════════════════════════════════════════

POINTS_COINCIDENT = 20
// Two points are at the same location
// Visual: No explicit indicator (points overlap)
// Note: Implicitly shown by overlapping points

// ═══════════════════════════════════════════════════════════════
// DISTANCE CONSTRAINTS - Specify lengths/distances
// ═══════════════════════════════════════════════════════════════

PT_PT_DISTANCE = 30
// Distance between two points
// Visual: Dimension line with arrows and value label
//    ●←─────25.4─────→●

PT_PLANE_DISTANCE = 31
// Distance from point to plane
// Visual: Perpendicular dimension line

PT_LINE_DISTANCE = 32
// Distance from point to line
// Visual: Perpendicular dimension from point to line

PT_FACE_DISTANCE = 33
// Distance from point to face
// Visual: Perpendicular dimension line

PROJ_PT_DISTANCE = 34
// Projected distance (along a direction)
// Visual: Dimension with projected line shown dashed

// ═══════════════════════════════════════════════════════════════
// POSITIONAL CONSTRAINTS - Points on entities
// ═══════════════════════════════════════════════════════════════

PT_IN_PLANE = 41
// Point lies in a plane
// Visual: Dashed line from point perpendicular to plane

PT_ON_LINE = 42
// Point lies on a line
// Visual: Small marker at coincidence point

PT_ON_FACE = 43
// Point lies on a face surface
// Visual: Dashed line perpendicular to face

PT_ON_CIRCLE = 100
// Point lies on a circle
// Visual: Small marker at coincidence point

// ═══════════════════════════════════════════════════════════════
// LENGTH EQUALITY CONSTRAINTS - Same lengths
// ═══════════════════════════════════════════════════════════════

EQUAL_LENGTH_LINES = 50
// Two lines have equal length
// Visual: Tick marks on both lines
//    ───/───      ───/───

LENGTH_RATIO = 51
// Lines have a specific length ratio
// Visual: Label showing ratio "2.5:1"

EQ_LEN_PT_LINE_D = 52
// Line length equals point-to-line distance

EQ_PT_LN_DISTANCES = 53
// Two point-to-line distances are equal

EQUAL_ANGLE = 54
// Two angles are equal

EQUAL_LINE_ARC_LEN = 55
// Line length equals arc length

LENGTH_DIFFERENCE = 56
// Lines differ by specific amount

// ═══════════════════════════════════════════════════════════════
// SYMMETRY CONSTRAINTS - Mirror relationships
// ═══════════════════════════════════════════════════════════════

SYMMETRIC = 60
// Points symmetric about a plane
// Visual: Dashed line connecting points through mirror plane

SYMMETRIC_HORIZ = 61
// Points symmetric about horizontal axis
// Visual: Horizontal dashed line between points

SYMMETRIC_VERT = 62
// Points symmetric about vertical axis
// Visual: Vertical dashed line between points

SYMMETRIC_LINE = 63
// Points symmetric about a line
// Visual: Dashed lines to mirror line

// ═══════════════════════════════════════════════════════════════
// MIDPOINT AND ALIGNMENT CONSTRAINTS
// ═══════════════════════════════════════════════════════════════

AT_MIDPOINT = 70
// Point at midpoint of line
// Visual: Small "M" marker or midpoint symbol

HORIZONTAL = 80
// Line is horizontal (in workplane)
// Visual: Small "H" symbol near line
//    ═══H═══

VERTICAL = 81
// Line is vertical (in workplane)
// Visual: Small "V" symbol near line
//    ║
//    V
//    ║

// ═══════════════════════════════════════════════════════════════
// DIAMETER/RADIUS CONSTRAINTS
// ═══════════════════════════════════════════════════════════════

DIAMETER = 90
// Circle/arc diameter (or radius if .other is set)
// Visual: Dimension line through/to center
//    ⌀25.4  or  R12.7

EQUAL_RADIUS = 130
// Two circles have same radius
// Visual: "R=" symbol on both circles

// ═══════════════════════════════════════════════════════════════
// ANGULAR CONSTRAINTS
// ═══════════════════════════════════════════════════════════════

SAME_ORIENTATION = 110
// Two normals point in same direction

ANGLE = 120
// Angle between two lines
// Visual: Arc with angle value
//           45°
//          ╱
//         ╱
//    ────╱

PARALLEL = 121
// Lines are parallel
// Visual: "//" symbol between lines

PERPENDICULAR = 122
// Lines are perpendicular
// Visual: "⊥" symbol at intersection

// ═══════════════════════════════════════════════════════════════
// TANGENCY CONSTRAINTS
// ═══════════════════════════════════════════════════════════════

ARC_LINE_TANGENT = 123
// Arc is tangent to line
// Visual: "T" symbol at tangent point

CUBIC_LINE_TANGENT = 124
// Spline is tangent to line

CURVE_CURVE_TANGENT = 125
// Two curves are tangent
// Visual: "T" symbol at tangent point

// ═══════════════════════════════════════════════════════════════
// SPECIAL CONSTRAINTS
// ═══════════════════════════════════════════════════════════════

WHERE_DRAGGED = 200
// Point fixed at its current position
// Visual: Anchor/lock symbol

COMMENT = 1000
// User text annotation (not a real constraint)
// Visual: Just the text, no constraint enforcement
```

### 6.2 Constraint Rendering Components

**What they are**: Helper functions for drawing constraint annotations.

#### DoLine - Basic Line Drawing
```cpp
void Constraint::DoLine(Canvas *canvas, Canvas::hStroke hcs, Vector a, Vector b)
// Purpose: Draw a single line between two points, aligned to pixel grid
// Used for: Leader lines, dimension lines, construction lines
//
// Pixel grid alignment prevents fuzzy/blurry lines on screen:
//    Without alignment:  ▒▒▒▒▒▒  (anti-aliased blur)
//    With alignment:     ████████  (crisp pixels)
```

#### DoStippledLine - Dashed Reference Lines
```cpp
void Constraint::DoStippledLine(Canvas *canvas, Canvas::hStroke hcs, Vector a, Vector b)
// Purpose: Draw a dashed line for reference/projected elements
// Used for: Projection lines, construction reference
// Pattern: SHORT_DASH with scale 4.0
//    - - - - - - - - - - - - -
```

#### DoLabel - Text Labels
```cpp
void Constraint::DoLabel(Canvas *canvas, Canvas::hStroke hcs,
                        Vector ref, Vector *labelPos, Vector gr, Vector gu)
// Purpose: Draw the constraint value as text
// Used for: "25.4", "45°", "⌀50", etc.
//
// Label positioning:
//    ref = reference point (usually center of dimension)
//    gr = right direction for text
//    gu = up direction for text
//    labelPos = output: actual position where label was drawn
//
// Text alignment based on style settings:
//    TextOrigin::LEFT   = left-aligned
//    TextOrigin::CENTER = centered (default)
//    TextOrigin::RIGHT  = right-aligned
```

#### DoLineTrimmedAgainstBox - Smart Dimension Lines
```cpp
int Constraint::DoLineTrimmedAgainstBox(Canvas *canvas, Canvas::hStroke hcs,
                                        Vector ref, Vector a, Vector b, bool extend)
// Purpose: Draw dimension line that doesn't overlap with label
//
// Case 1: Line passes through label box
//    Before:  ●──────────────●
//                  25.4
//    After:   ●────┘    └────●
//                  25.4
//
// Case 2: Label is beyond line
//    Before:  ●────────●
//                        25.4
//    After:   ●────────●────┘
//                        25.4
//
// Returns:
//    0 = label is between the points (line was split)
//    1 = label is beyond point a (line extended toward a)
//   -1 = label is beyond point b (line extended toward b)
```

#### DoArrow - Arrowheads
```cpp
void Constraint::DoArrow(Canvas *canvas, Canvas::hStroke hcs,
                        Vector p, Vector dir, Vector n,
                        double width, double angle, double da)
// Purpose: Draw arrowhead at dimension line end
//
// Parameters:
//    p     = tip of arrow
//    dir   = direction arrow points
//    n     = normal to plane (for 2D rotation)
//    width = length of arrowhead barbs
//    angle = half-angle of arrowhead opening
//    da    = additional rotation offset
//
// Visual:
//         dir →
//        ────────▶
//              / \
//             /   \
//            width
```

### 6.3 Dimension Label Formatting

**What it does**: Formats constraint values for display.

```cpp
std::string Constraint::Label() const {
    // ANGLES: degrees with ° symbol
    if(type == Type::ANGLE) {
        return SS.DegreeToString(valA) + "°";
        // Examples: "45°", "90°", "30.5°"
    }

    // RATIOS: formatted as "X:1"
    if(type == Type::LENGTH_RATIO || type == Type::ARC_ARC_LEN_RATIO || ...) {
        return ssprintf("%.3f:1", valA);
        // Examples: "2.000:1", "0.500:1"
    }

    // COMMENTS: user-entered text
    if(type == Type::COMMENT) {
        return comment;  // Raw string
    }

    // DIAMETERS: with ⌀ or R prefix
    if(type == Type::DIAMETER) {
        if(!other) {
            return "⌀" + SS.MmToStringSI(valA);      // "⌀25.4"
        } else {
            return "R" + SS.MmToStringSI(valA / 2);  // "R12.7"
        }
    }

    // ALL OTHER DISTANCES: SI formatted
    return SS.MmToStringSI(fabs(valA));
    // Examples: "25.4", "1.5 m", "0.5 mm"

    // Reference constraints get " REF" suffix
    if(reference) {
        result += " REF";  // "25.4 REF"
    }
}
```

**SI Formatting Examples**:
```
Value (mm)    Formatted
──────────    ─────────
0.001         "1 μm"
0.1           "0.1 mm"  or  "100 μm"
1.0           "1 mm"
10.0          "10 mm"   or  "1 cm"
100.0         "100 mm"  or  "10 cm"
1000.0        "1 m"
```

---

## 7. Camera System

### 7.1 Camera Properties

**What it is**: Controls how 3D geometry is projected onto the 2D screen.

**Why it matters**: Proper camera handling is essential for intuitive navigation. The camera supports both orthographic (CAD-style) and perspective viewing.

```cpp
class Camera {
    // ═══════════════════════════════════════════════════════════════
    // VIEWPORT SIZE
    // ═══════════════════════════════════════════════════════════════

    double width;       // Viewport width in pixels
    double height;      // Viewport height in pixels
    double pixelRatio;  // Device pixel ratio (for HiDPI displays)
                        // Example: 2.0 on Retina displays

    // ═══════════════════════════════════════════════════════════════
    // VIEW ORIENTATION
    // ═══════════════════════════════════════════════════════════════

    Vector offset;      // Position of view center in model space
                        // Pan the view by changing this
                        // Example: offset = (0,0,0) centers on origin

    Vector projRight;   // "Right" direction in view space
                        // This is the X axis of the screen in model coords
                        // Length should be 1.0 (unit vector)

    Vector projUp;      // "Up" direction in view space
                        // This is the Y axis of the screen in model coords
                        // Length should be 1.0 (unit vector)
                        // projRight × projUp = view direction (into screen)

    // ═══════════════════════════════════════════════════════════════
    // ZOOM AND PROJECTION
    // ═══════════════════════════════════════════════════════════════

    double scale;       // Zoom level: pixels per model unit (mm)
                        // Larger = more zoomed in
                        // Example: scale=10 means 10 pixels per mm

    double tangent;     // Perspective amount (0 = orthographic)
                        // tan(field_of_view / 2)
                        // Example: 0.0 = orthographic (parallel projection)
                        //          0.3 = mild perspective
                        //          0.5 = strong perspective

    // ═══════════════════════════════════════════════════════════════
    // RENDERING OPTIONS
    // ═══════════════════════════════════════════════════════════════

    bool gridFit;       // Snap coordinates to pixel boundaries
                        // Prevents blurry lines from sub-pixel positioning
};
```

### 7.2 Camera Methods

```cpp
bool IsPerspective() const { return tangent != 0.0; }
// Returns true if using perspective projection
// Orthographic: parallel lines stay parallel
// Perspective: parallel lines converge at horizon

Point2d ProjectPoint(Vector p) const;
// Convert 3D model point to 2D screen coordinates
// Input: 3D point in model space
// Output: 2D point in screen pixels (origin at center)
//
// Algorithm (orthographic):
//    screenX = (p - offset) · projRight * scale
//    screenY = (p - offset) · projUp * scale

Vector UnProjectPoint(Point2d p) const;
// Convert 2D screen point to 3D model coordinates
// Input: 2D screen position
// Output: 3D point on the view plane
// Note: Result is on the plane through offset, perpendicular to view

Vector ProjectPoint3(Vector p) const;
// Project 3D point and keep depth information
// Output.x, .y = screen position
// Output.z = depth (for depth sorting)

Vector ProjectPoint4(Vector p, double *w) const;
// Full perspective projection with homogeneous coordinate
// Returns (x, y, z) where:
//    actual_screen_x = x / w
//    actual_screen_y = y / w
// Used for proper perspective-correct interpolation

Vector AlignToPixelGrid(Vector v) const;
// Round coordinates to nearest pixel boundary
// Prevents anti-aliasing blur on lines
// Example:
//    Input:  (100.3, 200.7, 0)
//    Output: (100.0, 201.0, 0)

SBezier ProjectBezier(SBezier b) const;
// Project a 3D Bézier curve to 2D screen space
// For orthographic: simple projection of control points
// For perspective: more complex (curves can change degree)
```

**Projection Diagrams**:
```
ORTHOGRAPHIC (tangent = 0):
                                    Screen
Model Space                           │
                                      │
    ●───────────────────────────────→ │ ●
    ●───────────────────────────────→ │ ●
    ●───────────────────────────────→ │ ●
                                      │
    Parallel rays                     │

PERSPECTIVE (tangent > 0):
                                    Screen
Model Space                           │
                                      │
    ●─────────────────────────────╲   │
    ●─────────────────────────────── ●│ ← Rays converge
    ●─────────────────────────────╱   │
                                      │
    Converging rays               Eye
```

---

## 8. Lighting System

### 8.1 Lighting Properties

**What it is**: Controls how surfaces are shaded to show 3D form.

**Why it matters**: Lighting makes 3D objects readable. Without lighting, everything looks flat.

```cpp
class Lighting {
    RgbaColor backgroundColor;
    // The clear color for the viewport
    // Default: Light gray (~238, 242, 245)
    // Error state: Red tinted

    double ambientIntensity;
    // Base illumination for all surfaces (0.0 to 1.0)
    // This prevents completely black shadows
    // Typical: 0.3 (30% base brightness)

    double lightIntensity[2];
    // Brightness of two directional lights (0.0 to 1.0)
    // Two lights create more readable shading
    // Typical: [0.7, 0.3] (primary 70%, fill 30%)

    Vector lightDirection[2];
    // Direction vectors for the two lights
    // Points FROM light source (normalized)
    // Typical: Upper-left primary, lower-right fill
};
```

**Lighting Model**:
```
Final_Color = Ambient + Diffuse

Where:
    Ambient = material_color × ambientIntensity
    Diffuse = material_color × Σ(lightIntensity[i] × max(0, N·L[i]))

    N = surface normal
    L[i] = light direction (normalized)
```

**Visual Effect**:
```
With lighting:                Without lighting:
    ╭───────────╮                ███████████
   ╱ ░░░░░░░░░ ╲              █████████████
  │░░░░░░░░░░░░░│             █████████████
  │░░░░░░░░░░░░░│             █████████████
   ╲░░░░░░░░░░░╱              █████████████
    ╰───────────╯                ███████████

  (3D sphere visible)          (flat circle)
```

---

## 9. Selection and Hit Testing

### 9.1 ObjectPicker Class

**What it is**: A special Canvas implementation that tests for hits instead of drawing.

**Why it exists**: When the user clicks, we need to know which entity they clicked on. The ObjectPicker uses the same drawing code but checks distance to mouse instead of rendering.

```cpp
class ObjectPicker : public Canvas {
    // ═══════════════════════════════════════════════════════════════
    // INPUT: What are we testing against?
    // ═══════════════════════════════════════════════════════════════

    Camera camera;          // Current view (same as for rendering)
    Point2d point;          // Mouse position in screen coordinates
    double selRadius;       // Selection tolerance in pixels
                           // Example: 10.0 means within 10 pixels

    // ═══════════════════════════════════════════════════════════════
    // STATE: Best hit so far
    // ═══════════════════════════════════════════════════════════════

    double minDistance;     // Distance to closest hit (pixels)
                           // Initialize to very large value

    double minDepth;        // Depth of closest hit (for ties)
                           // Closer to camera wins

    int maxZIndex;          // Z-index of best hit
                           // Higher z-index wins over lower

    uint32_t position;      // Identifier for where on entity was hit
                           // Example: 0=start point, 1=end point, 2=middle

    // ═══════════════════════════════════════════════════════════════
    // METHODS
    // ═══════════════════════════════════════════════════════════════

    bool Pick(const std::function<void()> &drawFn);
    // Run the drawing function but collect hit data instead
    // Returns true if anything was hit within selRadius
    //
    // Usage:
    //    ObjectPicker picker;
    //    picker.point = mousePos;
    //    picker.selRadius = 10.0;
    //    bool hit = picker.Pick([&]() {
    //        entity.Draw(Entity::DrawAs::DEFAULT, &picker);
    //    });

    void DoCompare(double depth, double distance, int zIndex, int comparePosition);
    // Called for each piece of geometry
    // Updates minDistance/minDepth/maxZIndex if this is better hit
    //
    // Priority order:
    //    1. Within selection radius (distance < selRadius)
    //    2. Higher z-index (points over lines over faces)
    //    3. Closer distance
    //    4. Closer depth (for ties)
};
```

**Hit Priority Algorithm**:
```cpp
// Pseudocode for hit comparison
if (new_distance < selRadius) {
    if (new_distance < current_best_distance) {
        // Clearly closer - take it
        accept_new_hit();
    }
    else if (new_zIndex > current_best_zIndex) {
        // Higher z-index wins (points over lines)
        accept_new_hit();
    }
    else if (new_zIndex == current_best_zIndex) {
        if (new_distance < current_best_distance) {
            // Same z-index, but closer
            accept_new_hit();
        }
        else if (new_distance == current_best_distance) {
            if (new_depth < current_best_depth) {
                // Same everything, but closer to camera
                accept_new_hit();
            }
        }
    }
}
```

### 9.2 Selection State Management

**What it is**: Tracks which entities and constraints are currently selected.

```cpp
class Selection {
    hEntity entity;         // Handle to selected entity (0 if none)
    hConstraint constraint; // Handle to selected constraint (0 if none)
    bool emphasized;        // Draw emphasis line from corner

    // Only one of entity or constraint can be set
    // Both can be 0 (empty selection)
};

// The full selection is a list of Selection objects
// Supports multi-select (Ctrl+click / Shift+click)
```

### 9.3 Selection Visualization

**What it does**: Draws visual feedback for selected and hovered items.

```cpp
void Selection::Draw(bool isHovered, Canvas *canvas) {
    // 1. Draw the entity/constraint in highlight color
    if(entity.v) {
        Entity *e = SK.GetEntity(entity);
        e->Draw(isHovered ? Entity::DrawAs::HOVERED :    // Yellow
                           Entity::DrawAs::SELECTED,    // Red
                canvas);
    }

    // 2. If emphasized, draw line from screen corner to reference point
    if(emphasized && (constraint.v || entity.v)) {
        // Get reference points of entity
        std::vector<Vector> refs;
        e->GetReferencePoints(&refs);

        // Draw thick semi-transparent line from top-left corner
        Canvas::Stroke strokeEmphasis = {};
        strokeEmphasis.layer = Canvas::Layer::FRONT;
        strokeEmphasis.color = Style::Color(Style::HOVERED).WithAlpha(50);
        strokeEmphasis.width = 40;  // Very thick!
        strokeEmphasis.unit  = Canvas::Unit::PX;

        Vector topLeft = ... // Top-left corner of screen
        for(const Vector &p : refs) {
            canvas->DrawLine(topLeft, p, hcsEmphasis);
        }
    }
}
```

**Visual Example of Emphasis**:
```
┌───────────────────────────────────────────────────┐
│╲                                                  │
│ ╲                                                 │
│  ╲                                                │
│   ╲                                               │
│    ╲                                              │
│     ╲                  ┌────┐                     │
│      ╲                 │    │                     │
│       ╲───────────────→●    │ ← Selected entity   │
│         Emphasis line  │    │                     │
│                        └────┘                     │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 10. Mesh Rendering

### 10.1 Data Structures

**What they are**: The geometric data for solid 3D shapes.

```cpp
struct STriangle {
    // ═══════════════════════════════════════════════════════════════
    // VERTEX POSITIONS
    // ═══════════════════════════════════════════════════════════════

    Vector a, b, c;     // Three vertices of the triangle
                        // In counter-clockwise order (front face)
                        //
                        //         b
                        //        ╱╲
                        //       ╱  ╲
                        //      ╱    ╲
                        //     ╱      ╲
                        //    a────────c
                        //
                        // Front face: visible when looking at CCW winding

    // ═══════════════════════════════════════════════════════════════
    // VERTEX NORMALS
    // ═══════════════════════════════════════════════════════════════

    Vector an, bn, cn;  // Normal vector at each vertex
                        // Used for smooth shading (Gouraud/Phong)
                        //
                        // Flat shading: an = bn = cn = face normal
                        // Smooth shading: averaged normals from adjacent faces
                        //
                        //       bn↑
                        //        ╱╲
                        //   an↑ ╱  ╲ cn↑
                        //      ╱    ╲
                        //     a──────c

    // ═══════════════════════════════════════════════════════════════
    // METADATA
    // ═══════════════════════════════════════════════════════════════

    uint32_t meta;      // Face identifier and flags
                        // Used for selection (which face was clicked)
                        // Bits: face ID + flags
};

struct SMesh {
    List<STriangle> l;   // List of all triangles
                         // A cube has 12 triangles (2 per face)

    bool isTransparent;  // Contains any transparent materials
                         // If true, needs special sorting for correct rendering

    bool flipNormals;    // Invert all normals
                         // Used when viewing inside of shell

    bool keepCoplanar;   // Don't merge coplanar triangles
                         // Important for correct face selection
};

struct SEdge {
    Vector a, b;         // Edge endpoints
                         //    a●──────────●b

    int auxA, auxB;      // Auxiliary data
                         // auxA: Style handle
                         // auxB: Segment index (for curves)

    int tag;             // Selection/grouping tag
                         // Used to identify which entity this edge belongs to
};

struct SOutline {
    Vector a, b;         // Edge endpoints

    Vector nl, nr;       // Surface normals of adjacent faces
                         //
                         //     nl↑  │  ↑nr
                         //       ╲  │  ╱
                         //        ╲ │ ╱
                         //         ╲│╱
                         //    a─────●─────b
                         //
                         // If nl·view and nr·view have different signs,
                         // this is a contour edge (silhouette)

    int tag;             // Edge type tag
};
```

### 10.2 Mesh Rendering Modes

```cpp
enum class DrawMeshAs {
    DEFAULT,
    // Normal shaded rendering
    // Fill: Material color with lighting
    // Use: Standard solid body display

    HOVERED,
    // Mouse is over this mesh
    // Fill: Semi-transparent checkered overlay
    // Use: Visual feedback before selection

    SELECTED
    // Mesh faces are selected
    // Fill: Different checkered pattern overlay
    // Use: Show which faces are in selection
};
```

### 10.3 Face Selection Patterns

**Why two patterns?**: When a face is both selected AND hovered, users need to see both states. The two checkered patterns are offset so they don't cancel out.

```cpp
// CHECKERED_A (for selection):
//    █ █ █ █
//     █ █ █ █
//    █ █ █ █
//     █ █ █ █

// CHECKERED_B (for hover):
//     █ █ █ █
//    █ █ █ █
//     █ █ █ █
//    █ █ █ █

// When combined (selected + hovered):
//    ██  ██
//      ██  ██
//    ██  ██
//      ██  ██
// (alternating larger squares)
```

---

## 11. Grid Rendering

### 11.1 Snap Grid

**What it is**: A visual grid on the active workplane to help with alignment.

**Why it exists**: Grids help users align geometry and estimate distances visually.

```cpp
void GraphicsWindow::DrawSnapGrid(Canvas *canvas) {
    // ═══════════════════════════════════════════════════════════════
    // GRID PROPERTIES
    // ═══════════════════════════════════════════════════════════════

    // Grid spacing from settings (e.g., 10mm, 1mm, 0.1mm)
    double g = SS.gridSpacing;

    // Grid style
    Canvas::Stroke stroke = {};
    stroke.layer = Canvas::Layer::BACK;      // Behind everything
    stroke.color = Style::Color(Style::DATUM).WithAlpha(75);  // Subtle
    stroke.unit  = Canvas::Unit::PX;
    stroke.width = 1.0f;                     // 1 pixel wide

    // ═══════════════════════════════════════════════════════════════
    // GRID CALCULATION
    // ═══════════════════════════════════════════════════════════════

    // 1. Get active workplane
    hEntity he = ActiveWorkplane();
    Vector wp = workplane_origin;
    Vector wu = workplane_u_direction;
    Vector wv = workplane_v_direction;

    // 2. Find grid extent (what's visible on screen)
    // Project screen corners onto workplane
    // Find min/max U and V coordinates

    // 3. Limit grid density (max 400 lines per axis)
    // Prevents performance issues when very zoomed out
    if(i1 - i0 > 400) return;  // Too many lines, don't draw

    // ═══════════════════════════════════════════════════════════════
    // GRID DRAWING
    // ═══════════════════════════════════════════════════════════════

    // Draw vertical lines (constant U)
    for(i = i0 + 1; i < i1; i++) {
        Vector lineStart = wp + wu*(i*g) + wv*(j0*g);
        Vector lineEnd   = wp + wu*(i*g) + wv*(j1*g);
        canvas->DrawLine(lineStart, lineEnd, hcs);
    }

    // Draw horizontal lines (constant V)
    for(j = j0 + 1; j < j1; j++) {
        Vector lineStart = wp + wu*(i0*g) + wv*(j*g);
        Vector lineEnd   = wp + wu*(i1*g) + wv*(j*g);
        canvas->DrawLine(lineStart, lineEnd, hcs);
    }
}
```

**Visual Appearance**:
```
Grid on XY workplane (looking down Z axis):
┌─────────────────────────────────────────┐
│  │  │  │  │  │  │  │  │  │  │  │  │  │  │
│──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──│
│  │  │  │  │  │  │  │  │  │  │  │  │  │  │
│──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──│
│  │  │  │  │  │  │  │  │  │  │  │  │  │  │
│──┼──┼──┼──┼──┼──┼──╋──┼──┼──┼──┼──┼──┼──│ ← Origin (0,0)
│  │  │  │  │  │  │  │  │  │  │  │  │  │  │
│──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──│
│  │  │  │  │  │  │  │  │  │  │  │  │  │  │
└─────────────────────────────────────────┘
Spacing: SS.gridSpacing (e.g., 10mm)
```

---

## 12. Main Rendering Flow

### 12.1 Paint Sequence

**What it is**: The top-level function called each frame to render everything.

```cpp
void GraphicsWindow::Paint() {
    // ═══════════════════════════════════════════════════════════════
    // STEP 1: SETUP
    // ═══════════════════════════════════════════════════════════════

    Camera camera = GetCamera();
    // Get current viewport size, zoom, orientation
    // This defines how 3D maps to 2D

    Lighting lighting = GetLighting();
    // Get ambient and directional light settings

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: ERROR STATE CHECK
    // ═══════════════════════════════════════════════════════════════

    if(!SS.ActiveGroupsOkay()) {
        // Solver has errors - change background to red-tinted
        // This immediately signals a problem to the user
        RgbaColor bgColor = Style::Color(Style::DRAW_ERROR);
        bgColor = RgbaColor::FromFloat(0.4f*bgColor.redF(), ...);
        lighting.backgroundColor = bgColor;

        // Also force text window visible (shows error details)
        ForceTextWindowShown();
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: RENDER 3D CONTENT
    // ═══════════════════════════════════════════════════════════════

    canvas->SetLighting(lighting);
    canvas->SetCamera(camera);
    canvas->StartFrame();   // Clear buffers

    Draw(canvas.get());     // ← Main drawing function (see below)

    canvas->FlushFrame();   // Execute draw commands

    // ═══════════════════════════════════════════════════════════════
    // STEP 4: RENDER 2D OVERLAY
    // ═══════════════════════════════════════════════════════════════

    // Switch to 2D screen-space camera
    camera.LoadIdentity();
    camera.offset.x = -(double)camera.width / 2.0;
    camera.offset.y = -(double)camera.height / 2.0;
    canvas->SetCamera(camera);

    UiCanvas uiCanvas = {};
    uiCanvas.canvas = canvas;

    // Draw marquee selection rectangle if dragging
    if(pending.operation == Pending::DRAGGING_MARQUEE) {
        uiCanvas.DrawRect(..., fillColor, outlineColor);
    }

    // Draw toolbar if enabled
    if(SS.showToolbar) {
        ToolbarDraw(&uiCanvas);
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 5: FINALIZE
    // ═══════════════════════════════════════════════════════════════

    canvas->FlushFrame();
    canvas->FinishFrame();  // Swap buffers
    canvas->Clear();        // Reset for next frame
}
```

### 12.2 Draw Sequence

**What it is**: The function that draws all 3D model content.

```cpp
void GraphicsWindow::Draw(Canvas *canvas) {
    // ═══════════════════════════════════════════════════════════════
    // LAYER 1: BACKGROUND
    // ═══════════════════════════════════════════════════════════════

    if(showSnapGrid) {
        DrawSnapGrid(canvas);
        // Draws grid lines on BACK layer
    }

    // ═══════════════════════════════════════════════════════════════
    // LAYER 2: PERSISTENT GEOMETRY (Cached)
    // ═══════════════════════════════════════════════════════════════

    // These don't change with rotation, so they can be cached

    if(persistentCanvas != NULL) {
        if(persistentDirty) {
            // Rebuild cache
            persistentCanvas->Clear();
            DrawPersistent(&*persistentCanvas);
            persistentCanvas->Finalize();
            persistentDirty = false;
        }
        persistentCanvas->Draw();  // Draw from cache
    } else {
        DrawPersistent(canvas);    // Draw directly
    }

    // DrawPersistent includes:
    //   - Active group mesh and edges
    //   - Normals and workplanes (persistent entities)
    //   - Filled paths in all groups

    // ═══════════════════════════════════════════════════════════════
    // LAYER 3: VIEWPORT-DEPENDENT ENTITIES
    // ═══════════════════════════════════════════════════════════════

    DrawEntities(canvas, /*persistent=*/false);
    // Draws all non-persistent entities:
    //   - Points, lines, curves
    //   - These may have hidden-line states that depend on view

    // ═══════════════════════════════════════════════════════════════
    // LAYER 4: ERROR INDICATORS
    // ═══════════════════════════════════════════════════════════════

    if(SS.checkClosedContour) {
        SK.GetGroup(activeGroup)->DrawPolyError(canvas);
        // Highlights unclosed contours, self-intersections
    }

    // ═══════════════════════════════════════════════════════════════
    // LAYER 5: CONSTRAINTS
    // ═══════════════════════════════════════════════════════════════

    for(Constraint &c : SK.constraint) {
        c.Draw(Constraint::DrawAs::DEFAULT, canvas);
        // Dimension lines, labels, symbols
    }

    // Contour area labels
    if(SS.showContourAreas) {
        for(each visible group) {
            g->DrawContourAreaLabels(canvas);
            // Shows area in mm² for closed regions
        }
    }

    // Pending constraint preview
    if(dragging new line && has suggestion) {
        // Show H or V constraint that would be auto-added
        pendingConstraint.Draw(...);
    }

    // ═══════════════════════════════════════════════════════════════
    // LAYER 6: ANALYSIS OVERLAYS
    // ═══════════════════════════════════════════════════════════════

    // Traced path (for debugging/analysis)
    canvas->DrawEdges(SS.traced.path, hcsAnalyze);

    // Naked edges (from Analyze → Show Naked Edges)
    canvas->DrawEdges(SS.nakedEdges, hcsError);

    // ═══════════════════════════════════════════════════════════════
    // LAYER 7: INTERACTION FEEDBACK (Always on top)
    // ═══════════════════════════════════════════════════════════════

    // Hover highlight
    hover.Draw(/*isHovered=*/true, canvas);
    SK.GetGroup(activeGroup)->DrawMesh(Group::DrawMeshAs::HOVERED, canvas);

    // Selection highlight
    for(Selection *s = selection.First(); s; s = selection.NextAfter(s)) {
        s->Draw(/*isHovered=*/false, canvas);
    }
    SK.GetGroup(activeGroup)->DrawMesh(Group::DrawMeshAs::SELECTED, canvas);

    // ═══════════════════════════════════════════════════════════════
    // LAYER 8: MISC OVERLAYS
    // ═══════════════════════════════════════════════════════════════

    // Extra reference line (rotation origin indicator)
    if(SS.extraLine.draw) {
        canvas->DrawLine(SS.extraLine.ptA, SS.extraLine.ptB, hcsDatum);
    }

    // Center of mass indicator
    if(SS.centerOfMass.draw && !SS.centerOfMass.dirty) {
        // Crosshair + circle + coordinate text
    }

    // Export preview annotation
    if(SS.justExportedInfo.draw) {
        // Shows origin and message for export preview
    }
}
```

**Rendering Order Summary**:
```
Draw Order (back to front):
────────────────────────────────────────────────────────
 1. Background grid          │ BACK layer
────────────────────────────────────────────────────────
 2. Mesh surfaces           │
 3. Mesh edges              │ NORMAL layer (depth tested)
 4. Sketch entities         │
────────────────────────────────────────────────────────
 5. Hidden edges (dashed)   │ OCCLUDED layer
────────────────────────────────────────────────────────
 6. Error indicators        │
 7. Constraints/dimensions  │ NORMAL layer (above geometry)
 8. Analysis overlays       │
 9. Hover highlight         │ FRONT layer (always on top)
10. Selection highlight     │
11. Misc overlays           │
────────────────────────────────────────────────────────
```

---

## 13. Three.js Migration Mapping

### 13.1 Canvas Abstraction → Three.js

| SolveSpace Method | Three.js Implementation | Notes |
|-------------------|------------------------|-------|
| `DrawLine(a, b, stroke)` | `THREE.Line` with `LineBasicMaterial` | Single line segment |
| `DrawEdges(list, stroke)` | `THREE.LineSegments` with `BufferGeometry` | Batch of disconnected lines |
| `DrawPoint(p, stroke)` | `THREE.Points` with `PointsMaterial` | Point size in material |
| `DrawMesh(mesh, fill)` | `THREE.Mesh` with `MeshStandardMaterial` | Lighting built-in |
| `DrawBeziers(curves, stroke)` | `THREE.Line` with subdivided points | Three.js can't render Béziers directly |
| `DrawVectorText(text, ...)` | `troika-three-text` or HTML overlay | troika-three-text recommended |
| `DrawPixmap(img, ...)` | `THREE.Mesh` with `PlaneGeometry` + `MeshBasicMaterial` | Set material.map to texture |
| `DrawQuad(a,b,c,d, fill)` | `THREE.Mesh` with custom `BufferGeometry` | Two triangles |
| `DrawPolygon(poly, fill)` | `THREE.Mesh` with triangulated geometry | Use earcut for triangulation |
| `DrawOutlines(outlines, ...)` | `THREE.LineSegments` with visibility shader | Need custom shader for contour detection |

### 13.2 Layer System → Three.js

```javascript
// Layer implementation using renderOrder and material properties

const LAYERS = {
  BACK: {
    renderOrder: -100,
    depthTest: false,
    depthWrite: false
  },
  DEPTH_ONLY: {
    renderOrder: -50,
    colorWrite: false,
    depthTest: true,
    depthWrite: true
  },
  NORMAL: {
    renderOrder: 0,
    depthTest: true,
    depthWrite: true
  },
  OCCLUDED: {
    renderOrder: 50,
    depthTest: true,
    depthFunc: THREE.GreaterDepth,  // Only where behind
    // Plus custom shader for dashed rendering
  },
  FRONT: {
    renderOrder: 100,
    depthTest: false,
    depthWrite: false
  }
};

// Apply to material:
function applyLayer(material, layer) {
  const config = LAYERS[layer];
  material.depthTest = config.depthTest;
  material.depthWrite = config.depthWrite;
  if (config.colorWrite !== undefined) {
    material.colorWrite = config.colorWrite;
  }
  return config.renderOrder;
}
```

### 13.3 Stroke/Fill → Materials

```javascript
// Stroke to LineBasicMaterial/LineDashedMaterial
function createStrokeMaterial(stroke) {
  const params = {
    color: new THREE.Color(
      stroke.color.r / 255,
      stroke.color.g / 255,
      stroke.color.b / 255
    ),
    transparent: stroke.color.a < 255,
    opacity: stroke.color.a / 255,
    linewidth: stroke.width,  // Note: only works in some renderers
  };

  if (stroke.stipplePattern !== CONTINUOUS) {
    return new THREE.LineDashedMaterial({
      ...params,
      dashSize: getDashSize(stroke.stipplePattern) * stroke.stippleScale,
      gapSize: getGapSize(stroke.stipplePattern) * stroke.stippleScale,
    });
  }

  return new THREE.LineBasicMaterial(params);
}

// Fill to MeshStandardMaterial
function createFillMaterial(fill) {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(fill.color.r/255, fill.color.g/255, fill.color.b/255),
    transparent: fill.color.a < 255,
    opacity: fill.color.a / 255,
    side: THREE.DoubleSide,  // For viewing from both sides
  });

  if (fill.pattern !== SOLID) {
    // Create checkered texture
    material.map = createCheckeredTexture(fill.pattern);
  }

  if (fill.texture) {
    material.map = new THREE.TextureLoader().load(fill.texture);
  }

  return material;
}
```

### 13.4 Selection/Picking → Raycaster

```javascript
// SolveSpace ObjectPicker → Three.js Raycaster
class EntityPicker {
  constructor(camera, scene) {
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;
    this.scene = scene;

    // Selection tolerance in pixels
    this.raycaster.params.Line.threshold = 5;
    this.raycaster.params.Points.threshold = 5;
  }

  pick(mousePosition, entities) {
    // Convert mouse to normalized device coordinates
    const ndc = new THREE.Vector2(
      (mousePosition.x / window.innerWidth) * 2 - 1,
      -(mousePosition.y / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(ndc, this.camera);

    // Get all intersections
    const intersects = this.raycaster.intersectObjects(entities, true);

    if (intersects.length === 0) return null;

    // Sort by z-index (from userData), then by distance
    intersects.sort((a, b) => {
      const zIndexA = a.object.userData.zIndex || 0;
      const zIndexB = b.object.userData.zIndex || 0;
      if (zIndexB !== zIndexA) return zIndexB - zIndexA;  // Higher z-index first
      return a.distance - b.distance;  // Closer first
    });

    return intersects[0];
  }
}
```

---

## 14. Implementation Priority

### P1 - Core Rendering (Required for basic functionality)

| # | Feature | Description | Three.js Approach |
|---|---------|-------------|-------------------|
| 1 | **Edge/Wireframe** | Display solid body edges | `THREE.LineSegments` with `BufferGeometry` |
| 2 | **Point Rendering** | Display sketch points | `THREE.Points` with `PointsMaterial` |
| 3 | **Selection Highlight** | Show selected items in red | Clone geometry with different material |
| 4 | **Hover Effect** | Show hovered items in yellow | Same as selection, different color |
| 5 | **Hit Testing** | Click to select entities | `THREE.Raycaster` |
| 6 | **Camera Controls** | Pan, zoom, rotate view | `OrbitControls` from drei |

### P2 - Enhanced Visualization

| # | Feature | Description | Three.js Approach |
|---|---------|-------------|-------------------|
| 7 | **Construction Lines** | Dashed green lines | `LineDashedMaterial` |
| 8 | **2D Sketch View** | Orthographic mode | `OrthographicCamera`, toggle |
| 9 | **Grid Rendering** | Workplane grid | `GridHelper` or custom lines |
| 10 | **Stipple Patterns** | Various dash styles | Custom shader or multiple materials |
| 11 | **Layer System** | Control draw order | `renderOrder` + material flags |

### P3 - Constraint Visualization

| # | Feature | Description | Three.js Approach |
|---|---------|-------------|-------------------|
| 12 | **Dimension Lines** | Lines with arrows | Custom geometry builder |
| 13 | **Text Labels** | Dimension values | `troika-three-text` |
| 14 | **Constraint Symbols** | H, V, //, ⊥, etc. | Sprites or instanced geometry |

### P4 - Optimization

| # | Feature | Description | Three.js Approach |
|---|---------|-------------|-------------------|
| 15 | **Dirty Flagging** | Only update changed parts | Track changes in store |
| 16 | **LOD** | Simpler meshes when zoomed out | `THREE.LOD` |
| 17 | **Frustum Culling** | Skip off-screen geometry | Built into Three.js |
| 18 | **Geometry Batching** | Reduce draw calls | `InstancedMesh`, merged geometries |

---

## 15. Required WASM API Extensions

### Tier 1: Basic Rendering Data

```cpp
// ═══════════════════════════════════════════════════════════════
// EDGE DATA - For wireframe rendering
// ═══════════════════════════════════════════════════════════════

int GetEdgeCount(int groupID);
// Returns number of edge segments in the group's outline
// Use: Allocate buffer for edge data

emscripten::val GetEdgeVertices(int groupID);
// Returns Float32Array of edge vertex pairs
// Format: [x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4, ...]
//         ^--edge 1--^  ^--edge 2--^
// Use: Create THREE.LineSegments geometry

// ═══════════════════════════════════════════════════════════════
// POINT DATA - For point rendering
// ═══════════════════════════════════════════════════════════════

int GetPointCount(int groupID);
// Returns number of points in the group

emscripten::val GetPointPositions(int groupID);
// Returns Float32Array of point positions
// Format: [x1,y1,z1, x2,y2,z2, ...]
// Use: Create THREE.Points geometry

// ═══════════════════════════════════════════════════════════════
// ENTITY PROPERTIES - For styling
// ═══════════════════════════════════════════════════════════════

bool IsEntityVisible(int entityID);
// Returns whether entity should be rendered

int GetEntityStyle(int entityID);
// Returns style ID (ACTIVE_GRP, CONSTRUCTION, etc.)
// Use: Determine color, width, pattern

bool IsConstructionGeometry(int entityID);
// Returns true if entity is construction (not in final output)
// Use: Apply construction style (green, dashed)
```

### Tier 2: Selection/Interaction

```cpp
// ═══════════════════════════════════════════════════════════════
// BOUNDING BOX - For culling and fit-to-view
// ═══════════════════════════════════════════════════════════════

emscripten::val GetBoundingBox(int groupID);
// Returns {minX, minY, minZ, maxX, maxY, maxZ}
// Use: Camera fitting, frustum culling

// ═══════════════════════════════════════════════════════════════
// ENTITY INFO - For property display
// ═══════════════════════════════════════════════════════════════

emscripten::val GetEntityInfo(int entityID);
// Returns {
//   type: string,        // "LINE_SEGMENT", "CIRCLE", etc.
//   group: int,          // Owning group ID
//   style: int,          // Style ID
//   construction: bool,  // Is construction geometry
//   description: string  // Human-readable description
// }
```

### Tier 3: Constraints

```cpp
// ═══════════════════════════════════════════════════════════════
// CONSTRAINT DATA - For visualization
// ═══════════════════════════════════════════════════════════════

int GetConstraintCount();
// Total number of constraints

emscripten::val GetConstraintData(int constraintID);
// Returns {
//   type: string,           // "PT_PT_DISTANCE", "HORIZONTAL", etc.
//   value: number,          // Constraint value (for dimensions)
//   label: string,          // Formatted label ("25.4", "45°", etc.)
//   referencePoint: [x,y,z],// Where to draw the annotation
//   entityA: int,           // First entity involved
//   entityB: int,           // Second entity (if applicable)
//   workplane: int          // Workplane context
// }
```

---

## Appendix A: Color Constants (Hex Values)

```javascript
// Style colors for Three.js
const STYLE_COLORS = {
  ACTIVE_GRP:    0xFFFFFF,  // White - active group entities
  CONSTRUCTION:  0x1AB31A,  // Light green - construction geometry
  INACTIVE_GRP:  0x804D00,  // Orange - inactive groups
  DATUM:         0x00CC00,  // Dark green - datum points
  SOLID_EDGE:    0xCCCCCC,  // Light gray - solid body edges
  CONSTRAINT:    0xFF1AFF,  // Magenta - constraints
  SELECTED:      0xFF0000,  // Red - selected items
  HOVERED:       0xFFFF00,  // Yellow - hovered items
  CONTOUR_FILL:  0x001A1A,  // Dark cyan - contour fill
  NORMALS:       0x006666,  // Teal - normal vectors
  ANALYZE:       0x00FFFF,  // Cyan - analysis indicators
  DRAW_ERROR:    0xFF0000,  // Red - error indicators
  DIM_SOLID:     0x1A1A1A,  // Dark gray - dimmed solids
  HIDDEN_EDGE:   0xCCCCCC,  // Gray - hidden edges (with dash)
  OUTLINE:       0xCCCCCC,  // Gray - outline edges (thick)

  // Reference axes (RGB = XYZ convention)
  AXIS_X:        0xFF0000,  // Red - X axis
  AXIS_Y:        0x00FF00,  // Green - Y axis
  AXIS_Z:        0x0000FF,  // Blue - Z axis
};

// Background color
const BACKGROUND_COLOR = 0xEEF2F5;  // Light gray
```

---

## Appendix B: File References

| Purpose | Source File | Key Functions |
|---------|-------------|---------------|
| Canvas interface | `src/render/render.h` | `Canvas`, `Stroke`, `Fill`, `Camera`, `Lighting` |
| OpenGL implementation | `src/render/rendergl3.cpp` | `OpenGl3Renderer` |
| Main render coordinator | `src/draw.cpp` | `Paint()`, `Draw()`, `DrawSnapGrid()` |
| Entity rendering | `src/drawentity.cpp` | `Entity::Draw()` |
| Constraint rendering | `src/drawconstraint.cpp` | `Constraint::Draw()`, `DoLine()`, `DoLabel()` |
| Style definitions | `src/style.cpp` | `Style::Defaults[]` |
| Entity/Constraint types | `src/sketch.h` | `Entity::Type`, `Constraint::Type` |
| Mesh/Edge structures | `src/polygon.h` | `STriangle`, `SMesh`, `SEdge`, `SOutline` |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Entity** | A geometric object (point, line, circle, etc.) in the model |
| **Constraint** | A mathematical relationship between entities |
| **Stroke** | Visual style for lines (color, width, pattern) |
| **Fill** | Visual style for surfaces (color, pattern, texture) |
| **Workplane** | A 2D plane in 3D space where sketching occurs |
| **Construction geometry** | Helper geometry not included in final output |
| **Stipple** | A dashed or dotted line pattern |
| **Z-index** | Draw priority within the same layer |
| **Layer** | Depth category (BACK, NORMAL, FRONT, etc.) |
| **Hit testing** | Determining which entity was clicked |
| **Bézier curve** | Mathematically-defined smooth curve |
| **Chord tolerance** | Maximum error when approximating curves with lines |
| **SMesh** | SolveSpace mesh (list of triangles) |
| **SEdge** | SolveSpace edge (line segment with metadata) |
| **SOutline** | Edge with adjacent surface normals (for silhouettes) |
