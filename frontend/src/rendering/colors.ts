// SolveSpace color definitions matching src/style.cpp
// All colors use RGB values from the original C++ implementation

export const SolveSpaceColors = {
  // Background colors
  BACKGROUND: '#1a1a1a',        // Dark background (default)
  BACKGROUND_LIGHT: '#2d2d2d',  // Slightly lighter for contrast

  // Entity styles from Style::Defaults[] in style.cpp
  ACTIVE_GRP: '#ffffff',        // RGBf(1.0, 1.0, 1.0) - White
  CONSTRUCTION: '#1ab31a',      // RGBf(0.1, 0.7, 0.1) - Light green
  INACTIVE_GRP: '#804d00',      // RGBf(0.5, 0.3, 0.0) - Orange/brown
  DATUM: '#00cc00',             // RGBf(0.0, 0.8, 0.0) - Dark green
  SOLID_EDGE: '#cccccc',        // RGBf(0.8, 0.8, 0.8) - Light gray
  CONSTRAINT: '#ff1aff',        // RGBf(1.0, 0.1, 1.0) - Magenta
  SELECTED: '#ff0000',          // RGBf(1.0, 0.0, 0.0) - Red
  HOVERED: '#ffff00',           // RGBf(1.0, 1.0, 0.0) - Yellow
  CONTOUR_FILL: '#001a1a',      // RGBf(0.0, 0.1, 0.1) - Dark cyan
  NORMALS: '#006666',           // RGBf(0.0, 0.4, 0.4) - Teal
  ANALYZE: '#00ffff',           // RGBf(0.0, 1.0, 1.0) - Cyan (DOF indicators)
  DRAW_ERROR: '#ff0000',        // RGBf(1.0, 0.0, 0.0) - Red (errors)
  DIM_SOLID: '#1a1a1a',         // RGBf(0.1, 0.1, 0.1) - Dark gray
  HIDDEN_EDGE: '#cccccc',       // Same as SOLID_EDGE but dashed
  OUTLINE: '#cccccc',           // RGBf(0.8, 0.8, 0.8) - Gray

  // Grid colors
  GRID_MAJOR: '#404040',        // Major grid lines
  GRID_MINOR: '#2a2a2a',        // Minor grid lines

  // Mesh colors (for solid bodies)
  MESH_FRONT: '#4a6fa5',        // Front face color
  MESH_BACK: '#8b0000',         // Back face color (indicates inside-out)
} as const;

// Line widths from style.cpp
export const LineWidths = {
  ACTIVE_GRP: 1.5,
  CONSTRUCTION: 1.5,
  INACTIVE_GRP: 1.5,
  DATUM: 1.5,
  SOLID_EDGE: 1.0,
  CONSTRAINT: 1.0,
  SELECTED: 1.5,
  HOVERED: 1.5,
  ANALYZE: 3.0,
  DRAW_ERROR: 8.0,
  OUTLINE: 3.0,
} as const;

// Z-index ordering (higher = drawn on top)
export const ZIndex = {
  HIDDEN_EDGE: 1,
  SOLID_EDGE: 2,
  INACTIVE_GRP: 3,
  CONSTRUCTION: 4,
  ACTIVE_GRP: 5,
  POINTS: 6,
  SELECTED: 10,
  HOVERED: 11,
} as const;

// Stipple patterns matching StipplePattern enum
export enum StipplePattern {
  CONTINUOUS = 0,
  SHORT_DASH = 1,
  DASH = 2,
  LONG_DASH = 3,
  DASH_DOT = 4,
  DASH_DOT_DOT = 5,
  DOT = 6,
  FREEHAND = 7,
  ZIGZAG = 8,
}

// Pattern definitions for Three.js LineDashedMaterial
// Format: [dashSize, gapSize] (scaled by stippleScale)
export const StipplePatterns: Record<StipplePattern, { dashSize: number; gapSize: number }> = {
  [StipplePattern.CONTINUOUS]: { dashSize: 1, gapSize: 0 },
  [StipplePattern.SHORT_DASH]: { dashSize: 1, gapSize: 2 },
  [StipplePattern.DASH]: { dashSize: 3, gapSize: 2 },
  [StipplePattern.LONG_DASH]: { dashSize: 6, gapSize: 2 },
  [StipplePattern.DASH_DOT]: { dashSize: 4, gapSize: 2 },
  [StipplePattern.DASH_DOT_DOT]: { dashSize: 4, gapSize: 2 },
  [StipplePattern.DOT]: { dashSize: 0.5, gapSize: 2 },
  [StipplePattern.FREEHAND]: { dashSize: 1, gapSize: 1 },
  [StipplePattern.ZIGZAG]: { dashSize: 1, gapSize: 1 },
};

// Convert hex color to Three.js format
export function hexToThreeColor(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}
