import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useGeometryStore } from '@/store/useGeometryStore';
import './PropertyBrowser.css';
import {
  WorkplanesIcon,
  NormalsIcon,
  PointIcon,
  ToggleConstructionIcon,
  ConstraintAngleIcon,
  CubeFrontViewIcon,
  ShadedViewIcon,
  CubeSolidIcon,
  CubeOutlineIcon,
  TriangleMeshIcon,
  OccludedLinesIcon,
} from './PropertyBrowserIcons';
import { ColorPicker } from '../ColorPicker/ColorPicker';

type ViewMode = 'main' | 'lineStyles' | 'view' | 'configuration';

interface ColorPickerState {
  isOpen: boolean;
  position: { x: number; y: number };
  initialColor: string;
  colorKey: string;
}

interface LineStyle {
  id: string;
  name: string;
  color: string;
}

interface ViewSettings {
  scale: number;
  origin: [number, number, number];
  projection: {
    right: [number, number, number];
    up: [number, number, number];
    forward: [number, number, number];
  };
  perspectiveFactor: number;
  lights: {
    direction: [number, number, number];
    intensity: number;
  }[];
  ambientLight: number;
  explodeDistance: number;
}

export function PropertyBrowser() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const groups = useGeometryStore((state) => state.groups);

  // Position and size state for draggable/resizable panel
  const [position, setPosition] = useState({ x: 16, y: 8 });
  const [size, setSize] = useState({ width: 416, height: (window.innerHeight - 16) / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Color picker state
  const [colorPicker, setColorPicker] = useState<ColorPickerState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    initialColor: '#ff0000',
    colorKey: '',
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const minHeight = 200;
  const headerHeight = 56; // Height of header only for minimized state

  // Open color picker
  const openColorPicker = (e: React.MouseEvent, color: string, key: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setColorPicker({
      isOpen: true,
      position: { x: rect.left - 300, y: rect.top },
      initialColor: color,
      colorKey: key,
    });
  };

  // Close color picker
  const closeColorPicker = () => {
    setColorPicker(prev => ({ ...prev, isOpen: false }));
  };

  // Handle drag start - can drag from anywhere except buttons and inputs
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't start drag if clicking on interactive elements
    if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('.property-browser-resize-handle')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (window.innerWidth - position.x - size.width),
      y: e.clientY - position.y,
    });
    e.preventDefault();
  }, [position, size.width]);

  // Handle resize start (bottom edge)
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle mouse move for drag and resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = window.innerWidth - e.clientX + dragOffset.x - size.width;
        const newY = e.clientY - dragOffset.y;

        // Constrain to viewport
        const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
        const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - 100));

        setPosition({ x: constrainedX, y: constrainedY });
      }

      if (isResizing && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const newHeight = e.clientY - rect.top;
        const constrainedHeight = Math.max(minHeight, Math.min(newHeight, window.innerHeight - position.y - 8));
        setSize(prev => ({ ...prev, height: constrainedHeight }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isResizing ? 'ns-resize' : 'move';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, dragOffset, position.y, size.width]);

  const [lineStyles] = useState<LineStyle[]>([
    { id: 's001', name: '#def-active-grp', color: '#d4d4d4' },
    { id: 's002', name: '#def-construction', color: '#2e8b57' },
    { id: 's003', name: '#def-inactive-grp', color: '#8b6914' },
    { id: 's004', name: '#def-datum', color: '#2e8b57' },
    { id: 's005', name: '#def-solid-edge', color: '#c0c0c0' },
    { id: 's006', name: '#def-constraint', color: '#d946ef' },
    { id: 's007', name: '#def-selected', color: '#ef4444' },
    { id: 's008', name: '#def-hovered', color: '#facc15' },
    { id: 's009', name: '#def-contour-fill', color: '#1e293b' },
    { id: 's00a', name: '#def-normals', color: '#22d3ee' },
    { id: 's00b', name: '#def-analyze', color: '#67e8f9' },
    { id: 's00c', name: '#def-draw-error', color: '#ef4444' },
    { id: 's00d', name: '#def-dim-solid', color: '#1e293b' },
    { id: 's00e', name: '#def-hidden-edge', color: '#94a3b8' },
    { id: 's00f', name: '#def-outline', color: '#e2e8f0' },
  ]);

  const [viewSettings] = useState<ViewSettings>({
    scale: 7.559,
    origin: [-0.0, -0.0, -0.0],
    projection: {
      right: [1.0, 0.0, 0.0],
      up: [1.0, 0.0, 0.0],
      forward: [1.0, 0.0, 0.0],
    },
    perspectiveFactor: 0.3,
    lights: [
      { direction: [-1.0, 1.0, 0.0], intensity: 1.0 },
      { direction: [1.0, 0.0, 0.0], intensity: 0.5 },
    ],
    ambientLight: 0.3,
    explodeDistance: 1.0,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) {
    return (
      <button
        className="property-browser-toggle"
        onClick={() => setIsVisible(true)}
        title="Show Property Browser (Tab)"
      >
        <ChevronLeft size={16} />
      </button>
    );
  }

  const renderToolbarIcons = () => (
    <div className="property-browser-toolbar">
      <button className="toolbar-icon" data-tooltip="Show / hide workplanes from inactive groups">
        <WorkplanesIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Show / hide normals on solid model">
        <NormalsIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Show / hide point entities">
        <PointIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Show / hide construction entities">
        <ToggleConstructionIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Show / hide constraint annotations">
        <ConstraintAngleIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Make faces / edges selectable">
        <CubeFrontViewIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Shaded view of solid model">
        <ShadedViewIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Hide edges of solid model">
        <CubeSolidIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Hide outlines of solid model">
        <CubeOutlineIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Show triangle mesh of solid model">
        <TriangleMeshIcon size={16} />
      </button>
      <button className="toolbar-icon" data-tooltip="Don't draw occluded lines">
        <OccludedLinesIcon size={16} />
      </button>
    </div>
  );

  const renderMainView = () => (
    <div className="property-browser-content">
      {/* "active" label */}
      <div className="history-row">
        <div className="history-label">active</div>
      </div>

      {/* "shown dof group-name" with guideline */}
      <div className="history-row with-guideline">
        <div className="guideline-segment" />
        <div className="history-label">shown dof group-name</div>
      </div>

      {/* Group list items */}
      {groups.length === 0 ? (
        <>
          <div className="history-row group-row">
            <div className="guideline-vertical" />
            <div className="group-checkbox">
              <input type="checkbox" id="g001-ok" defaultChecked />
            </div>
            <span className="status-label ok">ok</span>
            <a href="#" className="group-link">g001- #references</a>
          </div>
          <div className="history-row group-row">
            <div className="guideline-vertical" />
            <div className="group-checkbox">
              <input type="checkbox" id="g001-err" defaultChecked />
            </div>
            <span className="status-label error">err</span>
            <a href="#" className="group-link">g001- #references</a>
          </div>
          <div className="history-row group-row last-item">
            <div className="guideline-corner" />
            <div className="group-checkbox">
              <input type="checkbox" id="g002" defaultChecked />
            </div>
            <span className="status-label">12</span>
            <a href="#" className="group-link">g002- sketch-in plane</a>
          </div>
        </>
      ) : (
        groups.map((group, index) => (
          <div key={index} className={`history-row group-row ${index === groups.length - 1 ? 'last-item' : ''}`}>
            <div className={index === groups.length - 1 ? 'guideline-corner' : 'guideline-vertical'} />
            <div className="group-checkbox">
              <input type="checkbox" id={`group-${index}`} defaultChecked />
            </div>
            <span className="status-label ok">ok</span>
            <a href="#" className="group-link">{group.name || `g00${index + 1}-group`}</a>
          </div>
        ))
      )}

      {/* Filter links */}
      <div className="history-row filter-row">
        <button className="filter-button">show all</button>
        <span className="slash-divider" />
        <button className="filter-button">only unconstrained</button>
        <span className="slash-divider" />
        <button className="filter-button">hide all</button>
      </div>

      {/* Bottom navigation buttons */}
      <div className="history-row filter-row">
        <button className="filter-button" onClick={() => setViewMode('lineStyles')}>
          line styles
        </button>
        <span className="slash-divider" />
        <button className="filter-button" onClick={() => setViewMode('view')}>
          view
        </button>
        <span className="slash-divider" />
        <button className="filter-button" onClick={() => setViewMode('configuration')}>
          configuration
        </button>
      </div>
    </div>
  );

  const renderLineStylesView = () => (
    <div className="property-browser-content">
      <div className="property-section">
        <div className="style-list-header">
          <span className="style-header-color">color</span>
          <span className="style-header-name">style name</span>
        </div>

        <div className="style-list">
          {lineStyles.map((style) => (
            <div key={style.id} className="style-item">
              <div
                className="style-color-box"
                style={{ backgroundColor: style.color, cursor: 'pointer' }}
                onClick={(e) => openColorPicker(e, style.color, `style-${style.id}`)}
              />
              <a href="#" className="style-link">
                {style.id}-{style.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="property-section">
        <a href="#" className="action-link">create a new custom style</a>
      </div>

      <div className="property-section">
        <div className="property-label-primary">background color (r,g,b)</div>
        <div className="property-row">
          <input type="text" className="property-input" defaultValue="0.00, 0.00, 0.00" />
          <button
            className="property-button"
            onClick={(e) => openColorPicker(e, '#000000', 'background-color')}
          >
            change
          </button>
        </div>
      </div>

      <div className="property-section">
        <a href="#" className="action-link">load factory defaults</a>
      </div>
    </div>
  );

  const renderViewSettings = () => (
    <div className="property-browser-content">
      {/* 3D view parameters header */}
      <div className="property-section">
        <div className="property-label-primary">3D view parameters</div>
      </div>

      {/* Overall scale factor */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">overall scale factor</span>
        </div>
        <div className="view-row-input">
          <div className="action-spacer" />
          <div className="value-field">
            <span className="value-field-text">{viewSettings.scale.toFixed(3)}</span>
            <div className="value-field-addon">px/mm</div>
          </div>
          <button className="property-button">edit</button>
        </div>
        <div className="view-row" style={{ minHeight: '40px', paddingLeft: '36px' }}>
          <button className="property-button" style={{ padding: '8px 16px' }}>set to full scale</button>
        </div>
      </div>

      {/* Origin */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">origin (maps to center of screen)</span>
        </div>
        <div className="view-row-input">
          <div className="action-spacer" />
          <div className="value-field">
            <span className="value-field-text">
              ({viewSettings.origin.map(v => v.toFixed(2)).join(', ')})
            </span>
          </div>
          <button className="property-button">edit</button>
        </div>
      </div>

      {/* Projection onto screen */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">projection onto screen</span>
        </div>
        <div className="property-subsection">
          <div className="view-labeled-row">
            <div className="action-spacer" />
            <span className="view-label-fixed">right</span>
            <div className="value-divider" />
            <div className="value-field">
              <span className="value-field-text">
                ({viewSettings.projection.right.map(v => v.toFixed(3)).join(', ')})
              </span>
            </div>
            <button className="property-button">edit</button>
          </div>
          <div className="view-labeled-row">
            <div className="action-spacer" />
            <span className="view-label-fixed">up</span>
            <div className="value-divider" />
            <div className="value-field">
              <span className="value-field-text">
                ({viewSettings.projection.up.map(v => v.toFixed(3)).join(', ')})
              </span>
            </div>
            <button className="property-button">edit</button>
          </div>
          <div className="view-labeled-row">
            <div className="action-spacer" />
            <span className="view-label-fixed">right</span>
            <div className="value-divider" />
            <div className="value-field">
              <span className="value-field-text">
                ({viewSettings.projection.forward.map(v => v.toFixed(3)).join(', ')})
              </span>
            </div>
            <button className="property-button">edit</button>
          </div>
        </div>
      </div>

      {/* Perspective factor */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">perspective factor (0 for parallel)</span>
        </div>
        <div className="view-row-input">
          <div className="action-spacer" />
          <div className="value-field">
            <span className="value-field-text">{viewSettings.perspectiveFactor.toFixed(3)}</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Light direction */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">light direction</span>
        </div>
        {viewSettings.lights.map((light, index) => (
          <div key={index} className="view-light-row">
            <div className="view-light-left">
              <div className="action-spacer" />
              <span className="view-light-label">#{index}</span>
              <div className="value-divider" />
              <div className="value-field">
                <span className="value-field-text">
                  ({light.direction.map(v => v.toFixed(2)).join(' ,')})
                </span>
              </div>
              <button className="property-button-small">c</button>
            </div>
            <div className="view-light-right">
              <div className="value-field view-light-value">
                <span className="value-field-text">{light.intensity.toFixed(2)}</span>
              </div>
              <button className="property-button-small">c</button>
            </div>
          </div>
        ))}
        {/* Ambient lighting row */}
        <div className="view-ambient-row">
          <div className="view-ambient-left">
            <div className="action-spacer" />
            <span className="view-light-label" style={{ opacity: 0 }}>#1</span>
            <div className="value-divider" style={{ opacity: 0 }} />
            <span className="view-ambient-label">ambient lighting</span>
          </div>
          <div className="view-light-right">
            <div className="value-field view-light-value">
              <span className="value-field-text">{viewSettings.ambientLight.toFixed(2)}</span>
            </div>
            <button className="property-button-small">c</button>
          </div>
        </div>
      </div>

      {/* Explode distance */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">explode distance</span>
        </div>
        <div className="view-row-input">
          <div className="action-spacer" />
          <div className="value-field">
            <span className="value-field-text">{viewSettings.explodeDistance.toFixed(2)}</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>
    </div>
  );

  const renderConfigurationView = () => (
    <div className="property-browser-content">
      {/* User color section */}
      <div className="property-section">
        <div className="property-label-primary">user color (r,g,b)</div>
        {[
          { id: '#0', color: '(0.59,0.59,0.59)', rgb: 'rgb(151,151,151)', hex: '#979797' },
          { id: '#1', color: '(0.75,0.75,0.55)', rgb: 'rgb(191,191,140)', hex: '#bfbf8c' },
          { id: '#2', color: '(0.12,0.12,0.12)', rgb: 'rgb(31,31,31)', hex: '#1f1f1f' },
          { id: '#3', color: '(0.56,0.00,0.00)', rgb: 'rgb(143,0,0)', hex: '#8f0000' },
          { id: '#4', color: '(0.00,0.39,0.00)', rgb: 'rgb(0,99,0)', hex: '#006300' },
          { id: '#5', color: '(0.00,0.5,0.31)', rgb: 'rgb(0,128,79)', hex: '#00804f' },
          { id: '#6', color: '(0.00,0.0,0.64)', rgb: 'rgb(0,0,163)', hex: '#0000a3' },
          { id: '#7', color: '(0.30,0.00,0.30)', rgb: 'rgb(77,0,77)', hex: '#4d004d' },
        ].map((item) => (
          <div key={item.id} className="config-color-row">
            <div className="action-spacer" />
            <span className="config-color-label">{item.id}</span>
            <div className="value-divider" />
            <div className="config-color-swatch" style={{ backgroundColor: item.rgb }} />
            <div className="value-field" style={{ flex: 1 }}>
              <span className="value-field-text">{item.color}</span>
            </div>
            <button
              className="property-button"
              onClick={(e) => openColorPicker(e, item.hex, `user-color-${item.id}`)}
            >
              change
            </button>
          </div>
        ))}
      </div>

      {/* Chord tolerance */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">chord tolerance (in percent)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ width: '80px', flex: 'none' }}>
            <span className="value-field-text">0.10%</span>
          </div>
          <button className="property-button">change</button>
          <div className="value-divider" />
          <span className="config-info-text">0.00</span>
          <span className="config-unit">mm</span>
          <span className="config-info-text">0 triangles</span>
        </div>
      </div>

      {/* Max piecewise linear segments */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">max piecewise linear segments</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">20</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Export chord tolerance */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">export chord tolerance (in mm)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">0.00</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Export max piecewise linear segments */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">export max piecewise linear segments</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">64</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Snap grid spacing */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">snap grid spacing</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">5.00</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Digits after decimal point */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">digits after decimal point to show</span>
        </div>
        <div className="config-labeled-row">
          <div className="action-spacer" />
          <span className="config-row-label">distances:</span>
          <div className="value-divider" />
          <div className="value-field" style={{ width: '124px', flex: 'none' }}>
            <span className="value-field-text">2</span>
          </div>
          <button className="property-button">change</button>
          <span className="config-hint">(e.g. 1.23)</span>
        </div>
        <div className="config-labeled-row">
          <div className="action-spacer" />
          <span className="config-row-label">angles:</span>
          <div className="value-divider" />
          <div className="value-field" style={{ width: '124px', flex: 'none' }}>
            <span className="value-field-text">2</span>
          </div>
          <button className="property-button">change</button>
          <span className="config-hint">(e.g. 1.23)</span>
        </div>
        <div className="config-checkbox-row">
          <input type="checkbox" id="si-prefixes" className="config-checkbox" />
          <label htmlFor="si-prefixes" className="config-checkbox-label">use SI prefixes for distances</label>
        </div>
      </div>

      {/* Export scale factor */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">export scale factor (1=1mm, 1.26.4=1inch)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">1.0000</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Cutter radius offset */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">cutter radius offset (0=no offset)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">0.00</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Export checkboxes */}
      <div className="property-section">
        <div className="config-checkbox-row">
          <input type="checkbox" id="export-shaded-2d" className="config-checkbox" />
          <label htmlFor="export-shaded-2d" className="config-checkbox-label">export shaded 2d triangles</label>
        </div>
        <div className="config-checkbox-row">
          <input type="checkbox" id="export-piecewise" className="config-checkbox" />
          <label htmlFor="export-piecewise" className="config-checkbox-label">export curves as piecewise linear</label>
        </div>
        <div className="config-checkbox-row">
          <input type="checkbox" id="fix-white" className="config-checkbox" />
          <label htmlFor="fix-white" className="config-checkbox-label">fix white exported lines</label>
        </div>
        <div className="config-checkbox-row">
          <input type="checkbox" id="export-bg-color" className="config-checkbox" />
          <label htmlFor="export-bg-color" className="config-checkbox-label">export background color</label>
        </div>
      </div>

      {/* Export canvas size */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">export canvas size:</span>
          <span className="config-radio-inline">
            <input type="radio" name="canvas-size" value="fixed" id="canvas-fixed" />
            <label htmlFor="canvas-fixed">fixed</label>
          </span>
          <span className="config-radio-inline">
            <input type="radio" name="canvas-size" value="auto" id="canvas-auto" defaultChecked />
            <label htmlFor="canvas-auto">auto</label>
          </span>
        </div>
        <div className="view-label-row" style={{ paddingLeft: '16px' }}>
          <span className="config-sub-label">(by margins around exported geometry)</span>
        </div>
        {['left', 'right', 'bottom', 'top'].map((side) => (
          <div key={side} className="config-labeled-row">
            <div className="action-spacer" />
            <span className="config-row-label">{side}:</span>
            <div className="value-divider" />
            <div className="value-field" style={{ flex: 1 }}>
              <span className="value-field-text">5.00</span>
            </div>
            <button className="property-button">change</button>
          </div>
        ))}
      </div>

      {/* Exported g code parameters */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">exported g code parameters</span>
        </div>
        {[
          { label: 'depth:', value: '10.00' },
          { label: 'passes:', value: '1' },
          { label: 'feed:', value: '10.00' },
          { label: 'plunge fd:', value: '10.00' },
        ].map((item) => (
          <div key={item.label} className="config-labeled-row">
            <div className="action-spacer" />
            <span className="config-row-label">{item.label}</span>
            <div className="value-divider" />
            <div className="value-field" style={{ flex: 1 }}>
              <span className="value-field-text">{item.value}</span>
            </div>
            <button className="property-button">change</button>
          </div>
        ))}
      </div>

      {/* Additional checkboxes */}
      <div className="property-section">
        {[
          'draw triangle back faces in red',
          'check sketch for closed contour',
          'show areas of closed contours',
          'enable automatic line constraints',
          'use camera mouse navigation',
          'use turntable mouse navigation',
          'edit newly added dimensions',
          'arc default to diameter',
          'display the full path in the title bar',
        ].map((label, index) => (
          <div key={index} className="config-checkbox-row">
            <input type="checkbox" id={`checkbox-${index}`} className="config-checkbox" />
            <label htmlFor={`checkbox-${index}`} className="config-checkbox-label">{label}</label>
          </div>
        ))}
      </div>

      {/* Autosave interval */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">autosave interval (in minutes)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">5</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Redundant constraint timeout */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">redundant constraint timeout (in ms)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">1000</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* Animation speed */}
      <div className="property-section">
        <div className="view-label-row">
          <span className="property-label-secondary">animation speed (0=no, 8=to-disktate)</span>
        </div>
        <div className="config-input-row">
          <div className="action-spacer" />
          <div className="value-field" style={{ flex: 1 }}>
            <span className="value-field-text">800</span>
          </div>
          <button className="property-button">change</button>
        </div>
      </div>

      {/* GL info */}
      <div className="property-section">
        <div className="config-info-row">
          <span className="config-row-label">gl vendor</span>
          <div className="value-divider" />
          <span className="config-info-value">Webkit</span>
        </div>
        <div className="config-info-row">
          <span className="config-row-label">renderer</span>
          <div className="value-divider" />
          <span className="config-info-value">Webkit WebGL</span>
        </div>
        <div className="config-info-row">
          <span className="config-row-label">version</span>
          <div className="value-divider" />
          <span className="config-info-value">OpenGL ES 2.0 (WebGL 1.0)</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={panelRef}
      className={`property-browser ${isDragging ? 'dragging' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        right: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? `${headerHeight}px` : `${size.height}px`,
      }}
      onMouseDown={handleDragStart}
    >
      <div className="property-browser-header">
        <button
          className="property-browser-resize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M0 3H6M3 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
              <path d="M0 1H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        {renderToolbarIcons()}
      </div>

      {!isMinimized && (
        <>
          <div className="property-browser-divider" />

          <div className="property-browser-body">
            <div className="property-browser-tabs">
              <button
                className="tab-button"
                onClick={() => setViewMode('main')}
              >
                home
              </button>
              <span className="breadcrumb-current">In plane: g002-sketch-in plane</span>
            </div>

            {viewMode === 'main' && renderMainView()}
            {viewMode === 'lineStyles' && renderLineStylesView()}
            {viewMode === 'view' && renderViewSettings()}
            {viewMode === 'configuration' && renderConfigurationView()}
          </div>

          {/* Resize handle at bottom */}
          <div
            className="property-browser-resize-handle"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          />
        </>
      )}

      {/* Color Picker */}
      {colorPicker.isOpen && (
        <ColorPicker
          initialColor={colorPicker.initialColor}
          position={colorPicker.position}
          onClose={closeColorPicker}
          onColorChange={(color) => {
            console.log('Color changed:', colorPicker.colorKey, color);
          }}
        />
      )}
    </div>
  );
}