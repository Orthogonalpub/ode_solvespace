import { useGeometryStore } from '@/store/useGeometryStore';
import './StatusBar.css';

export function StatusBar() {
  const wasmModule = useGeometryStore((state) => state.wasmModule);
  const groups = useGeometryStore((state) => state.groups);
  const activeTool = useGeometryStore((state) => state.activeTool);

  return (
    <div className="status-bar">
      <div className="status-section">
        <span className="status-label">Version:</span>
        <span className="status-value">
          {wasmModule?.GetVersion() || 'Not loaded'}
        </span>
      </div>
      <div className="status-section">
        <span className="status-label">Groups:</span>
        <span className="status-value">{groups.length}</span>
      </div>
      <div className="status-section">
        <span className="status-label">Tool:</span>
        <span className="status-value">{activeTool.type}</span>
      </div>
      <div className="status-section status-right">
        <span className="status-ready">● Ready</span>
      </div>
    </div>
  );
}
