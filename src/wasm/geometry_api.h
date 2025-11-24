#ifndef SOLVESPACE_WASM_GEOMETRY_API_H
#define SOLVESPACE_WASM_GEOMETRY_API_H

#include "solvespace.h"
#include <emscripten/val.h>

namespace SolveSpace {
namespace GeometryAPI {

void Initialize();
void Reset();
std::string GetVersion();

void LoadModelFromBuffer(const std::string& data);
std::string SaveModel();

int GetGroupCount();
emscripten::val GetGroupInfo(int groupIndex);

int GetTriangleCount(int groupID);
emscripten::val GetTriangleVertices(int groupID);
emscripten::val GetTriangleNormals(int groupID);
emscripten::val GetTriangleIndices(int groupID);

int GetEdgeCount(int groupID);
emscripten::val GetEdgeVertices(int groupID);

emscripten::val GetBoundingBox(int groupID);

}
}

#endif
