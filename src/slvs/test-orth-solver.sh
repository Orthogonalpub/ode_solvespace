#!/bin/sh
# Build the orth-solver sources natively (same sources and defines as build-orth-solver.sh) with
# the regression test in test-orth-solver.cpp, and run it.
#
#   src/slvs/test-orth-solver.sh [out-dir]          (default: build-orth-solver/)
#
# Needs a C++17 compiler ($CXX, default c++) and Eigen: extlib/eigen (the submodule), or $EIGEN_DIR.
set -eu

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
OUT=${1:-"$ROOT/build-orth-solver"}
CXX=${CXX:-c++}
EIGEN_DIR=${EIGEN_DIR:-"$ROOT/extlib/eigen"}
if [ ! -f "$EIGEN_DIR/Eigen/Core" ]; then
    echo "Eigen not found at $EIGEN_DIR (init the extlib/eigen submodule or set EIGEN_DIR)" >&2
    exit 1
fi

mkdir -p "$OUT"
"$CXX" -O2 -std=c++17 -w \
    -DLIBRARY -DNDEBUG -DORTH_SOLVER -DSLVS_SIMPLE_ARENA \
    -I"$ROOT/src" -I"$ROOT/include" -I"$EIGEN_DIR" \
    "$ROOT/src/constrainteq.cpp" "$ROOT/src/entity.cpp" "$ROOT/src/expr.cpp" \
    "$ROOT/src/system.cpp" "$ROOT/src/util.cpp" "$ROOT/src/platform/platformbase.cpp" \
    "$ROOT/src/slvs/lib.cpp" "$ROOT/src/slvs/orth_solver.cpp" \
    "$ROOT/src/slvs/test-orth-solver.cpp" \
    -o "$OUT/test-orth-solver"
"$OUT/test-orth-solver"
