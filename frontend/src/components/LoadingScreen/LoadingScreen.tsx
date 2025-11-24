import './LoadingScreen.css';

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>ODE Geometry</h2>
        <p>Loading WASM module...</p>
      </div>
    </div>
  );
}
