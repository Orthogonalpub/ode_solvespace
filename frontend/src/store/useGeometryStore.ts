import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GroupInfo, EntityID, WASMModule } from '@/types/geometry';

interface Tool {
  type: 'select' | 'point' | 'line' | 'circle' | 'arc' | 'rectangle';
  active: boolean;
}

interface GeometryState {
  wasmModule: WASMModule | null;
  groups: GroupInfo[];
  selectedEntities: EntityID[];
  activeTool: Tool;

  setWASMModule: (module: WASMModule) => void;
  loadGroups: () => void;
  selectEntity: (id: EntityID) => void;
  deselectAll: () => void;
  setActiveTool: (type: Tool['type']) => void;
}

export const useGeometryStore = create<GeometryState>()(
  immer((set, get) => ({
    wasmModule: null,
    groups: [],
    selectedEntities: [],
    activeTool: { type: 'select', active: false },

    setWASMModule: (module) => {
      set((state) => {
        state.wasmModule = module;
      });
    },

    loadGroups: () => {
      const { wasmModule } = get();
      if (!wasmModule) return;

      const count = wasmModule.GetGroupCount();
      const groups: GroupInfo[] = [];

      for (let i = 0; i < count; i++) {
        groups.push(wasmModule.GetGroupInfo(i));
      }

      set((state) => {
        state.groups = groups;
      });
    },

    selectEntity: (id) => {
      set((state) => {
        if (!state.selectedEntities.includes(id)) {
          state.selectedEntities.push(id);
        }
      });
    },

    deselectAll: () => {
      set((state) => {
        state.selectedEntities = [];
      });
    },

    setActiveTool: (type) => {
      set((state) => {
        state.activeTool = { type, active: true };
      });
    },
  }))
);
