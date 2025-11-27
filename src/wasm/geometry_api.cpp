#include "geometry_api.h"
#include "ui.h"
#include "platform/gui.h"
#include "platform/platform.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>

using namespace emscripten;

namespace SolveSpace {
namespace GeometryAPI {

    static SolveSpaceUI* SS_ptr = nullptr;

    void Initialize() {
        if(SS_ptr == nullptr) {
            SS_ptr = new SolveSpaceUI();
        }
        SK.Clear();
        SS.Init();
    }

    void Reset() {
        if(SS_ptr) {
            SK.Clear();
            SS.Init();
        }
    }

    std::string GetVersion() {
        return "0.1.0-alpha (Headless WASM)";
    }

    void LoadModelFromBuffer(const std::string& data) {
        std::string tempFile = "/tmp/temp.slvs";
        FILE* f              = fopen(tempFile.c_str(), "wb");
        if(f) {
            fwrite(data.c_str(), 1, data.size(), f);
            fclose(f);
            SS.LoadFromFile(Platform::Path::From(tempFile));
        }
    }

    std::string SaveModel() {
        std::string tempFile = "/tmp/temp_save.slvs";
        if(SS.SaveToFile(Platform::Path::From(tempFile))) {
            FILE* f = fopen(tempFile.c_str(), "rb");
            if(f) {
                fseek(f, 0, SEEK_END);
                long size = ftell(f);
                fseek(f, 0, SEEK_SET);
                std::string buffer(size, 0);
                fread(&buffer[0], 1, size, f);
                fclose(f);
                return buffer;
            }
        }
        return "";
    }

    int GetGroupCount() {
        return SK.group.n;
    }

    val GetGroupInfo(int groupIndex) {
        if(groupIndex < 0 || groupIndex >= SK.group.n) {
            return val::object();
        }

        Group* g = &SK.group[groupIndex];
        val info = val::object();

        info.set("id", g->h.v);
        info.set("name", std::string(g->DescriptionString()));
        info.set("visible", g->visible);
        info.set("order", g->order);

        return info;
    }

    int GetTriangleCount(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g || !g->displayMesh.IsEmpty()) {
            return 0;
        }

        SMesh* mesh = &g->displayMesh;
        return mesh->l.n;
    }

    val GetTriangleVertices(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g || g->displayMesh.IsEmpty()) {
            return val::array();
        }

        SMesh* mesh       = &g->displayMesh;
        int triangleCount = mesh->l.n;
        int vertexCount   = triangleCount * 3;

        val vertices = val::global("Float32Array").new_(vertexCount * 3);

        int idx = 0;
        for(int i = 0; i < triangleCount; i++) {
            STriangle* tr = &mesh->l[i];

            vertices.call<void>(
                "set",
                val::array(std::vector<double>{tr->a.x, tr->a.y, tr->a.z, tr->b.x, tr->b.y, tr->b.z,
                                               tr->c.x, tr->c.y, tr->c.z}),
                idx);
            idx += 9;
        }

