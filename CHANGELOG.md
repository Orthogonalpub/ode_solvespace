# Changelog

## [Unreleased] - 2025-11-24

### Fixed
- **WASM Build**: Resolved persistent C++ compilation and linker errors for the `slvs-wasm` target.
    - Refactored `src/slvs/lib.cpp` to use `auto` and `decltype` for `ENTITY` and `CONSTRAINT` types, resolving type mismatches with `SolveSpace::EntityBase`.
    - Added `using namespace SolveSpace` to `src/slvs/lib.cpp` to fix undeclared identifier errors.
    - Implemented comprehensive stubs in `src/wasm/geometry_api.cpp` for `SolveSpaceUI` (including `ChordTolMm`, `GetMaxSegments`), `Entity` (`GenerateBezierCurves`), `Settings`, `Platform`, and `Translate` to satisfy linker requirements.
    - Added `src/platform/platform.cpp` to the HEADLESS build configuration in `src/CMakeLists.txt` to provide `Platform::Path` implementation.
    - Fixed `FileDialog` and `Pixmap` stub signatures in `geometry_api.cpp`.
- **Frontend**: Successfully compiled `slvs.js` and verified the build process.
