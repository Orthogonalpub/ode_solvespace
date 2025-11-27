import { useRef, useCallback, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGeometryStore } from '@/store/useGeometryStore';
import { PendingOperation } from '@/types/geometry';

interface MouseState {
  position: THREE.Vector2;
  worldPosition: THREE.Vector3;
  isDown: boolean;
  button: number;
}

export function InteractionManager() {
  const { camera, gl, scene, raycaster } = useThree();
  const mouseState = useRef<MouseState>({
    position: new THREE.Vector2(),
    worldPosition: new THREE.Vector3(),
    isDown: false,
    button: -1,
  });

  const activeTool = useGeometryStore((state) => state.activeTool);
  const pendingOperation = useGeometryStore((state) => state.pendingOperation);
  const setHoveredEntity = useGeometryStore((state) => state.setHoveredEntity);
  const selectEntity = useGeometryStore((state) => state.selectEntity);
  const deselectAll = useGeometryStore((state) => state.deselectAll);

  // Plane for projecting mouse to 3D (default XY plane at Z=0)
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // Convert screen coordinates to normalized device coordinates
  const screenToNDC = useCallback((clientX: number, clientY: number) => {
    const rect = gl.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
  }, [gl]);

  // Get 3D world position from mouse
  const getWorldPosition = useCallback((ndc: THREE.Vector2): THREE.Vector3 => {
    raycaster.setFromCamera(ndc, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane.current, target);
    return target || new THREE.Vector3();
  }, [camera, raycaster]);

  // Find intersected objects
  const findIntersections = useCallback((ndc: THREE.Vector2) => {
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObjects(scene.children, true);
  }, [camera, raycaster, scene]);

  // Handle mouse move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const ndc = screenToNDC(event.clientX, event.clientY);
    mouseState.current.position.copy(ndc);
    mouseState.current.worldPosition = getWorldPosition(ndc);

    // Update hover state
    const intersections = findIntersections(ndc);
    if (intersections.length > 0) {
      const first = intersections[0];
      // Check if the object has entityId in userData
      const entityId = first.object.userData?.entityId;
      if (entityId !== undefined) {
        setHoveredEntity(entityId);
      } else {
        setHoveredEntity(null);
      }
    } else {
      setHoveredEntity(null);
    }
  }, [screenToNDC, getWorldPosition, findIntersections, setHoveredEntity]);

  // Handle mouse down
  const handleMouseDown = useCallback((event: MouseEvent) => {
    mouseState.current.isDown = true;
    mouseState.current.button = event.button;

    // Left click
    if (event.button === 0) {
      const ndc = screenToNDC(event.clientX, event.clientY);
      const worldPos = getWorldPosition(ndc);
      const intersections = findIntersections(ndc);

      // If we have an active drawing tool and there's a pending operation
      if (pendingOperation !== PendingOperation.NONE && activeTool.type !== 'select') {
        // Drawing mode - log click position for now
        console.log(`Click at world position: (${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)})`);
        console.log(`Active tool: ${activeTool.type}`);
        // TODO: Send click to WASM for entity creation
      } else {
        // Selection mode
        if (intersections.length > 0) {
          const first = intersections[0];
          const entityId = first.object.userData?.entityId;
          if (entityId !== undefined) {
            if (event.shiftKey) {
              // Add to selection
              selectEntity(entityId);
            } else {
              // Replace selection
              deselectAll();
              selectEntity(entityId);
            }
          }
        } else if (!event.shiftKey) {
          // Click on empty space - clear selection
          deselectAll();
        }
      }
    }
  }, [screenToNDC, getWorldPosition, findIntersections, pendingOperation, activeTool, selectEntity, deselectAll]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    mouseState.current.isDown = false;
    mouseState.current.button = -1;
  }, []);

  // Add event listeners
  useEffect(() => {
    const domElement = gl.domElement;
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mouseup', handleMouseUp);

    return () => {
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl, handleMouseMove, handleMouseDown, handleMouseUp]);

  // Update cursor based on active tool
  useFrame(() => {
    const canvas = gl.domElement;
    if (activeTool.type === 'select') {
      canvas.style.cursor = 'default';
    } else if (pendingOperation !== PendingOperation.NONE) {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = 'default';
    }
  });

  return null; // This component doesn't render anything
}
