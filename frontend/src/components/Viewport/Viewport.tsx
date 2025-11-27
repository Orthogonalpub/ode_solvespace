import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { GeometryMesh } from './GeometryMesh';
import { EdgeRenderer } from './EdgeRenderer';
import { PointRenderer } from './PointRenderer';
import { SolveSpaceGrid } from './SolveSpaceGrid';
import { Workplane } from './Workplane';
import { InteractionManager } from './InteractionManager';
import { SolveSpaceColors } from '@/rendering/colors';

export function Viewport() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: SolveSpaceColors.BACKGROUND }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting setup matching SolveSpace */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight
          position={[1, 1, 0.5]}
          intensity={0.8}
          color="#ffffff"
        />
        <directionalLight
          position={[-1, -1, -0.5]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* Grid matching SolveSpace style */}
        <SolveSpaceGrid />

        {/* Reference workplanes (XY, YZ, XZ) - matching SolveSpace's default workplanes */}
        <Workplane name="XY" normal={[0, 0, 1]} origin={[0, 0, 0]} />
        <Workplane name="YZ" normal={[1, 0, 0]} origin={[0, 0, 0]} />
        <Workplane name="XZ" normal={[0, 1, 0]} origin={[0, 0, 0]} />

        {/* Geometry rendering */}
        <GeometryMesh />
        <EdgeRenderer />
        <PointRenderer />

        {/* Mouse interaction handler */}
        <InteractionManager />

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={1.0}
          panSpeed={0.8}
          // Middle mouse button for pan (matching SolveSpace)
          mouseButtons={{
            LEFT: 0, // Orbit
            MIDDLE: 2, // Pan
            RIGHT: 1, // Zoom (or context menu)
          }}
        />

        {/* Coordinate gizmo */}
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={['#ff4444', '#44ff44', '#4444ff']}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
