import { create } from 'zustand';
import { Workspace, Tool } from '../types';
import { WorkspaceManager } from '../services/workspaceManager';
import { SystemScanner } from '../services/systemScanner';

interface AppState {
  // Data
  workspaces: Workspace[];
  tools: Tool[];
  
  // UI state
  loading: {
    workspaces: boolean;
    scanning: boolean;
    installing: boolean;
  };
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setTools: (tools: Tool[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  
  // Service actions
  loadWorkspaces: () => Promise<void>;
  createWorkspace: (request: any) => Promise<Workspace>;
  scanSystem: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  workspaces: [],
  tools: [],
  loading: {
    workspaces: false,
    scanning: false,
    installing: false,
  },
  
  // Actions
  setWorkspaces: (workspaces) => set({ workspaces }),
  setTools: (tools) => set({ tools }),
  addWorkspace: (workspace) => set((state) => ({ 
    workspaces: [...state.workspaces, workspace] 
  })),
  setLoading: (key, value) => set((state) => ({
    loading: { ...state.loading, [key]: value }
  })),

  // Service actions
  loadWorkspaces: async () => {
    set((state) => ({ loading: { ...state.loading, workspaces: true } }));
    try {
      const workspaceManager = WorkspaceManager.getInstance();
      const workspaces = await workspaceManager.getWorkspaces();
      set({ workspaces });
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, workspaces: false } }));
    }
  },

  createWorkspace: async (request) => {
    const workspaceManager = WorkspaceManager.getInstance();
    const workspace = await workspaceManager.createWorkspace(request);
    set((state) => ({ 
      workspaces: [...state.workspaces, workspace] 
    }));
    return workspace;
  },

  scanSystem: async () => {
    set((state) => ({ loading: { ...state.loading, scanning: true } }));
    try {
      const scanner = new SystemScanner();
      const tools = await scanner.scanSystem((progress: number) => {
        // Progress callback - można dodać progress bar
        console.log(`Scanning progress: ${progress}%`);
      });
      set({ tools });
    } catch (error) {
      console.error('Failed to scan system:', error);
    } finally {
      set((state) => ({ loading: { ...state.loading, scanning: false } }));
    }
  },
}));