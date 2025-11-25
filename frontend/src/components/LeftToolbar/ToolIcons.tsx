// SVG icons for Left Toolbar
// Figma file: jh5Xm4JLImD0NEnB9oyl2Z
// Toolbar node: 1:7139
//
// HOW TO UPDATE ICONS:
// 1. Open Figma and select the icon
// 2. Right-click → Copy as SVG
// 3. Paste the SVG content inside the component below
// 4. Convert attributes: stroke-width → strokeWidth, fill-opacity → fillOpacity, etc.
// 5. Change width="32" height="32" to width={size} height={size}
//
import React from 'react';

interface IconProps {
  size?: number;
}

// ============================================================================
// SHAPE SECTION (Figma node: 1:7145)
// ============================================================================

// --- 1. Line Icon ---
// Figma node: 1:7146
export const LineIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 24L24 8" stroke="#203646" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 2. Rectangle Icon ---
// Figma node: 1:7147
export const RectangleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <rect x="8" y="10" width="16" height="12" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 3. Circle Icon ---
// Figma node: 1:7148
export const CircleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <circle cx="16" cy="16" r="7" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 4. Arc Icon ---
// Figma node: 1:7149
export const ArcIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 22C10 15.373 15.373 10 22 10" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 5. Text Icon ---
// Figma node: 1:7150
export const TextIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 12H22M16 12V22M13 22H19" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 6. Image Icon ---
// Figma node: 1:7151
export const ImageIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <rect x="8" y="10" width="16" height="12" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <circle cx="12" cy="14" r="1.5" fill="#203646" opacity="0.7" />
    <path d="M8 20L12 16L16 19L20 15L24 19" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 7. Tangent Icon ---
// Figma node: 1:7152
export const TangentIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <circle cx="16" cy="18" r="6" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M8 12H24" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 8. Connect Icon ---
// Figma node: 1:7153
export const ConnectIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <circle cx="10" cy="12" r="3" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <circle cx="22" cy="20" r="3" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M13 14L19 18" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 9. Point Icon ---
// Figma node: 1:7154
export const PointIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <circle cx="16" cy="16" r="3" fill="#203646" opacity="0.7" />
  </svg>
);

// --- 10. Toggle Construction Icon ---
// Figma node: 1:7155
export const ToggleConstructionIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 10L10 22L18 16L10 10Z" fill="#203646" opacity="0.7" />
    <path d="M22 10V22" stroke="#203646" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
  </svg>
);

// --- 11. Intersect Icon ---
// Figma node: 1:7156
export const IntersectIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 24L24 8" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M8 8L24 24" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <circle cx="16" cy="16" r="2" fill="#203646" opacity="0.7" />
  </svg>
);

// ============================================================================
// CONSTR SECTION (Figma node: 1:7159)
// ============================================================================

// --- 12. Distance Icon ---
// Figma node: 1:7165
export const DistanceIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 20H22" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M10 16V24M22 16V24" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M14 12H18L16 8L14 12Z" fill="#203646" opacity="0.7" />
  </svg>
);

// --- 13. Angle Icon ---
// Figma node: 1:7166
export const AngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 24H24" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M8 24L20 10" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M12 24C12 21 13 19 15 17" stroke="#203646" strokeWidth="1.2" opacity="0.7" />
  </svg>
);

// --- 14. Horizontal Icon ---
// Figma node: 1:7167
export const HorizontalIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 16H24" stroke="#203646" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M12 12L8 16L12 20" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M20 12L24 16L20 20" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 15. Vertical Icon ---
// Figma node: 1:7168
export const VerticalIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M16 8V24" stroke="#203646" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M12 12L16 8L20 12" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M12 20L16 24L20 20" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 16. Parallel Icon ---
// Figma node: 1:7169
export const ParallelIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 10L22 22" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M10 16L22 28" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 17. Perpendicular Icon ---
// Figma node: 1:7170
export const PerpendicularIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 22V10H22" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    <rect x="10" y="16" width="4" height="4" stroke="#203646" strokeWidth="1" opacity="0.5" />
  </svg>
);

// --- 18. Point On Line Icon ---
// Figma node: 1:7171
export const PointOnLineIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 24L24 8" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <circle cx="16" cy="16" r="3" fill="#203646" opacity="0.7" />
  </svg>
);

