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
      { icon: LineIcon, name: 'Line', type: 'line', shortcut: 'L', description: 'Create a line segment' },
      { icon: RectangleIcon, name: 'Rectangle', type: 'rectangle', shortcut: 'R', description: 'Create a rectangle' },
      { icon: CircleIcon, name: 'Circle', type: 'circle', shortcut: 'C', description: 'Create a circle' },
      { icon: ArcIcon, name: 'Arc', type: 'arc', shortcut: 'A', description: 'Create an arc' },
      { icon: TextIcon, name: 'Text', type: 'text', shortcut: 'T', description: 'Add text' },
      { icon: ImageIcon, name: 'Image', type: 'image', description: 'Insert image' },
      { icon: TangentIcon, name: 'Tangent', type: 'tangent', description: 'Tangent constraint' },
      { icon: ConnectIcon, name: 'Connect', type: 'connect', description: 'Connect points' },
      { icon: PointIcon, name: 'Point', type: 'point', shortcut: 'P', description: 'Create a point' },
      { icon: ToggleConstructionIcon, name: 'Construction', type: 'construction', shortcut: 'X', description: 'Toggle construction' },
      { icon: IntersectIcon, name: 'Intersect', type: 'intersect', description: 'Intersection point' },
    ],
  },
  {
    title: 'CONSTR',
    tools: [
      { icon: DistanceIcon, name: 'Distance', type: 'distance', shortcut: 'Shift+D', description: 'Distance constraint' },
      { icon: AngleIcon, name: 'Angle', type: 'angle', shortcut: 'Shift+A', description: 'Angle constraint' },
      { icon: HorizontalIcon, name: 'Horizontal', type: 'horizontal', shortcut: 'H', description: 'Horizontal constraint' },
      { icon: VerticalIcon, name: 'Vertical', type: 'vertical', shortcut: 'V', description: 'Vertical constraint' },
      { icon: ParallelIcon, name: 'Parallel', type: 'parallel', description: 'Parallel constraint' },
      { icon: PerpendicularIcon, name: 'Perpendicular', type: 'perpendicular', description: 'Perpendicular constraint' },
      { icon: PointOnLineIcon, name: 'Point on Line', type: 'point-on-line', description: 'Point on line constraint' },
      { icon: MirrorIcon, name: 'Mirror', type: 'mirror', shortcut: 'Shift+M', description: 'Mirror constraint' },
      { icon: EqualIcon, name: 'Equal', type: 'equal', shortcut: 'E', description: 'Equal length/radius' },
      { icon: NormalsIcon, name: 'Normals', type: 'normals', description: 'Show normals' },
      { icon: SupplementaryAngleIcon, name: 'Supplementary', type: 'supplementary', description: 'Supplementary angle' },
      { icon: RefIcon, name: 'Reference', type: 'reference', description: 'Reference dimension' },
    ],
  },
  {
    title: 'FORM',
    tools: [
      { icon: ExtrudeIcon, name: 'Extrude', type: 'extrude', shortcut: 'Shift+E', description: 'Extrude sketch' },
      { icon: RotateIcon, name: 'Rotate', type: 'rotate', description: 'Rotate component' },
      { icon: HelixIcon, name: 'Helix', type: 'helix', description: 'Create helix' },
      { icon: RevolveIcon, name: 'Revolve', type: 'revolve', shortcut: 'Shift+R', description: 'Revolve sketch' },
      { icon: RotatePatternIcon, name: 'Rotate Pattern', type: 'rotate-pattern', description: 'Rotate pattern' },
      { icon: TranslateIcon, name: 'Translate', type: 'translate', description: 'Translate entities' },
      { icon: NewWorkplaneIcon, name: 'New Workplane', type: 'new-workplane', description: 'New group in workplane' },
      { icon: NewGroup3DIcon, name: 'New 3D Group', type: 'new-3d-group', description: 'New group in 3D' },
      { icon: AssemblyIcon, name: 'Assembly', type: 'assembly', description: 'Assembly operation' },
    ],
  },
  {
    title: 'VIEW',
    tools: [
      { icon: IsometricIcon, name: 'Isometric', type: 'isometric', description: 'Isometric view' },
      { icon: AlignViewIcon, name: 'Align View', type: 'align-view', description: 'Align view to workplane' },
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
