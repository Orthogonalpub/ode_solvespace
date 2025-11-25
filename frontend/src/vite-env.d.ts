/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_USE_REAL_WASM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
