import { useEffect, useState } from 'react';
import { useGeometryStore } from '@/store/useGeometryStore';
import * as THREE from 'three';
import { SolveSpaceColors } from '@/rendering/colors';
import type { PointWithId } from '@/types/geometry';

interface PointData {
  id: number;
  position: THREE.Vector3;
  construction: boolean;
}

// Individual point component for hit detection
function SelectablePoint({ point, isSelected, isHovered }: {
  point: PointData;
  isSelected: boolean;
  isHovered: boolean;
}) {
  const color = isHovered
    ? SolveSpaceColors.HOVERED
    : isSelected
      ? SolveSpaceColors.SELECTED
      : point.construction
        ? SolveSpaceColors.CONSTRUCTION
        : SolveSpaceColors.ACTIVE_GRP;

  const size = (isSelected || isHovered) ? 0.12 : 0.08;

  return (
    <mesh
      position={[point.position.x, point.position.y, point.position.z]}
      userData={{ entityId: point.id }}
      renderOrder={isHovered ? 11 : isSelected ? 10 : 0}
    >
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function PointRenderer() {
  const wasmModule = useGeometryStore((state) => state.wasmModule);
  const groups = useGeometryStore((state) => state.groups);
  const selectedEntities = useGeometryStore((state) => state.selectedEntities);
  const hoveredEntity = useGeometryStore((state) => state.hoveredEntity);
  const [points, setPoints] = useState<PointData[]>([]);

  // Fetch points with IDs from WASM
  useEffect(() => {
    if (!wasmModule || groups.length === 0) {
      console.log('[PointRenderer] No wasmModule or groups');
      return;
    }

    console.log('[PointRenderer] Processing groups:', groups.length);
    const allPoints: PointData[] = [];

    groups.forEach((group) => {
      if (!group.visible) return;

      try {
        // Try to use GetPointsWithIds if available
        if (wasmModule.GetPointsWithIds) {
          const pointsWithIds = wasmModule.GetPointsWithIds(group.id);
          console.log(`[PointRenderer] Group ${group.id}: ${pointsWithIds?.length || 0} points with IDs`);
          if (pointsWithIds && pointsWithIds.length > 0) {
            pointsWithIds.forEach((p: PointWithId) => {
              allPoints.push({
                id: p.id,
                position: new THREE.Vector3(p.x, p.y, p.z),
                construction: p.construction,
              });
            });
          }
        } else {
          // Fallback to old API without IDs
          const positions = wasmModule.GetPointPositions(group.id);
          console.log(`[PointRenderer] Group ${group.id}: ${positions?.length / 3 || 0} points (fallback)`);
          if (positions && positions.length > 0) {
            for (let i = 0; i < positions.length; i += 3) {
              allPoints.push({
                id: i / 3, // Use index as fallback ID
                position: new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]),
                construction: false,
              });
            }
          }
        }
      } catch (e) {
        console.debug(`No point data for group ${group.id}`, e);
      }
    });

    console.log('[PointRenderer] Total points:', allPoints.length);
    setPoints(allPoints);
  }, [wasmModule, groups]);

  return (
    <group>
      {points.map((point) => (
        <SelectablePoint
          key={point.id}
          point={point}
          isSelected={selectedEntities.includes(point.id)}
          isHovered={hoveredEntity === point.id}
        />
      ))}
    </group>
  );
}