        return vertices;
    }

    val GetTriangleNormals(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g || g->displayMesh.IsEmpty()) {
            return val::array();
        }

        SMesh* mesh       = &g->displayMesh;
        int triangleCount = mesh->l.n;
        int vertexCount   = triangleCount * 3;

        val normals = val::global("Float32Array").new_(vertexCount * 3);

        int idx = 0;
        for(int i = 0; i < triangleCount; i++) {
            STriangle* tr = &mesh->l[i];
            Vector n      = tr->Normal();

            for(int j = 0; j < 3; j++) {
                normals.call<void>("set", val::array(std::vector<double>{n.x, n.y, n.z}), idx);
                idx += 3;
            }
        }

        return normals;
    }

    val GetTriangleIndices(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g || g->displayMesh.IsEmpty()) {
            return val::array();
        }

        SMesh* mesh       = &g->displayMesh;
        int triangleCount = mesh->l.n;

        val indices = val::global("Uint32Array").new_(triangleCount * 3);

        std::vector<uint32_t> indexData;
        for(int i = 0; i < triangleCount * 3; i++) {
            indexData.push_back(i);
        }

        indices.call<void>("set", val(typed_memory_view(indexData.size(), indexData.data())));

        return indices;
    }

    int GetEdgeCount(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g) return 0;

        SOutlineList* outlines = &g->displayOutlines;
        return outlines->l.n;
    }

    val GetEdgeVertices(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g) return val::array();

        SOutlineList* outlines = &g->displayOutlines;
        if(outlines->l.n == 0) return val::array();

        int edgeCount = outlines->l.n;
        val vertices = val::global("Float32Array").new_(edgeCount * 6);

        std::vector<float> data;
        data.reserve(edgeCount * 6);

        for(int i = 0; i < edgeCount; i++) {
            SOutline* e = &outlines->l[i];
            data.push_back((float)e->a.x);
            data.push_back((float)e->a.y);
            data.push_back((float)e->a.z);
            data.push_back((float)e->b.x);
            data.push_back((float)e->b.y);
            data.push_back((float)e->b.z);
        }

        vertices.call<void>("set", val(typed_memory_view(data.size(), data.data())));
        return vertices;
    }

    int GetActiveGroup() {
        return SS.GW.activeGroup.v;
    }

    void SetActiveGroup(int groupID) {
        SS.GW.activeGroup.v = groupID;
    }

    int GetEntityCount() {
        return SK.entity.n;
    }

    val GetEntityInfoByIndex(int entityIndex) {
        if(entityIndex < 0 || entityIndex >= SK.entity.n) {
            return val::object();
        }

        Entity* e = &SK.entity[entityIndex];
        val info = val::object();

        info.set("id", e->h.v);
        info.set("type", (int)e->type);
        info.set("groupID", e->group.v);
        info.set("construction", e->construction);
        info.set("visible", true); // Simplified - always visible for now

        if(e->IsPoint()) {
            Vector p = e->PointGetNum();
            val pos = val::array();
            pos.call<void>("push", p.x);
            pos.call<void>("push", p.y);
            pos.call<void>("push", p.z);
            info.set("position", pos);
        }

        return info;
    }

    int GetPointCount(int groupID) {
        int count = 0;
        for(int i = 0; i < SK.entity.n; i++) {
            Entity* e = &SK.entity[i];
            if((int)e->group.v == groupID && e->IsPoint()) {
                count++;
            }
        }
        return count;
    }

    val GetPointPositions(int groupID) {
        std::vector<float> positions;

        for(int i = 0; i < SK.entity.n; i++) {
            Entity* e = &SK.entity[i];
            if((int)e->group.v == groupID && e->IsPoint()) {
                Vector p = e->PointGetNum();
                positions.push_back((float)p.x);
                positions.push_back((float)p.y);
                positions.push_back((float)p.z);
            }
        }

        if(positions.empty()) return val::array();

        val result = val::global("Float32Array").new_(positions.size());
        result.call<void>("set", val(typed_memory_view(positions.size(), positions.data())));
        return result;
    }

    // Command execution - stub for now (not available in headless build)
    void ActivateCommand(int commandID) {
        // Not available in headless WASM build
        // Commands need the full GraphicsWindow implementation
        (void)commandID;
    }

    int GetPendingOperation() {
        return 0; // NONE
    }

    void CancelPendingOperation() {
        // No-op in headless build
    }

    // Selection - simplified for headless build
    static std::vector<uint32_t> selectedEntities;

    void SelectEntity(int entityID) {
        selectedEntities.push_back((uint32_t)entityID);
    }

    void DeselectEntity(int entityID) {
        selectedEntities.erase(
            std::remove(selectedEntities.begin(), selectedEntities.end(), (uint32_t)entityID),
            selectedEntities.end()
        );
    }

    void ClearSelection() {
        selectedEntities.clear();
    }

    val GetSelectedEntities() {
        val result = val::array();
        for(uint32_t id : selectedEntities) {
            result.call<void>("push", (int)id);
        }
        return result;
    }

    val GetActiveWorkplane() {
        val info = val::object();
        // In headless mode, default to free in 3D
        info.set("id", 0);
        info.set("name", "Free in 3D");
        info.set("freeIn3D", true);
        return info;
    }

    val GetWorkplaneInfo(int workplaneID) {
        val info = val::object();

        Entity* e = SK.GetEntity({(uint32_t)workplaneID});
        if(!e || !e->IsWorkplane()) {
            return info;
        }

        info.set("id", workplaneID);
        info.set("name", "workplane"); // Simplified

        // Get workplane geometry
        Vector origin = SK.GetEntity(e->point[0])->PointGetNum();
        Quaternion q = e->Normal()->NormalGetNum();
        Vector u = q.RotationU();
        Vector v = q.RotationV();
        Vector n = u.Cross(v);

        val o = val::array();
        o.call<void>("push", origin.x);
        o.call<void>("push", origin.y);
        o.call<void>("push", origin.z);
        info.set("origin", o);

        val norm = val::array();
        norm.call<void>("push", n.x);
        norm.call<void>("push", n.y);
        norm.call<void>("push", n.z);
        info.set("normal", norm);

        val uAxis = val::array();
        uAxis.call<void>("push", u.x);
        uAxis.call<void>("push", u.y);
        uAxis.call<void>("push", u.z);
        info.set("u", uAxis);

        val vAxis = val::array();
        vAxis.call<void>("push", v.x);
        vAxis.call<void>("push", v.y);
        vAxis.call<void>("push", v.z);
        info.set("v", vAxis);

        return info;
    }

    val GetBoundingBox(int groupID) {
        Group* g = SK.GetGroup({(uint32_t)groupID});
        if(!g) {
            return val::object();
        }

        Vector minBound, maxBound;
        g->displayMesh.GetBounding(&minBound, &maxBound);

        val bbox = val::object();
        bbox.set("min", val::array(std::vector<double>{minBound.x, minBound.y, minBound.z}));
        bbox.set("max", val::array(std::vector<double>{maxBound.x, maxBound.y, maxBound.z}));

        return bbox;
    }

} // namespace GeometryAPI
} // namespace SolveSpace

