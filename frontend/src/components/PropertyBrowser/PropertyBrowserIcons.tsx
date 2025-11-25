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

// Normals icon - Y-shaped arrow matching Figma design (larger, more prominent)
export const NormalsIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    {/* Main Y-shaped lines */}
    <path
      d="M8 14V8M8 8L3 3M8 8L13 3"
      stroke="#203646"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Small circle at intersection */}
    <circle cx="8" cy="8" r="1.5" fill="#203646" />
  </svg>
);

// Point icon - small centered dot matching Figma design (inset 37.5% = small dot)
export const PointIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    <circle cx="8" cy="8" r="2" fill="#203646" />
  </svg>
);

export const ToggleConstructionIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.toggleConstruction} size={size} alt="Toggle Construction" />
);

// Constraint Angle icon - angle indicator with arc (5th icon)
// Based on Figma node 90:10817 screenshot
export const ConstraintAngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    {/* Horizontal base line */}
    <path
      d="M2 15H18"
      stroke="#203646"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Angled line going up-right */}
    <path
      d="M2 15L14 4"
      stroke="#203646"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Small angle arc indicator */}
    <path
      d="M6 15A4 4 0 0 1 8.5 12"
      stroke="#060708"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Cube Front View icon - isometric cube with highlighted RIGHT face (6th icon)
// Based on Figma node 90:10818 screenshot
export const CubeFrontViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    {/* Cube outline */}
    <path
      d="M10 3L17 7V13L10 17L3 13V7L10 3Z"
      stroke="#203646"
      strokeWidth="1.3"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Center vertical line */}
    <path d="M10 10V17" stroke="#203646" strokeWidth="1.3" />
    {/* Top internal lines */}
    <path d="M3 7L10 10L17 7" stroke="#203646" strokeWidth="1.3" />
    {/* Highlighted RIGHT face */}
    <path
      d="M10 10L17 7V13L10 17V10Z"
      fill="#949A9E"
      stroke="#203646"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

// Shaded View icon - isometric cube with highlighted TOP face (7th icon)
// Based on Figma node 90:10819 screenshot
export const ShadedViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    {/* Cube outline */}
    <path
      d="M10 3L17 7V13L10 17L3 13V7L10 3Z"
      stroke="#203646"
      strokeWidth="1.3"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Center vertical line */}
    <path d="M10 10V17" stroke="#203646" strokeWidth="1.3" />
    {/* Top internal lines */}
    <path d="M3 7L10 10L17 7" stroke="#203646" strokeWidth="1.3" />
    {/* Highlighted TOP face */}
    <path
      d="M10 3L17 7L10 10L3 7L10 3Z"
      fill="#949A9E"
      stroke="#203646"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
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
