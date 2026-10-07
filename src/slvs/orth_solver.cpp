//-----------------------------------------------------------------------------
// orth-solver: the JSON entry point of the orth-solver wasm target.
//
// Protocol orth-solver/1 works at the primitive layer: rigid bodies, points and
// directions fixed in body-local coordinates, lines and planes built from them,
// and constraints between those. A body is a POINT_IN_3D (origin) plus a
// NORMAL_IN_3D (orientation); its features are POINT_N_ROT_TRANS /
// NORMAL_N_ROT entities over the same seven params, so the solver moves each
// body rigidly. Joints and mates are lowered to these primitives by the caller.
//
// The request is validated in full before anything reaches the solver core: a
// bad request gets status "invalid-request" and never an assertion. Should the
// core still fail an assertion, Platform::FatalError throws (see lib.cpp) and
// the request gets status "internal-error"; the instance stays usable.
//
// Request:
//   { "v": 1,
//     "bodies":  [{ "id", "fixed"?: bool, "t": [x,y,z], "q": [w,x,y,z] }],
//     "points":  [{ "id", "body", "p": [x,y,z] }],          body-local
//     "dirs":    [{ "id", "body", "d": [x,y,z], "u"?: [x,y,z] }],  body-local; u: frame reference
//     "lines":   [{ "id", "a": point, "b": point }],
//     "planes":  [{ "id", "origin": point, "normal": dir }],
//     "constraints": [{ "id", "type", "a", "b"?, "value"?, "flip"?, "sense"? }],
//     "dragged"?: [body or point id],   a body: its params change as little as possible;
//                                       a point: it is pulled toward where the request puts it
//     "findFailed"?: bool }
// Point, dir, line and plane ids share one namespace; body and constraint ids
// have their own. Constraint types and their operands:
//   coincident (point, point)            pointOnLine (point, line)
//   pointInPlane (point, plane)          pointPlaneDistance (point, plane, value)
//   pointLineDistance (point, line, value)  pointPointDistance (point, point, value)
//   parallel (dir|line, dir|line; sense "same"|"opposite" for two dirs)
//   perpendicular (dir|line, dir|line)   angle (dir|line, dir|line, value deg, flip)
//   sameOrientation (dir, dir: frames d, u, d x u match; give both dirs "u")
//   whereDragged (point)
//
// Response:
//   { "v": 1, "status": "ok" | "redundant-ok" | "inconsistent" | "didnt-converge"
//               | "too-many-unknowns" | "invalid-request" | "internal-error",
//     "dof": n, "bodies": [{ "id", "t", "q" }], "failed": [constraint id],
//     "error"?: message }
// Bodies come back in request order. When the solve fails they keep their
// request pose. Numbers are written with 17 significant digits, so a response
// is the same bytes wherever the same wasm runs.
//-----------------------------------------------------------------------------
#include "solvespace.h"
#include "orth_solver.h"
#include <slvs.h>
#include <climits>

using namespace SolveSpace;

#ifndef ORTH_SOLVER_VERSION
#   define ORTH_SOLVER_VERSION "dev"
#endif
#ifndef ORTH_SOLVER_SOURCE
#   define ORTH_SOLVER_SOURCE "https://github.com/Orthogonalpub/ode_solvespace"
#endif

namespace {

using SketchEntity     = std::remove_reference<decltype(*SK.entity.begin())>::type;
using SketchConstraint = std::remove_reference<decltype(*SK.constraint.begin())>::type;

// Bodies' own entities: constant (fixed) or solved. Features live in a third
// group, so they add neither params nor equations of their own.
const uint32_t GROUP_FIXED   = 1;
const uint32_t GROUP_SOLVE   = 2;
const uint32_t GROUP_FEATURE = 3;

// Nesting deeper than the protocol needs is refused, so the parser's recursion stays shallow.
const int MAX_DEPTH = 16;

System OSYS;
std::string response;

//-----------------------------------------------------------------------------
// A small JSON reader (RFC 8259), enough for requests.
//-----------------------------------------------------------------------------

struct Json {
    enum class T { NUL, BOOL, NUM, STR, ARR, OBJ };
    T t      = T::NUL;
    bool b   = false;
    double n = 0;
    std::string s;
    std::vector<Json> a;
    std::vector<std::pair<std::string, Json>> o;

    const Json *Get(const char *key) const {
        if(t != T::OBJ) return nullptr;
        for(const auto &kv : o) {
            if(kv.first == key) return &kv.second;
        }
        return nullptr;
    }
};

class JsonReader {
public:
    explicit JsonReader(const char *text) : p(text) {}

