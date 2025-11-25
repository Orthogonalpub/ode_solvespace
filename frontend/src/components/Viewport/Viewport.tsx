import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { GeometryMesh } from './GeometryMesh';

export function Viewport() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: '#e8e9eb' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#c4c5c7"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ea0a3"
          fadeDistance={50}
          fadeStrength={1}
          infiniteGrid
        />

        <GeometryMesh />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={1.0}
        />

        <GizmoHelper alignment="bottom-center" margin={[80, 80]}>
          <GizmoViewport
            axisColors={['#e64949', '#4949e6', '#49e649']}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
