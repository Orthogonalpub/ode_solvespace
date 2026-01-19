export type EntityID = number;
export type GroupID = number;
export type ConstraintID = number;

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface MeshData {
  vertices: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
  colors?: Float32Array;
}

export interface EdgeData {
  vertices: Float32Array;
  colors?: Float32Array;
}

export interface GroupInfo {
  id: GroupID;
  name: string;
  visible: boolean;
  order: number;
}

export interface EntityInfo {
  id: EntityID;
  type: number;
  groupID: GroupID;
  construction: boolean;
  visible: boolean;
  position?: number[]; // For points
}

export interface PointWithId {
  id: EntityID;
  x: number;
  y: number;
  z: number;
  construction: boolean;
}

export interface WorkplaneInfo {
  id: number;
  name: string;
  freeIn3D?: boolean;
  origin?: number[];
  normal?: number[];
  u?: number[];
  v?: number[];
}

export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

// SolveSpace Command IDs (matching ui.h enum Command)
export enum Command {
  NONE = 0,
  // File
  NEW = 100,
  OPEN = 101,
  SAVE = 103,
  SAVE_AS = 104,
  // View
  ZOOM_IN = 113,
  ZOOM_OUT = 114,
  ZOOM_TO_FIT = 115,
  ONTO_WORKPLANE = 120,
  NEAREST_ORTHO = 121,
  NEAREST_ISO = 122,
  // Edit
  UNDO = 132,
  REDO = 133,
  DELETE = 138,
  SELECT_ALL = 140,
  UNSELECT_ALL = 143,
  // Request (Sketch tools)
  SEL_WORKPLANE = 149,
  FREE_IN_3D = 150,
  DATUM_POINT = 151,
  WORKPLANE = 152,
  LINE_SEGMENT = 153,
  CONSTR_SEGMENT = 154,
  CIRCLE = 155,
  ARC = 156,
  RECTANGLE = 157,
  CUBIC = 158,
  TTF_TEXT = 159,
  IMAGE = 160,
  SPLIT_CURVES = 161,
  TANGENT_ARC = 162,
  CONSTRUCTION = 163,
  // Group
  GROUP_3D = 165,
  GROUP_WRKPL = 166,
  GROUP_EXTRUDE = 167,
  GROUP_HELIX = 168,
  GROUP_LATHE = 169,
  GROUP_REVOLVE = 170,
  GROUP_ROT = 171,
  GROUP_TRANS = 172,
  GROUP_LINK = 173,
  // Constrain
  DISTANCE_DIA = 176,
  ANGLE = 178,
  HORIZONTAL = 188,
  VERTICAL = 189,
  PARALLEL = 190,
  PERPENDICULAR = 191,
  ON_ENTITY = 185,
  SYMMETRIC = 186,
  EQUAL = 182,
  ORIENTED_SAME = 192,
  OTHER_ANGLE = 180,
  REFERENCE = 181,
}

// Pending operation types
export enum PendingOperation {
  NONE = 0,
  COMMAND = 1,
  DRAGGING_POINTS = 2,
  DRAGGING_NEW_POINT = 3,
  DRAGGING_NEW_LINE_POINT = 4,
  DRAGGING_NEW_CUBIC_POINT = 5,
  DRAGGING_NEW_ARC_POINT = 6,
  DRAGGING_CONSTRAINT = 7,
  DRAGGING_RADIUS = 8,
  DRAGGING_NORMAL = 9,
  DRAGGING_MARQUEE = 10,
}

export interface WASMModule {
  // Initialization
  Initialize: () => void;
  Reset: () => void;
  GetVersion: () => string;

  // File I/O
  LoadModelFromBuffer: (data: string) => void;
  SaveModel: () => string;

  // Group management
  GetGroupCount: () => number;
  GetGroupInfo: (groupIndex: number) => GroupInfo;
  GetActiveGroup: () => number;
  SetActiveGroup: (groupID: GroupID) => void;

  // Mesh data
  GetTriangleCount: (groupID: GroupID) => number;
  GetTriangleVertices: (groupID: GroupID) => Float32Array;
  GetTriangleNormals: (groupID: GroupID) => Float32Array;
  GetTriangleIndices: (groupID: GroupID) => Uint32Array;

  // Edge data
  GetEdgeCount: (groupID: GroupID) => number;
  GetEdgeVertices: (groupID: GroupID) => Float32Array;

  // Entity data
  GetEntityCount: () => number;
  GetEntityInfoByIndex: (entityIndex: number) => EntityInfo;
  GetEntityInfo: (entityID: number) => EntityInfo; // From exposed_textwin.cpp
  GetPointCount: (groupID: GroupID) => number;
  GetPointPositions: (groupID: GroupID) => Float32Array;
  GetPointsWithIds: (groupID: GroupID) => PointWithId[];

  // Bounding box
  GetBoundingBox: (groupID: GroupID) => BoundingBox;

  // Command execution
  ActivateCommand: (commandID: number) => void;
  GetPendingOperation: () => number;
  CancelPendingOperation: () => void;

  // Selection
  SelectEntity: (entityID: EntityID) => void;
  DeselectEntity: (entityID: EntityID) => void;
  ClearSelection: () => void;
  GetSelectedEntities: () => number[];

  // Workplane
  GetActiveWorkplane: () => WorkplaneInfo;
  GetWorkplaneInfo: (workplaneID: number) => WorkplaneInfo;
}
