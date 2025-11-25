import { useEffect, useState } from 'react';
import { useGeometryStore } from '@/store/useGeometryStore';
import * as THREE from 'three';

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

  return (
    <>
      {meshes.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshStandardMaterial
            color="#4a90e2"
            metalness={0.3}
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}
