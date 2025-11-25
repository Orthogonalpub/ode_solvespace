import { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useGeometryStore } from '@/store/useGeometryStore';
import './PropertyBrowser.css';

type ViewMode = 'main' | 'lineStyles' | 'view' | 'configuration';

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
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const groups = useGeometryStore((state) => state.groups);
  const activeTool = useGeometryStore((state) => state.activeTool);

  const [lineStyles] = useState<LineStyle[]>([
    { id: 's001', name: '#def-active-grp', color: '#00ff00' },
    { id: 's002', name: '#def-construction', color: '#00ff00' },
    { id: 's003', name: '#def-inactive-grp', color: '#8b6914' },
    { id: 's004', name: '#def-datum', color: '#00ff00' },
    { id: 's005', name: '#def-solid-edge', color: '#c0c0c0' },
    { id: 's006', name: '#def-constraint', color: '#ff00ff' },
    { id: 's007', name: '#def-selected', color: '#ff0000' },
    { id: 's008', name: '#def-hovered', color: '#ffff00' },
    { id: 's009', name: '#def-contour-fill', color: '#000000' },
    { id: 's00a', name: '#def-normals', color: '#008080' },
    { id: 's00b', name: '#def-analyze', color: '#00ffff' },
    { id: 's00c', name: '#def-draw-error', color: '#ff0000' },
    { id: 's00d', name: '#def-dim-solid', color: '#000000' },
    { id: 's00e', name: '#def-hidden-edge', color: '#c0c0c0' },
    { id: 's00f', name: '#def-outline', color: '#c0c0c0' },
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
        <ChevronRight size={16} />
      </button>
    );
  }

  const renderToolbarIcons = () => (
    <div className="property-browser-toolbar">
      <button className="toolbar-icon" title="Link/Unlink">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M7 4L4 7L7 10M9 4L12 7L9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Check/Uncheck">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Circle">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Reference">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 7L11 11" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Edit">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Copy">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="5" y="5" width="8" height="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 11V3H11" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Paste">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="5" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 3H10V5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Box">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 6L8 3L14 6V10L8 13L2 10V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Solid">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="10" height="10" fill="currentColor"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Wireframe">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      <button className="toolbar-icon" title="Hidden Line">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="3" width="10" height="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
        </svg>
      </button>
    </div>
  );

  const renderMainView = () => (
    <div className="property-browser-content">
      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">In plane:</span>
          <a href="#" className="property-link">g002-sketch-in-plane</a>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-primary">active</div>
      </div>

      <div className="property-section">
        <div className="property-section-content">
          <div className="property-label-primary">shown dof group-name</div>

          {groups.length === 0 ? (
            <>
              <div className="group-item">
                <div className="group-checkbox">
                  <input type="checkbox" id="g001-ok" defaultChecked />
                  <label htmlFor="g001-ok" className="checkbox-label ok">ok</label>
                </div>
                <a href="#" className="property-link">g001-#references</a>
              </div>
              <div className="group-item">
                <div className="group-checkbox">
                  <input type="checkbox" id="g001-err" defaultChecked />
                  <label htmlFor="g001-err" className="checkbox-label error">err</label>
                </div>
                <a href="#" className="property-link">g001-#references</a>
              </div>
              <div className="group-item with-line">
                <div className="group-checkbox">
                  <input type="checkbox" id="g002" defaultChecked />
                  <label htmlFor="g002" className="checkbox-label">12</label>
                </div>
                <a href="#" className="property-link">g002-sketch-in-plane</a>
              </div>
            </>
          ) : (
            groups.map((group, index) => (
              <div key={index} className="group-item">
                <div className="group-checkbox">
                  <input type="checkbox" id={`group-${index}`} defaultChecked />
                  <label htmlFor={`group-${index}`} className="checkbox-label ok">ok</label>
                </div>
                <a href="#" className="property-link">{group.name || `g00${index + 1}-group`}</a>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="property-section">
        <div className="filter-links">
          <a href="#" className="filter-link">show all</a>
          <a href="#" className="filter-link">only unconstrained</a>
          <a href="#" className="filter-link">hide all</a>
        </div>
      </div>

      <div className="property-section bottom-buttons">
        <button className="section-button" onClick={() => setViewMode('lineStyles')}>
          line styles
        </button>
        <button className="section-button" onClick={() => setViewMode('view')}>
          view
        </button>
        <button className="section-button" onClick={() => setViewMode('configuration')}>
          configuration
        </button>
      </div>
    </div>
  );

  const renderLineStylesView = () => (
    <div className="property-browser-content">
      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">In plane:</span>
          <span className="property-value">g002-sketch-in-plane</span>
        </div>
      </div>

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
                style={{ backgroundColor: style.color }}
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
          <button className="property-button">change</button>
        </div>
      </div>

      <div className="property-section">
        <a href="#" className="action-link">load factory defaults</a>
      </div>
    </div>
  );

  const renderViewSettings = () => (
    <div className="property-browser-content">
      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">In plane:</span>
          <span className="property-value">g002-sketch-in-plane</span>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-primary">3D view parameters</div>
      </div>

      <div className="property-section">
        <div className="property-label-secondary">overall scale factor</div>
        <div className="property-row">
          <span className="property-value">{viewSettings.scale.toFixed(3)}</span>
          <span className="property-unit">px/mm</span>
          <a href="#" className="property-link-action">edit</a>
        </div>
        <a href="#" className="action-link">set to full scale</a>
      </div>

      <div className="property-section">
        <div className="property-label-secondary">origin (maps to center of screen)</div>
        <div className="property-row">
          <span className="property-value">
            ({viewSettings.origin.map(v => v.toFixed(2)).join(', ')})
          </span>
          <a href="#" className="property-link-action">edit</a>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-secondary">projection onto screen</div>
        <div className="property-subsection">
          <div className="property-row">
            <span className="property-label-tertiary">right</span>
            <span className="property-value">
              ({viewSettings.projection.right.map(v => v.toFixed(3)).join(', ')})
            </span>
            <a href="#" className="property-link-action">edit</a>
          </div>
          <div className="property-row">
            <span className="property-label-tertiary">up</span>
            <span className="property-value">
              ({viewSettings.projection.up.map(v => v.toFixed(3)).join(', ')})
            </span>
            <a href="#" className="property-link-action">edit</a>
          </div>
          <div className="property-row">
            <span className="property-label-tertiary">right</span>
            <span className="property-value">
              ({viewSettings.projection.forward.map(v => v.toFixed(3)).join(', ')})
            </span>
            <a href="#" className="property-link-action">edit</a>
          </div>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-secondary">perspective factor (0 for parallel)</div>
        <div className="property-row">
          <span className="property-value">{viewSettings.perspectiveFactor.toFixed(3)}</span>
          <button className="property-button">change</button>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-secondary">light direction</div>
        {viewSettings.lights.map((light, index) => (
          <div key={index} className="property-row">
            <span className="property-label-tertiary">#{index}</span>
            <span className="property-value">
              ({light.direction.map(v => v.toFixed(2)).join(',')})
            </span>
            <button className="property-button-small">c</button>
            <span className="property-value">{light.intensity.toFixed(2)}</span>
            <button className="property-button-small">c</button>
          </div>
        ))}
        <div className="property-row">
          <span className="property-label-tertiary" style={{ marginLeft: '2rem' }}>ambient lighting</span>
          <span className="property-value">{viewSettings.ambientLight.toFixed(2)}</span>
          <button className="property-button-small">c</button>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-secondary">explode distance</div>
        <div className="property-row">
          <span className="property-value">{viewSettings.explodeDistance.toFixed(2)}</span>
          <button className="property-button">change</button>
        </div>
      </div>
    </div>
  );

  const renderConfigurationView = () => (
    <div className="property-browser-content">
      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">In plane:</span>
          <span className="property-value">g002-sketch-in-plane</span>
        </div>
      </div>

      <div className="property-section">
        <div className="property-label-primary">user color (r,g,b)</div>
        <div className="property-row">
          <span className="property-label-tertiary">#0:</span>
          <div className="color-swatch" style={{ backgroundColor: 'rgb(151,151,151)' }} />
          <span className="property-value">(0.59,0.59,0.59)</span>
          <button className="property-button">change</button>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row">
          <input type="text" className="property-input-small" defaultValue="0.10%" />
          <button className="property-button">change</button>
          <span className="property-value">0.00</span>
          <span className="property-unit">mm</span>
          <span className="property-value">0 triangles</span>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row">
          <input type="text" className="property-input-small" defaultValue="20" />
          <button className="property-button">change</button>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">distances:</span>
          <input type="text" className="property-input-small" defaultValue="2" />
          <button className="property-button">change</button>
          <span className="property-hint">(e.g. '1.23')</span>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row checkbox-row">
          <input type="checkbox" id="si-prefixes" />
          <label htmlFor="si-prefixes">use SI prefixes for distances</label>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row checkbox-row">
          <input type="checkbox" id="export-shaded" defaultChecked />
          <label htmlFor="export-shaded">export shaded 2d triangles</label>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">export canvas size:</span>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="canvas-size" value="fixed" />
              fixed
            </label>
            <label className="radio-label">
              <input type="radio" name="canvas-size" value="auto" defaultChecked />
              auto
            </label>
          </div>
        </div>
      </div>

      <div className="property-section">
        <div className="property-row">
          <span className="property-label-secondary">gl vendor</span>
          <span className="property-value">Webkit</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="property-browser">
      <div className="property-browser-header">
        {renderToolbarIcons()}
        <button
          className="property-browser-close"
          onClick={() => setIsVisible(false)}
          title="Hide Property Browser (Tab)"
        >
          <X size={16} />
        </button>
      </div>

      <div className="property-browser-tabs">
        <button
          className={`tab-button ${viewMode === 'main' ? 'active' : ''}`}
          onClick={() => setViewMode('main')}
        >
          home
        </button>
      </div>

      {viewMode === 'main' && renderMainView()}
      {viewMode === 'lineStyles' && renderLineStylesView()}
      {viewMode === 'view' && renderViewSettings()}
      {viewMode === 'configuration' && renderConfigurationView()}
    </div>
  );
}