    bool Read(Json *out) {
        Space();
        if(!Value(out, 0)) return false;
        Space();
        if(*p != '\0') return Fail("trailing characters after the request");
        return true;
    }

    std::string error;

private:
    const char *p;

    bool Fail(const std::string &message) {
        if(error.empty()) error = "malformed JSON: " + message;
        return false;
    }

    void Space() {
        while(*p == ' ' || *p == '\t' || *p == '\n' || *p == '\r') p++;
    }

    bool Literal(const char *word) {
        size_t n = strlen(word);
        if(strncmp(p, word, n) != 0) return Fail("unexpected token");
        p += n;
        return true;
    }

    bool Value(Json *out, int depth) {
        if(depth > MAX_DEPTH) return Fail("nested too deep");
        switch(*p) {
        case '{': return Object(out, depth);
        case '[': return Array(out, depth);
        case '"': out->t = Json::T::STR; return String(&out->s);
        case 't': out->t = Json::T::BOOL; out->b = true; return Literal("true");
        case 'f': out->t = Json::T::BOOL; out->b = false; return Literal("false");
        case 'n': out->t = Json::T::NUL; return Literal("null");
        default: out->t = Json::T::NUM; return Number(&out->n);
        }
    }

    bool Object(Json *out, int depth) {
        out->t = Json::T::OBJ;
        p++;
        Space();
        if(*p == '}') { p++; return true; }
        for(;;) {
            Space();
            if(*p != '"') return Fail("expected a key");
            std::string key;
            if(!String(&key)) return false;
            Space();
            if(*p != ':') return Fail("expected ':'");
            p++;
            Space();
            Json value;
            if(!Value(&value, depth + 1)) return false;
            out->o.emplace_back(std::move(key), std::move(value));
            Space();
            if(*p == ',') { p++; continue; }
            if(*p == '}') { p++; return true; }
            return Fail("expected ',' or '}'");
        }
    }

    bool Array(Json *out, int depth) {
        out->t = Json::T::ARR;
        p++;
        Space();
        if(*p == ']') { p++; return true; }
        for(;;) {
            Space();
            Json value;
            if(!Value(&value, depth + 1)) return false;
            out->a.push_back(std::move(value));
            Space();
            if(*p == ',') { p++; continue; }
            if(*p == ']') { p++; return true; }
            return Fail("expected ',' or ']'");
        }
    }

    static int Hex(char c) {
        if(c >= '0' && c <= '9') return c - '0';
        if(c >= 'a' && c <= 'f') return c - 'a' + 10;
        if(c >= 'A' && c <= 'F') return c - 'A' + 10;
        return -1;
    }

    bool Hex4(unsigned *out) {
        unsigned v = 0;
        for(int i = 0; i < 4; i++) {
            int h = Hex(p[i]);
            if(h < 0) return Fail("bad \\u escape");
            v = v * 16 + (unsigned)h;
        }
        p += 4;
        *out = v;
        return true;
    }

    static void Utf8(unsigned cp, std::string *out) {
        if(cp < 0x80) {
            out->push_back((char)cp);
        } else if(cp < 0x800) {
            out->push_back((char)(0xC0 | (cp >> 6)));
            out->push_back((char)(0x80 | (cp & 0x3F)));
        } else if(cp < 0x10000) {
            out->push_back((char)(0xE0 | (cp >> 12)));
            out->push_back((char)(0x80 | ((cp >> 6) & 0x3F)));
            out->push_back((char)(0x80 | (cp & 0x3F)));
        } else {
            out->push_back((char)(0xF0 | (cp >> 18)));
            out->push_back((char)(0x80 | ((cp >> 12) & 0x3F)));
            out->push_back((char)(0x80 | ((cp >> 6) & 0x3F)));
            out->push_back((char)(0x80 | (cp & 0x3F)));
        }
    }

