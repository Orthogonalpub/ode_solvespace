// Mock WASM module for testing the GUI without building C++
function createMockWASM() {
  // Sample geometry data - a simple cube
  const cubeVertices = new Float32Array([
    // Front face
    -1, -1,  1,  1, -1,  1,  1,  1,  1,
    -1, -1,  1,  1,  1,  1, -1,  1,  1,
    // Back face
    -1, -1, -1, -1,  1, -1,  1,  1, -1,
    -1, -1, -1,  1,  1, -1,  1, -1, -1,
    // Top face
    -1,  1, -1, -1,  1,  1,  1,  1,  1,
    -1,  1, -1,  1,  1,  1,  1,  1, -1,
    // Bottom face
    -1, -1, -1,  1, -1, -1,  1, -1,  1,
    -1, -1, -1,  1, -1,  1, -1, -1,  1,
    // Right face
     1, -1, -1,  1,  1, -1,  1,  1,  1,
     1, -1, -1,  1,  1,  1,  1, -1,  1,
    // Left face
    -1, -1, -1, -1, -1,  1, -1,  1,  1,
    -1, -1, -1, -1,  1,  1, -1,  1, -1,
  ]);

  const cubeNormals = new Float32Array([
    // Front
     0,  0,  1,   0,  0,  1,   0,  0,  1,
     0,  0,  1,   0,  0,  1,   0,  0,  1,
    // Back
     0,  0, -1,   0,  0, -1,   0,  0, -1,
     0,  0, -1,   0,  0, -1,   0,  0, -1,
    // Top
     0,  1,  0,   0,  1,  0,   0,  1,  0,
     0,  1,  0,   0,  1,  0,   0,  1,  0,
    // Bottom
     0, -1,  0,   0, -1,  0,   0, -1,  0,
     0, -1,  0,   0, -1,  0,   0, -1,  0,
    // Right
     1,  0,  0,   1,  0,  0,   1,  0,  0,
     1,  0,  0,   1,  0,  0,   1,  0,  0,
    // Left
    -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
    -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
  ]);

  const cubeIndices = new Uint32Array([
    0, 1, 2, 3, 4, 5,       // Front
    6, 7, 8, 9, 10, 11,     // Back
    12, 13, 14, 15, 16, 17, // Top
    18, 19, 20, 21, 22, 23, // Bottom
    24, 25, 26, 27, 28, 29, // Right
    30, 31, 32, 33, 34, 35  // Left
  ]);

  const groups = [
    { id: 1, name: 'Sketch-1', visible: true, order: 1 },
    { id: 2, name: 'Extrude-1', visible: true, order: 2 },
  ];

  return {
    Initialize: function() {
      console.log('[Mock WASM] Initialized');
    },

    Reset: function() {
      console.log('[Mock WASM] Reset');
    },

    GetVersion: function() {
      return '0.1.0-alpha (Mock WASM for Testing)';
    },

    LoadModelFromBuffer: function(data) {
      console.log('[Mock WASM] Loading model from buffer:', data.length, 'bytes');
    },

    SaveModel: function() {
      console.log('[Mock WASM] Saving model');
      return 'MOCK_MODEL_DATA';
    },

    GetGroupCount: function() {
      return groups.length;
    },

    GetGroupInfo: function(index) {
      if (index >= 0 && index < groups.length) {
        return groups[index];
      }
      return null;
    },

    GetTriangleCount: function(groupId) {
      // Return cube triangles for group 2 (Extrude-1)
      return groupId === 2 ? 12 : 0;
    },

    GetTriangleVertices: function(groupId) {
      if (groupId === 2) {
        return cubeVertices;
      }
      return new Float32Array(0);
    },

    GetTriangleNormals: function(groupId) {
      if (groupId === 2) {
        return cubeNormals;
      }
      return new Float32Array(0);
    },

    GetTriangleIndices: function(groupId) {
      if (groupId === 2) {
        return cubeIndices;
      }
      return new Uint32Array(0);
    },

    GetEdgeCount: function(groupId) {
      return 0;
    },

    GetEdgeVertices: function(groupId) {
      return new Float32Array(0);
    },

    GetBoundingBox: function(groupId) {
      if (groupId === 2) {
        return {
          min: [-1, -1, -1],
          max: [1, 1, 1]
        };
      }
      return { min: [0, 0, 0], max: [0, 0, 0] };
    }
  };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createMockWASM;
}

// Global for browser
if (typeof window !== 'undefined') {
  window.solvespace = function() {
    return Promise.resolve(createMockWASM());
  };
}