using namespace SolveSpace;

// Define global instances for HEADLESS build
namespace SolveSpace {
Sketch SK;
SolveSpaceUI SS;

// Stubs for missing symbols in HEADLESS build
void Sketch::Clear() {
    // Minimal implementation for headless
    param.Clear();
    entity.Clear();
    constraint.Clear();
    group.Clear();
}

void SolveSpaceUI::Init() {
    // No-op for headless
}

void SolveSpaceUI::ScheduleShowTW() {
    // No-op for headless
}

// Stub for Translate which is likely in solvespace.cpp or gui
const std::string& Translate(const char* s, const char* c) {
    static std::string str;
    str = s;
    return str;
}

const std::string& Translate(const char* s) {
    static std::string str;
    str = s;
    return str;
}

// Entity::CalculateNumerical
void Entity::CalculateNumerical(bool) {
    // No-op
}

// Sketch::CalculateEntityBBox
BBox Sketch::CalculateEntityBBox(bool) {
    return BBox();
}

// GraphicsWindow methods
void GraphicsWindow::Invalidate(bool) {
}
void GraphicsWindow::ClearNonexistentSelectionItems() {
}
void GraphicsWindow::ClearSuper() {
}

// TextWindow methods
void TextWindow::ClearSuper() {
}
void TextWindow::ReportHowGroupSolved(hGroup) {
}

// Pixmap::ReadPng
std::shared_ptr<Pixmap> Pixmap::ReadPng(const Platform::Path& filename, bool) {
    return nullptr;
}

namespace Platform {
    std::vector<FileFilter> SolveSpaceLinkFileFilters;
    std::vector<FileFilter> RasterFileFilters;

