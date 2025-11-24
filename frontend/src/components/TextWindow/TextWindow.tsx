import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useGeometryStore } from '@/store/useGeometryStore';
import './TextWindow.css';

export function TextWindow() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const groups = useGeometryStore((state) => state.groups);
  const activeTool = useGeometryStore((state) => state.activeTool);

  if (!isVisible) {
    return (
      <button className="text-window-toggle" onClick={() => setIsVisible(true)} title="Show Text Window (Tab)">
        <ChevronRight size={16} />
      </button>
    );
  }

  return (
    <div className="text-window">
      <div className="text-window-header">
        <div className="text-window-tabs">
          <button
            className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            home
          </button>
        </div>
        <button className="text-window-close" onClick={() => setIsVisible(false)} title="Hide (Tab)">
          <X size={16} />
        </button>
      </div>

      <div className="text-window-content">
        {/* Current Workplane */}
        <div className="text-window-section">
          <div className="property-row-plain">
            <span className="property-label-sub">In plane:</span>
            <a href="#" className="property-link-focus">g002-sketch-in-plane</a>
          </div>
        </div>

        {/* Active Group */}
        <div className="text-window-section">
          <div className="section-title">active</div>
          <div className="section-content">
            <div className="property-row-plain">
              <span className="property-value-main">{activeTool.type}</span>
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="text-window-section">
          <div className="section-title">shown.dof.group-name</div>
          <div className="section-content">
            {groups.length === 0 ? (
              <>
                <div className="group-reference-item">
                  <div className="checkbox-group">
                    <input type="checkbox" id="ref1-ok" className="status-checkbox ok" defaultChecked />
                    <label htmlFor="ref1-ok" className="status-label">ok</label>
                  </div>
                  <a href="#" className="reference-link">g001-#references</a>
                </div>
                <div className="group-reference-item">
                  <div className="checkbox-group">
                    <input type="checkbox" id="ref2-ok" className="status-checkbox ok" defaultChecked />
                    <label htmlFor="ref2-ok" className="status-label">ok</label>
                  </div>
                  <a href="#" className="reference-link">g002-sketch-in-plane</a>
                </div>
              </>
            ) : (
              groups.map((group, index) => (
                <div key={index} className="group-reference-item">
                  <div className="checkbox-group">
                    <input type="checkbox" id={`group-${index}`} className="status-checkbox ok" defaultChecked />
                    <label htmlFor={`group-${index}`} className="status-label">ok</label>
                  </div>
                  <a href="#" className="reference-link">{group.name || `g00${index + 1}-group`}</a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Filter Links */}
        <div className="text-window-section">
          <div className="filter-links">
            <a href="#" className="filter-link">show all</a>
            <a href="#" className="filter-link">only unconstrained</a>
            <a href="#" className="filter-link">hide all</a>
          </div>
        </div>

        {/* Requests Section */}
        <div className="text-window-section">
          <div className="section-title">requests</div>
          <div className="section-content">
            <a href="#" className="entity-link">point (x y z)</a>
            <a href="#" className="entity-link">workplane (normal ref pt)</a>
            <a href="#" className="entity-link">line segment (pt a pt b)</a>
            <a href="#" className="entity-link">cubic (pt/slope 0-3)</a>
            <a href="#" className="entity-link">circle (center radius)</a>
            <a href="#" className="entity-link">arc (center start end)</a>
            <a href="#" className="entity-link">ttf text (pt ttf str)</a>
          </div>
        </div>

        {/* Constraints Section */}
        <div className="text-window-section">
          <div className="section-title">constraints</div>
          <div className="section-content">
            <a href="#" className="constraint-link">points coincident</a>
            <a href="#" className="constraint-link">pt-pt distance</a>
            <a href="#" className="constraint-link">pt-line distance</a>
            <a href="#" className="constraint-link">horizontal</a>
            <a href="#" className="constraint-link">vertical</a>
            <a href="#" className="constraint-link">parallel</a>
            <a href="#" className="constraint-link">perpendicular</a>
            <a href="#" className="constraint-link">equal length</a>
            <a href="#" className="constraint-link">equal angle</a>
            <a href="#" className="constraint-link">equal radius</a>
            <a href="#" className="constraint-link">on point/curve/plane</a>
            <a href="#" className="constraint-link">symmetric</a>
            <a href="#" className="constraint-link">at midpoint</a>
            <a href="#" className="constraint-link">tangent</a>
          </div>
        </div>

        {/* Sketch Statistics */}
        <div className="text-window-section">
          <div className="section-title">sketch</div>
          <div className="section-content">
            <div className="property-row">
              <span className="property-label">DOF:</span>
              <span className="property-value-data">0</span>
            </div>
            <div className="property-row">
              <span className="property-label">points:</span>
              <span className="property-value-data">0</span>
            </div>
            <div className="property-row">
              <span className="property-label">constraints:</span>
              <span className="property-value-data">0</span>
            </div>
            <div className="property-row">
              <span className="property-label">requests:</span>
              <span className="property-value-data">0</span>
            </div>
          </div>
        </div>

        {/* Entity Properties (shown when entity selected) */}
        <div className="text-window-section" style={{ display: 'none' }}>
          <div className="section-title">selected entity</div>
          <div className="section-content">
            <div className="property-row">
              <span className="property-label">type:</span>
              <span className="property-value-main">point</span>
            </div>
            <div className="property-row">
              <span className="property-label">x:</span>
              <span className="property-value-data">0.000</span>
            </div>
            <div className="property-row">
              <span className="property-label">y:</span>
              <span className="property-value-data">0.000</span>
            </div>
            <div className="property-row">
              <span className="property-label">z:</span>
              <span className="property-value-data">0.000</span>
            </div>
          </div>
        </div>

        {/* Measurement (shown when 2 entities selected) */}
        <div className="text-window-section" style={{ display: 'none' }}>
          <div className="section-title">measurement</div>
          <div className="section-content">
            <div className="property-row">
              <span className="property-label">distance:</span>
              <span className="property-value-data">10.000 mm</span>
            </div>
            <div className="property-row">
              <span className="property-label">angle:</span>
              <span className="property-value-data">90.00°</span>
            </div>
          </div>
        </div>

        {/* Solver Status */}
        <div className="text-window-section">
          <div className="section-title">solver</div>
          <div className="section-content">
            <div className="property-row-plain">
              <span className="property-label-sub">status:</span>
              <span className="property-value-success">converged okay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