    bool String(std::string *out) {
        p++; // opening quote
        for(;;) {
            unsigned char c = (unsigned char)*p;
            if(c == '\0') return Fail("unterminated string");
            if(c < 0x20) return Fail("control character in string");
            p++;
            if(c == '"') return true;
            if(c != '\\') {
                out->push_back((char)c);
                continue;
            }
            char e = *p++;
            switch(e) {
            case '"': out->push_back('"'); break;
            case '\\': out->push_back('\\'); break;
            case '/': out->push_back('/'); break;
            case 'b': out->push_back('\b'); break;
            case 'f': out->push_back('\f'); break;
            case 'n': out->push_back('\n'); break;
            case 'r': out->push_back('\r'); break;
            case 't': out->push_back('\t'); break;
            case 'u': {
                unsigned cp;
                if(!Hex4(&cp)) return false;
                if(cp >= 0xD800 && cp <= 0xDBFF) {
                    unsigned lo;
                    if(p[0] != '\\' || p[1] != 'u') return Fail("lone surrogate");
                    p += 2;
                    if(!Hex4(&lo)) return false;
                    if(lo < 0xDC00 || lo > 0xDFFF) return Fail("lone surrogate");
                    cp = 0x10000 + ((cp - 0xD800) << 10) + (lo - 0xDC00);
                } else if(cp >= 0xDC00 && cp <= 0xDFFF) {
                    return Fail("lone surrogate");
                }
                Utf8(cp, out);
                break;
            }
            default: return Fail("bad escape");
            }
        }
    }

