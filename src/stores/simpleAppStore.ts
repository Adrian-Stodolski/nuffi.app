import { create } from 'zustand';

interface SimpleAppState {
  // UI state
  loading: {
    workspaces: boolean;
    scanning: boolean;
    installing: boolean;
  };
  
  // Actions
  setLoading: (key: keyof SimpleAppState['loading'], value: boolean) => void;
  
  // Simple actions without external dependencies
  scanSystem: () => Promise<void>;
}

export const useSimpleAppStore = create<SimpleAppState>((set, get) => ({
  // Initial state
  loading: {
    workspaces: false,
    scanning: false,
    installing: false,
  },
  
  // Actions
  setLoading: (key, value) => set((state) => ({
    loading: { ...state.loading, [key]: value }
  })),

  // Simple scan system without external dependencies
  scanSystem: async () => {
    set((state) => ({ loading: { ...state.loading, scanning: true } }));
    
    // Simulate scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    set((state) => ({ loading: { ...state.loading, scanning: false } }));
  },
}));