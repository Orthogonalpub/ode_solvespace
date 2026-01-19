/**
 * Mock Geometry Data Generator
 *
 * Simulates geometry engine output for testing rendering without WASM.
 * This generates the same data formats that the WASM API would return.
 */

import type { GroupInfo, PointWithId } from '@/types/geometry';

// ============================================================================
// Mock Group Data
// ============================================================================

export const mockGroups: GroupInfo[] = [
  { id: 1, name: '#1 (Reference)', visible: true, order: 0 },
  { id: 2, name: '#2 (Sketch in XY)', visible: true, order: 1 },
  { id: 3, name: '#3 (Extrude)', visible: true, order: 2 },
];

// ============================================================================
// Mock Triangle Data (Solid Mesh)
// ============================================================================

/**
 * Creates a simple cube mesh
 * Returns vertices in format: [x1,y1,z1, x2,y2,z2, x3,y3,z3, ...] (9 floats per triangle)
 */
export function createMockCubeVertices(size: number = 2, offset: [number, number, number] = [0, 0, 0]): Float32Array {
  const s = size / 2;
  const [ox, oy, oz] = offset;

  // 6 faces * 2 triangles * 3 vertices * 3 coords = 108 floats
  const vertices = new Float32Array([
    // Front face (z = s)
    -s + ox, -s + oy, s + oz,   s + ox, -s + oy, s + oz,   s + ox, s + oy, s + oz,
    -s + ox, -s + oy, s + oz,   s + ox, s + oy, s + oz,   -s + ox, s + oy, s + oz,
    // Back face (z = -s)
    s + ox, -s + oy, -s + oz,   -s + ox, -s + oy, -s + oz,   -s + ox, s + oy, -s + oz,
    s + ox, -s + oy, -s + oz,   -s + ox, s + oy, -s + oz,   s + ox, s + oy, -s + oz,
    // Top face (y = s)
    -s + ox, s + oy, -s + oz,   -s + ox, s + oy, s + oz,   s + ox, s + oy, s + oz,
    -s + ox, s + oy, -s + oz,   s + ox, s + oy, s + oz,   s + ox, s + oy, -s + oz,
    // Bottom face (y = -s)
    -s + ox, -s + oy, s + oz,   -s + ox, -s + oy, -s + oz,   s + ox, -s + oy, -s + oz,
    -s + ox, -s + oy, s + oz,   s + ox, -s + oy, -s + oz,   s + ox, -s + oy, s + oz,
    // Right face (x = s)
    s + ox, -s + oy, s + oz,   s + ox, -s + oy, -s + oz,   s + ox, s + oy, -s + oz,
    s + ox, -s + oy, s + oz,   s + ox, s + oy, -s + oz,   s + ox, s + oy, s + oz,
    // Left face (x = -s)
    -s + ox, -s + oy, -s + oz,   -s + ox, -s + oy, s + oz,   -s + ox, s + oy, s + oz,
    -s + ox, -s + oy, -s + oz,   -s + ox, s + oy, s + oz,   -s + ox, s + oy, -s + oz,
  ]);

  return vertices;
}

/**
 * Creates normals for a cube mesh
 */
export function createMockCubeNormals(): Float32Array {
  // 6 faces * 2 triangles * 3 vertices * 3 coords = 108 floats
  const normals = new Float32Array([
    // Front face normal (0, 0, 1)
    0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back face normal (0, 0, -1)
    0, 0, -1,  0, 0, -1,  0, 0, -1,
    0, 0, -1,  0, 0, -1,  0, 0, -1,
    // Top face normal (0, 1, 0)
    0, 1, 0,  0, 1, 0,  0, 1, 0,
    0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom face normal (0, -1, 0)
    0, -1, 0,  0, -1, 0,  0, -1, 0,
    0, -1, 0,  0, -1, 0,  0, -1, 0,
    // Right face normal (1, 0, 0)
    1, 0, 0,  1, 0, 0,  1, 0, 0,
    1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left face normal (-1, 0, 0)
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ]);

  return normals;
}

// ============================================================================
// Mock Edge Data (Wireframe)
// ============================================================================

/**
 * Creates edge vertices for a cube wireframe
 * Returns vertices in format: [x1,y1,z1, x2,y2,z2, ...] (6 floats per edge)
 */
export function createMockCubeEdges(size: number = 2, offset: [number, number, number] = [0, 0, 0]): Float32Array {
  const s = size / 2;
  const [ox, oy, oz] = offset;

  // 12 edges * 2 points * 3 coords = 72 floats
  const edges = new Float32Array([
    // Bottom face edges
    -s + ox, -s + oy, -s + oz,   s + ox, -s + oy, -s + oz,
    s + ox, -s + oy, -s + oz,   s + ox, -s + oy, s + oz,
    s + ox, -s + oy, s + oz,   -s + ox, -s + oy, s + oz,
    -s + ox, -s + oy, s + oz,   -s + ox, -s + oy, -s + oz,
    // Top face edges
    -s + ox, s + oy, -s + oz,   s + ox, s + oy, -s + oz,
    s + ox, s + oy, -s + oz,   s + ox, s + oy, s + oz,
    s + ox, s + oy, s + oz,   -s + ox, s + oy, s + oz,
    -s + ox, s + oy, s + oz,   -s + ox, s + oy, -s + oz,
    // Vertical edges
    -s + ox, -s + oy, -s + oz,   -s + ox, s + oy, -s + oz,
    s + ox, -s + oy, -s + oz,   s + ox, s + oy, -s + oz,
    s + ox, -s + oy, s + oz,   s + ox, s + oy, s + oz,
    -s + ox, -s + oy, s + oz,   -s + ox, s + oy, s + oz,
  ]);

  return edges;
}

