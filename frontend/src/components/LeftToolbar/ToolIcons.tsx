// SVG icons extracted from Figma design
// Figma file: jh5Xm4JLImD0NEnB9oyl2Z
// Toolbar node: 1:7139
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Exact Figma icon assets from node 1:7139 (refreshed 2025-11-25)
const figmaIcons = {
  // SHAPE section (1:7145)
  line: 'https://www.figma.com/api/mcp/asset/e6d192cf-0e6b-41c2-ad87-b7f852b8a731',           // img1 - Line
  rectangle: 'https://www.figma.com/api/mcp/asset/75de61e9-dbfe-45c2-9fe8-2fb5cdbafbd9',     // img2 - Rectangle
  circle: 'https://www.figma.com/api/mcp/asset/9196e568-ad05-4a2e-b2f6-eca06d5cab18',        // img3 - Circle
  arc: 'https://www.figma.com/api/mcp/asset/b84199e1-56dd-49ce-87ab-0d6199698e07',           // img4 - Arc
  text: 'https://www.figma.com/api/mcp/asset/b8587909-96ab-40b0-b789-e909b2811528',          // img5 - Text
  image: 'https://www.figma.com/api/mcp/asset/24b40669-ec22-4534-b6cc-b170d58fe5bd',         // img6 - Image
  tangent: 'https://www.figma.com/api/mcp/asset/2e5f961d-9847-4c8f-a42a-951b29a3ad23',       // img7 - Tangent
  connect: 'https://www.figma.com/api/mcp/asset/db144182-7ab7-4790-9929-47a3365c303e',       // img9 - Connect
  point: 'https://www.figma.com/api/mcp/asset/4c9cf74a-0f59-4be8-acfd-504a97e8c157',         // img10 - Point
  toggleConstruction: 'https://www.figma.com/api/mcp/asset/9186f0b6-4d11-456c-8e24-613ac05ddab0', // img12 - Toggle Construction
  intersect: 'https://www.figma.com/api/mcp/asset/ef1369a2-e7a3-4bfc-9f18-11944d4d07c6',     // img13 - Intersect

  // CONSTR section (1:7159) - from node 1:7164
  distance: 'https://www.figma.com/api/mcp/asset/008f5300-aa88-471f-baa2-549c31e0d11d',      // img16 - Distance
  angle: 'https://www.figma.com/api/mcp/asset/f034c5fb-e16a-4d5c-ba99-87fa492a5435',         // img18 - Angle
  horizontal: 'https://www.figma.com/api/mcp/asset/f82346a4-ba67-44dc-a8fe-4bcc84c7d4a8',    // img19 - Horizontal
  vertical: 'https://www.figma.com/api/mcp/asset/1ecc3363-605c-4436-b59b-43a4500f81a6',      // img20 - Vertical
  parallel: 'https://www.figma.com/api/mcp/asset/b57c0a9b-eba7-4ff9-8d4c-9df731d11ed1',      // img21 - Parallel
  perpendicular: 'https://www.figma.com/api/mcp/asset/4365099c-4b59-48aa-86a9-e12b355c8842', // img23 - Perpendicular
  pointOnLine: 'https://www.figma.com/api/mcp/asset/4a2850de-b342-48fc-9a81-bc783028cb67',   // img24 - Point on Line
  mirror: 'https://www.figma.com/api/mcp/asset/e1620ebf-c582-4dbd-81ba-96c4de5cad2d',        // img25 - Mirror
  equal: 'https://www.figma.com/api/mcp/asset/1632e398-6472-4c89-9b46-e3af5c09170e',         // img26 - Equal
  normals: 'https://www.figma.com/api/mcp/asset/8d0a531f-7f04-4e2d-b448-a5ed11611fef',       // img27 - Normals
  supplementaryAngle: 'https://www.figma.com/api/mcp/asset/1a0b3236-dce7-452c-8e2b-2203c0c62097', // img30 - Supplementary Angle
  ref: 'https://www.figma.com/api/mcp/asset/02bf4d57-e0c3-4c42-ba2d-4eb8737239a8',           // img31 - Ref

  // FORM section (1:7184)
  extrude: 'https://www.figma.com/api/mcp/asset/bc768cb0-4fa0-43ff-90a2-c901e8a8ca99',       // img32 - Extrude
  rotateComponent: 'https://www.figma.com/api/mcp/asset/5e5ffdaf-466b-4c24-b4ea-bdb8f9aed99a', // img33 - Rotate Component
  helix: 'https://www.figma.com/api/mcp/asset/e89ce95a-58a7-43b2-8106-ba8631a51fa8',         // img34 - Helix
  revolve: 'https://www.figma.com/api/mcp/asset/b9d2857a-2f37-4315-86ef-9a898c861c60',       // img37 - Revolve
  rotate: 'https://www.figma.com/api/mcp/asset/88973dac-58c4-4c3e-a3e8-773f10c882aa',        // img39 - Rotate Pattern
  translate: 'https://www.figma.com/api/mcp/asset/32fa9df4-86d7-41d7-85c0-04cd8744f831',     // img45 - Translate
  newWorkplane: 'https://www.figma.com/api/mcp/asset/60c751a5-569b-424d-ad3f-b78574d600ef',  // img48 - New Workplane
  newGroup3D: 'https://www.figma.com/api/mcp/asset/46fe003d-82ba-47e4-851a-617b77d30100',    // img49 - New Group 3D
  assembly: 'https://www.figma.com/api/mcp/asset/faa71fb0-e891-4641-8e3d-02002bd72acd',      // img47 - Assembly

  // VIEW section (1:7199)
  isometric: 'https://www.figma.com/api/mcp/asset/fd38848f-6b27-4916-a15a-753c9c05e821',     // img50 - Isometric
  alignView: 'https://www.figma.com/api/mcp/asset/dd32195d-ac81-40ac-bb46-12892450c8f9',     // img51 - Align View
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

export const LineIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.line} size={size} alt="Line" />
);

