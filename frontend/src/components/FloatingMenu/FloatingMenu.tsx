import { ChevronRight } from 'lucide-react';
import './FloatingMenu.css';

export interface MenuItem {
  label?: string;
  shortcut?: string;
  onClick?: () => void;
  submenu?: MenuItem[];
  divider?: boolean;
  highlighted?: boolean;
}

interface FloatingMenuProps {
  items: MenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  onSubmenuOpen?: (submenu: MenuItem[], position: { x: number; y: number }) => void;
}

export function FloatingMenu({ items, position, onClose, onSubmenuOpen }: FloatingMenuProps) {
  const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
    if (item.submenu && onSubmenuOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      onSubmenuOpen(item.submenu, { x: rect.right + 4, y: rect.top });
    } else if (item.onClick) {
      item.onClick();
      onClose();
    }
  };

  return (
    <>
      <div className="floating-menu-overlay" onClick={onClose} />
      <div
        className="floating-menu"
        style={{ left: position.x, top: position.y }}
      >
        {items.map((item, index) => (
          item.divider ? (
            <div key={index} className="menu-divider">
              <div className="menu-divider-line" />
            </div>
          ) : (
            <div
              key={index}
              className={`menu-item ${item.highlighted ? 'highlighted' : ''}`}
              onClick={(e) => handleItemClick(item, e)}
            >
              <div className="menu-item-content">
                <span className="menu-item-label">{item.label}</span>
                {item.shortcut && (
                  <span className="menu-item-shortcut">{item.shortcut}</span>
                )}
                {item.submenu && (
                  <ChevronRight size={8} className="menu-item-arrow" />
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  );
}
