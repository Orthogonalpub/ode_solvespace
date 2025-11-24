import type { WASMModule } from '@/types/geometry';

let wasmModule: WASMModule | null = null;
let modulePromise: Promise<WASMModule> | null = null;

const USE_MOCK = import.meta.env.DEV || !import.meta.env.VITE_USE_REAL_WASM;

export async function loadWASMModule(): Promise<WASMModule> {
  if (wasmModule) {
    return wasmModule;
  }

  if (modulePromise) {
    return modulePromise;
  }

  modulePromise = new Promise((resolve, reject) => {
    const scriptPath = USE_MOCK ? '/mock-wasm.js' : '/slvs.js';
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = true;

    script.onload = async () => {
      try {
        const solvespace = (window as any).solvespace;
        if (!solvespace) {
          throw new Error('SolveSpace WASM module not found');
        }

        let module;
        if (USE_MOCK) {
          module = await solvespace();
        } else {
          module = await solvespace({
            locateFile: (path: string) => {
              if (path.endsWith('.wasm')) {
                return '/slvs.wasm';
              }
              return path;
            },
          });
        }

        module.Initialize();
        wasmModule = module;
        console.log(`✅ ${USE_MOCK ? 'Mock' : 'Real'} WASM module loaded:`, module.GetVersion());
        resolve(module);
      } catch (error) {
        console.error('Failed to initialize WASM module:', error);
        reject(error);
      }
    };

    script.onerror = () => {
      reject(new Error(`Failed to load WASM module script: ${scriptPath}`));
    };

    document.head.appendChild(script);
  });

  return modulePromise;
}

export function getWASMModule(): WASMModule | null {
  return wasmModule;
}
