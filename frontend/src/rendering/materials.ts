import * as THREE from 'three';
import { SolveSpaceColors, LineWidths, hexToThreeColor, StipplePattern, StipplePatterns } from './colors';

// Mesh materials
export const meshMaterials = {
  default: new THREE.MeshStandardMaterial({
    color: hexToThreeColor(SolveSpaceColors.MESH_FRONT),
    metalness: 0.1,
    roughness: 0.8,
    side: THREE.DoubleSide,
  }),

  selected: new THREE.MeshStandardMaterial({
    color: hexToThreeColor(SolveSpaceColors.SELECTED),
    metalness: 0.1,
    roughness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  }),

  hovered: new THREE.MeshStandardMaterial({
    color: hexToThreeColor(SolveSpaceColors.HOVERED),
    metalness: 0.1,
    roughness: 0.8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  }),

  dimmed: new THREE.MeshStandardMaterial({
    color: hexToThreeColor(SolveSpaceColors.DIM_SOLID),
    metalness: 0.1,
    roughness: 0.9,
    side: THREE.DoubleSide,
  }),
};

// Edge/line materials
export const edgeMaterials = {
  solidEdge: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.SOLID_EDGE),
    linewidth: LineWidths.SOLID_EDGE,
  }),

  activeGrp: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.ACTIVE_GRP),
    linewidth: LineWidths.ACTIVE_GRP,
  }),

  construction: new THREE.LineDashedMaterial({
    color: hexToThreeColor(SolveSpaceColors.CONSTRUCTION),
    linewidth: LineWidths.CONSTRUCTION,
    dashSize: StipplePatterns[StipplePattern.SHORT_DASH].dashSize * 0.1,
    gapSize: StipplePatterns[StipplePattern.SHORT_DASH].gapSize * 0.1,
  }),

  inactiveGrp: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.INACTIVE_GRP),
    linewidth: LineWidths.INACTIVE_GRP,
  }),

  selected: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.SELECTED),
    linewidth: LineWidths.SELECTED,
  }),

  hovered: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.HOVERED),
    linewidth: LineWidths.HOVERED,
  }),

  hiddenEdge: new THREE.LineDashedMaterial({
    color: hexToThreeColor(SolveSpaceColors.HIDDEN_EDGE),
    linewidth: LineWidths.SOLID_EDGE,
    dashSize: StipplePatterns[StipplePattern.DASH].dashSize * 0.05,
    gapSize: StipplePatterns[StipplePattern.DASH].gapSize * 0.05,
    transparent: true,
    opacity: 0.5,
  }),

  constraint: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.CONSTRAINT),
    linewidth: LineWidths.CONSTRAINT,
  }),

  analyze: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.ANALYZE),
    linewidth: LineWidths.ANALYZE,
  }),

  error: new THREE.LineBasicMaterial({
    color: hexToThreeColor(SolveSpaceColors.DRAW_ERROR),
    linewidth: LineWidths.DRAW_ERROR,
  }),
};

// Point materials
export const pointMaterials = {
  default: new THREE.PointsMaterial({
    color: hexToThreeColor(SolveSpaceColors.ACTIVE_GRP),
    size: 6,
    sizeAttenuation: false,
  }),

  datum: new THREE.PointsMaterial({
    color: hexToThreeColor(SolveSpaceColors.DATUM),
    size: 6,
    sizeAttenuation: false,
  }),

  construction: new THREE.PointsMaterial({
    color: hexToThreeColor(SolveSpaceColors.CONSTRUCTION),
    size: 5,
    sizeAttenuation: false,
  }),

  selected: new THREE.PointsMaterial({
    color: hexToThreeColor(SolveSpaceColors.SELECTED),
    size: 8,
    sizeAttenuation: false,
  }),

  hovered: new THREE.PointsMaterial({
    color: hexToThreeColor(SolveSpaceColors.HOVERED),
    size: 8,
    sizeAttenuation: false,
  }),

  analyze: new THREE.PointsMaterial({
    color: hexToThreeColor(SolveSpaceColors.ANALYZE),
    size: 10,
    sizeAttenuation: false,
  }),
};

// Workplane material (dashed border)
export const workplaneMaterial = new THREE.LineDashedMaterial({
  color: hexToThreeColor(SolveSpaceColors.NORMALS),
  linewidth: 1,
  dashSize: StipplePatterns[StipplePattern.SHORT_DASH].dashSize * 0.15,
  gapSize: StipplePatterns[StipplePattern.SHORT_DASH].gapSize * 0.15,
  transparent: true,
  opacity: 0.7,
});

// Clone material with different properties
export function cloneMaterialWithColor(
  material: THREE.Material,
  color: string
): THREE.Material {
  const cloned = material.clone();
  if ('color' in cloned) {
    (cloned as THREE.MeshStandardMaterial).color.setHex(hexToThreeColor(color));
  }
  return cloned;
}
