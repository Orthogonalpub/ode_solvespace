# ODE Geometry Frontend

Modern React + Three.js frontend for ODE Geometry (SolveSpace Web).

## Quick Start (No Build Required!)

```bash
# Install dependencies
pnpm install
# or: npm install

# Start development server with MOCK WASM
pnpm dev

# Open http://localhost:3000
```

The app will automatically load a **mock WASM module** that displays a sample 3D cube. No C++ compilation needed for testing!

## Features

- ✅ **Mock WASM Mode** - Test UI without building C++
- ✅ **Three.js 3D Viewport** - Grid, lighting, orbit controls
- ✅ **Figma Design Match** - Exact implementation of design system
- ✅ **Tool Palette** - SHAPE, CONSTR, FORM, VIEW sections
- ✅ **State Management** - Zustand + Immer
- ✅ **TypeScript** - Full type safety

## Architecture

```
React UI Layer
    ↓
WASM API (Mock or Real)
    ↓
Three.js Rendering
```

### Mock WASM Module

Located at `public/mock-wasm.js`, provides:
- Sample cube geometry (12 triangles)
- 2 groups (Sketch-1, Extrude-1)
- All 13 Phase 1 API functions
- Instant loading for development

### Real WASM Module

To use the real C++ WASM module:

1. Build WASM:
```bash
cd ../build-wasm-headless
make -j8
cp bin/slvs.* ../frontend/public/
```

2. Enable real WASM:
```bash
# Edit .env
VITE_USE_REAL_WASM=true
```

3. Restart dev server:
```bash
pnpm dev
```

## Project Structure

```
src/
├── components/
│   ├── Viewport/          # Three.js 3D canvas
│   │   ├── Viewport.tsx
│   │   └── GeometryMesh.tsx
│   ├── LeftSidebar/       # Task navigation (272px)
│   ├── LeftToolbar/       # Tool palette (76px)
│   └── TopBar/            # View controls (48px)
├── api/
│   └── wasmLoader.ts      # WASM module loader
├── store/
│   └── useGeometryStore.ts # Zustand state
├── types/
│   └── geometry.ts        # TypeScript types
└── App.tsx                # Main layout

public/
├── mock-wasm.js           # Mock WASM for development
└── slvs.js/.wasm          # Real WASM (after build)
```

## UI Components

### Viewport (Main Canvas)
- **Grid**: Infinite grid, 1 unit cells, 5 unit major grid
- **Controls**: Orbit (rotate), Pan, Zoom
- **Lighting**: Directional + ambient
- **Gizmo**: 3D orientation helper (bottom-right)

### Left Sidebar (272px)
- Logo button
- Task selector dropdown
- Menu button
- (Future: File tree, groups list)

### Left Toolbar (76px)
Organized into 4 sections:

**SHAPE** (11 tools)
- Point, Line, Circle, Arc
- Spline, Rectangle, Polygon, etc.

**CONSTR** (12 tools)
- Distance, Angle, Parallel
- Perpendicular, Tangent, Equal, etc.

**FORM** (9 tools)
- Extrude, Revolve, Loft
- Boolean operations, Fillet, Chamfer

**VIEW** (2 tools)
- Show/Hide, Pan

### Top Bar (48px)
- Undo/Redo buttons
- View mode selector (3D, Top, Front, Right)
- Help button
- Share button

## State Management

### Geometry Store (`useGeometryStore`)

```typescript
interface GeometryState {
  wasmModule: WASMModule | null;
  groups: GroupInfo[];
  selectedEntities: EntityID[];
  activeTool: Tool;

  setWASMModule(module: WASMModule): void;
  loadGroups(): void;
  selectEntity(id: EntityID): void;
  setActiveTool(type: ToolType): void;
}
```

## Development

### Available Scripts

```bash
pnpm dev          # Start dev server (mock WASM)
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript check
```

### Adding New Components

1. Create component in `src/components/`
2. Add styles (CSS or inline)
3. Import in `App.tsx`
4. Update state in `useGeometryStore` if needed

### Connecting to WASM

```typescript
import { useGeometryStore } from '@/store/useGeometryStore';

function MyComponent() {
  const wasmModule = useGeometryStore(s => s.wasmModule);

  const handleAction = () => {
    if (!wasmModule) return;

    const count = wasmModule.GetGroupCount();
    // Use WASM API...
  };
}
```

## Testing the GUI

### What You'll See

1. **3D Viewport**: Light gray background with grid
2. **Sample Cube**: Blue 3D cube at origin (from mock WASM)
3. **Left Sidebar**: Task name "Default Task Name"
4. **Left Toolbar**: 4 sections with tool buttons
5. **Top Bar**: View controls and share button
6. **Gizmo**: XYZ axis helper (bottom-right)

### Interactive Features

✅ **Orbit Controls**:
- Left click + drag = Rotate
- Right click + drag = Pan
- Scroll = Zoom

✅ **Tool Selection**:
- Click any tool button
- Active tool highlights in blue

✅ **View Switching**:
- Click 3D/Top/Front/Right buttons
- Camera reorients (WIP)

## Design System

Matches Figma design exactly:

**Colors:**
- Background: `#e8e9eb`
- Sidebar: `#f5f5f6`
- Border: `#e0e0e2`
- Text Primary: `#2c2d30`
- Text Secondary: `#5e6063`
- Accent Blue: `#4a90e2`
- Grid Major: `#9ea0a3`
- Grid Minor: `#c4c5c7`

**Spacing:**
- Sidebar: 272px
- Toolbar: 76px
- Top bar: 48px
- Tool button: 32px
- Section gap: 4px

## Troubleshooting

### "WASM module not found"
- Check `public/mock-wasm.js` exists
- Restart dev server
- Clear browser cache

### "Blank screen"
- Open browser console (F12)
- Check for error messages
- Verify `pnpm install` completed

### "Types error"
- Run `pnpm type-check`
- Update TypeScript definitions in `src/types/`

### "Mock cube not showing"
- Check console: "✅ Mock WASM module loaded"
- Verify `loadGroups()` called in App.tsx
- Check Three.js console warnings

## Next Steps

- [ ] Implement tool actions (point, line, circle)
- [ ] Add file upload for .slvs files
- [ ] Connect constraint system
- [ ] Add property panel
- [ ] Implement undo/redo
- [ ] Add keyboard shortcuts

## Resources

- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Figma Design](https://www.figma.com/design/jh5Xm4JLImD0NEnB9oyl2Z/Geometry-UI?node-id=1-7050)
