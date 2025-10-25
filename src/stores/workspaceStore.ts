import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  icon: string;
  color: string;
  gradient: string;
  tools: string[];
  setupTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  downloads?: number;
  rating?: number;
  features?: string[];
  requirements?: {
    os: string[];
    diskSpace: string;
    ram: string;
  };
  status?: 'available' | 'installing' | 'installed' | 'error';
  installProgress?: number;
}

export interface InstallationLog {
  id: string;
  workspaceId: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  step?: string;
}

interface WorkspaceState {
  // Workspace data
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  
  // Installation state
  isInstalling: boolean;
  installationProgress: number;
  currentInstallStep: string;
  installationLogs: InstallationLog[];
  
  // UI state
  selectedCategory: string;
  searchQuery: string;
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Installation actions
  startInstallation: (workspaceId: string) => Promise<void>;
  updateInstallationProgress: (progress: number, step: string) => void;
  addInstallationLog: (log: Omit<InstallationLog, 'id' | 'timestamp'>) => void;
  completeInstallation: (workspaceId: string) => void;
  cancelInstallation: () => void;
  
  // Workspace management
  getWorkspaceById: (id: string) => Workspace | undefined;
  getWorkspacesByCategory: (category: string) => Workspace[];
  searchWorkspaces: (query: string) => Workspace[];
  getInstalledWorkspaces: () => Workspace[];
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      workspaces: [],
      selectedWorkspace: null,
      isInstalling: false,
      installationProgress: 0,
      currentInstallStep: '',
      installationLogs: [],
      selectedCategory: 'all',
      searchQuery: '',

      // Basic setters
      setWorkspaces: (workspaces) => set({ workspaces }),
      setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Installation actions
      startInstallation: async (workspaceId: string) => {
        const workspace = get().getWorkspaceById(workspaceId);
        if (!workspace) return;

        set({
          isInstalling: true,
          installationProgress: 0,
          currentInstallStep: 'Initializing...',
          installationLogs: []
        });

        // Update workspace status
        const updatedWorkspaces = get().workspaces.map(w =>
          w.id === workspaceId 
            ? { ...w, status: 'installing' as const, installProgress: 0 }
            : w
        );
        set({ workspaces: updatedWorkspaces });

        // Add initial log
        get().addInstallationLog({
          workspaceId,
          level: 'info',
          message: `Starting installation of ${workspace.name}`,
          step: 'initialization'
        });

        // Simulate installation process
        try {
          const steps = [
            { name: 'System Check', duration: 2000 },
            { name: 'Downloading Tools', duration: 5000 },
            { name: 'Installing GUI Applications', duration: 8000 },
            { name: 'Installing CLI Tools', duration: 6000 },
            { name: 'Installing Packages', duration: 4000 },
            { name: 'Configuring Environment', duration: 3000 },
            { name: 'Verifying Installation', duration: 2000 }
          ];

          let totalProgress = 0;
          const progressPerStep = 100 / steps.length;

          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            get().updateInstallationProgress(totalProgress, step.name);
            get().addInstallationLog({
              workspaceId,
              level: 'info',
              message: `${step.name}...`,
              step: step.name.toLowerCase().replace(/\s+/g, '_')
            });

            // Simulate step progress
            const stepStartTime = Date.now();
            while (Date.now() - stepStartTime < step.duration) {
              await new Promise(resolve => setTimeout(resolve, 100));
              const stepProgress = Math.min(
                ((Date.now() - stepStartTime) / step.duration) * progressPerStep,
                progressPerStep
              );
              get().updateInstallationProgress(totalProgress + stepProgress, step.name);
            }

            totalProgress += progressPerStep;
            
            get().addInstallationLog({
              workspaceId,
              level: 'success',
              message: `${step.name} completed successfully`,
              step: step.name.toLowerCase().replace(/\s+/g, '_')
            });
          }

          get().completeInstallation(workspaceId);
        } catch (error) {
          get().addInstallationLog({
            workspaceId,
            level: 'error',
            message: `Installation failed: ${error}`,
            step: 'error'
          });

          // Update workspace status to error
          const updatedWorkspaces = get().workspaces.map(w =>
            w.id === workspaceId 
              ? { ...w, status: 'error' as const }
              : w
          );
          set({ workspaces: updatedWorkspaces, isInstalling: false });
        }
      },

      updateInstallationProgress: (progress, step) => {
        set({
          installationProgress: Math.min(progress, 100),
          currentInstallStep: step
        });
      },

      addInstallationLog: (log) => {
        const newLog: InstallationLog = {
          ...log,
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };

        set(state => ({
          installationLogs: [...state.installationLogs, newLog]
        }));
      },

      completeInstallation: (workspaceId) => {
        // Update workspace status to installed
        const updatedWorkspaces = get().workspaces.map(w =>
          w.id === workspaceId 
            ? { ...w, status: 'installed' as const, installProgress: 100 }
            : w
        );

        set({
          workspaces: updatedWorkspaces,
          isInstalling: false,
          installationProgress: 100,
          currentInstallStep: 'Installation Complete!'
        });

        get().addInstallationLog({
          workspaceId,
          level: 'success',
          message: 'Installation completed successfully! 🎉',
          step: 'complete'
        });
      },

      cancelInstallation: () => {
        set({
          isInstalling: false,
          installationProgress: 0,
          currentInstallStep: '',
          installationLogs: []
        });
      },

      // Utility functions
      getWorkspaceById: (id: string) => {
        return get().workspaces.find(w => w.id === id);
      },

      getWorkspacesByCategory: (category: string) => {
        if (category === 'all') return get().workspaces;
        return get().workspaces.filter(w => w.category === category);
      },

      searchWorkspaces: (query: string) => {
        if (!query.trim()) return get().workspaces;
        
        const lowercaseQuery = query.toLowerCase();
        return get().workspaces.filter(w =>
          w.name.toLowerCase().includes(lowercaseQuery) ||
          w.description.toLowerCase().includes(lowercaseQuery) ||
          w.category.toLowerCase().includes(lowercaseQuery) ||
          w.tools.some(tool => tool.toLowerCase().includes(lowercaseQuery))
        );
      },

      getInstalledWorkspaces: () => {
        return get().workspaces.filter(w => w.status === 'installed');
      }
    }),
    {
      name: 'workspace-store'
    }
  )
);