// SVG icons extracted from Figma design
// Figma file: jh5Xm4JLImD0NEnB9oyl2Z
// Toolbar node: 90:12952
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Exact Figma icon assets from node 90:12952
const figmaIcons = {
  // SHAPE section
  line: 'https://www.figma.com/api/mcp/asset/4f3fa958-e99b-46cc-9458-e89014aaba69',
  rectangle: 'https://www.figma.com/api/mcp/asset/6d113786-6982-4f30-a04c-1495d6371456',
  circle: 'https://www.figma.com/api/mcp/asset/25bba374-6e78-45d5-a351-8312a21d36c7',
  arc: 'https://www.figma.com/api/mcp/asset/57198827-6e37-47a2-a6c5-522eb0bee2e9',
  text: 'https://www.figma.com/api/mcp/asset/de898656-8025-4723-9671-8200950be654',
  image: 'https://www.figma.com/api/mcp/asset/7cdfb5eb-5360-46eb-a92f-43df8af464a0',
  tangent: 'https://www.figma.com/api/mcp/asset/1d118f91-73ff-4a01-ba36-6fd7ff137648',
  connect: 'https://www.figma.com/api/mcp/asset/a3f73253-bf8b-41b7-9936-df74c1cb4b8c',
  point: 'https://www.figma.com/api/mcp/asset/8817b607-fdbc-44c7-8f01-6ec68c936bc0',
  toggleConstruction: 'https://www.figma.com/api/mcp/asset/374c873b-64c9-48ed-88a7-c038cb432bc7',
  intersect: 'https://www.figma.com/api/mcp/asset/098326ca-1bdf-4b66-8cc2-bccbd9354fa4',

  // CONSTR section
  distance: 'https://www.figma.com/api/mcp/asset/a00b6601-0e19-46d7-b515-4d8c5d304da4',
  angle: 'https://www.figma.com/api/mcp/asset/4ea85329-1e18-4871-8477-688391592f4a',
  horizontal: 'https://www.figma.com/api/mcp/asset/720b81a1-b2e2-41a4-8bc5-b4fd8e692c1f',
  vertical: 'https://www.figma.com/api/mcp/asset/c53d989c-18bd-4503-a72c-396f6ac07e4f',
  parallel: 'https://www.figma.com/api/mcp/asset/4f4f890a-403c-4d3f-8e15-13c9bd6554b8',
  perpendicular: 'https://www.figma.com/api/mcp/asset/5b3df82b-3b8a-4e26-b2ca-d98b3a8de3c8',
  pointOnLine: 'https://www.figma.com/api/mcp/asset/0b99cc77-1baa-4bae-b864-d2257437603f',
  mirror: 'https://www.figma.com/api/mcp/asset/40937fbe-4b7a-42e6-ab60-c9c900b35b48',
  equal: 'https://www.figma.com/api/mcp/asset/68f86de7-8656-47ff-9962-c962f375b560',
  normals: 'https://www.figma.com/api/mcp/asset/a629dcf1-300a-4b06-84ec-b1656de2e08a',
  supplementaryAngle: 'https://www.figma.com/api/mcp/asset/c42cdf13-0511-4a25-9be8-75be0dfe90e8',
  ref: 'https://www.figma.com/api/mcp/asset/fdd8ae3a-bbe6-4a34-8520-861f463f0b6a',

  // FORM section
  extrude: 'https://www.figma.com/api/mcp/asset/dd0acd45-a3a6-4417-9382-f0d799f92151',
  rotateComponent: 'https://www.figma.com/api/mcp/asset/0881915b-f20b-4ebb-9f0d-35c05c6b99af',
  helix: 'https://www.figma.com/api/mcp/asset/99634ee9-68f8-470c-8853-4f89f97c4147',
  revolve: 'https://www.figma.com/api/mcp/asset/108c3543-ecda-4224-ae9a-50726d7acf6a',
  rotate: 'https://www.figma.com/api/mcp/asset/488090b4-cf45-4f83-a1a0-123949f5c3be',
  translate: 'https://www.figma.com/api/mcp/asset/3cdc4ab3-5f3a-4407-9589-72a499c8ee0b',
  newWorkplane: 'https://www.figma.com/api/mcp/asset/6ca01404-b07d-4e5c-94d6-b1ec5f1180e5',
  newGroup3D: 'https://www.figma.com/api/mcp/asset/f4f5eb9d-f1f3-4926-8aaf-e89262b4f983',
  assembly: 'https://www.figma.com/api/mcp/asset/137e88a0-0376-4f20-b4a9-8bd33d71e492',

  // VIEW section
  isometric: 'https://www.figma.com/api/mcp/asset/471824ed-8a2b-40a9-9add-58c44b2e1a92',
  alignView: 'https://www.figma.com/api/mcp/asset/86ac22ac-d3a3-4d88-ba04-2944f679b4a9',
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
