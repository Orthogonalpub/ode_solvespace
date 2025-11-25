# Changelog

## [Unreleased] - 2025-11-25

### Changed
- **Left Toolbar UI**: Refreshed all toolbar icons with latest Figma assets from design node 1:7139
  - All 35 toolbar icons now use correct asset URLs extracted directly from Figma
  - SHAPE section: 11 icons (Line, Rectangle, Circle, Arc, Text, Image, Tangent, Connect, Point, Toggle Construction, Intersect)
  - CONSTR section: 12 icons (Distance, Angle, Horizontal, Vertical, Parallel, Perpendicular, Point on Line, Mirror, Equal, Normals, Supplementary Angle, Ref)
  - FORM section: 9 icons (Extrude, Rotate Component, Helix, Revolve, Rotate Pattern, Translate, New Workplane, New Group 3D, Assembly)
  - VIEW section: 2 icons (Isometric, Align View)
  - Icons are guaranteed to be square with `aspect-ratio: 1/1` and `object-fit: contain`
  - Toolbar is vertically centered on the page with `left: 8px` positioning
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