/**
 * Creates edges for a 2D rectangle sketch
 */
export function createMockRectangleEdges(
  width: number = 4,
  height: number = 3,
  z: number = 0
): Float32Array {
  const w = width / 2;
  const h = height / 2;

  // 4 edges * 2 points * 3 coords = 24 floats
  const edges = new Float32Array([
    -w, -h, z,   w, -h, z,  // Bottom
    w, -h, z,   w, h, z,    // Right
    w, h, z,   -w, h, z,    // Top
    -w, h, z,   -w, -h, z,  // Left
  ]);

  return edges;
}

/**
 * Creates edges for a circle sketch (approximated with segments)
 */
export function createMockCircleEdges(
  radius: number = 2,
  segments: number = 32,
  z: number = 0
): Float32Array {
  const edges: number[] = [];

  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;

    edges.push(
      Math.cos(angle1) * radius, Math.sin(angle1) * radius, z,
      Math.cos(angle2) * radius, Math.sin(angle2) * radius, z
    );
  }

  return new Float32Array(edges);
}

/**
 * Creates edges for a line
 */
export function createMockLineEdge(
  start: [number, number, number],
  end: [number, number, number]
): Float32Array {
  return new Float32Array([...start, ...end]);
}

// ============================================================================
// Mock Point Data
// ============================================================================

/**
 * Creates points with IDs for a cube's corners
 */
export function createMockCubePoints(size: number = 2, startId: number = 1000): PointWithId[] {
  const s = size / 2;

  return [
    { id: startId, x: -s, y: -s, z: -s, construction: false },
    { id: startId + 1, x: s, y: -s, z: -s, construction: false },
    { id: startId + 2, x: s, y: s, z: -s, construction: false },
    { id: startId + 3, x: -s, y: s, z: -s, construction: false },
    { id: startId + 4, x: -s, y: -s, z: s, construction: false },
    { id: startId + 5, x: s, y: -s, z: s, construction: false },
    { id: startId + 6, x: s, y: s, z: s, construction: false },
    { id: startId + 7, x: -s, y: s, z: s, construction: false },
  ];
}

/**
 * Creates points for a 2D sketch with some construction points
 */
export function createMockSketchPoints(startId: number = 2000): PointWithId[] {
  return [
    // Rectangle corners
    { id: startId, x: -2, y: -1.5, z: 0, construction: false },
    { id: startId + 1, x: 2, y: -1.5, z: 0, construction: false },
    { id: startId + 2, x: 2, y: 1.5, z: 0, construction: false },
    { id: startId + 3, x: -2, y: 1.5, z: 0, construction: false },
    // Center point (construction)
    { id: startId + 4, x: 0, y: 0, z: 0, construction: true },
    // Midpoints (construction)
    { id: startId + 5, x: 0, y: -1.5, z: 0, construction: true },
    { id: startId + 6, x: 2, y: 0, z: 0, construction: true },
    { id: startId + 7, x: 0, y: 1.5, z: 0, construction: true },
    { id: startId + 8, x: -2, y: 0, z: 0, construction: true },
  ];
}

/**
 * Creates points for a circle with center and quadrant points
 */
export function createMockCirclePoints(
  radius: number = 2,
  centerZ: number = 0,
  startId: number = 3000
): PointWithId[] {
  return [
    // Center point
    { id: startId, x: 0, y: 0, z: centerZ, construction: true },
    // Quadrant points
    { id: startId + 1, x: radius, y: 0, z: centerZ, construction: false },
    { id: startId + 2, x: 0, y: radius, z: centerZ, construction: false },
    { id: startId + 3, x: -radius, y: 0, z: centerZ, construction: false },
    { id: startId + 4, x: 0, y: -radius, z: centerZ, construction: false },
  ];
}

// ============================================================================
// Complete Mock Scene
// ============================================================================

export interface MockSceneData {
  groups: GroupInfo[];
  meshes: Map<number, { vertices: Float32Array; normals: Float32Array }>;
  edges: Map<number, Float32Array>;
  points: Map<number, PointWithId[]>;
}

/**
 * Creates a complete mock scene with:
 * - A cube solid body
 * - A 2D sketch with rectangle and circle
 * - Various points (construction and regular)
 */
