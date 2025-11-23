
To understand the Web/WASM version of SolveSpace, you need to look specifically at how the C++ core interacts with the Emscripten compiler (which translates C++ to WebAssembly/JavaScript).

The "Web Version" is essentially the core SolveSpace logic wrapped in a specific **Platform Abstraction Layer** designed for the browser.

Here is the function call diagram and code structure analysis.

### High-Level Architecture Diagram

This diagram illustrates the flow from the Web Browser (JS) down to the C++ Core Geometry Kernel.

graph TD
    %% Web / Browser Layer
    subgraph "Web / Browser Layer"
        HTML[index.html] -->|Loads| JSGlue[solvespace.js / Module]
        JSGlue -->|Init / Memory| WASM[solvespace.wasm]
        DOMEvents[DOM Events (Mouse, Keyboard, Resize)] -->|Triggers| JSGlue
    end

    %% Platform Layer
    subgraph "Platform Layer (src/platform/emscripten/)"
        JSGlue -->|Calls main()| EmMain[emmain.cpp main()]
        EmMain -->|Registers| Loop[emscripten_set_main_loop]
        
        DOMEvents -.->|Callbacks| EmInput[Input Event Handlers (OnMouse, OnKey)]
        EmInput -->|Dispatches| GW[GraphicsWindow]
    end

    %% Core UI & Graphics
    subgraph "Core UI & Graphics (src/)"
        GW -->|Paint()| Draw[draw.cpp PaintGraphics()]
        Draw -->|OpenGL ES 2.0| WebGL[WebGL Context]
        
        GW -->|Handle Interaction| MouseLogic[mouse.cpp Mouse Handling]
    end

    %% Geometry Kernel
    subgraph "Geometry Kernel (src/)"
        MouseLogic -->|Modify| Sketch[Group / Constraint]
        Sketch -->|Trigger| Solver[solver.cpp System::Solve]
        Solver -->|Regenerate| Geo[generate.cpp GenerateAll]
        Geo -->|Triangulation| Mesh[srf/booleans]
    end

    %% File System (Virtual)
    subgraph "File System (Virtual)"
        Save[Save/Load] -->|IDBFS| IDB[IndexedDB (Virtual /save directory)]
    end

    %% Connections
    Loop -->|Every Frame| GW
    Geo -.->|Update| Draw



### Detailed Code Structure Breakdown

To navigate the code `solvespace/solvespace`, focus on these specific directories and files that facilitate the web version.

#### 1. The Entry Point (The Bridge)
**Location:** `src/platform/emscripten/emmain.cpp`

This is the most critical file for the web version. Unlike the Desktop version (which starts in `main.cpp` or `wWinMain`), the web version starts here.

*   **`main()`**: Initializes the Emscripten environment.
*   **`emscripten_set_main_loop(DoPaint, ...)`**: The browser cannot have a blocking `while(true)` loop. This function tells the browser to call the C++ function `DoPaint` every time the screen refreshes (60fps).
*   **`RunFile(filename)`**: Handles loading a file passed via URL parameters or drag-and-drop.

#### 2. The UI & Rendering Loop
**Location:** `src/platform/emscripten/` & `src/window.cpp`

*   **`DoPaint()`**: Located in `emmain.cpp`. It calls the core `GraphicsWindow::Paint()`.
*   **`GraphicsWindow::Paint()`**: This is the heart of the visual output. It clears the screen, sets up the camera, and calls `draw.cpp` to render the 3D geometry and the 2D UI (toolbar, menus) over it.
*   **WebGL**: SolveSpace uses OpenGL 1.x/2.x commands. Emscripten automatically translates these C++ OpenGL calls into WebGL JavaScript calls.

#### 3. Input Handling (Mouse/Keyboard)
**Location:** `src/platform/emscripten/emmain.cpp` -> `src/mouse.cpp`

*   **HTML Events**: The C++ code registers callbacks like `emscripten_set_mousemove_callback`.
*   **Translation**: When you move the mouse in Chrome, Emscripten catches the JS event, converts coordinates, and calls a C++ function inside `emmain.cpp`.
*   **`GraphicsWindow::MouseEvent(...)`**: The platform layer passes the event to the core application logic. This determines if you are rotating the view, dragging a constraint, or clicking a button.

#### 4. The Geometry Kernel (The Core)
**Location:** `src/solve.cpp`, `src/generate.cpp`, `src/group.cpp`

This code is identical to the desktop version. It compiles to WASM without changes.

*   **`Group`**: Represents a step in the history (e.g., "Extrude", "Sketch in Plane").
*   **`System::Solve()`**: When you change a dimension, the Newton-Raphson solver runs to satisfy constraints.
*   **`GenerateAll()`**: If the solver succeeds, this regenerates the 3D meshes (triangles) for rendering.
    *   *Performance Note:* On the web, this runs on the main browser thread. If a model is complex, the browser UI might freeze momentarily while this function calculates.

#### 5. File System (Virtual Disk)
**Location:** `src/platform/emscripten/emmain.cpp`

Browsers don't have direct access to your hard drive.
*   **IDBFS (IndexedDB File System)**: SolveSpace Web creates a "virtual" folder `/save`.
*   **Syncing**: When you click "Save", it writes to this virtual memory. Emscripten then syncs this memory to the browser's `IndexedDB` storage so your files persist between reloads.

### Call Interaction Example: "Drawing a Line"

Here is the trace of what happens when you draw a line in the Web Version:

1.  **User Action**: User clicks inside the HTML canvas.
2.  **Browser**: Fires standard JS `mousedown` event.
3.  **Emscripten Glue**: Calls the registered C++ callback in `emmain.cpp`.
4.  **Platform Layer**: `emmain.cpp` passes coordinates to `GraphicsWindow::MouseEvent`.
5.  **Core Logic**:
    *   `mouse.cpp` detects "Sketch Line" tool is active.
    *   It creates a new `Request` object.
6.  **Solver**:
    *   `solver.cpp` runs to ensure the new point snaps to the grid or existing points.
7.  **Visual Feedback**:
    *   The data structure is updated.
    *   The `emscripten_set_main_loop` triggers the next frame.
    *   `DoPaint` -> `PaintGraphics` draws the new line segment in red (active).