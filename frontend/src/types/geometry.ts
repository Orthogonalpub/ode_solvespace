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

export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

export interface GeometryEngine {
  Initialize(): void;
  Reset(): void;
  GetVersion(): string;

  LoadModelFromBuffer(data: string): void;
  SaveModel(): string;

  GetGroupCount(): number;
  GetGroupInfo(groupIndex: number): GroupInfo;

  GetTriangleCount(groupID: GroupID): number;
  GetTriangleVertices(groupID: GroupID): Float32Array;
  GetTriangleNormals(groupID: GroupID): Float32Array;
  GetTriangleIndices(groupID: GroupID): Uint32Array;

  GetEdgeCount(groupID: GroupID): number;
  GetEdgeVertices(groupID: GroupID): Float32Array;

  GetBoundingBox(groupID: GroupID): BoundingBox;
}

export interface WASMModule {
  Initialize: () => void;
  Reset: () => void;
  GetVersion: () => string;
  LoadModelFromBuffer: (data: string) => void;
  SaveModel: () => string;
  GetGroupCount: () => number;
  GetGroupInfo: (groupIndex: number) => GroupInfo;
  GetTriangleCount: (groupID: GroupID) => number;
  GetTriangleVertices: (groupID: GroupID) => Float32Array;
  GetTriangleNormals: (groupID: GroupID) => Float32Array;
  GetTriangleIndices: (groupID: GroupID) => Uint32Array;
  GetEdgeCount: (groupID: GroupID) => number;
  GetEdgeVertices: (groupID: GroupID) => Float32Array;
  GetBoundingBox: (groupID: GroupID) => BoundingBox;
}