    void FileDialog::AddFilters(const std::vector<FileFilter>& filters) {
    }

    void Settings::FreezeBool(const std::string& key, bool value) {
    }
    bool Settings::ThawBool(const std::string& key, bool defaultValue) {
        return defaultValue;
    }
    void Settings::FreezeColor(const std::string& key, RgbaColor value) {
    }
    RgbaColor Settings::ThawColor(const std::string& key, RgbaColor defaultValue) {
        return defaultValue;
    }
} // namespace Platform

// SolveSpaceUI methods
double SolveSpaceUI::ChordTolMm() {
    return 0.1;
}
int SolveSpaceUI::GetMaxSegments() {
    return 100;
}

// Entity methods
void Entity::GenerateBezierCurves(SBezierList* sbl) const {
}

} // namespace SolveSpace

EMSCRIPTEN_BINDINGS(geometry_api) {
    function("Initialize", &SolveSpace::GeometryAPI::Initialize);
    function("Reset", &SolveSpace::GeometryAPI::Reset);
    function("GetVersion", &SolveSpace::GeometryAPI::GetVersion);

    function("LoadModelFromBuffer", &SolveSpace::GeometryAPI::LoadModelFromBuffer);
    function("SaveModel", &SolveSpace::GeometryAPI::SaveModel);

    function("GetGroupCount", &SolveSpace::GeometryAPI::GetGroupCount);
    function("GetGroupInfo", &SolveSpace::GeometryAPI::GetGroupInfo);
    function("GetActiveGroup", &SolveSpace::GeometryAPI::GetActiveGroup);
    function("SetActiveGroup", &SolveSpace::GeometryAPI::SetActiveGroup);

    function("GetTriangleCount", &SolveSpace::GeometryAPI::GetTriangleCount);
    function("GetTriangleVertices", &SolveSpace::GeometryAPI::GetTriangleVertices);
    function("GetTriangleNormals", &SolveSpace::GeometryAPI::GetTriangleNormals);
    function("GetTriangleIndices", &SolveSpace::GeometryAPI::GetTriangleIndices);

    function("GetEdgeCount", &SolveSpace::GeometryAPI::GetEdgeCount);
    function("GetEdgeVertices", &SolveSpace::GeometryAPI::GetEdgeVertices);

    function("GetEntityCount", &SolveSpace::GeometryAPI::GetEntityCount);
    function("GetEntityInfoByIndex", &SolveSpace::GeometryAPI::GetEntityInfoByIndex);
    function("GetPointCount", &SolveSpace::GeometryAPI::GetPointCount);
    function("GetPointPositions", &SolveSpace::GeometryAPI::GetPointPositions);

    function("GetBoundingBox", &SolveSpace::GeometryAPI::GetBoundingBox);

    // Command execution
    function("ActivateCommand", &SolveSpace::GeometryAPI::ActivateCommand);
    function("GetPendingOperation", &SolveSpace::GeometryAPI::GetPendingOperation);
    function("CancelPendingOperation", &SolveSpace::GeometryAPI::CancelPendingOperation);

    // Selection
    function("SelectEntity", &SolveSpace::GeometryAPI::SelectEntity);
    function("DeselectEntity", &SolveSpace::GeometryAPI::DeselectEntity);
    function("ClearSelection", &SolveSpace::GeometryAPI::ClearSelection);
    function("GetSelectedEntities", &SolveSpace::GeometryAPI::GetSelectedEntities);

    // Workplane
    function("GetActiveWorkplane", &SolveSpace::GeometryAPI::GetActiveWorkplane);
    function("GetWorkplaneInfo", &SolveSpace::GeometryAPI::GetWorkplaneInfo);
}
