#!/bin/sh
# Build the orth-solver wasm target: libslvs's solver sources plus the JSON entry point
# (orth_solver.cpp), nothing else of SolveSpace. Output: a standalone .wasm with five exports
# (orth_solve, orth_version, orth_alloc, orth_free, memory) and only WASI imports, so a host
# loads it without generated JS glue.
#
#   src/slvs/build-orth-solver.sh [out-dir]          (default: build-orth-solver/)
#
# Needs emcc (Emscripten 4.x) on PATH or in $EMCC, and Eigen: extlib/eigen (the submodule),
# or $EIGEN_DIR. The CMake target `orth-solver` (src/slvs/CMakeLists.txt) builds the same thing.
set -eu

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
OUT=${1:-"$ROOT/build-orth-solver"}
EMXX=${EMXX:-$(dirname "${EMCC:-$(command -v emcc)}")/em++}
EIGEN_DIR=${EIGEN_DIR:-"$ROOT/extlib/eigen"}
if [ ! -f "$EIGEN_DIR/Eigen/Core" ]; then
    echo "Eigen not found at $EIGEN_DIR (init the extlib/eigen submodule or set EIGEN_DIR)" >&2
    exit 1
fi

VERSION=${ORTH_SOLVER_VERSION:-$(git -C "$ROOT" describe --tags --always --dirty 2>/dev/null || echo dev)}
SOURCE=${ORTH_SOLVER_SOURCE:-"https://github.com/Orthogonalpub/ode_solvespace/tree/$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo master)"}

mkdir -p "$OUT"
"$EMXX" -O3 -flto -std=c++17 -fwasm-exceptions \
    -DLIBRARY -DNDEBUG -DORTH_SOLVER -DSLVS_SIMPLE_ARENA \
    "-DORTH_SOLVER_VERSION=\"$VERSION\"" "-DORTH_SOLVER_SOURCE=\"$SOURCE\"" \
    -I"$ROOT/src" -I"$ROOT/include" -I"$EIGEN_DIR" \
    "$ROOT/src/constrainteq.cpp" "$ROOT/src/entity.cpp" "$ROOT/src/expr.cpp" \
    "$ROOT/src/system.cpp" "$ROOT/src/util.cpp" "$ROOT/src/platform/platformbase.cpp" \
    "$ROOT/src/slvs/lib.cpp" "$ROOT/src/slvs/orth_solver.cpp" \
    -sSTANDALONE_WASM=1 --no-entry \
    -sEXPORTED_FUNCTIONS=_orth_solve,_orth_version,_orth_alloc,_orth_free \
    -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=16MB -sSTACK_SIZE=1MB \
    -o "$OUT/orth-solver.wasm"

echo "$VERSION" > "$OUT/orth-solver.version"
ls -l "$OUT/orth-solver.wasm"
