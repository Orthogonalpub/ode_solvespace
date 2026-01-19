#ifndef SOLVESPACE_WASM_GEOMETRY_API_H
#define SOLVESPACE_WASM_GEOMETRY_API_H

#include "solvespace.h"
#include <emscripten/val.h>

namespace SolveSpace {
namespace GeometryAPI {

// Initialization
void Initialize();
void Reset();
std::string GetVersion();

// File I/O
void LoadModelFromBuffer(const std::string& data);
std::string SaveModel();

// Group management
int GetGroupCount();
emscripten::val GetGroupInfo(int groupIndex);
int GetActiveGroup();
void SetActiveGroup(int groupID);

// Mesh data
int GetTriangleCount(int groupID);
emscripten::val GetTriangleVertices(int groupID);
emscripten::val GetTriangleNormals(int groupID);
emscripten::val GetTriangleIndices(int groupID);

// Edge data
int GetEdgeCount(int groupID);
emscripten::val GetEdgeVertices(int groupID);

// Entity data
int GetEntityCount();
emscripten::val GetEntityInfoByIndex(int entityIndex);
emscripten::val GetPointPositions(int groupID);
int GetPointCount(int groupID);

// Point data with entity IDs (for selection visualization)
emscripten::val GetPointsWithIds(int groupID);

// Bounding box
emscripten::val GetBoundingBox(int groupID);

// Command execution (matching toolbar/menu commands)
void ActivateCommand(int commandID);
int GetPendingOperation();
void CancelPendingOperation();

// Selection
void SelectEntity(int entityID);
void DeselectEntity(int entityID);
void ClearSelection();
emscripten::val GetSelectedEntities();

// Workplane
emscripten::val GetActiveWorkplane();
emscripten::val GetWorkplaneInfo(int workplaneID);

}
}

#endif
