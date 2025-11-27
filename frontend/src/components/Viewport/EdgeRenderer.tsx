import { useEffect, useState, useMemo } from 'react';
import { useGeometryStore } from '@/store/useGeometryStore';
import * as THREE from 'three';
import { SolveSpaceColors, hexToThreeColor } from '@/rendering/colors';

export function EdgeRenderer() {
  const wasmModule = useGeometryStore((state) => state.wasmModule);
  const groups = useGeometryStore((state) => state.groups);
  const [edgeGeometries, setEdgeGeometries] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    if (!wasmModule || groups.length === 0) return;

    const newGeometries: THREE.BufferGeometry[] = [];

    groups.forEach((group) => {
      if (!group.visible) return;

      try {
        const edgeCount = wasmModule.GetEdgeCount(group.id);
        if (edgeCount === 0) return;

        const edgeVertices = wasmModule.GetEdgeVertices(group.id);
        if (!edgeVertices || edgeVertices.length === 0) return;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(edgeVertices, 3)
        );

        newGeometries.push(geometry);
      } catch (e) {
        // Edge data not available for this group
        console.debug(`No edge data for group ${group.id}`);
      }
    });

    setEdgeGeometries(newGeometries);

    return () => {
      newGeometries.forEach((geo) => geo.dispose());
    };
  }, [wasmModule, groups]);

  // Create edge material matching SolveSpace style
  const edgeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: hexToThreeColor(SolveSpaceColors.SOLID_EDGE),
      linewidth: 1,
    });
  }, []);

  return (
    <>
      {edgeGeometries.map((geometry, index) => (
        <lineSegments key={index} geometry={geometry} material={edgeMaterial} />
      ))}
    </>
  );
}
