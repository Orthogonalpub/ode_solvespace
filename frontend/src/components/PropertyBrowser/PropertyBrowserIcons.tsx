// SVG icons extracted from Figma design
// Figma file: jh5Xm4JLImD0NEnB9oyl2Z
// Right sidebar toolbar node: 90:10812
import React from 'react';

interface IconProps {
  size?: number;
}

// Exact Figma icon assets from node 90:10812 (2025-11-25)
const figmaIcons = {
  // Right sidebar toolbar icons (11 total)
  workplanes: 'https://www.figma.com/api/mcp/asset/8a1061c2-3b2c-4fa3-8fe8-247f8b2e0a04',           // img1 - Workplanes (stacked layers)
  normals: 'https://www.figma.com/api/mcp/asset/5426c470-438d-47fa-b3b4-e26b7e355115',             // img3 - Normals (L-shaped arrow)
  point: 'https://www.figma.com/api/mcp/asset/2322f90b-7eb9-4340-99a2-962119cd5841',               // img4 - Point
  toggleConstruction: 'https://www.figma.com/api/mcp/asset/70175511-083c-4090-82c1-66ad4ef576b6',  // img6 - Toggle Construction
  constraintAngle: 'https://www.figma.com/api/mcp/asset/e363ee55-d30e-43e5-a6d8-2da84e5e5442',     // img8 - Constraint Angle
  cubeFrontView: 'https://www.figma.com/api/mcp/asset/7eec959e-024c-4252-9c73-25b83c8f51ed',       // img9 - Cube Front View (faces selectable)
  shadedView: 'https://www.figma.com/api/mcp/asset/1d13928d-f8f3-48b5-89c0-bb41421d8c06',          // img11 - Shaded View
  cubeSolid: 'https://www.figma.com/api/mcp/asset/cfa4e2b0-fd88-4e00-9207-1b00e11f42a5',           // img12 - Cube Solid (hide edges)
  cubeOutline: 'https://www.figma.com/api/mcp/asset/2f62ddaf-ee96-4eda-af0a-01c793e9dba2',         // img13 - Cube Outline (hide outlines) - with blue stroke
  triangleMesh: 'https://www.figma.com/api/mcp/asset/b49ca97b-aa16-4c95-9707-f2faa8be5072',        // img14 - Triangle Mesh
  occludedLines: 'https://www.figma.com/api/mcp/asset/2b1d4257-212c-4897-b42e-6b3cd475decd',       // img15 - Don't draw occluded lines
};

// Helper component for Figma image icons - ensures square aspect ratio
const FigmaIcon: React.FC<{ src: string; size?: number; alt: string }> = ({ src, size = 16, alt }) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    style={{
      opacity: 0.7,
      display: 'block',
      objectFit: 'contain',
      aspectRatio: '1 / 1',
    }}
  />
);

export const WorkplanesIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.workplanes} size={size} alt="Workplanes" />
);

export const NormalsIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.normals} size={size} alt="Normals" />
);

export const PointIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.point} size={size} alt="Point" />
);

export const ToggleConstructionIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.toggleConstruction} size={size} alt="Toggle Construction" />
);

export const ConstraintAngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.constraintAngle} size={size} alt="Constraint Angle" />
);

export const CubeFrontViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.cubeFrontView} size={size} alt="Faces Selectable" />
);

export const ShadedViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.shadedView} size={size} alt="Shaded View" />
);

export const CubeSolidIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.cubeSolid} size={size} alt="Hide Edges" />
);

export const CubeOutlineIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.cubeOutline} size={size} alt="Hide Outlines" />
);

export const TriangleMeshIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.triangleMesh} size={size} alt="Triangle Mesh" />
);

export const OccludedLinesIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.occludedLines} size={size} alt="Don't Draw Occluded Lines" />
);

// Export all icons as a named object for convenience
export const PropertyBrowserIcons = {
  workplanes: WorkplanesIcon,
  normals: NormalsIcon,
  point: PointIcon,
  toggleConstruction: ToggleConstructionIcon,
  constraintAngle: ConstraintAngleIcon,
  cubeFrontView: CubeFrontViewIcon,
  shadedView: ShadedViewIcon,
  cubeSolid: CubeSolidIcon,
  cubeOutline: CubeOutlineIcon,
  triangleMesh: TriangleMeshIcon,
  occludedLines: OccludedLinesIcon,
};
