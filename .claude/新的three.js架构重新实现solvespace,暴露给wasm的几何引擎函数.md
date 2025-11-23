帮我检查下，如果需要新的three.js架构重新实现solvespace, 前端UI全部不通过C++处理，那么需要多少目前版本没有暴露给wasm的几何引擎函数还需要添加

这是一个非常关键的架构设计步骤。目前的 SolveSpace WebAssembly (WASM) 接口几乎是“黑盒”状态——它只暴露了 `main()` 和 OpenGL 上下文，内部逻辑完全封闭。

如果你要将 UI 和渲染完全剥离给 Three.js，你需要将 C++ 内核重构为一个**“无状态（或半有状态）的 API 服务器”**。

你需要添加的 API 数量在 **40-60 个** 左右。以下是详细的 API 需求清单，按功能模块分类：

---

### 1. 核心生命周期与文件 I/O (System & File)
目前 C++ 代码直接读写虚拟文件系统。你需要改为通过内存 buffer 传递数据。

*   **`long Initialize()`**: 初始化求解器内存。
*   **`void LoadModelFromBuffer(uint8_t* ptr, int length)`**: 从 JS 传入的 ArrayBuffer 加载 `.slvs` 文件。
*   **`int GetSaveDataSize()`**: 获取当前模型保存后的字节大小。
*   **`void GetSaveData(uint8_t* ptr)`**: 将保存的数据写入 JS 提供的内存块。
*   **`void ClearModel()`**: 重置/新建空文件。

### 2. 渲染数据获取 (Rendering Data Access) —— **最核心缺口**
这是 Three.js 渲染的基础。目前这些数据都在 C++ 的 `SSSurface` 和 `SKEntity` 结构体里，外部拿不到。你需要暴露函数来获取**顶点数组**，以便填充 Three.js 的 `BufferGeometry`。

*   **`int GetTriangleCount(int groupID)`**: 获取某组实体的三角形数量。
*   **`void GetTriangleVertices(int groupID, float* outPtr)`**:
    *   **作用**：把 C++ 里的 mesh 顶点数据拷贝到 JS 的 `Float32Array`。
    *   **用途**：渲染 3D 实体表面。
*   **`int GetEdgeCount(int groupID)`**: 获取线条数量（轮廓线）。
*   **`void GetEdgeVertices(int groupID, float* outPtr)`**:
    *   **作用**：获取所有线段的 `x1, y1, z1, x2, y2, z2`。
    *   **用途**：渲染黑色轮廓线（Three.js `LineSegments`）。
*   **`void GetNormals(int groupID, float* outPtr)`**: 获取法线数据（用于光照）。
*   **`int GetConstraintVisualizationCount()`**: 获取约束图标（如距离标注、平行符号）的数量。
*   **`void GetConstraintData(int index, float* outPos, int* outType)`**: 获取第 N 个约束在空间的坐标，以便前端画文字或图标。

### 3. 实体查询与对象树 (Entity & Tree Traversal)
前端需要显示左侧的“浏览器树”（Group List），这需要遍历 C++ 的数据结构。

*   **`int GetGroupCount()`**: 获取有多少个步骤（Group）。
*   **`void GetGroupInfo(int groupIndex, GroupInfoStruct* outInfo)`**: 获取组的名称、ID、显隐状态。
*   **`int GetEntitiesInGroupCount(int groupID)`**: 获取某组里有多少个点、线、圆。
*   **`void GetEntityInfo(int entityID, EntityInfoStruct* outInfo)`**:
    *   **关键**：返回实体的类型（点/线/圆）、参数（坐标/半径）、以及它的**唯一 ID (h.v)**。前端的三维物体 `userData` 必须存这个 ID。
*   **`void SetGroupVisibility(int groupID, bool visible)`**: 控制组的显示/隐藏。

### 4. 编辑操作 (Mutations / Actions)
这是目前的 `src/mouse.cpp` 和 `src/textwin.cpp` 做的逻辑，现在要由 JS 触发。

*   **`int AddPoint(double x, double y, double z)`**: 添加点，返回新点的 ID。
*   **`int AddLine(int p1_ID, int p2_ID)`**: 连接两点成线。
*   **`int AddCircle(int center_ID, int normal_ID, double radius)`**: 画圆。
*   **`int AddConstraint(int type, int* entityIDs, int count, double value)`**:
    *   **核心**：添加约束（如：选中两条线 IDs，类型为平行）。
*   **`void DeleteEntity(int entityID)`**: 删除选中的物体。
*   **`void SetEntityParameter(int entityID, int paramType, double value)`**: 修改尺寸（如将长度从 10mm 改为 20mm）。

### 5. 交互与计算辅助 (Interaction Helper)
前端 JS 做光线投射（Raycasting）虽然能拿到坐标，但复杂的**几何吸附 (Snapping)** 最好还是让 C++ 算。

*   **`SnapResult CalculateSnapping(double x, double y, double viewScale)`**:
    *   输入：鼠标在工作平面的坐标。
    *   输出：吸附到的点 ID、吸附后的精确坐标、是否吸附到网格。
*   **`void DragRequest(int entityID, double newX, double newY)`**:
    *   **拖拽专用**：告诉求解器，用户正在尝试把某个点拖到新位置。
*   **`bool Solve()`**:
    *   **手动触发求解**。在 JS 拖拽过程中，每帧调用一次，然后重新获取渲染数据更新画面。

### 6. 总结：你需要暴露多少？

目前 C++ 代码库中：
*   **已暴露**：`0` (除了 main 和基本的 stdio)。
*   **需添加**：约 **45 - 55 个导出函数**。

#### 实施建议：不要手动写 `extern "C"`

不要手动在每个 C++ 函数前加 `extern "C"`。建议使用 **Emscripten 的 `Embind`** 技术。

**Embind 示例代码：**

```cpp
// interface.cpp (新建文件)
#include <emscripten/bind.h>
#include "solvespace.h"

using namespace emscripten;

// 封装一个类给 JS 用
class SolveSpaceAPI {
public:
    void loadModel(std::string data) { ... }
    
    // 返回 JS 数组
    val getVertices() {
        std::vector<float> verts = Core::GetMesh();
        return val::array(verts);
    }
    
    void addConstraint(int type, val entityIds) {
        std::vector<int> ids = vecFromJSArray<int>(entityIds);
        System::AddConstraint(type, ids);
    }
};

EMSCRIPTEN_BINDINGS(my_module) {
    class_<SolveSpaceAPI>("SolveSpaceAPI")
        .constructor<>()
        .function("loadModel", &SolveSpaceAPI::loadModel)
        .function("getVertices", &SolveSpaceAPI::getVertices)
        .function("addConstraint", &SolveSpaceAPI::addConstraint);
}
```

### 结论
你需要做的是一层 **"Data Adaptation Layer" (数据适配层)**。
这层 C++ 代码位于 `solvespace` 核心和 `WASM` 之间，它的唯一工作就是：**把 SolveSpace 复杂的内部类（Group, Entity, Constraint）拆解成简单的 int/float 数组，喂给 JavaScript。**