import { Share2, MoreVertical, ZoomIn, ChevronDown, Box } from 'lucide-react';
import { useGeometryStore } from '@/store/useGeometryStore';
import './TopBar.css';

export function TopBar() {
  const enableMockData = useGeometryStore((state) => state.enableMockData);
  const useMockData = useGeometryStore((state) => state.useMockData);
  const groups = useGeometryStore((state) => state.groups);

  const handleLoadMockData = () => {
    enableMockData();
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="cursor-status-btn" title="Cursor: Pointer">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1.5 1L4.5 10L6 6L10 4.5L1.5 1Z" fill="#1b5d8d" stroke="#1b5d8d" strokeWidth="0.5"/>
          </svg>
        </button>
        <div className="view-controls">
          <button className="icon-btn" title="Zoom Fit">
            <ZoomIn size={16} />
          </button>
          <button className="icon-btn" title="More">
            <MoreVertical size={16} />
          </button>
        </div>
        {/* Mock Data Button for Testing */}
        <button
          className="icon-btn"
          onClick={handleLoadMockData}
          title={useMockData ? `Mock Data Active (${groups.length} groups)` : 'Load Mock Data'}
          style={{
            marginLeft: '8px',
            background: useMockData ? '#2172ab' : undefined,
            color: useMockData ? 'white' : undefined,
          }}
        >
          <Box size={16} />
        </button>
      </div>

      <div className="divider" />

      <div className="top-bar-right">
        <div className="collab-container">
          <button className="share-btn">
            <Share2 size={16} />
            <span>Share</span>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.69 6.89L4.5 1L7.31 6.89H1.69Z" fill="white"/>
              <rect x="3.5" y="7.5" width="2" height="2.5" fill="white"/>
            </svg>
          </button>
          <div className="collab-divider" />
          <div className="user-avatar">
            <div className="avatar-circle">U</div>
            <ChevronDown size={16} className="avatar-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
