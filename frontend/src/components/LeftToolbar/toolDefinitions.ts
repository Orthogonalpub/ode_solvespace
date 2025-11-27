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
import { Command } from '@/types/geometry';

export interface Tool {
  icon: React.ComponentType<any>;
  name: string;
  type: string;
  shortcut?: string;
  description?: string;
  command?: Command; // SolveSpace command ID
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
      { icon: LineIcon, name: 'Line', type: 'line', shortcut: 'S', description: 'Sketch line segment', command: Command.LINE_SEGMENT },
      { icon: RectangleIcon, name: 'Rectangle', type: 'rectangle', shortcut: 'R', description: 'Sketch rectangle', command: Command.RECTANGLE },
      { icon: CircleIcon, name: 'Circle', type: 'circle', shortcut: 'C', description: 'Sketch circle', command: Command.CIRCLE },
      { icon: ArcIcon, name: 'Arc', type: 'arc', shortcut: 'A', description: 'Sketch arc of a circle', command: Command.ARC },
      { icon: TextIcon, name: 'Text', type: 'text', shortcut: 'T', description: 'Sketch curves from text in a TrueType font', command: Command.TTF_TEXT },
      { icon: ImageIcon, name: 'Image', type: 'image', description: 'Sketch image from a file', command: Command.IMAGE },
      { icon: TangentIcon, name: 'Tangent Arc', type: 'tangent', shortcut: 'Shift+A', description: 'Create tangent arc at selected point', command: Command.TANGENT_ARC },
      { icon: ConnectIcon, name: 'Bezier', type: 'connect', shortcut: 'B', description: 'Sketch cubic Bezier spline', command: Command.CUBIC },
      { icon: PointIcon, name: 'Point', type: 'point', shortcut: 'P', description: 'Sketch datum point', command: Command.DATUM_POINT },
      { icon: ToggleConstructionIcon, name: 'Construction', type: 'construction', shortcut: 'G', description: 'Toggle construction', command: Command.CONSTRUCTION },
      { icon: IntersectIcon, name: 'Split', type: 'intersect', shortcut: 'I', description: 'Split lines / curves where they intersect', command: Command.SPLIT_CURVES },
    ],
  },
  {
    title: 'CONSTR',
    tools: [
      { icon: DistanceIcon, name: 'Distance', type: 'distance', shortcut: 'D', description: 'Constrain distance / diameter / length', command: Command.DISTANCE_DIA },
      { icon: AngleIcon, name: 'Angle', type: 'angle', shortcut: 'N', description: 'Constrain angle', command: Command.ANGLE },
      { icon: HorizontalIcon, name: 'Horizontal', type: 'horizontal', shortcut: 'H', description: 'Constrain to be horizontal', command: Command.HORIZONTAL },
      { icon: VerticalIcon, name: 'Vertical', type: 'vertical', shortcut: 'V', description: 'Constrain to be vertical', command: Command.VERTICAL },
      { icon: ParallelIcon, name: 'Parallel', type: 'parallel', shortcut: 'L', description: 'Constrain to be parallel or tangent', command: Command.PARALLEL },
      { icon: PerpendicularIcon, name: 'Perpendicular', type: 'perpendicular', shortcut: '[', description: 'Constrain to be perpendicular', command: Command.PERPENDICULAR },
      { icon: PointOnLineIcon, name: 'On Entity', type: 'point-on-line', shortcut: 'O', description: 'Constrain point on line / curve / plane / point', command: Command.ON_ENTITY },
      { icon: MirrorIcon, name: 'Symmetric', type: 'mirror', shortcut: 'Y', description: 'Constrain symmetric', command: Command.SYMMETRIC },
      { icon: EqualIcon, name: 'Equal', type: 'equal', shortcut: 'Q', description: 'Constrain equal length / radius / angle', command: Command.EQUAL },
      { icon: NormalsIcon, name: 'Orientation', type: 'normals', shortcut: 'X', description: 'Constrain normals in same orientation', command: Command.ORIENTED_SAME },
      { icon: SupplementaryAngleIcon, name: 'Supplementary', type: 'supplementary', shortcut: 'U', description: 'Other supplementary angle', command: Command.OTHER_ANGLE },
      { icon: RefIcon, name: 'Reference', type: 'reference', shortcut: 'E', description: 'Toggle reference dimension', command: Command.REFERENCE },
    ],
  },
  {
    title: 'FORM',
    tools: [
      { icon: ExtrudeIcon, name: 'Extrude', type: 'extrude', shortcut: 'Shift+X', description: 'New group extruding active sketch', command: Command.GROUP_EXTRUDE },
      { icon: RotateIcon, name: 'Lathe', type: 'rotate', shortcut: 'Shift+L', description: 'New group rotating active sketch', command: Command.GROUP_LATHE },
      { icon: HelixIcon, name: 'Helix', type: 'helix', shortcut: 'Shift+H', description: 'New group helix from active sketch', command: Command.GROUP_HELIX },
      { icon: RevolveIcon, name: 'Revolve', type: 'revolve', shortcut: 'Shift+V', description: 'New group revolve active sketch', command: Command.GROUP_REVOLVE },
      { icon: RotatePatternIcon, name: 'Step Rotate', type: 'rotate-pattern', shortcut: 'Shift+R', description: 'New group step and repeat rotating', command: Command.GROUP_ROT },
      { icon: TranslateIcon, name: 'Step Translate', type: 'translate', shortcut: 'Shift+T', description: 'New group step and repeat translating', command: Command.GROUP_TRANS },
      { icon: NewWorkplaneIcon, name: 'Workplane', type: 'new-workplane', shortcut: 'Shift+W', description: 'New group in new workplane (thru given entities)', command: Command.GROUP_WRKPL },
      { icon: NewGroup3DIcon, name: '3D Sketch', type: 'new-3d-group', shortcut: 'Shift+3', description: 'New group in 3d', command: Command.GROUP_3D },
      { icon: AssemblyIcon, name: 'Link', type: 'assembly', shortcut: 'Shift+I', description: 'New group linking / assembling file', command: Command.GROUP_LINK },
    ],
  },
  {
    title: 'VIEW',
    tools: [
      { icon: IsometricIcon, name: 'Isometric', type: 'isometric', description: 'Nearest isometric view', command: Command.NEAREST_ISO },
      { icon: AlignViewIcon, name: 'Align View', type: 'align-view', shortcut: 'W', description: 'Align view to active workplane', command: Command.ONTO_WORKPLANE },
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
