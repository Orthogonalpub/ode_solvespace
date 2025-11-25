import { MenuItem } from './FloatingMenu';

export const fileSubmenu: MenuItem[] = [
  { label: 'New', shortcut: 'Ctrl+N' },
  { label: 'Open...', shortcut: 'Ctrl+O' },
  { label: 'Save', shortcut: 'Ctrl+S' },
  { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
  { divider: true },
  { label: 'Export Image...' },
  { label: 'Export 2d Section...' },
  { label: 'Export 2d View...' },
  { label: 'Export 3d Wireframe...' },
  { label: 'Export Triangle Mesh...' },
  { label: 'Export NURBS Surfaces...' },
  { divider: true },
  { label: 'Recent Files', submenu: [] },
  { divider: true },
  { label: 'Exit' },
];

export const viewSubmenu: MenuItem[] = [
  { label: 'Show Toolbar' },
  { divider: true },
  { label: 'Zoom To Fit' },
  { label: 'Align View to Workplane', shortcut: 'W' },
  { label: 'Nearest Ortho View' },
  { label: 'Nearest Iso View' },
  { label: 'Center View at Point' },
  { divider: true },
  { label: 'Dimensions in Inches' },
  { label: 'Dimensions in Millimeters' },
  { divider: true },
  { label: 'Show Property Browser', shortcut: 'Tab' },
  { label: 'Show Snap Grid' },
  { label: 'Darken Inactive Solids' },
  { label: 'Use Perspective Projection' },
];

export const newGroupSubmenu: MenuItem[] = [
  { label: 'Sketch in 3d' },
  { label: 'Sketch in New Workplane' },
  { divider: true },
  { label: 'Step Translating' },
  { label: 'Step Rotating' },
  { divider: true },
  { label: 'Extrude' },
  { label: 'Lathe' },
  { label: 'Revolve' },
  { label: 'Helix' },
  { divider: true },
  { label: 'Link / Assemble...' },
];

export const sketchSubmenu: MenuItem[] = [
  { label: 'Line Segment', shortcut: 'S' },
  { label: 'Rectangle', shortcut: 'R' },
  { label: 'Circle', shortcut: 'C' },
  { label: 'Arc of a Circle', shortcut: 'A' },
  { label: 'Tangent Arc at Point' },
  { label: 'Bezier Cubic Spline', shortcut: 'B' },
  { divider: true },
  { label: 'Text in TrueType Font', shortcut: 'T' },
  { label: 'Image' },
  { divider: true },
  { label: 'Split Curves at Intersection', shortcut: 'I' },
  { divider: true },
  { label: 'Anywhere In 3d' },
  { label: 'In Workplane' },
  { divider: true },
  { label: 'Toggle Construction', shortcut: 'G' },
];

export const constraintsSubmenu: MenuItem[] = [
  { label: 'Distance/Diameter', shortcut: 'D' },
  { label: 'Reference dimension', shortcut: 'Shift+D' },
  { label: 'Angle/Equal angle', shortcut: 'N' },
  { label: 'Reference angle', shortcut: 'Shift+N' },
  { label: 'Other supplementary angle', shortcut: 'U' },
  { label: 'Toggle reference dim', shortcut: 'E' },
  { divider: true },
  { label: 'Horizontal', shortcut: 'H' },
  { label: 'Vertical', shortcut: 'V' },
  { divider: true },
  { label: 'On point/curve/plane', shortcut: 'O' },
  { label: 'Equal Length/Radius/Angle', shortcut: 'L' },
  { label: 'At Midpoint', shortcut: 'M' },
  { label: 'Symmetric', shortcut: 'Y' },
  { label: 'Parallel/Tangent', shortcut: 'Shift+P' },
  { label: 'Perpendicular', shortcut: 'Shift+N' },
  { label: 'Same Orientation' },
  { label: 'Equal Line/Arc Length' },
  { label: 'Length Ratio' },
  { label: 'Length Difference' },
  { label: 'Constrain Arc Line Angle' },
  { label: 'Comment', shortcut: ';' },
];

export const analyzeSubmenu: MenuItem[] = [
  { label: 'Trace Point' },
  { label: 'Stop Tracing' },
  { divider: true },
  { label: 'Step Dimension' },
  { divider: true },
  { label: 'Measure Volume' },
  { label: 'Measure Area' },
  { divider: true },
  { label: 'Show Degrees of Freedom' },
  { label: 'Show Interfering Parts' },
  { label: 'Show Naked Edges' },
];

export const helpSubmenu: MenuItem[] = [
  { label: 'Website / Documentation' },
  { label: 'Online Forum' },
  { divider: true },
  { label: 'About SolveSpace' },
];

export const mainMenuItems: MenuItem[] = [
  { label: 'File', submenu: fileSubmenu },
  { label: 'View', submenu: viewSubmenu },
  { label: 'New group', submenu: newGroupSubmenu },
  { label: 'Sketch', submenu: sketchSubmenu },
  { label: 'Constraints', submenu: constraintsSubmenu, highlighted: true },
  { label: 'Analyze', submenu: analyzeSubmenu },
  { divider: true },
  { label: 'Help', submenu: helpSubmenu },
];
