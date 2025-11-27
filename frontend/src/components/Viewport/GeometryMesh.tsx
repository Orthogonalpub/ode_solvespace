import { useEffect, useState, useMemo } from 'react';
import { useGeometryStore } from '@/store/useGeometryStore';
import * as THREE from 'three';
import { SolveSpaceColors, hexToThreeColor } from '@/rendering/colors';

export function GeometryMesh() {
  const wasmModule = useGeometryStore((state) => state.wasmModule);
  const groups = useGeometryStore((state) => state.groups);
  const [meshes, setMeshes] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    if (!wasmModule || groups.length === 0) return;

    const newMeshes: THREE.BufferGeometry[] = [];

    groups.forEach((group) => {
      if (!group.visible) return;

      const triangleCount = wasmModule.GetTriangleCount(group.id);
      if (triangleCount === 0) return;

      const vertices = wasmModule.GetTriangleVertices(group.id);
      const normals = wasmModule.GetTriangleNormals(group.id);
      const indices = wasmModule.GetTriangleIndices(group.id);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));

      newMeshes.push(geometry);
    });

    setMeshes(newMeshes);

    return () => {
      newMeshes.forEach((mesh) => mesh.dispose());
    };
  }, [wasmModule, groups]);

  // Create mesh material matching SolveSpace style
  const meshMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: hexToThreeColor(SolveSpaceColors.MESH_FRONT),
      metalness: 0.1,
      roughness: 0.8,
      side: THREE.DoubleSide,
      flatShading: false,
    });
  }, []);

  return (
    <>
      {meshes.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={meshMaterial} />
      ))}
    </>
  );
}
