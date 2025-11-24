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
        return 0;
    }

    val GetEdgeVertices(int groupID) {
        return val::array();
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

    function("GetTriangleCount", &SolveSpace::GeometryAPI::GetTriangleCount);
    function("GetTriangleVertices", &SolveSpace::GeometryAPI::GetTriangleVertices);
    function("GetTriangleNormals", &SolveSpace::GeometryAPI::GetTriangleNormals);
    function("GetTriangleIndices", &SolveSpace::GeometryAPI::GetTriangleIndices);

    function("GetEdgeCount", &SolveSpace::GeometryAPI::GetEdgeCount);
    function("GetEdgeVertices", &SolveSpace::GeometryAPI::GetEdgeVertices);

    function("GetBoundingBox", &SolveSpace::GeometryAPI::GetBoundingBox);
}