export const RectangleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.rectangle} size={size} alt="Rectangle" />
);

export const CircleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.circle} size={size} alt="Circle" />
);

export const ArcIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.arc} size={size} alt="Arc" />
);

export const TextIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.text} size={size} alt="Text" />
);

export const ImageIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.image} size={size} alt="Image" />
);

export const TangentIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.tangent} size={size} alt="Tangent" />
);

export const ConnectIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.connect} size={size} alt="Connect" />
);

export const PointIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.point} size={size} alt="Point" />
);

export const ToggleConstructionIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.toggleConstruction} size={size} alt="Toggle Construction" />
);

export const IntersectIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.intersect} size={size} alt="Intersect" />
);

export const DistanceIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.distance} size={size} alt="Distance" />
);

export const AngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.angle} size={size} alt="Angle" />
);

export const HorizontalIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.horizontal} size={size} alt="Horizontal" />
);

export const VerticalIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.vertical} size={size} alt="Vertical" />
);

export const ParallelIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.parallel} size={size} alt="Parallel" />
);

export const PerpendicularIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.perpendicular} size={size} alt="Perpendicular" />
);

export const PointOnLineIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.pointOnLine} size={size} alt="Point on Line" />
);

export const MirrorIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.mirror} size={size} alt="Mirror" />
);

export const EqualIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.equal} size={size} alt="Equal" />
);

export const NormalsIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.normals} size={size} alt="Normals" />
);

export const SupplementaryAngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.supplementaryAngle} size={size} alt="Supplementary Angle" />
);

export const RefIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.ref} size={size} alt="Reference" />
);

export const ExtrudeIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.extrude} size={size} alt="Extrude" />
);

export const RotateIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.rotateComponent} size={size} alt="Rotate" />
);

export const HelixIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.helix} size={size} alt="Helix" />
);

export const RevolveIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.revolve} size={size} alt="Revolve" />
);

export const RotatePatternIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.rotate} size={size} alt="Rotate Pattern" />
);

export const TranslateIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.translate} size={size} alt="Translate" />
);

export const NewWorkplaneIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.newWorkplane} size={size} alt="New Workplane" />
);

export const NewGroup3DIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.newGroup3D} size={size} alt="New 3D Group" />
);

export const AssemblyIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.assembly} size={size} alt="Assembly" />
);

export const IsometricIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.isometric} size={size} alt="Isometric" />
);

export const AlignViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <FigmaIcon src={figmaIcons.alignView} size={size} alt="Align View" />
);
