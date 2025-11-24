import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { FloatingMenu, MenuItem } from '@/components/FloatingMenu/FloatingMenu';
import { mainMenuItems } from '@/components/FloatingMenu/menuData';
import './LeftSidebar.css';

export function LeftSidebar() {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [submenu, setSubmenu] = useState<{ items: MenuItem[]; position: { x: number; y: number } } | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const handleMenuClick = () => {
    if (menuBtnRef.current) {
      setShowMainMenu(!showMainMenu);
      setSubmenu(null);
    }
  };

  const handleMainMenuClose = () => {
    setShowMainMenu(false);
    setSubmenu(null);
  };

  const handleSubmenuOpen = (items: MenuItem[], position: { x: number; y: number }) => {
    setSubmenu({ items, position });
  };

  const handleSubmenuClose = () => {
    setSubmenu(null);
  };

  return (
    <div className="left-sidebar">
      <div className="sidebar-header">
        <button className="logo-btn">
          <img
            src="https://www.figma.com/api/mcp/asset/deb59942-5a5e-4580-bec8-9756d525f0c5"
            alt="Logo"
            className="logo-icon"
          />
        </button>
        <div className="task-selector">
          <span className="task-name">Default Task Name</span>
        </div>
        <div className="task-arrow-wrapper">
          <ChevronDown size={16} className="task-arrow" />
        </div>
        <div className="menu-btn-wrapper">
          <button className="menu-btn" ref={menuBtnRef} onClick={handleMenuClick}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
        </div>
      </div>

      {showMainMenu && menuBtnRef.current && (
        <FloatingMenu
          items={mainMenuItems}
          position={{
            x: menuBtnRef.current.getBoundingClientRect().right + 4,
            y: menuBtnRef.current.getBoundingClientRect().top,
          }}
          onClose={handleMainMenuClose}
          onSubmenuOpen={handleSubmenuOpen}
        />
      )}

      {submenu && (
        <FloatingMenu
          items={submenu.items}
          position={submenu.position}
          onClose={handleSubmenuClose}
        />
      )}
    </div>
  );
}
