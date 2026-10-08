//-----------------------------------------------------------------------------
// Native regression test for the orth-solver JSON entry point: status and DOF of
// a pin mated into a plate (the DOF the rank test reports), and the sense of the
// oriented parallels behind flush / align / face distance / angle 0 and 180.
// Build and run with src/slvs/test-orth-solver.sh.
//-----------------------------------------------------------------------------
#include "orth_solver.h"
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <string>

namespace {

int failures = 0;

// The plate is fixed at the origin; its top face is centred at [50,40,10] with normal +z,
// and its hole axis (1 long) runs up from there. The pin's bottom face and axis start at its
// origin (bottom normal -z, axis +z), its top face is 20 up; "pin.side.n" (+x) and the
// plate's "plate.side.n" (+x) let a third mate fix the pin's spin. Lengths scale by s
// (axis lengths stay 1).
std::string Request(const std::string &constraints, const std::string &pinPose, double s = 1,
                    bool pinFixed = false) {
    auto num = [&](double v) {
        char buf[32];
        snprintf(buf, sizeof(buf), "%.17g", v * s);
        return std::string(buf);
    };
    // A body-local point, scaled by s.
    auto pt = [&](const char *id, const char *body, double x, double y, double z) {
        return std::string("{\"id\":\"") + id + "\",\"body\":\"" + body + "\",\"p\":[" + num(x) +
               "," + num(y) + "," + num(z) + "]}";
    };
    std::string r = "{\"v\":1,\"findFailed\":true,\"bodies\":["
                    "{\"id\":\"plate\",\"fixed\":true,\"t\":[0,0,0],\"q\":[1,0,0,0]},"
                    "{\"id\":\"pin\"," +
                    std::string(pinFixed ? "\"fixed\":true," : "") + pinPose + "}],\"points\":[";
    r += pt("plate.top.c", "plate", 50, 40, 10) + "," + pt("plate.ax.o", "plate", 50, 40, 10) + "," +
         pt("plate.ax.t", "plate", 50, 40, 10 + 1 / s) + ",";
    r += pt("pin.bot.c", "pin", 0, 0, 0) + "," + pt("pin.top.c", "pin", 0, 0, 20) + "," +
         pt("pin.ax.o", "pin", 0, 0, 0) + "," + pt("pin.ax.t", "pin", 0, 0, 1 / s) + "," +
         pt("pin.p2.o", "pin", 0, 0, 10) + "," + pt("pin.p2.t", "pin", 0, 0, 10 + 1 / s) + "],";
    r += "\"dirs\":["
         "{\"id\":\"plate.top.n\",\"body\":\"plate\",\"d\":[0,0,1]},"
         "{\"id\":\"plate.ax.d\",\"body\":\"plate\",\"d\":[0,0,1]},"
         "{\"id\":\"plate.side.n\",\"body\":\"plate\",\"d\":[1,0,0]},"
         "{\"id\":\"pin.bot.n\",\"body\":\"pin\",\"d\":[0,0,-1]},"
         "{\"id\":\"pin.top.n\",\"body\":\"pin\",\"d\":[0,0,1]},"
         "{\"id\":\"pin.ax.d\",\"body\":\"pin\",\"d\":[0,0,1]},"
         "{\"id\":\"pin.side.n\",\"body\":\"pin\",\"d\":[1,0,0]}],"
         "\"lines\":["
         "{\"id\":\"plate.ax\",\"a\":\"plate.ax.o\",\"b\":\"plate.ax.t\"},"
         "{\"id\":\"pin.ax\",\"a\":\"pin.ax.o\",\"b\":\"pin.ax.t\"}],"
         "\"planes\":["
         "{\"id\":\"plate.top\",\"origin\":\"plate.top.c\",\"normal\":\"plate.top.n\"},"
         "{\"id\":\"pin.bot\",\"origin\":\"pin.bot.c\",\"normal\":\"pin.bot.n\"},"
         "{\"id\":\"pin.top\",\"origin\":\"pin.top.c\",\"normal\":\"pin.top.n\"}],"
         "\"constraints\":[" +
         constraints + "]}";
    return r;
}

// Pin poses (q = [w,x,y,z]). TILT: 0.2 rad about (1,1,0), then 0.4 rad about z, 25 above the
// plate and off its axis; FLIPPED: the same, then half a turn about x (bottom normal ~ +z);
// EXACT: seated in the hole. Positions are scaled with the part (see Pose).
std::string Pose(const char *q, double x, double y, double z, double s = 1) {
    char buf[256];
    snprintf(buf, sizeof(buf), "\"t\":[%.17g,%.17g,%.17g],\"q\":[%s]", x * s, y * s, z * s, q);
    return buf;
}
const char *Q_TILT = "0.97517032720181596,0.055161086703300541,0.083210369504588447,0.19767681165408388";
const char *Q_FLIPPED =
    "-0.055161086703300478,0.97517032720181596,-0.19767681165408388,0.083210369504588461";
const std::string TILT    = Pose(Q_TILT, 52, 41, 25);
const std::string FLIPPED = Pose(Q_FLIPPED, 52, 41, 25);
const std::string EXACT   = Pose("1,0,0,0", 50, 40, 10);

const std::string CONC = "{\"id\":\"conc0\",\"type\":\"pointOnLine\",\"a\":\"pin.ax.o\",\"b\":\"plate.ax\"},"
                         "{\"id\":\"conc1\",\"type\":\"pointOnLine\",\"a\":\"pin.ax.t\",\"b\":\"plate.ax\"}";
const std::string CONC2 = "{\"id\":\"conc2\",\"type\":\"pointOnLine\",\"a\":\"pin.p2.o\",\"b\":\"plate.ax\"},"
                          "{\"id\":\"conc3\",\"type\":\"pointOnLine\",\"a\":\"pin.p2.t\",\"b\":\"plate.ax\"}";
std::string Par(const char *id, const char *a, const char *b, const char *sense) {
    std::string s = std::string("{\"id\":\"") + id + "\",\"type\":\"parallel\",\"a\":\"" + a +
                    "\",\"b\":\"" + b + "\"";
    if(sense) s += std::string(",\"sense\":\"") + sense + "\"";
    return s + "}";
}
const std::string FLUSH = Par("flush0", "plate.top.n", "pin.bot.n", "opposite") +
                          ",{\"id\":\"flush1\",\"type\":\"pointInPlane\",\"a\":\"plate.top.c\",\"b\":\"pin.bot\"}";
const std::string ALIGN = Par("align0", "plate.top.n", "pin.top.n", "same") +
                          ",{\"id\":\"align1\",\"type\":\"pointInPlane\",\"a\":\"plate.top.c\",\"b\":\"pin.top\"}";
std::string FaceDistance(const char *sense, double d) {
    char v[32];
    snprintf(v, sizeof(v), "%.17g", d);
    return Par("fd0", "plate.top.n", "pin.bot.n", sense) +
           ",{\"id\":\"fd1\",\"type\":\"pointPlaneDistance\",\"a\":\"plate.top.c\",\"b\":\"pin.bot\",\"value\":" +
           v + "}";
}
const std::string POF = "{\"id\":\"pof\",\"type\":\"pointInPlane\",\"a\":\"pin.bot.c\",\"b\":\"plate.top\"}";

std::string Field(const std::string &json, const char *key) {
    std::string k = std::string("\"") + key + "\":";
    size_t at     = json.find(k);
    if(at == std::string::npos) return "";
    at += k.size();
    if(json[at] == '"') return json.substr(at + 1, json.find('"', at + 1) - at - 1);
    return json.substr(at, json.find_first_of(",}]", at) - at);
}

// The pin's world bottom normal (local -z) from the response.
bool PinBottomNormal(const std::string &res, double n[3]) {
    size_t at = res.find("{\"id\":\"pin\"");
    if(at == std::string::npos) return false;
    at = res.find("\"q\":[", at);
    double w, x, y, z;
    if(at == std::string::npos ||
       sscanf(res.c_str() + at, "\"q\":[%lf,%lf,%lf,%lf]", &w, &x, &y, &z) != 4) {
        return false;
    }
    // N = R(q) * (0,0,1); bottom = -N
    n[0] = -2 * (w * y + x * z);
    n[1] = -2 * (y * z - w * x);
    n[2] = -(w * w - x * x - y * y + z * z);
    return true;
}

void Expect(const char *name, const std::string &req, const char *status, int dof,
            double bottomZ = 0) {
    std::string res = orth_solve(req.c_str());
    std::string st  = Field(res, "status");
    bool ok         = (st == status);
    if(ok && dof >= 0) ok = atoi(Field(res, "dof").c_str()) == dof;
    if(ok && bottomZ != 0) {
        double n[3];
        ok = PinBottomNormal(res, n) && std::fabs(n[0]) < 1e-7 && std::fabs(n[1]) < 1e-7 &&
             std::fabs(n[2] - bottomZ) < 1e-7;
    }
    printf("%s %-58s %s dof=%s\n", ok ? "ok  " : "FAIL", name, st.c_str(), Field(res, "dof").c_str());
    if(!ok) {
        failures++;
        printf("     expected %s dof=%d%s\n     %s\n", status, dof,
               bottomZ != 0 ? (bottomZ < 0 ? ", pin bottom normal -z" : ", pin bottom normal +z") : "",
               res.c_str());
    }
}

} // namespace

