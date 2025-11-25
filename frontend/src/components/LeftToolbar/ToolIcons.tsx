// SVG icons extracted from Figma design
// Figma file: jh5Xm4JLImD0NEnB9oyl2Z
// Toolbar node: 1:7139
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Exact Figma icon assets from node 1:7139
const figmaIcons = {
  // SHAPE section (1:7145)
  line: 'https://www.figma.com/api/mcp/asset/b5bd6509-aa50-483f-8260-15998613099b',           // img1 - Line
  rectangle: 'https://www.figma.com/api/mcp/asset/6f1d65b0-3874-42e6-82ac-6d15f16ee570',     // img2 - Rectangle
  circle: 'https://www.figma.com/api/mcp/asset/782f6da5-8799-490a-b517-c15c1cd7cbcd',        // img3 - Circle
  arc: 'https://www.figma.com/api/mcp/asset/08ae1954-31a7-48cb-84f9-64913ce31938',           // img4 - Arc
  text: 'https://www.figma.com/api/mcp/asset/cf58f950-8c90-4b92-b679-c6503a2199da',          // img5 - Text
  image: 'https://www.figma.com/api/mcp/asset/e68c0c36-7203-4cd6-95b1-d70e86957f87',         // img6 - Image
  tangent: 'https://www.figma.com/api/mcp/asset/c5be36df-4657-41eb-8d65-b8ed7e22fbfa',       // img7 - Tangent
  connect: 'https://www.figma.com/api/mcp/asset/e69210d2-9d32-4b29-8d6f-3675528ff1be',       // img9 - Connect
  point: 'https://www.figma.com/api/mcp/asset/21c8de98-e851-4fca-8ee3-60c69550de42',         // img10 - Point
  toggleConstruction: 'https://www.figma.com/api/mcp/asset/d1289609-dfa0-410f-9b1a-7c4967a056fc', // img12 - Toggle Construction
  intersect: 'https://www.figma.com/api/mcp/asset/45133d13-6684-48bc-a176-d8f8479b5bfc',     // img13 - Intersect

  // CONSTR section (1:7164)
  distance: 'https://www.figma.com/api/mcp/asset/1cd457e0-661c-416f-955f-695aee6b5798',      // img16 - Distance
  angle: 'https://www.figma.com/api/mcp/asset/2244856e-ecfe-4981-af88-71517b23b73b',         // img18 - Angle
  horizontal: 'https://www.figma.com/api/mcp/asset/a35d043a-26f0-44a9-a803-71ff1800ba33',    // img19 - Horizontal
  vertical: 'https://www.figma.com/api/mcp/asset/bd6cf13a-bb3e-4a64-b7be-5478f921961a',      // img20 - Vertical
  parallel: 'https://www.figma.com/api/mcp/asset/0a012605-f72f-469b-8ddb-2149d0a8da18',      // img21 - Parallel
  perpendicular: 'https://www.figma.com/api/mcp/asset/e6ff116a-837c-446e-889a-789eafd81900', // img23 - Perpendicular
  pointOnLine: 'https://www.figma.com/api/mcp/asset/5b6ec6d2-cad6-46f3-86cd-5f456d090f32',   // img24 - Point on Line
  mirror: 'https://www.figma.com/api/mcp/asset/ae007442-3e0b-45a2-bbd7-ff06a4685247',        // img25 - Mirror
  equal: 'https://www.figma.com/api/mcp/asset/ae026660-bd3b-4f5d-9da9-bb4024f4e322',         // img26 - Equal
  normals: 'https://www.figma.com/api/mcp/asset/f76c070b-3a90-4979-9689-5efa27e63a0d',       // img27 - Normals
  supplementaryAngle: 'https://www.figma.com/api/mcp/asset/87d1012e-d2d6-4cce-b55a-09eeebcc908f', // img30 - Supplementary Angle
  ref: 'https://www.figma.com/api/mcp/asset/7caf143f-5f72-40b9-832e-2c253da0a7d5',           // img31 - Ref

  // FORM section (1:7184)
  extrude: 'https://www.figma.com/api/mcp/asset/5ab4eccc-37e1-43c9-9fa3-bcf2d8200fbf',       // img32 - Extrude
  rotateComponent: 'https://www.figma.com/api/mcp/asset/5dbf4f29-0a69-4a65-b8c0-dc73d44ace0e', // img33 - Rotate Component
  helix: 'https://www.figma.com/api/mcp/asset/8c03d271-9573-4935-93d9-30ac7aee6632',         // img34 - Helix
  revolve: 'https://www.figma.com/api/mcp/asset/61059605-9fa8-46b0-9991-60f3acfb3359',       // img37 - Revolve
  rotate: 'https://www.figma.com/api/mcp/asset/e97f4f83-d94f-4cab-8033-ae51b6e68809',        // img39 - Rotate Pattern
  translate: 'https://www.figma.com/api/mcp/asset/a86fd149-8475-498a-afd7-4ff1b1456610',     // img45 - Translate
  newWorkplane: 'https://www.figma.com/api/mcp/asset/b1e2d214-915d-4d0e-918a-a86da9d31c02',  // img48 - New Workplane
  newGroup3D: 'https://www.figma.com/api/mcp/asset/53287994-7af1-4b18-bcf3-629d34400aeb',    // img49 - New Group 3D
  assembly: 'https://www.figma.com/api/mcp/asset/95ededaf-be1a-4791-b8cc-a79458a4ee16',      // img47 - Assembly

  // VIEW section (1:7199)
  isometric: 'https://www.figma.com/api/mcp/asset/f4f27d7b-f517-44fe-9cea-8a047d860952',     // img50 - Isometric
  alignView: 'https://www.figma.com/api/mcp/asset/5cf27e49-85db-422e-b7b5-31b5f7fb34b7',     // img51 - Align View
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
