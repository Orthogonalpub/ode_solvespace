import { useState, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './LeftToolbar.css';
import { useGeometryStore } from '@/store/useGeometryStore';
import { toolSections, Tool } from './toolDefinitions';

export function LeftToolbar() {
  const setActiveTool = useGeometryStore((state) => state.setActiveTool);
  const activeTool = useGeometryStore((state) => state.activeTool);
  const cancelPendingOperation = useGeometryStore((state) => state.cancelPendingOperation);
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

  const handleToolClick = useCallback((tool: Tool) => {
    // If clicking the same tool, deselect it
    if (activeTool.type === tool.type) {
      cancelPendingOperation();
    } else {
      // Activate the tool with its command
      setActiveTool(tool.type, tool.command);
    }
  }, [activeTool.type, setActiveTool, cancelPendingOperation]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape cancels the current operation
      if (e.key === 'Escape') {
        cancelPendingOperation();
        return;
      }

      // Find matching tool by shortcut
      const key = e.key.toUpperCase();
      const shift = e.shiftKey;

      for (const section of toolSections) {
        for (const tool of section.tools) {
          if (!tool.shortcut) continue;

          const shortcut = tool.shortcut.toUpperCase();
          const needsShift = shortcut.startsWith('SHIFT+');
          const shortcutKey = needsShift ? shortcut.replace('SHIFT+', '') : shortcut;

          if (key === shortcutKey && shift === needsShift) {
            e.preventDefault();
            handleToolClick(tool);
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToolClick, cancelPendingOperation]);

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
                    ? `${tool.description} (${tool.shortcut})`
                    : tool.description || tool.name;

                  return (
                    <button
                      key={toolIndex}
                      className={`tool-btn ${isActive ? 'active' : ''}`}
                      data-tooltip={tooltipText}
                      onClick={() => handleToolClick(tool)}
                      aria-label={tool.name}
                      tabIndex={-1}
                    >
                      <Icon size={16} />
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
