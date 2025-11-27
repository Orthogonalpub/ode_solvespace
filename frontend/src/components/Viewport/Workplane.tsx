import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { SolveSpaceColors, hexToThreeColor, StipplePattern, StipplePatterns } from '@/rendering/colors';

interface WorkplaneProps {
  name: string;
  normal: [number, number, number];
  origin: [number, number, number];
  visible?: boolean;
  active?: boolean;
}

export function Workplane({
  name,
  normal,
  origin,
  visible = true,
  active = false,
}: WorkplaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Calculate workplane size based on viewport (45% of min dimension as in original)
  const workplaneSize = useMemo(() => {
    const scale = Math.min(size.width, size.height) * 0.002;
    return Math.max(5, scale * 2);
  }, [size]);

  // Create workplane border geometry (dashed rectangle)
  const borderGeometry = useMemo(() => {
    const halfSize = workplaneSize;
    const vertices = new Float32Array([
      // Rectangle corners: pp, pm, mm, mp
      halfSize, halfSize, 0,   // pp (top-right)
      halfSize, -halfSize, 0,  // pm (bottom-right)
      halfSize, -halfSize, 0,  // pm
      -halfSize, -halfSize, 0, // mm (bottom-left)
      -halfSize, -halfSize, 0, // mm
      -halfSize, halfSize, 0,  // mp (top-left)
      -halfSize, halfSize, 0,  // mp
      halfSize, halfSize, 0,   // pp (close the rectangle)
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, [workplaneSize]);

  // Calculate rotation from normal vector
  const rotation = useMemo(() => {
    const up = new THREE.Vector3(0, 0, 1);
    const normalVec = new THREE.Vector3(...normal).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normalVec);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return euler;
  }, [normal]);

  // Update line distances for dashed material
  useFrame(() => {
    if (groupRef.current) {
      const line = groupRef.current.children[0] as THREE.LineSegments;
      if (line && line.geometry) {
        line.computeLineDistances();
      }
    }
  });

  if (!visible) return null;

  const color = active
    ? SolveSpaceColors.ACTIVE_GRP
    : SolveSpaceColors.NORMALS;

  const stipple = StipplePatterns[StipplePattern.SHORT_DASH];

  return (
    <group
      ref={groupRef}
      position={origin}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      {/* Dashed border */}
      <lineSegments geometry={borderGeometry}>
        <lineDashedMaterial
          color={hexToThreeColor(color)}
          dashSize={stipple.dashSize * 0.3}
          gapSize={stipple.gapSize * 0.3}
          transparent
          opacity={0.6}
        />
      </lineSegments>

      {/* Workplane label */}
      <Text
        position={[-workplaneSize + 0.3, -workplaneSize + 0.3, 0.01]}
        fontSize={0.4}
        color={color}
        anchorX="left"
        anchorY="bottom"
      >
        {name}
      </Text>

      {/* Normal indicator arrow */}
      <group position={[0, 0, 0]}>
        <arrowHelper
          args={[
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            1,
            hexToThreeColor(color),
            0.2,
            0.1,
          ]}
        />
      </group>
    </group>
  );
}
