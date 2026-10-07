//-----------------------------------------------------------------------------
// orth-solver: a narrow constraint-solving entry point over libslvs, for the
// orth-solver wasm target. One C function takes a JSON request and returns a
// JSON response (protocol orth-solver/1, documented at the top of
// orth_solver.cpp). Nothing else of SolveSpace is exported.
//-----------------------------------------------------------------------------
#ifndef SOLVESPACE_ORTH_SOLVER_H
#define SOLVESPACE_ORTH_SOLVER_H

#include <stddef.h>
#include <string>

// Thrown by Platform::FatalError in this target (see lib.cpp), caught by orth_solve.
struct OrthSolverFatal {
    std::string message;
};

extern "C" {
// Solve one request. `json` is a NUL-terminated UTF-8 request; the returned
// NUL-terminated response stays valid until the next call.
const char *orth_solve(const char *json);
// {"protocol":"orth-solver/1","version":...,"source":...}
const char *orth_version(void);
// Buffers for the request string, so a host needs no other exports.
char *orth_alloc(size_t size);
void orth_free(char *ptr);
}

#endif
