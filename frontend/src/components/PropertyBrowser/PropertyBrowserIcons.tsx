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

// Workplanes icon - stacked diamond layers (1st icon)
// SVG copied from Figma
export const WorkplanesIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 32 32"
    style={{ display: 'block' }}
  >
    <path
      fill="#203646"
      d="m23.42 14.87-6.384-3.702c-.393-.228-.711-.335-1.036-.335-.334 0-.645.107-1.035.334L8.58 14.868c-.652.384-.913.687-.913 1.127 0 .45.261.75.913 1.133l6.383 3.7c.394.23.702.337 1.037.337.325 0 .643-.107 1.035-.335l6.385-3.702c.651-.383.913-.685.913-1.133 0-.44-.261-.743-.913-1.125m-.857 1.207-6.205 3.555a.73.73 0 0 1-.358.113.73.73 0 0 1-.358-.113l-6.214-3.555c-.033-.017-.058-.042-.058-.084 0-.031.025-.056.058-.071l6.214-3.557a.74.74 0 0 1 .358-.113.73.73 0 0 1 .358.115l6.207 3.553c.04.017.065.042.065.073 0 .042-.025.067-.067.084"
      opacity="0.7"
    />
  </svg>
);

// Normals icon - Y-shaped arrow matching Figma design (larger, more prominent)
export const NormalsIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  fill="none"
  viewBox="0 0 32 32"
>
  <g opacity="0.7">
    <path
      fill="#060708"
      fillOpacity="0.6"
      d="M16.922 22.88a7.2 7.2 0 0 0-7.198-7.198.9.9 0 0 1 0-1.8 9 9 0 0 1 8.313 5.555 9 9 0 0 1 .685 3.443.9.9 0 1 1-1.8 0"
    ></path>
    <path
      fill="#000"
      d="M20.853 9.382a.81.81 0 0 1 1.203 1.084l-5.719 6.352-1.204-1.084z"
    ></path>
  </g>
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

// Toggle Construction icon - play triangle with dashed vertical line (4th icon)
// Based on Figma node 90:10816 screenshot
export const ToggleConstructionIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
  >
    <g opacity="0.7">
      <path
        fill="#060708"
        fillOpacity="0.6"
        d="M21 20.962c0-.488.373-.884.833-.884s.834.396.834.884v1.654c0 .488-.373.884-.834.884S21 23.104 21 22.616zm0-6.616c0-.488.373-.884.833-.884s.834.396.834.884v3.308c0 .488-.373.884-.834.884S21 18.142 21 17.654zm0-4.962c0-.488.373-.884.833-.884s.834.396.834.884v1.654c0 .488-.373.884-.834.884S21 11.526 21 11.038z"
      ></path>
      <path
        fill="#203646"
        d="M15.832 18.154a.656.656 0 0 1 .919 0 .64.64 0 0 1 0 .914l-1.389 1.37h4.188c.357 0 .65.286.65.645a.65.65 0 0 1-.65.644H15.36l1.39 1.37a.64.64 0 0 1 0 .915.656.656 0 0 1-.919 0l-2.507-2.472q-.021-.023-.039-.048-.021-.025-.04-.052-.016-.023-.028-.048-.02-.031-.035-.065-.016-.042-.026-.085-.004-.015-.01-.031a.64.64 0 0 1 .038-.377q.017-.039.039-.073.01-.02.021-.037a.6.6 0 0 1 .08-.098zM10.834 9c.46 0 .833.396.833.884v13.232c0 .488-.373.884-.833.884S10 23.603 10 23.115V9.883c0-.488.374-.884.834-.884m5.776 14.87a.5.5 0 0 1-.07.057zM20 21.082q0 .018-.003.034l.004-.033zm-6.575-.267a.4.4 0 0 0 .04-.047zm6.232-.164-.016-.005q-.008 0-.014-.002zM16.584 8.987a.656.656 0 0 1 .919 0l2.506 2.472q.045.044.08.098.009.012.016.026a.6.6 0 0 1 .082.207.64.64 0 0 1-.08.452q-.008.016-.017.031a.7.7 0 0 1-.081.1l-2.506 2.472a.656.656 0 0 1-.919 0 .64.64 0 0 1 0-.915l1.39-1.37h-4.189a.65.65 0 0 1-.651-.644.65.65 0 0 1 .651-.646h4.188l-1.389-1.369a.64.64 0 0 1 0-.914m.045 5.223-.004.009a.4.4 0 0 1 .041-.076zm.037-5.01a.4.4 0 0 0 .059-.071z"
      ></path>
    </g>
  </svg>
);

// Constraint Angle icon - two lines with angle arc (5th icon)
// Based on Figma node 90:10817 screenshot
export const ConstraintAngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
  >
    <g opacity="0.7">
      <path
        stroke="#060708"
        strokeLinejoin="round"
        strokeOpacity="0.6"
        strokeWidth="1.887"
        d="M11.204 16.833c1.18.393 3.93 1.572 3.145 4.717"
      ></path>
      <path
        fill="#203646"
        d="M15.31 9a2.358 2.358 0 1 1-.217 4.705l-4.424 7.963 9.504-1.187a2.358 2.358 0 1 1 .333 1.859L9.06 23.77a.95.95 0 0 1-.9-.407.94.94 0 0 1-.042-.986l5.323-9.585A2.359 2.359 0 0 1 15.311 9m7.155 11.367a.66.66 0 1 0 0 1.321.66.66 0 0 0 0-1.32m-7.155-9.669a.66.66 0 1 0 0 1.32.66.66 0 0 0 0-1.32"
      ></path>
    </g>
  </svg>
);

// Cube Front View icon - isometric cube with RIGHT face shaded (6th icon)
// Based on Figma node 90:10818 screenshot
export const CubeFrontViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    {/* Back edges first */}
    <path d="M10 4L16 7" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M10 4L4 7" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M4 7V13" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M4 13L10 16" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M10 10V16" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M4 7L10 10" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Highlighted RIGHT face with gray fill */}
    <path
      d="M10 10L16 7V13L10 16V10Z"
      fill="#949A9E"
      stroke="#203646"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Top edge of right face */}
    <path d="M10 10L16 7" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// Shaded View icon - isometric cube with TOP face shaded (7th icon)
// Based on Figma node 90:10819 screenshot
export const ShadedViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{ opacity: 0.7, display: 'block' }}
  >
    {/* Bottom/side edges first */}
    <path d="M4 7V13L10 16V10" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M10 16L16 13V7" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M10 10V16" stroke="#203646" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Highlighted TOP face with gray fill */}
    <path
      d="M10 4L16 7L10 10L4 7L10 4Z"
      fill="#949A9E"
      stroke="#203646"
      strokeWidth="1.2"
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
