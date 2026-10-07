#include "solvespace.h"
#if !defined(SLVS_SIMPLE_ARENA)
#include <mimalloc.h>
#endif

#if defined(WIN32)
#   include <Windows.h>
#endif // defined(WIN32)

namespace SolveSpace {
namespace Platform {

//-----------------------------------------------------------------------------
// Debug output, on Windows.
//-----------------------------------------------------------------------------

#if defined(WIN32)

#if !defined(_alloca)
// Fix for compiling with MinGW.org GCC-6.3.0-1
#define _alloca alloca
#include <malloc.h>
#endif

void DebugPrint(const char *fmt, ...)
{
    va_list va;
    va_start(va, fmt);
    int len = _vscprintf(fmt, va) + 1;
    va_end(va);

    va_start(va, fmt);
    char *buf = (char *)_alloca(len);
    _vsnprintf(buf, len, fmt, va);
    va_end(va);

    // The native version of OutputDebugString, unlike most others,
    // is OutputDebugStringA.
    OutputDebugStringA(buf);
    OutputDebugStringA("\n");

#ifndef NDEBUG
    // Duplicate to stderr in debug builds, but not in release; this is slow.
    fputs(buf, stderr);
    fputc('\n', stderr);
#endif
}

#endif

//-----------------------------------------------------------------------------
// Debug output, on *nix.
//-----------------------------------------------------------------------------

#if !defined(WIN32)

void DebugPrint(const char *fmt, ...) {
    va_list va;
    va_start(va, fmt);
    vfprintf(stderr, fmt, va);
    fputc('\n', stderr);
    va_end(va);
}

#endif

//-----------------------------------------------------------------------------
// Temporary arena.
//-----------------------------------------------------------------------------

#if defined(SLVS_SIMPLE_ARENA)

// A bump arena over malloc, for builds without mimalloc (the orth-solver wasm target). The
// solver allocates its expression trees here and frees them all at once after each solve.
struct SimpleArena {
    static const size_t CHUNK = 1 << 20;
    std::vector<char *> chunks;
    size_t used = CHUNK;

    ~SimpleArena() { Clear(); }
    void Clear() {
        for(char *c : chunks) free(c);
        chunks.clear();
        used = CHUNK;
    }
};

static SimpleArena TempArena;

void *AllocTemporary(size_t size) {
    size = (size + 15) & ~(size_t)15;
    if(size > SimpleArena::CHUNK / 4) {
        // Large blocks get a chunk of their own, kept behind the current one.
        char *big = (char *)calloc(1, size);
        ssassert(big != NULL, "out of memory");
        TempArena.chunks.insert(TempArena.chunks.begin(), big);
        return big;
    }
    if(TempArena.used + size > SimpleArena::CHUNK) {
        char *chunk = (char *)malloc(SimpleArena::CHUNK);
        ssassert(chunk != NULL, "out of memory");
        TempArena.chunks.push_back(chunk);
        TempArena.used = 0;
    }
    void *ptr = TempArena.chunks.back() + TempArena.used;
    TempArena.used += size;
    memset(ptr, 0, size);
    return ptr;
}

void FreeAllTemporary() {
    TempArena.Clear();
}

#else

struct MimallocHeap {
    mi_heap_t *heap = NULL;

    ~MimallocHeap() {
        if(heap != NULL)
            mi_heap_destroy(heap);
    }
};

static thread_local MimallocHeap TempArena;

void *AllocTemporary(size_t size) {
    if(TempArena.heap == NULL) {
        TempArena.heap = mi_heap_new();
        ssassert(TempArena.heap != NULL, "out of memory");
    }
    void *ptr = mi_heap_zalloc(TempArena.heap, size);
    ssassert(ptr != NULL, "out of memory");
    return ptr;
}

void FreeAllTemporary() {
    MimallocHeap temp;
    std::swap(TempArena.heap, temp.heap);
}

#endif

}
}
