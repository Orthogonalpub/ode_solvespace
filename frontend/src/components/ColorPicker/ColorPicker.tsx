import { useState, useRef, useEffect, useCallback } from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  initialColor?: string;
  position: { x: number; y: number };
  onClose: () => void;
  onColorChange?: (color: string) => void;
}

// Preset colors from Figma design
const presetColors = [
  '#969696', '#646464', '#ea3323', '#75fb4c', '#0004f5', '#74fbfd', '#ea34f7',
  '#ffff54', '#ef8632', '#ea337e', '#75fb8d', '#a0fc4e', '#7416f5', '#357df7',
];

// Convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Convert hex to RGB
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, v];
}

export function ColorPicker({ initialColor = '#ff0000', position, onClose, onColorChange }: ColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [isDraggingGradient, setIsDraggingGradient] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [rgbInput, setRgbInput] = useState('');

  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize from initial color
  useEffect(() => {
    const rgb = hexToRgb(initialColor);
    if (rgb) {
      const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      setHue(h);
      setSaturation(s);
      setBrightness(v);
    }
  }, [initialColor]);

  // Get current color as hex
  const getCurrentColor = useCallback(() => {
    const [r, g, b] = hsvToRgb(hue, saturation, brightness);
    return rgbToHex(r, g, b);
  }, [hue, saturation, brightness]);

  // Update RGB input when color changes
  useEffect(() => {
    const [r, g, b] = hsvToRgb(hue, saturation, brightness);
    setRgbInput(`${r}, ${g}, ${b}`);
  }, [hue, saturation, brightness]);

  // Notify color change
  useEffect(() => {
    onColorChange?.(getCurrentColor());
  }, [hue, saturation, brightness, getCurrentColor, onColorChange]);

  // Handle RGB input change
  const handleRgbInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRgbInput(e.target.value);
  };

  // Apply RGB input on Enter or blur
  const applyRgbInput = () => {
    const parts = rgbInput.split(',').map(s => parseInt(s.trim(), 10));
    if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
      const [r, g, b] = parts;
      const [h, s, v] = rgbToHsv(r, g, b);
      setHue(h);
      setSaturation(s);
      setBrightness(v);
    } else {
      // Reset to current value if invalid
      const [r, g, b] = hsvToRgb(hue, saturation, brightness);
      setRgbInput(`${r}, ${g}, ${b}`);
    }
  };

  const handleRgbKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyRgbInput();
    }
  };

  // Handle gradient area drag
  const handleGradientMouseDown = (e: React.MouseEvent) => {
    setIsDraggingGradient(true);
    updateGradientFromMouse(e);
  };

  const updateGradientFromMouse = (e: MouseEvent | React.MouseEvent) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSaturation(x);
    setBrightness(1 - y);
  };

  // Handle hue slider drag
  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    updateHueFromMouse(e);
  };

  const updateHueFromMouse = (e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHue(x);
  };

  // Mouse move/up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingGradient) {
        updateGradientFromMouse(e);
      }
      if (isDraggingHue) {
        updateHueFromMouse(e);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingGradient(false);
      setIsDraggingHue(false);
    };

    if (isDraggingGradient || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingGradient, isDraggingHue]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Get hue color for gradient background
  const hueColor = rgbToHex(...hsvToRgb(hue, 1, 1));

  // Stop propagation to prevent PropertyBrowser drag
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={panelRef}
      className="color-picker-panel"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handlePanelMouseDown}
    >
      {/* Header */}
      <div className="color-picker-header">
        <span className="color-picker-title">Edit color</span>
        <button className="color-picker-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4.5 4.5L11.5 11.5M4.5 11.5L11.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Color gradient area */}
      <div className="color-picker-selector">
        <div
          ref={gradientRef}
          className="color-picker-gradient"
          style={{ backgroundColor: hueColor }}
          onMouseDown={handleGradientMouseDown}
        >
          <div className="color-picker-gradient-white" />
          <div className="color-picker-gradient-black" />
          <div
            className="color-picker-cursor"
            style={{
              left: `${saturation * 100}%`,
              top: `${(1 - brightness) * 100}%`,
            }}
          />
        </div>

        {/* Hue slider */}
        <div
          ref={hueRef}
          className="color-picker-hue-slider"
          onMouseDown={handleHueMouseDown}
        >
          <div
            className="color-picker-hue-cursor"
            style={{ left: `${hue * 100}%` }}
          />
        </div>

        {/* RGB input row */}
        <div className="color-picker-input-row">
          <div
            className="color-picker-preview"
            style={{ backgroundColor: getCurrentColor() }}
          />
          <div className="color-picker-rgb-label">RGB</div>
          <input
            type="text"
            className="color-picker-rgb-input"
            value={rgbInput}
            onChange={handleRgbInputChange}
            onBlur={applyRgbInput}
            onKeyDown={handleRgbKeyDown}
          />
        </div>
      </div>

      {/* Preset colors */}
      <div className="color-picker-presets">
        <div className="color-picker-preset-grid">
          {presetColors.map((color, index) => (
            <button
              key={index}
              className="color-picker-preset"
              style={{ backgroundColor: color }}
              onClick={() => {
                const rgb = hexToRgb(color);
                if (rgb) {
                  const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
                  setHue(h);
                  setSaturation(s);
                  setBrightness(v);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