int main() {
    // DOF: a pin's six, less what the mates hold. Concentric holds four (two slides, two
    // tilts); flush, align and face distance hold a tilt pair (shared with concentric) and
    // one slide; the spin about the axis is left over.
    Expect("concentric", Request(CONC, TILT), "ok", 2);
    Expect("flush", Request(FLUSH, TILT), "ok", 3, -1);
    Expect("concentric + flush (pin in a hole)", Request(CONC + "," + FLUSH, TILT), "redundant-ok", 1, -1);
    Expect("concentric + flush, starting solved", Request(CONC + "," + FLUSH, EXACT), "redundant-ok", 1, -1);
    Expect("concentric + flush at 10x size", Request(CONC + "," + FLUSH, Pose(Q_TILT, 52, 41, 25, 10), 10), "redundant-ok", 1, -1);
    Expect("concentric + flush at 100x size", Request(CONC + "," + FLUSH, Pose(Q_TILT, 52, 41, 25, 100), 100), "redundant-ok", 1, -1);
    Expect("concentric + pointOnFace", Request(CONC + "," + POF, TILT), "ok", 1);
    Expect("concentric + axisParallel", Request(CONC + "," + Par("ap", "plate.ax.d", "pin.ax.d", nullptr), TILT),
           "redundant-ok", 2);
    Expect("concentric x2", Request(CONC + "," + CONC2, TILT), "redundant-ok", 2);
    Expect("concentric + align", Request(CONC + "," + ALIGN, TILT), "redundant-ok", 1, -1);
    Expect("align", Request(ALIGN, TILT), "ok", 3, -1);
    Expect("concentric + faceDistance 5", Request(CONC + "," + FaceDistance("opposite", 5), TILT),
           "redundant-ok", 1, -1);
    Expect("concentric + faceDistance 5 flipped (same sense)",
           Request(CONC + "," + FaceDistance("same", 5), FLIPPED), "redundant-ok", 1, +1);
    Expect("concentric + angle 0 (parallel same)",
           Request(CONC + "," + Par("a0", "plate.top.n", "pin.top.n", "same"), TILT), "redundant-ok", 2, -1);
    Expect("concentric + angle 180 (parallel opposite)",
           Request(CONC + "," + Par("a180", "plate.top.n", "pin.bot.n", "opposite"), TILT), "redundant-ok", 2, -1);
    Expect("angle 0 alone", Request(Par("a0", "plate.top.n", "pin.top.n", "same"), TILT), "ok", 4, -1);
    Expect("concentric + flush + side faces aligned",
           Request(CONC + "," + FLUSH + "," + Par("side", "plate.side.n", "pin.side.n", "same"), TILT),
           "redundant-ok", 0, -1);
    // The sense: the pin starts upside down; flush turns it over rather than accept it.
    Expect("flush, pin starting upside down", Request(FLUSH, FLIPPED), "ok", 3, -1);
    // The wrong sense is never a solution.
    Expect("same and opposite on one pair",
           Request(Par("s", "plate.top.n", "pin.bot.n", "same") + "," +
                   Par("o", "plate.top.n", "pin.bot.n", "opposite"), TILT),
           "inconsistent", -1);
    Expect("both fixed, wrong sense",
           Request(Par("o", "plate.top.n", "pin.bot.n", "opposite"), FLIPPED, 1, true), "inconsistent", -1);
    Expect("both fixed, right sense",
           Request(Par("o", "plate.top.n", "pin.bot.n", "opposite"), EXACT, 1, true), "redundant-ok", 0);
    printf(failures ? "%d FAILED\n" : "all passed\n", failures);
    return failures ? 1 : 0;
}
