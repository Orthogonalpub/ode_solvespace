import { useMemo } from 'react';
import * as THREE from 'three';
import { SolveSpaceColors, hexToThreeColor } from '@/rendering/colors';

interface SolveSpaceGridProps {
  size?: number;
  divisions?: number;
  majorDivisions?: number;
}

export function SolveSpaceGrid({
  size = 100,
  divisions = 100,
  majorDivisions = 10,
}: SolveSpaceGridProps) {
  const halfSizeValue = size / 2;

  const { minorLines, majorLines } = useMemo(() => {
    const minorVertices: number[] = [];
    const majorVertices: number[] = [];
    const step = size / divisions;
    const hs = size / 2;

    for (let i = 0; i <= divisions; i++) {
      const pos = -hs + i * step;
      const isMajor = i % majorDivisions === 0;

      if (isMajor) {
        // X direction
        majorVertices.push(-hs, 0, pos);
        majorVertices.push(hs, 0, pos);
        // Z direction
        majorVertices.push(pos, 0, -hs);
        majorVertices.push(pos, 0, hs);
      } else {
        // X direction
        minorVertices.push(-hs, 0, pos);
        minorVertices.push(hs, 0, pos);
        // Z direction
        minorVertices.push(pos, 0, -hs);
        minorVertices.push(pos, 0, hs);
      }
    }

    const minorGeo = new THREE.BufferGeometry();
    minorGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(minorVertices, 3)
    );

    const majorGeo = new THREE.BufferGeometry();
    majorGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(majorVertices, 3)
    );

    return { minorLines: minorGeo, majorLines: majorGeo };
  }, [size, divisions, majorDivisions]);

  return (
    <group>
      {/* Minor grid lines */}
      <lineSegments geometry={minorLines}>
        <lineBasicMaterial
          color={hexToThreeColor(SolveSpaceColors.GRID_MINOR)}
          transparent
          opacity={0.3}
        />
      </lineSegments>

      {/* Major grid lines */}
      <lineSegments geometry={majorLines}>
        <lineBasicMaterial
          color={hexToThreeColor(SolveSpaceColors.GRID_MAJOR)}
          transparent
          opacity={0.5}
        />
      </lineSegments>

      {/* Origin X axis (red - matching Figma red/500) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-halfSizeValue, 0, 0, halfSizeValue, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#cd5537" opacity={0.8} transparent />
      </line>

      {/* Origin Z axis (blue - matching Figma vibrantblue/500) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -halfSizeValue, 0, 0, halfSizeValue])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2172ab" opacity={0.8} transparent />
      </line>
    </group>
  );
}
