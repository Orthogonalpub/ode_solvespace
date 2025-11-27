import { useEffect, useState, useMemo } from 'react';
import { useGeometryStore } from '@/store/useGeometryStore';
import * as THREE from 'three';
import { SolveSpaceColors, hexToThreeColor } from '@/rendering/colors';

export function PointRenderer() {
  const wasmModule = useGeometryStore((state) => state.wasmModule);
  const groups = useGeometryStore((state) => state.groups);
  // TODO: Use for selection highlighting
  // const selectedEntities = useGeometryStore((state) => state.selectedEntities);
  // const hoveredEntity = useGeometryStore((state) => state.hoveredEntity);
  const [pointGeometries, setPointGeometries] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    if (!wasmModule || groups.length === 0) return;

    const newGeometries: THREE.BufferGeometry[] = [];

    groups.forEach((group) => {
      if (!group.visible) return;

      try {
        const pointCount = wasmModule.GetPointCount(group.id);
        if (pointCount === 0) return;

        const positions = wasmModule.GetPointPositions(group.id);
        if (!positions || positions.length === 0) return;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );

        newGeometries.push(geometry);
      } catch (e) {
        // Point data not available for this group
        console.debug(`No point data for group ${group.id}`);
      }
    });

    setPointGeometries(newGeometries);

    return () => {
      newGeometries.forEach((geo) => geo.dispose());
    };
  }, [wasmModule, groups]);

  // Point material matching SolveSpace style
  const pointMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: hexToThreeColor(SolveSpaceColors.ACTIVE_GRP),
      size: 6,
      sizeAttenuation: false,
    });
  }, []);

  return (
    <>
      {pointGeometries.map((geometry, index) => (
        <points key={index} geometry={geometry} material={pointMaterial} />
      ))}
    </>
  );
}
