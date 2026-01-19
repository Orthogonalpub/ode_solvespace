import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GroupInfo, EntityID, WASMModule, WorkplaneInfo } from '@/types/geometry';
import { Command, PendingOperation } from '@/types/geometry';
import { createMockWASMModule } from '@/utils/mockGeometryData';

interface Tool {
  type: string;
  active: boolean;
  command?: Command;
}

interface GeometryState {
  wasmModule: WASMModule | null;
  useMockData: boolean;
  groups: GroupInfo[];
  selectedEntities: EntityID[];
  hoveredEntity: EntityID | null;
  activeTool: Tool;
  pendingOperation: PendingOperation;
  activeWorkplane: WorkplaneInfo | null;

  // Core actions
  setWASMModule: (module: WASMModule) => void;
  enableMockData: () => void;
  loadGroups: () => void;
  refreshGeometry: () => void;

  // Selection actions
  selectEntity: (id: EntityID) => void;
  deselectEntity: (id: EntityID) => void;
  deselectAll: () => void;
  setHoveredEntity: (id: EntityID | null) => void;

  // Tool actions
  setActiveTool: (type: string, command?: Command) => void;
  activateCommand: (command: Command) => void;
  cancelPendingOperation: () => void;

  // Workplane actions
  updateActiveWorkplane: () => void;
}

export const useGeometryStore = create<GeometryState>()(
  immer((set, get) => ({
    wasmModule: null,
    useMockData: false,
    groups: [],
    selectedEntities: [],
    hoveredEntity: null,
    activeTool: { type: 'select', active: false },
    pendingOperation: PendingOperation.NONE,
    activeWorkplane: null,

    setWASMModule: (module) => {
      set((state) => {
        state.wasmModule = module;
        state.useMockData = false;
      });
    },

    enableMockData: () => {
      const mockModule = createMockWASMModule() as unknown as WASMModule;
      set((state) => {
        state.wasmModule = mockModule;
        state.useMockData = true;
      });
      // Load mock data immediately
      get().refreshGeometry();
      console.log('[Store] Mock data enabled - geometry loaded');
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

    refreshGeometry: () => {
      const { loadGroups, updateActiveWorkplane } = get();
      loadGroups();
      updateActiveWorkplane();
    },

    selectEntity: (id) => {
      const { wasmModule } = get();
      if (wasmModule) {
        wasmModule.SelectEntity(id);
      }
      set((state) => {
        if (!state.selectedEntities.includes(id)) {
          state.selectedEntities.push(id);
        }
      });
    },

    deselectEntity: (id) => {
      const { wasmModule } = get();
      if (wasmModule) {
        wasmModule.DeselectEntity(id);
      }
      set((state) => {
        state.selectedEntities = state.selectedEntities.filter((e) => e !== id);
      });
    },

    deselectAll: () => {
      const { wasmModule } = get();
      if (wasmModule) {
        wasmModule.ClearSelection();
      }
      set((state) => {
        state.selectedEntities = [];
      });
    },

    setHoveredEntity: (id) => {
      set((state) => {
        state.hoveredEntity = id;
      });
    },

    setActiveTool: (type, command) => {
      const { activateCommand } = get();
      set((state) => {
        state.activeTool = { type, active: true, command };
      });
      // If tool has a command, activate it in the WASM engine
      if (command !== undefined) {
        activateCommand(command);
      }
    },

    activateCommand: (command) => {
      const { wasmModule, refreshGeometry } = get();
      if (!wasmModule) return;

      try {
        wasmModule.ActivateCommand(command);

        // Update pending operation state
        const pending = wasmModule.GetPendingOperation();
        set((state) => {
          state.pendingOperation = pending as PendingOperation;
        });

        // Refresh geometry after command execution
        refreshGeometry();
      } catch (e) {
        console.error('Failed to activate command:', command, e);
      }
    },

    cancelPendingOperation: () => {
      const { wasmModule } = get();
      if (wasmModule) {
        wasmModule.CancelPendingOperation();
      }
      set((state) => {
        state.pendingOperation = PendingOperation.NONE;
        state.activeTool = { type: 'select', active: false };
      });
    },

    updateActiveWorkplane: () => {
      const { wasmModule } = get();
      if (!wasmModule) return;

      try {
        const wp = wasmModule.GetActiveWorkplane();
        set((state) => {
          state.activeWorkplane = wp;
        });
      } catch (e) {
        // Workplane API might not be available yet
      }
    },
  }))
);
