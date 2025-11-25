# Changelog

## [Unreleased] - 2025-11-25

### Added
- **ColorPicker Component**: New floating color picker UI for editing colors
  - HSV color selection with gradient picker and hue slider
  - RGB input field for explicit color values (comma-separated format: "255, 128, 64")
  - Live color preview swatch
  - Preset color swatches grid
  - Click outside to close
  - Integrated with PropertyBrowser configuration page (user colors) and line styles page (background color, style colors)
- **Toolbar Tooltips**: Added hover tooltips for all icons in left toolbar and property browser
  - Custom CSS tooltips using `data-tooltip` attribute with `::after` pseudo-element
  - Shows tool description and keyboard shortcut
  - High z-index (99999) to ensure visibility above all other layers

### Fixed
- **LineIcon SVG**: Removed erroneous border path that was baked into the SVG from Figma export
  - The Line tool icon no longer shows a permanent border box
  - Only the active/selected tool now displays a border
- **ColorPicker Drag Interference**: Fixed bug where hovering over color picker would trigger PropertyBrowser panel dragging
  - Added `stopPropagation()` on color picker panel mousedown events
- **Tool Type System**: Fixed TypeScript type restriction that prevented all tool types from working correctly
  - Changed `Tool.type` from limited union type to `string` to support all tools defined in toolDefinitions

### Changed
- **Toolbar Hover Effect**: Made hover background darker (0.08 → 0.24 opacity) for better visibility
- **Font Styling**:
  - Changed "Default Task Name" font-weight from 600 to 400 (no bold)
  - Changed FloatingMenu font-weight from 600 to 400 for all menu items
- **History Page**: Refined PropertyBrowser home/history view to match Figma design
  - Added tree view guidelines (vertical lines and corner connectors)
  - Added group checkboxes and status labels (ok/err/dof count)
  - Added filter buttons with slash dividers (show all / only unconstrained / hide all)
- **Left Toolbar Icons**: Converted all 34 toolbar icons from Figma URLs to inline SVGs for reliability
  - Icons no longer depend on external Figma asset URLs (which expire after 7 days)
  - Organized into 4 sections with Figma node IDs documented for each icon:
    - SHAPE section: 11 icons (Line, Rectangle, Circle, Arc, Text, Image, Tangent, Connect, Point, Toggle Construction, Intersect)
    - CONSTR section: 12 icons (Distance, Angle, Horizontal, Vertical, Parallel, Perpendicular, Point on Line, Mirror, Equal, Normals, Supplementary Angle, Ref)
    - FORM section: 9 icons (Extrude, Rotate Component, Helix, Revolve, Rotate Pattern, Translate, New Workplane, New Group 3D, Assembly)
    - VIEW section: 2 icons (Isometric, Align View)
  - Each icon component includes instructions for manual SVG updates from Figma
- **Right Sidebar (PropertyBrowser)**: Updated toolbar icons to use inline SVGs from Figma design node 90:10812
  - All 11 icons converted to inline SVGs: Workplanes, Normals, Point, Toggle Construction, Constraint Angle, Cube Front View, Shaded View, Cube Solid, Cube Outline, Triangle Mesh, Occluded Lines
  - Icons now match exact Figma design with proper opacity (0.7) and hover states
  - Created PropertyBrowserIcons.tsx component for icon management
- **Icon Architecture**: All icons now use inline SVG approach for permanent, offline-capable rendering
  - No network requests required for icons
  - No expiration issues from external URLs
  - Consistent styling with design tokens
- **PropertyBrowser**: Improved right sidebar styling and layout
- **LeftSidebar**: Removed unnecessary border from header

### Removed
- **StatusBar**: Removed bottom status bar component from App.tsx

## [Unreleased] - 2025-11-24

### Fixed
- **WASM Build**: Resolved persistent C++ compilation and linker errors for the `slvs-wasm` target.
    - Refactored `src/slvs/lib.cpp` to use `auto` and `decltype` for `ENTITY` and `CONSTRAINT` types, resolving type mismatches with `SolveSpace::EntityBase`.
    - Added `using namespace SolveSpace` to `src/slvs/lib.cpp` to fix undeclared identifier errors.
    - Implemented comprehensive stubs in `src/wasm/geometry_api.cpp` for `SolveSpaceUI` (including `ChordTolMm`, `GetMaxSegments`), `Entity` (`GenerateBezierCurves`), `Settings`, `Platform`, and `Translate` to satisfy linker requirements.
    - Added `src/platform/platform.cpp` to the HEADLESS build configuration in `src/CMakeLists.txt` to provide `Platform::Path` implementation.
    - Fixed `FileDialog` and `Pixmap` stub signatures in `geometry_api.cpp`.
- **Frontend**: Successfully compiled `slvs.js` and verified the build process.
