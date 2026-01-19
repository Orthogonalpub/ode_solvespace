import { useEffect, useState } from 'react';
import { loadWASMModule } from '@/api/wasmLoader';
import { useGeometryStore } from '@/store/useGeometryStore';
import { LeftSidebar } from '@/components/LeftSidebar/LeftSidebar';
import { LeftToolbar } from '@/components/LeftToolbar/LeftToolbar';
import { TopBar } from '@/components/TopBar/TopBar';
import { Viewport } from '@/components/Viewport/Viewport';
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';
import { PropertyBrowser } from '@/components/PropertyBrowser/PropertyBrowser';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setWASMModule = useGeometryStore((state) => state.setWASMModule);
  const loadGroups = useGeometryStore((state) => state.loadGroups);
  const enableMockData = useGeometryStore((state) => state.enableMockData);
  const useMockData = useGeometryStore((state) => state.useMockData);

  useEffect(() => {
    async function initWASM() {
      try {
        const module = await loadWASMModule();
        setWASMModule(module);
        loadGroups();
        console.log('WASM ready:', module.GetVersion());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load WASM module:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    initWASM();
  }, [setWASMModule, loadGroups]);

  const handleUseMockData = () => {
    enableMockData();
    setError(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && !useMockData) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h2>Failed to Load WASM</h2>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={() => window.location.reload()}>Reload</button>
            <button
              onClick={handleUseMockData}
              style={{ background: '#2172ab' }}
            >
              Use Mock Data
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
            Mock data simulates geometry for testing the rendering system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <LeftToolbar />
      <div className="viewport-container">
        <Viewport />
      </div>

      {/* Floating UI elements */}
      <LeftSidebar />
      <TopBar />
      <PropertyBrowser />
    </div>
  );
}

export default App;
