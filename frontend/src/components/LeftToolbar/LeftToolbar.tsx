import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './LeftToolbar.css';
import { useGeometryStore } from '@/store/useGeometryStore';
import { toolSections } from './toolDefinitions';

export function LeftToolbar() {
  const setActiveTool = useGeometryStore((state) => state.setActiveTool);
  const activeTool = useGeometryStore((state) => state.activeTool);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="left-toolbar">
      {toolSections.map((section, sectionIndex) => {
        const isCollapsed = collapsedSections.has(sectionIndex);
        return (
          <div key={sectionIndex}>
            <div className="toolbar-section">
              <div
                className="section-header"
                onClick={() => toggleSection(sectionIndex)}
                title={`${isCollapsed ? 'Expand' : 'Collapse'} ${section.title}`}
              >
                <span className="section-title">{section.title}</span>
                <span className={`section-toggle ${isCollapsed ? '' : 'expanded'}`}>
                  <ChevronDown />
                </span>
              </div>
              <div className={`section-tools ${isCollapsed ? 'collapsed' : ''}`}>
                {section.tools.map((tool, toolIndex) => {
                  const Icon = tool.icon;
                  const isActive = activeTool.type === tool.type;
                  const tooltipText = tool.shortcut
                    ? `${tool.name} (${tool.shortcut})`
                    : tool.name;

                  return (
                    <button
                      key={toolIndex}
                      className={`tool-btn ${isActive ? 'active' : ''}`}
                      title={tooltipText}
                      onClick={() => setActiveTool(tool.type as any)}
                      aria-label={tool.name}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
            {sectionIndex < toolSections.length - 1 && <div className="toolbar-divider" />}
          </div>
        );
      })}
    </div>
  );
}