// --- 19. Mirror Icon ---
// Figma node: 1:7172
export const MirrorIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M16 8V24" stroke="#203646" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />
    <path d="M8 12L12 16L8 20" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M24 12L20 16L24 20" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 20. Equal Icon ---
// Figma node: 1:7173
export const EqualIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M10 13H22" stroke="#203646" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M10 19H22" stroke="#203646" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 21. Normals Icon ---
// Figma node: 1:7174
export const NormalsIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <circle cx="18" cy="18" r="6" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M14 14L8 8" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <path d="M8 8L11 9M8 8L9 11" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 22. Supplementary Angle Icon ---
// Figma node: 1:7175
export const SupplementaryAngleIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 20L16 12L24 20" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    <path d="M12 20C12 17 14 15 16 14" stroke="#203646" strokeWidth="1" opacity="0.5" />
  </svg>
);

// --- 23. Ref Icon ---
// Figma node: 1:7176
export const RefIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <text x="10" y="20" fill="#203646" fontSize="10" fontWeight="bold" opacity="0.7">66</text>
  </svg>
);

// ============================================================================
// FORM SECTION (Figma node: 1:7184)
// ============================================================================

// --- 24. Extrude Icon ---
// Figma node: 1:7185
export const ExtrudeIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <rect x="10" y="14" width="12" height="10" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M10 14L14 8H22L22 14" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M22 14L22 8" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 25. Rotate Component Icon ---
// Figma node: 1:7186
export const RotateIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M22 12C22 8.686 19.314 6 16 6C12.686 6 10 8.686 10 12" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M10 20C10 23.314 12.686 26 16 26C19.314 26 22 23.314 22 20" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M22 12L24 10M22 12L20 10" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M10 20L8 22M10 20L12 22" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 26. Helix Icon ---
// Figma node: 1:7187
export const HelixIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M12 24C12 22 14 20 16 20C18 20 20 18 20 16C20 14 18 12 16 12C14 12 12 10 12 8" stroke="#203646" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// --- 27. Revolve Icon ---
// Figma node: 1:7188
export const RevolveIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <ellipse cx="16" cy="16" rx="8" ry="4" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M16 12V20" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M8 16H24" stroke="#203646" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

// --- 28. Rotate Pattern Icon ---
// Figma node: 1:7189
export const RotatePatternIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <circle cx="16" cy="16" r="6" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <circle cx="16" cy="8" r="2" fill="#203646" opacity="0.7" />
    <circle cx="22" cy="20" r="2" fill="#203646" opacity="0.7" />
    <circle cx="10" cy="20" r="2" fill="#203646" opacity="0.7" />
  </svg>
);

// --- 29. Translate Icon ---
// Figma node: 1:7190
export const TranslateIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <rect x="8" y="8" width="6" height="6" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <rect x="14" y="14" width="6" height="6" stroke="#203646" strokeWidth="1.5" opacity="0.5" />
    <rect x="20" y="20" width="6" height="6" stroke="#203646" strokeWidth="1.5" opacity="0.3" />
  </svg>
);

// --- 30. New Workplane Icon ---
// Figma node: 25:1182
export const NewWorkplaneIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M8 20L16 24L24 20L16 16L8 20Z" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M16 10V16" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M13 13H19" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 31. New Group 3D Icon ---
// Figma node: 25:1188
export const NewGroup3DIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M16 16V24" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M8 12L16 16L24 12" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 32. Assembly Icon ---
// Figma node: 1:7191
export const AssemblyIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <rect x="8" y="8" width="8" height="8" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <rect x="16" y="16" width="8" height="8" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M16 12H20V16" stroke="#203646" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

// ============================================================================
// VIEW SECTION (Figma node: 1:7199)
// ============================================================================

// --- 33. Isometric Icon ---
// Figma node: 1:7200
export const IsometricIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" stroke="#203646" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
    <path d="M16 16V24" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M8 12L16 16L24 12" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

// --- 34. Align View Icon ---
// Figma node: 1:7201
export const AlignViewIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
    {/* TODO: Paste SVG content from Figma here */}
    <rect x="10" y="10" width="12" height="12" stroke="#203646" strokeWidth="1.5" opacity="0.7" />
    <path d="M16 6V10M16 22V26M6 16H10M22 16H26" stroke="#203646" strokeWidth="1.5" opacity="0.5" />
  </svg>
);
