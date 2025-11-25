# Changelog

## [Unreleased] - 2025-11-25

### Changed
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