    bool Number(double *out) {
        const char *start = p;
        if(*p == '-') p++;
        if(*p == '0') {
            p++;
        } else if(*p >= '1' && *p <= '9') {
            while(*p >= '0' && *p <= '9') p++;
        } else {
            return Fail("unexpected token");
        }
        if(*p == '.') {
            p++;
            if(!(*p >= '0' && *p <= '9')) return Fail("bad number");
            while(*p >= '0' && *p <= '9') p++;
        }
        if(*p == 'e' || *p == 'E') {
            p++;
            if(*p == '+' || *p == '-') p++;
            if(!(*p >= '0' && *p <= '9')) return Fail("bad number");
            while(*p >= '0' && *p <= '9') p++;
        }
        std::string text(start, p);
        *out = strtod(text.c_str(), nullptr);
        if(!std::isfinite(*out)) return Fail("number out of range");
        return true;
    }
};

//-----------------------------------------------------------------------------
// Writing the response.
//-----------------------------------------------------------------------------

void WriteString(std::string *out, const std::string &s) {
    out->push_back('"');
    for(unsigned char c : s) {
        if(c == '"' || c == '\\') {
            out->push_back('\\');
            out->push_back((char)c);
        } else if(c < 0x20) {
            char buf[8];
            snprintf(buf, sizeof(buf), "\\u%04x", c);
            *out += buf;
        } else {
            out->push_back((char)c);
        }
    }
    out->push_back('"');
}

void WriteNumber(std::string *out, double v) {
    if(!std::isfinite(v)) v = 0; // never written for a validated request
    if(v == 0) v = 0;              // no "-0"
    char buf[32];
    snprintf(buf, sizeof(buf), "%.17g", v);
    *out += buf;
}

//-----------------------------------------------------------------------------
// Validation and lowering onto the sketch.
//-----------------------------------------------------------------------------

struct InvalidRequest {
    std::string message;
};

[[noreturn]] void Invalid(const std::string &message) {
    throw InvalidRequest{message};
}

struct Body {
    std::string id;
    bool fixed;
    Vector t;
    Quaternion q;
    hEntity origin, orientation;
    hParam params[7];
};

enum class Kind { POINT, DIR, LINE, PLANE };

struct Feature {
    Kind kind;
    hEntity h;
    int body; // points and dirs only
    Vector local;
};

const char *KindName(Kind k) {
    switch(k) {
    case Kind::POINT: return "point";
    case Kind::DIR: return "dir";
    case Kind::LINE: return "line";
    case Kind::PLANE: return "plane";
    }
    return "?";
}

const Json &Field(const Json &obj, const char *key, const std::string &where) {
    const Json *v = obj.Get(key);
    if(!v) Invalid(where + ": missing \"" + key + "\"");
    return *v;
}

const std::vector<Json> &ArrayField(const Json &root, const char *key, bool required) {
    static const std::vector<Json> empty;
    const Json *v = root.Get(key);
    if(!v || v->t == Json::T::NUL) {
        if(required) Invalid(std::string("missing \"") + key + "\"");
        return empty;
    }
    if(v->t != Json::T::ARR) Invalid(std::string("\"") + key + "\" must be an array");
    return v->a;
}

std::string IdOf(const Json &obj, const std::string &where) {
    if(obj.t != Json::T::OBJ) Invalid(where + " must be an object");
    const Json &id = Field(obj, "id", where);
    if(id.t != Json::T::STR || id.s.empty()) Invalid(where + ": \"id\" must be a non-empty string");
    return id.s;
}

std::string StringField(const Json &obj, const char *key, const std::string &where) {
    const Json &v = Field(obj, key, where);
    if(v.t != Json::T::STR) Invalid(where + ": \"" + key + "\" must be a string");
    return v.s;
}

double NumberField(const Json &obj, const char *key, const std::string &where) {
    const Json &v = Field(obj, key, where);
    if(v.t != Json::T::NUM) Invalid(where + ": \"" + key + "\" must be a number");
    return v.n;
}

bool BoolField(const Json &obj, const char *key, const std::string &where, bool fallback) {
    const Json *v = obj.Get(key);
    if(!v || v->t == Json::T::NUL) return fallback;
    if(v->t != Json::T::BOOL) Invalid(where + ": \"" + key + "\" must be a boolean");
    return v->b;
}

void Numbers(const Json &obj, const char *key, const std::string &where, int n, double *out) {
    const Json &v = Field(obj, key, where);
    if(v.t != Json::T::ARR || (int)v.a.size() != n) {
        Invalid(where + ": \"" + key + "\" must be an array of " + std::to_string(n) + " numbers");
    }
    for(int i = 0; i < n; i++) {
        if(v.a[i].t != Json::T::NUM) {
            Invalid(where + ": \"" + key + "\" must be an array of " + std::to_string(n) + " numbers");
        }
        out[i] = v.a[i].n;
    }
}

hParam AddParam(double val) {
    Param pa = {};
    pa.val   = val;
    SK.param.AddAndAssignId(&pa);
    return pa.h;
}

void SolveParam(hParam h) {
    Param *p = SK.GetParam(h);
    p->known = false;
    OSYS.param.Add(p);
}

void ClearAll() {
    OSYS.Clear();
    SK.param.Clear();
    SK.entity.Clear();
    SK.constraint.Clear();
    FreeAllTemporary();
}

const char *StatusName(SolveResult how) {
    switch(how) {
    case SolveResult::OKAY: return "ok";
    case SolveResult::REDUNDANT_OKAY: return "redundant-ok";
    case SolveResult::DIDNT_CONVERGE: return "didnt-converge";
    case SolveResult::REDUNDANT_DIDNT_CONVERGE: return "inconsistent";
    case SolveResult::TOO_MANY_UNKNOWNS: return "too-many-unknowns";
    }
    return "internal-error";
}

void WriteFailure(const char *status, const std::string &message) {
    response.clear();
    response += "{\"v\":1,\"status\":\"";
    response += status;
    response += "\",\"dof\":0,\"bodies\":[],\"failed\":[],\"error\":";
    WriteString(&response, message);
    response += "}";
}

void Solve(const char *text) {
    Json root;
    JsonReader reader(text);
    if(!reader.Read(&root)) Invalid(reader.error);
    if(root.t != Json::T::OBJ) Invalid("the request must be an object");
    const Json *version = root.Get("v");
    if(!version || version->t != Json::T::NUM || version->n != 1) Invalid("\"v\" must be 1");

    // ── Bodies ───────────────────────────────────────────────────────────
    std::vector<Body> bodies;
    std::unordered_map<std::string, int> bodyIndex;
    for(const Json &jb : ArrayField(root, "bodies", /*required=*/true)) {
        std::string where = "bodies[" + std::to_string(bodies.size()) + "]";
        Body b = {};
        b.id = IdOf(jb, where);
        if(bodyIndex.count(b.id)) Invalid(where + ": duplicate body id \"" + b.id + "\"");
        b.fixed = BoolField(jb, "fixed", where, false);
        double t[3], q[4];
        Numbers(jb, "t", where, 3, t);
        Numbers(jb, "q", where, 4, q);
        double qm = sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
        if(!(qm > 1e-12) || !std::isfinite(qm)) Invalid(where + ": \"q\" must be a non-zero quaternion");
        b.t = Vector::From(t[0], t[1], t[2]);
        b.q = Quaternion::From(q[0] / qm, q[1] / qm, q[2] / qm, q[3] / qm);
        bodyIndex[b.id] = (int)bodies.size();
        bodies.push_back(b);
    }

    // ── Features (one id namespace) ──────────────────────────────────────
    std::unordered_map<std::string, Feature> features;
    auto declare = [&](const std::string &id, const std::string &where) {
        if(features.count(id)) Invalid(where + ": duplicate id \"" + id + "\"");
    };
    auto bodyOf = [&](const Json &obj, const std::string &where) {
        std::string id = StringField(obj, "body", where);
        auto it = bodyIndex.find(id);
        if(it == bodyIndex.end()) Invalid(where + ": unknown body \"" + id + "\"");
        return it->second;
    };
    auto feature = [&](const std::string &id, const std::string &where, Kind want) -> Feature & {
        auto it = features.find(id);
        if(it == features.end()) Invalid(where + ": unknown " + KindName(want) + " \"" + id + "\"");
        if(it->second.kind != want) {
            Invalid(where + ": \"" + id + "\" is a " + KindName(it->second.kind) + ", not a " +
                    KindName(want));
        }
        return it->second;
    };

    // The bodies' own entities and params. Handles are assigned in request order, so the same
    // request always builds the same system.
    for(Body &b : bodies) {
        double vals[7] = {b.t.x, b.t.y, b.t.z, b.q.w, b.q.vx, b.q.vy, b.q.vz};
        for(int i = 0; i < 7; i++) b.params[i] = AddParam(vals[i]);
        uint32_t group = b.fixed ? GROUP_FIXED : GROUP_SOLVE;

        SketchEntity origin = {};
        origin.type         = EntityBase::Type::POINT_IN_3D;
        origin.group.v      = group;
        origin.workplane    = EntityBase::FREE_IN_3D;
        for(int i = 0; i < 3; i++) origin.param[i] = b.params[i];
        SK.entity.AddAndAssignId(&origin);
        b.origin = origin.h;

        SketchEntity orientation = {};
        orientation.type         = EntityBase::Type::NORMAL_IN_3D;
        orientation.group.v      = group;
        orientation.workplane    = EntityBase::FREE_IN_3D;
        for(int i = 0; i < 4; i++) orientation.param[i] = b.params[3 + i];
        SK.entity.AddAndAssignId(&orientation);
        b.orientation = orientation.h;

        if(!b.fixed) {
            for(int i = 0; i < 7; i++) SolveParam(b.params[i]);
        }
    }

    int index = 0;
    for(const Json &jp : ArrayField(root, "points", false)) {
        std::string where = "points[" + std::to_string(index++) + "]";
        std::string id    = IdOf(jp, where);
        declare(id, where);
        int body = bodyOf(jp, where);
        double p[3];
        Numbers(jp, "p", where, 3, p);

        SketchEntity e = {};
        e.type         = EntityBase::Type::POINT_N_ROT_TRANS;
        e.group.v      = GROUP_FEATURE;
        e.workplane    = EntityBase::FREE_IN_3D;
        for(int i = 0; i < 7; i++) e.param[i] = bodies[body].params[i];
        e.numPoint = Vector::From(p[0], p[1], p[2]);
        SK.entity.AddAndAssignId(&e);
        features[id] = Feature{Kind::POINT, e.h, body, e.numPoint};
    }

    index = 0;
    for(const Json &jd : ArrayField(root, "dirs", false)) {
        std::string where = "dirs[" + std::to_string(index++) + "]";
        std::string id    = IdOf(jd, where);
        declare(id, where);
        int body = bodyOf(jd, where);
        double d[3];
        Numbers(jd, "d", where, 3, d);
        Vector dv = Vector::From(d[0], d[1], d[2]);
        double m  = dv.Magnitude();
        if(!(m > 1e-12) || !std::isfinite(m)) Invalid(where + ": \"d\" must be a non-zero vector");
        dv = dv.ScaledBy(1 / m);

        // A local frame whose N axis is d, so u x v = d with v = d x u. u is the given reference
        // direction made normal to d, or any unit vector normal to d. Only sameOrientation sees u.
        Vector u = dv.Normal(0);
        if(jd.Get("u") && jd.Get("u")->t != Json::T::NUL) {
            double uu[3];
            Numbers(jd, "u", where, 3, uu);
            Vector ur = Vector::From(uu[0], uu[1], uu[2]);
            ur        = ur.Minus(dv.ScaledBy(ur.Dot(dv)));
            double um = ur.Magnitude();
            if(!(um > 1e-9) || !std::isfinite(um)) {
                Invalid(where + ": \"u\" must not be parallel to \"d\"");
            }
            u = ur.ScaledBy(1 / um);
        }
        Vector v = dv.Cross(u);
        SketchEntity e = {};
        e.type         = EntityBase::Type::NORMAL_N_ROT;
        e.group.v      = GROUP_FEATURE;
        e.workplane    = EntityBase::FREE_IN_3D;
        for(int i = 0; i < 4; i++) e.param[i] = bodies[body].params[3 + i];
        e.numNormal = Quaternion::From(u, v);
        SK.entity.AddAndAssignId(&e);
        features[id] = Feature{Kind::DIR, e.h, body, dv};
    }

    index = 0;
    for(const Json &jl : ArrayField(root, "lines", false)) {
        std::string where = "lines[" + std::to_string(index++) + "]";
        std::string id    = IdOf(jl, where);
        declare(id, where);
        std::string ida = StringField(jl, "a", where), idb = StringField(jl, "b", where);
        Feature &a = feature(ida, where, Kind::POINT);
        Feature &b = feature(idb, where, Kind::POINT);
        if(ida == idb) Invalid(where + ": a line needs two different points");
        if(a.body == b.body && a.local.Minus(b.local).Magnitude() < 1e-9) {
            Invalid(where + ": the line's points coincide");
        }
        SketchEntity e = {};
        e.type         = EntityBase::Type::LINE_SEGMENT;
        e.group.v      = GROUP_FEATURE;
        e.workplane    = EntityBase::FREE_IN_3D;
        e.point[0]     = a.h;
        e.point[1]     = b.h;
        SK.entity.AddAndAssignId(&e);
        features[id] = Feature{Kind::LINE, e.h, -1, Vector::From(0, 0, 0)};
    }

    index = 0;
    for(const Json &jw : ArrayField(root, "planes", false)) {
        std::string where = "planes[" + std::to_string(index++) + "]";
        std::string id    = IdOf(jw, where);
        declare(id, where);
        Feature &o = feature(StringField(jw, "origin", where), where, Kind::POINT);
        Feature &n = feature(StringField(jw, "normal", where), where, Kind::DIR);
        SketchEntity e = {};
        e.type         = EntityBase::Type::WORKPLANE;
        e.group.v      = GROUP_FEATURE;
        e.workplane    = EntityBase::FREE_IN_3D;
        e.point[0]     = o.h;
        e.normal       = n.h;
        SK.entity.AddAndAssignId(&e);
        features[id] = Feature{Kind::PLANE, e.h, -1, Vector::From(0, 0, 0)};
    }

    // ── Constraints ──────────────────────────────────────────────────────
    std::unordered_map<uint32_t, std::string> constraintIds;
    std::unordered_set<std::string> seenConstraints;
    std::vector<hEntity> draggedPoints;
    index = 0;
    for(const Json &jc : ArrayField(root, "constraints", false)) {
        std::string where = "constraints[" + std::to_string(index++) + "]";
        std::string id    = IdOf(jc, where);
        if(!seenConstraints.insert(id).second) Invalid(where + ": duplicate constraint id \"" + id + "\"");
        std::string type = StringField(jc, "type", where);

        SketchConstraint c = {};
        c.group.v          = GROUP_SOLVE;
        c.workplane        = EntityBase::FREE_IN_3D;
        auto ref           = [&](const char *key, Kind want) {
            return feature(StringField(jc, key, where), where, want).h;
        };
        // A direction operand: a dir or a line.
        auto vectorRef = [&](const char *key) -> Feature & {
            std::string fid = StringField(jc, key, where);
            auto it         = features.find(fid);
            if(it == features.end()) Invalid(where + ": unknown dir or line \"" + fid + "\"");
            if(it->second.kind != Kind::DIR && it->second.kind != Kind::LINE) {
                Invalid(where + ": \"" + fid + "\" is a " + KindName(it->second.kind) +
                        ", not a dir or line");
            }
            return it->second;
        };
        auto value = [&]() { return NumberField(jc, "value", where); };

        if(type == "coincident") {
            c.type = ConstraintBase::Type::POINTS_COINCIDENT;
            c.ptA  = ref("a", Kind::POINT);
            c.ptB  = ref("b", Kind::POINT);
        } else if(type == "pointOnLine") {
            c.type    = ConstraintBase::Type::PT_ON_LINE;
            c.ptA     = ref("a", Kind::POINT);
            c.entityA = ref("b", Kind::LINE);
        } else if(type == "pointInPlane") {
            c.type    = ConstraintBase::Type::PT_IN_PLANE;
            c.ptA     = ref("a", Kind::POINT);
            c.entityA = ref("b", Kind::PLANE);
        } else if(type == "pointPlaneDistance") {
            c.type    = ConstraintBase::Type::PT_PLANE_DISTANCE;
            c.ptA     = ref("a", Kind::POINT);
            c.entityA = ref("b", Kind::PLANE);
            c.valA    = value();
        } else if(type == "pointLineDistance") {
            c.type    = ConstraintBase::Type::PT_LINE_DISTANCE;
            c.ptA     = ref("a", Kind::POINT);
            c.entityA = ref("b", Kind::LINE);
            c.valA    = value();
        } else if(type == "pointPointDistance") {
            c.type = ConstraintBase::Type::PT_PT_DISTANCE;
            c.ptA  = ref("a", Kind::POINT);
            c.ptB  = ref("b", Kind::POINT);
            c.valA = value();
        } else if(type == "parallel" || type == "perpendicular" || type == "angle") {
            Feature &a = vectorRef("a");
            Feature &b = vectorRef("b");
            c.entityA  = a.h;
            c.entityB  = b.h;
            if(type == "parallel") {
                c.type            = ConstraintBase::Type::PARALLEL;
                const Json *sense = jc.Get("sense");
                if(sense && sense->t != Json::T::NUL) {
                    if(sense->t != Json::T::STR || (sense->s != "same" && sense->s != "opposite")) {
                        Invalid(where + ": \"sense\" must be \"same\" or \"opposite\"");
                    }
                    if(a.kind != Kind::DIR || b.kind != Kind::DIR) {
                        Invalid(where + ": \"sense\" needs two dirs");
                    }
                    c.other  = true;
                    c.other2 = sense->s == "opposite";
                }
            } else if(type == "perpendicular") {
                c.type = ConstraintBase::Type::PERPENDICULAR;
            } else {
                c.type  = ConstraintBase::Type::ANGLE;
                c.valA  = value();
                c.other = BoolField(jc, "flip", where, false);
            }
        } else if(type == "sameOrientation") {
            c.type    = ConstraintBase::Type::SAME_ORIENTATION;
            c.entityA = ref("a", Kind::DIR);
            c.entityB = ref("b", Kind::DIR);
        } else if(type == "whereDragged") {
            c.type = ConstraintBase::Type::WHERE_DRAGGED;
            c.ptA  = ref("a", Kind::POINT);
            draggedPoints.push_back(c.ptA);
        } else {
            Invalid(where + ": unknown constraint type \"" + type + "\"");
        }
        SK.constraint.AddAndAssignId(&c);
        constraintIds[c.h.v] = id;
    }

    // Constraint params (a point's position along a line, a parallel's scale), started where the
    // current poses put them.
    for(auto &con : SK.constraint) {
        ConstraintBase *c = &con;
        c->Generate(&SK.param);
        if(!c->valP.v) continue;
        double init = 0;
        if(c->type == ConstraintBase::Type::PT_ON_LINE) {
            EntityBase *ln = SK.GetEntity(c->entityA);
            Vector a  = SK.GetEntity(ln->point[0])->PointGetNum();
            Vector b  = SK.GetEntity(ln->point[1])->PointGetNum();
            Vector p  = SK.GetEntity(c->ptA)->PointGetNum();
            double ab = b.Minus(a).MagSquared();
            init      = ab > 1e-24 ? p.Minus(a).Dot(b.Minus(a)) / ab : 0;
        } else {
            // PARALLEL / SAME_ORIENTATION: a = s * b
            Vector a  = SK.GetEntity(c->entityA)->VectorGetNum();
            Vector b  = SK.GetEntity(c->entityB)->VectorGetNum();
            double bb = b.MagSquared();
            init      = bb > 1e-24 ? a.Dot(b) / bb : 0;
        }
        SK.GetParam(c->valP)->val = init;
        SolveParam(c->valP);
    }

    // ── Drag, solve, answer ──────────────────────────────────────────────
    auto dragBody = [&](int body) {
        if(bodies[body].fixed) return;
        for(int i = 0; i < 7; i++) OSYS.dragged.insert(bodies[body].params[i]);
    };
    index = 0;
    for(const Json &jd : ArrayField(root, "dragged", false)) {
        std::string where = "dragged[" + std::to_string(index++) + "]";
        if(jd.t != Json::T::STR) Invalid(where + " must be a body or point id");
        auto b = bodyIndex.find(jd.s);
        if(b != bodyIndex.end()) {
            dragBody(b->second);
            continue;
        }
        auto f = features.find(jd.s);
        if(f == features.end() || f->second.kind != Kind::POINT) {
            Invalid(where + ": unknown body or point \"" + jd.s + "\"");
        }
        if(bodies[f->second.body].fixed) continue;
        // A dragged point: a free handle where the request's poses put the point, coincident
        // with it, and dragged (SolveSpace's own way to drag a point that hangs off other
        // params). The body moves to meet the handle as far as its constraints allow, so
        // a hinged part turns toward the pointer.
        Vector at = SK.GetEntity(f->second.h)->PointGetNum();
        SketchEntity handle = {};
        handle.type         = EntityBase::Type::POINT_IN_3D;
        handle.group.v      = GROUP_SOLVE;
        handle.workplane    = EntityBase::FREE_IN_3D;
        double xyz[3]       = {at.x, at.y, at.z};
        for(int i = 0; i < 3; i++) {
            handle.param[i] = AddParam(xyz[i]);
            SolveParam(handle.param[i]);
            OSYS.dragged.insert(handle.param[i]);
        }
        SK.entity.AddAndAssignId(&handle);
        SketchConstraint c = {};
        c.type             = ConstraintBase::Type::POINTS_COINCIDENT;
        c.group.v          = GROUP_SOLVE;
        c.workplane        = EntityBase::FREE_IN_3D;
        c.ptA              = handle.h;
        c.ptB              = f->second.h;
        SK.constraint.AddAndAssignId(&c);
        constraintIds[c.h.v] = "dragged:" + jd.s;
    }
    for(hEntity hp : draggedPoints) {
        for(const auto &f : features) {
            if(f.second.h == hp) dragBody(f.second.body);
        }
    }
    bool findFailed = BoolField(root, "findFailed", "request", false);

    Group g = {};
    g.h.v   = GROUP_SOLVE;
    // No time limit on finding the failed constraints, so the answer does not depend on speed.
    g.solved.findToFixTimeout = INT_MAX;

    List<hConstraint> bad = {};
    int dof               = 0;
    SolveResult how       = OSYS.Solve(&g, &dof, &bad, findFailed, /*andFindFree=*/false);

    response.clear();
    response += "{\"v\":1,\"status\":\"";
    response += StatusName(how);
    response += "\",\"dof\":";
    WriteNumber(&response, dof);
    response += ",\"bodies\":[";
    for(size_t i = 0; i < bodies.size(); i++) {
        const Body &b = bodies[i];
        double v[7];
        for(int k = 0; k < 7; k++) v[k] = SK.GetParam(b.params[k])->val;
        double qm = sqrt(v[3] * v[3] + v[4] * v[4] + v[5] * v[5] + v[6] * v[6]);
        if(qm > 0) {
            for(int k = 3; k < 7; k++) v[k] /= qm;
        }
        if(i > 0) response += ",";
        response += "{\"id\":";
        WriteString(&response, b.id);
        response += ",\"t\":[";
        for(int k = 0; k < 3; k++) {
            if(k > 0) response += ",";
            WriteNumber(&response, v[k]);
        }
        response += "],\"q\":[";
        for(int k = 3; k < 7; k++) {
            if(k > 3) response += ",";
            WriteNumber(&response, v[k]);
        }
        response += "]}";
    }
    response += "],\"failed\":[";
    for(int i = 0; i < bad.n; i++) {
        if(i > 0) response += ",";
        auto it = constraintIds.find(bad[i].v);
        WriteString(&response, it == constraintIds.end() ? std::string("?") : it->second);
    }
    response += "]}";
    bad.Clear();
}

} // namespace

extern "C" {

const char *orth_solve(const char *json) {
    try {
        ClearAll();
        if(json == nullptr) Invalid("no request");
        Solve(json);
    } catch(const InvalidRequest &e) {
        WriteFailure("invalid-request", e.message);
    } catch(const OrthSolverFatal &e) {
        WriteFailure("internal-error", e.message);
    } catch(const std::bad_alloc &) {
        WriteFailure("internal-error", "out of memory");
    }
    try {
        ClearAll();
    } catch(...) {
        // Nothing more can be done; the next call clears again.
    }
    return response.c_str();
}

const char *orth_version(void) {
    static std::string version;
    if(version.empty()) {
        version = "{\"protocol\":\"orth-solver/1\",\"version\":";
        WriteString(&version, ORTH_SOLVER_VERSION);
        version += ",\"source\":";
        WriteString(&version, ORTH_SOLVER_SOURCE);
        version += "}";
    }
    return version.c_str();
}

char *orth_alloc(size_t size) {
    return static_cast<char *>(malloc(size));
}

void orth_free(char *ptr) {
    free(ptr);
}

} // extern "C"