export function createMockScene(): MockSceneData {
  const groups: GroupInfo[] = [
    { id: 1, name: '#1 (Reference)', visible: true, order: 0 },
    { id: 2, name: '#2 (Sketch in XY)', visible: true, order: 1 },
    { id: 3, name: '#3 (Extrude)', visible: true, order: 2 },
  ];

  const meshes = new Map<number, { vertices: Float32Array; normals: Float32Array }>();
  const edges = new Map<number, Float32Array>();
  const points = new Map<number, PointWithId[]>();

  // Group 1: Reference (just origin point)
  points.set(1, [{ id: 100, x: 0, y: 0, z: 0, construction: true }]);

  // Group 2: 2D Sketch (rectangle + circle edges and points)
  const rectEdges = createMockRectangleEdges(4, 3, 0);
  const circleEdges = createMockCircleEdges(1, 24, 0);

  // Combine edges
  const sketchEdges = new Float32Array(rectEdges.length + circleEdges.length);
  sketchEdges.set(rectEdges, 0);
  sketchEdges.set(circleEdges, rectEdges.length);
  edges.set(2, sketchEdges);

  // Sketch points
  const sketchPoints = createMockSketchPoints(2000);
  const circlePoints = createMockCirclePoints(1, 0, 2100);
  points.set(2, [...sketchPoints, ...circlePoints]);

  // Group 3: Extruded solid (cube)
  meshes.set(3, {
    vertices: createMockCubeVertices(2, [0, 0, 1]),
    normals: createMockCubeNormals(),
  });
  edges.set(3, createMockCubeEdges(2, [0, 0, 1]));
  points.set(3, createMockCubePoints(2, 3000).map(p => ({ ...p, z: p.z + 1 })));

  return { groups, meshes, edges, points };
}

// ============================================================================
// Mock WASM Module Interface
// ============================================================================

/**
 * Creates a mock WASM module that returns simulated data
 * Use this for testing when actual WASM is not available
 */
export function createMockWASMModule() {
  const scene = createMockScene();

  return {
    Initialize: () => console.log('[MockWASM] Initialized'),
    Reset: () => console.log('[MockWASM] Reset'),
    GetVersion: () => 'Mock WASM v1.0.0',

    GetGroupCount: () => scene.groups.length,
    GetGroupInfo: (index: number) => scene.groups[index] || {},
    GetActiveGroup: () => 3,
    SetActiveGroup: (id: number) => console.log(`[MockWASM] SetActiveGroup(${id})`),

    GetTriangleCount: (groupID: number) => {
      const mesh = scene.meshes.get(groupID);
      return mesh ? mesh.vertices.length / 9 : 0;
    },
    GetTriangleVertices: (groupID: number) => {
      const mesh = scene.meshes.get(groupID);
      return mesh?.vertices || new Float32Array();
    },
    GetTriangleNormals: (groupID: number) => {
      const mesh = scene.meshes.get(groupID);
      return mesh?.normals || new Float32Array();
    },
    GetTriangleIndices: (groupID: number) => {
      const mesh = scene.meshes.get(groupID);
      if (!mesh) return new Uint32Array();
      // Create sequential indices for non-indexed geometry
      const vertexCount = mesh.vertices.length / 3;
      const indices = new Uint32Array(vertexCount);
      for (let i = 0; i < vertexCount; i++) {
        indices[i] = i;
      }
      return indices;
    },

    GetEdgeCount: (groupID: number) => {
      const edgeData = scene.edges.get(groupID);
      return edgeData ? edgeData.length / 6 : 0;
    },
    GetEdgeVertices: (groupID: number) => {
      return scene.edges.get(groupID) || new Float32Array();
    },

    GetPointCount: (groupID: number) => {
      const pts = scene.points.get(groupID);
      return pts?.length || 0;
    },
    GetPointPositions: (groupID: number) => {
      const pts = scene.points.get(groupID);
      if (!pts) return new Float32Array();
      const positions: number[] = [];
      pts.forEach(p => positions.push(p.x, p.y, p.z));
      return new Float32Array(positions);
    },
    GetPointsWithIds: (groupID: number) => {
      return scene.points.get(groupID) || [];
    },

    GetEntityCount: () => {
      let count = 0;
      scene.points.forEach(pts => count += pts.length);
      return count;
    },

    // Selection stubs
    SelectEntity: (id: number) => console.log(`[MockWASM] SelectEntity(${id})`),
    DeselectEntity: (id: number) => console.log(`[MockWASM] DeselectEntity(${id})`),
    ClearSelection: () => console.log('[MockWASM] ClearSelection'),
    GetSelectedEntities: () => [],

    // Command stubs
    ActivateCommand: (cmd: number) => console.log(`[MockWASM] ActivateCommand(${cmd})`),
    GetPendingOperation: () => 0,
    CancelPendingOperation: () => console.log('[MockWASM] CancelPendingOperation'),

    // Workplane stubs
    GetActiveWorkplane: () => ({ id: 0, name: 'Free in 3D', freeIn3D: true }),
    GetWorkplaneInfo: (id: number) => ({ id, name: 'Workplane' }),

    // Bounding box
    GetBoundingBox: (_groupID: number) => ({
      min: { x: -2, y: -2, z: -1 },
      max: { x: 2, y: 2, z: 3 },
    }),
  };
}
