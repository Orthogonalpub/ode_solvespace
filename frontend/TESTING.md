# GUI Testing Guide

## Quick Test (1 minute)

```bash
cd frontend
pnpm install
pnpm dev
```

**Expected Result**: Browser opens to `http://localhost:3000` showing the complete GUI.

---

## What You Should See

### 1. Loading Screen (2 seconds)
- Purple gradient background
- Spinning loader
- "ODE Geometry" title
- "Loading WASM module..." text

### 2. Main Application

#### Top Bar (48px height)
- ✅ Undo/Redo buttons (left)
- ✅ View mode buttons: **3D** (active), Top, Front, Right
- ✅ Help button
- ✅ Blue "Share" button (right)

#### Left Sidebar (272px width)
- ✅ Logo button with "G" icon
- ✅ "Default Task Name" dropdown
- ✅ Menu button (hamburger icon)

#### Left Toolbar (76px width)
Four sections with tool buttons:

**SHAPE** (11 tools in 2 columns)
- Row 1: Pen, Line
- Row 2: Circle, Arc
- Row 3: Spline, Rectangle
- Row 4: More tools...
- Clicking highlights button in blue

**CONSTR** (12 tools)
- Distance, Angle, Parallel, Perpendicular, etc.

**FORM** (9 tools)
- Extrude, Revolve, Boolean, etc.

**VIEW** (2 tools)
- Show/Hide, Pan

#### 3D Viewport (Main canvas)
- ✅ Light gray background (`#e8e9eb`)
- ✅ **Grid**: Infinite grid with major/minor lines
- ✅ **Blue Cube**: 2x2x2 cube at origin (from mock WASM)
- ✅ **Gizmo**: XYZ axis helper (bottom-right corner)
  - Red = X axis
  - Green = Y axis
  - Blue = Z axis

#### Bottom Status Bar (24px height)
- ✅ Version: "0.1.0-alpha (Mock WASM for Testing)"
- ✅ Groups: 2
- ✅ Tool: "select"
- ✅ Green "● Ready" indicator (right)

---

## Interactive Testing

### Test 1: Orbit Controls
1. **Rotate**: Left click + drag on viewport
   - ✅ Camera rotates around cube
   - ✅ Grid stays fixed
   - ✅ Cube visible from all angles

2. **Pan**: Right click + drag
   - ✅ Camera moves horizontally/vertically
   - ✅ Cube position shifts

3. **Zoom**: Scroll wheel
   - ✅ Camera moves closer/farther
   - ✅ Cube appears larger/smaller

### Test 2: Tool Selection
1. Click any tool in Left Toolbar
2. ✅ Button background turns blue (`#4a90e2`)
3. ✅ Status bar shows tool name
4. Click another tool
5. ✅ Previous tool deselects
6. ✅ New tool becomes active

### Test 3: View Switching
1. Click "Top" button in Top Bar
2. ✅ Button becomes active (white background)
3. ✅ "3D" button deactivates
4. (Camera reorientation - WIP)

### Test 4: Console Output
Open browser DevTools (F12) → Console:

```
✅ Mock WASM module loaded: 0.1.0-alpha (Mock WASM for Testing)
✅ Application ready: 0.1.0-alpha (Mock WASM for Testing)
```

Should see **NO** error messages.

---

## Visual Inspection Checklist

### Colors Match Design
- [ ] Background: Light gray (`#e8e9eb`)
- [ ] Sidebar: Lighter gray (`#f5f5f6`)
- [ ] Borders: Subtle gray (`#e0e0e2`)
- [ ] Active tool: Blue (`#4a90e2`)
- [ ] Cube: Blue-ish (`#4a90e2`)
- [ ] Grid major lines: Medium gray (`#9ea0a3`)
- [ ] Grid minor lines: Light gray (`#c4c5c7`)

### Layout Correct
- [ ] Left sidebar: 272px wide
- [ ] Left toolbar: 76px wide
- [ ] Top bar: 48px tall
- [ ] Status bar: 24px tall
- [ ] Viewport: Fills remaining space
- [ ] No horizontal/vertical scrollbars

### Typography
- [ ] Font: System font (SF Pro, Segoe UI, or Roboto)
- [ ] Toolbar section titles: 10px, uppercase, gray
- [ ] Status bar: 12px
- [ ] Buttons: 13-14px

### Spacing
- [ ] Tool buttons: 32x32px
- [ ] Button gap: 3px
- [ ] Section padding: 4px
- [ ] Icon size: 16-18px

---

## Performance Tests

### Frame Rate
1. Open DevTools → Performance tab
2. Start recording
3. Rotate viewport continuously for 5 seconds
4. Stop recording

✅ **Expected**: Solid 60 FPS (16.67ms per frame)

### Memory
1. DevTools → Memory tab
2. Take heap snapshot
3. Rotate/pan/zoom for 30 seconds
4. Take another snapshot

✅ **Expected**: No significant memory growth (<10MB increase)

---

## Browser Compatibility

Test in all major browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Should work |
| Firefox | 115+ | ✅ Should work |
| Safari | 16+ | ⚠️ May have minor styling differences |
| Edge | 120+ | ✅ Should work |

---

## Common Issues & Fixes

### Issue: Blank Screen
**Fix**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
pnpm install
pnpm dev
```

### Issue: "Module not found" errors
**Fix**: Check `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Cube not rendering
**Fix**:
1. Check console for Three.js errors
2. Verify mock-wasm.js loaded: See "✅ Mock WASM module loaded"
3. Check `loadGroups()` called in App.tsx

### Issue: Grid invisible
**Fix**: Grid may be below viewport. Try zooming out (scroll down).

### Issue: Icons missing
**Fix**: `lucide-react` icons should auto-import. If not:
```bash
pnpm add lucide-react
```

---

## Screenshot Tests

### Expected Appearance

**Full Application:**
```
┌─────────────────────────────────────────────────────────┐
│  [Undo] [Redo]  [3D] Top Front Right   [?] [Share]     │ ← Top Bar
├───┬────┬────────────────────────────────────────────────┤
│ G │SHP │                                                 │
│   │APE │                                                 │
│ T │    │          ╔═══════════════╗                     │
│ a │[⬤]│          ║               ║                     │
│ s │[/]│          ║   Blue Cube   ║    ← Viewport       │
│ k │    │          ║               ║                     │
│   │────│          ╚═══════════════╝                     │
│   │CONS│                                            XYZ  │ ← Gizmo
│   │TRS │                                                 │
│   │────│                                                 │
│   │FORM│                                                 │
│   │────│                                                 │
│   │VIEW│                                                 │
├───┴────┴─────────────────────────────────────────────────┤
│ Version: 0.1.0  Groups: 2  Tool: select      ● Ready    │ ← Status
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps After Testing

If everything works:

1. ✅ Mark GUI implementation as complete
2. ✅ Build real WASM module (see main README.md)
3. ✅ Test with actual .slvs file
4. ✅ Implement tool actions (point, line, circle)
5. ✅ Add constraint system

If issues found:
1. Check console for errors
2. Verify all dependencies installed
3. Try different browser
4. Report issue with screenshot + console log

---

## Success Criteria

✅ All tests pass if:
- [ ] Loading screen appears briefly
- [ ] Main UI matches Figma design
- [ ] Blue cube visible in viewport
- [ ] Orbit controls work smoothly
- [ ] Tool selection updates status bar
- [ ] No console errors
- [ ] 60 FPS maintained during interaction
- [ ] Status bar shows "● Ready"

**Test Duration**: ~5 minutes for full suite

---

Happy testing! 🚀
