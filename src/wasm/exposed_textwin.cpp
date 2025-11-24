#include "geometry_api.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>

using namespace emscripten;

namespace SolveSpace {
namespace GeometryAPI {

    val GetConfiguration() {
        val config = val::object();
        // TODO: Populate with real configuration values from SS.GW or similar
        config.set("showWorkplanes", SS.GW.showWorkplanes);
        config.set("showNormals", SS.GW.showNormals);
        config.set("showPoints", SS.GW.showPoints);
        config.set("showConstraints", (int)SS.GW.showConstraints);
        config.set("showFaces", SS.GW.showFaces);
        config.set("showShaded", SS.GW.showShaded);
        config.set("showEdges", SS.GW.showEdges);
        config.set("showOutlines", SS.GW.showOutlines);
        config.set("showMesh", SS.GW.showMesh);
        return config;
    }

    val GetStyles() {
        val styles = val::array();
        for(int i = 0; i < SK.style.n; i++) {
            Style* s  = &SK.style[i];
            val style = val::object();
            style.set("id", s->h.v);
            style.set("info", s->name); // Style has name, not info
            style.set("color",
                      val::array(std::vector<double>{s->color.redF(), s->color.greenF(),
                                                     s->color.blueF(), s->color.alphaF()}));
            style.set("width", s->width);
            styles.call<void>("push", style);
        }
        return styles;
    }

    val GetEntityInfo(int entityID) {
        EntityBase* e = SK.GetEntity({(uint32_t)entityID});
        if(!e)
            return val::null();

        val info = val::object();
        info.set("type", (uint32_t)e->type);
        info.set("group", e->group.v);
        info.set("workplane", e->workplane.v);

        // Add specific entity details based on type
        if(e->IsPoint()) {
            Vector p = e->PointGetNum();
            info.set("x", p.x);
            info.set("y", p.y);
            info.set("z", p.z);
        }

        return info;
    }

    int GetConstraintCount() {
        return SK.constraint.n;
    }

    val GetConstraintInfo(int index) {
        if(index < 0 || index >= SK.constraint.n)
            return val::null();

        ConstraintBase* c = &SK.constraint[index];
        val info          = val::object();
        info.set("type", (uint32_t)c->type);
        info.set("group", c->group.v);
        info.set("workplane", c->workplane.v);
        info.set("valA", c->valA);

        return info;
    }

    int GetRequestCount() {
        return SK.request.n;
    }

    val GetRequestInfo(int index) {
        if(index < 0 || index >= SK.request.n)
            return val::null();

        Request* r = &SK.request[index];
        val info   = val::object();
        info.set("type", (uint32_t)r->type);
        info.set("group", r->group.v);
        info.set("workplane", r->workplane.v);

        return info;
    }

    val GetSketchStats() {
        val stats = val::object();
        // stats.set("dof", SK.GetDOF()); // TODO: Implement GetDOF
        stats.set("dof", 0);
        stats.set("points", SK.entity.n); // Approximation, should filter by type
        stats.set("constraints", SK.constraint.n);
        stats.set("requests", SK.request.n);
        return stats;
    }

} // namespace GeometryAPI
} // namespace SolveSpace

EMSCRIPTEN_BINDINGS(exposed_textwin) {
    function("GetConfiguration", &SolveSpace::GeometryAPI::GetConfiguration);
    function("GetStyles", &SolveSpace::GeometryAPI::GetStyles);
    function("GetEntityInfo", &SolveSpace::GeometryAPI::GetEntityInfo);
    function("GetConstraintCount", &SolveSpace::GeometryAPI::GetConstraintCount);
    function("GetConstraintInfo", &SolveSpace::GeometryAPI::GetConstraintInfo);
    function("GetRequestCount", &SolveSpace::GeometryAPI::GetRequestCount);
    function("GetRequestInfo", &SolveSpace::GeometryAPI::GetRequestInfo);
    function("GetSketchStats", &SolveSpace::GeometryAPI::GetSketchStats);
}
