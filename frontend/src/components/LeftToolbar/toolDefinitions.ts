// Exact SVG icons from Figma design
import {
  LineIcon,
  RectangleIcon,
  CircleIcon,
  ArcIcon,
  TextIcon,
  ImageIcon,
  TangentIcon,
  ConnectIcon,
  PointIcon,
  ToggleConstructionIcon,
  IntersectIcon,
  DistanceIcon,
  AngleIcon,
  HorizontalIcon,
  VerticalIcon,
  ParallelIcon,
  PerpendicularIcon,
  PointOnLineIcon,
  MirrorIcon,
  EqualIcon,
  NormalsIcon,
  SupplementaryAngleIcon,
  RefIcon,
  ExtrudeIcon,
  RotateIcon,
  HelixIcon,
  RevolveIcon,
  RotatePatternIcon,
  TranslateIcon,
  AssemblyIcon,
  NewWorkplaneIcon,
  NewGroup3DIcon,
  IsometricIcon,
  AlignViewIcon,
} from './ToolIcons';

export interface Tool {
  icon: React.ComponentType<any>;
  name: string;
  type: string;
  shortcut?: string;
  description?: string;
}

export interface ToolSection {
  title: string;
  tools: Tool[];
  defaultCollapsed?: boolean;
}

export const toolSections: ToolSection[] = [
  {
    title: 'SHAPE',
    tools: [
      { icon: LineIcon, name: 'Line', type: 'line', shortcut: 'S', description: 'Sketch line segment' },
      { icon: RectangleIcon, name: 'Rectangle', type: 'rectangle', shortcut: 'R', description: 'Sketch rectangle' },
      { icon: CircleIcon, name: 'Circle', type: 'circle', shortcut: 'C', description: 'Sketch circle' },
      { icon: ArcIcon, name: 'Arc', type: 'arc', shortcut: 'A', description: 'Sketch arc of a circle' },
      { icon: TextIcon, name: 'Text', type: 'text', shortcut: 'T', description: 'Sketch curves from text in a TrueType font' },
      { icon: ImageIcon, name: 'Image', type: 'image', description: 'Sketch image from a file' },
      { icon: TangentIcon, name: 'Tangent Arc', type: 'tangent', shortcut: 'Shift+A', description: 'Create tangent arc at selected point' },
      { icon: ConnectIcon, name: 'Bezier', type: 'connect', shortcut: 'B', description: 'Sketch cubic Bezier spline' },
      { icon: PointIcon, name: 'Point', type: 'point', shortcut: 'P', description: 'Sketch datum point' },
      { icon: ToggleConstructionIcon, name: 'Construction', type: 'construction', shortcut: 'G', description: 'Toggle construction' },
      { icon: IntersectIcon, name: 'Split', type: 'intersect', shortcut: 'I', description: 'Split lines / curves where they intersect' },
    ],
  },
  {
    title: 'CONSTR',
    tools: [
      { icon: DistanceIcon, name: 'Distance', type: 'distance', shortcut: 'D', description: 'Constrain distance / diameter / length' },
      { icon: AngleIcon, name: 'Angle', type: 'angle', shortcut: 'N', description: 'Constrain angle' },
      { icon: HorizontalIcon, name: 'Horizontal', type: 'horizontal', shortcut: 'H', description: 'Constrain to be horizontal' },
      { icon: VerticalIcon, name: 'Vertical', type: 'vertical', shortcut: 'V', description: 'Constrain to be vertical' },
      { icon: ParallelIcon, name: 'Parallel', type: 'parallel', shortcut: 'L', description: 'Constrain to be parallel or tangent' },
      { icon: PerpendicularIcon, name: 'Perpendicular', type: 'perpendicular', shortcut: '[', description: 'Constrain to be perpendicular' },
      { icon: PointOnLineIcon, name: 'On Entity', type: 'point-on-line', shortcut: 'O', description: 'Constrain point on line / curve / plane / point' },
      { icon: MirrorIcon, name: 'Symmetric', type: 'mirror', shortcut: 'Y', description: 'Constrain symmetric' },
      { icon: EqualIcon, name: 'Equal', type: 'equal', shortcut: 'Q', description: 'Constrain equal length / radius / angle' },
      { icon: NormalsIcon, name: 'Orientation', type: 'normals', shortcut: 'X', description: 'Constrain normals in same orientation' },
      { icon: SupplementaryAngleIcon, name: 'Supplementary', type: 'supplementary', shortcut: 'U', description: 'Other supplementary angle' },
      { icon: RefIcon, name: 'Reference', type: 'reference', shortcut: 'E', description: 'Toggle reference dimension' },
    ],
  },
  {
    title: 'FORM',
    tools: [
      { icon: ExtrudeIcon, name: 'Extrude', type: 'extrude', shortcut: 'Shift+X', description: 'New group extruding active sketch' },
      { icon: RotateIcon, name: 'Lathe', type: 'rotate', shortcut: 'Shift+L', description: 'New group rotating active sketch' },
      { icon: HelixIcon, name: 'Helix', type: 'helix', shortcut: 'Shift+H', description: 'New group helix from active sketch' },
      { icon: RevolveIcon, name: 'Revolve', type: 'revolve', shortcut: 'Shift+V', description: 'New group revolve active sketch' },
      { icon: RotatePatternIcon, name: 'Step Rotate', type: 'rotate-pattern', shortcut: 'Shift+R', description: 'New group step and repeat rotating' },
      { icon: TranslateIcon, name: 'Step Translate', type: 'translate', shortcut: 'Shift+T', description: 'New group step and repeat translating' },
      { icon: NewWorkplaneIcon, name: 'Workplane', type: 'new-workplane', shortcut: 'Shift+W', description: 'New group in new workplane (thru given entities)' },
      { icon: NewGroup3DIcon, name: '3D Sketch', type: 'new-3d-group', shortcut: 'Shift+3', description: 'New group in 3d' },
      { icon: AssemblyIcon, name: 'Link', type: 'assembly', shortcut: 'Shift+I', description: 'New group linking / assembling file' },
    ],
  },
  {
    title: 'VIEW',
    tools: [
      { icon: IsometricIcon, name: 'Isometric', type: 'isometric', description: 'Nearest isometric view' },
      { icon: AlignViewIcon, name: 'Align View', type: 'align-view', shortcut: 'W', description: 'Align view to active workplane' },
    ],
  },
];

export const getToolByType = (type: string): Tool | undefined => {
  for (const section of toolSections) {
    const tool = section.tools.find(t => t.type === type);
    if (tool) return tool;
  }
  return undefined;
};

export const getAllTools = (): Tool[] => {
  return toolSections.flatMap(section => section.tools);
};

export const getToolCount = (): number => {
  return toolSections.reduce((count, section) => count + section.tools.length, 0);
};
