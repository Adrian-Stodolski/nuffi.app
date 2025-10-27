import { invoke } from '@tauri-apps/api/core';
import { Workspace, WorkspaceConfig, CreateWorkspaceRequest, InstalledTool, WorkspaceType, ToolRequirement } from '../types';

export class WorkspaceManager {
  private static instance: WorkspaceManager;
  private workspaces: Map<string, Workspace> = new Map();
  private activeWorkspace: Workspace | null = null;

  static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager();
    }
    return WorkspaceManager.instance;
  }

  async createWorkspace(request: CreateWorkspaceRequest): Promise<Workspace> {
    try {
      // Try Tauri backend first
      const result = await invoke<Workspace>('create_workspace', { request });
      this.workspaces.set(result.id, result);
      return result;
    } catch (error) {
      console.warn('Tauri backend not available, using local storage:', error);
      // Fallback to browser-based storage
      return this.createWorkspaceLocal(request);
    }
  }

  private createWorkspaceLocal(request: CreateWorkspaceRequest): Workspace {
    const workspace: Workspace = {
      id: this.generateId(),
      name: request.name,
      type: request.workspace_type,
      status: 'inactive',
      tools: request.tools.map((t: ToolRequirement | string) =>
        this.createMockTool(typeof t === 'string' ? t : t.name)
      ),
      config: request.config || this.getDefaultConfig(),
      resource_usage: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network_in: 0,
        network_out: 0
      },
      created_at: new Date(),
      last_active: new Date(),
      user_id: 'local-user'
    };

    this.workspaces.set(workspace.id, workspace);
    this.saveToLocalStorage();
    return workspace;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    try {
      // Try Tauri backend first
      const result = await invoke<Workspace[]>('get_workspaces');
      result.forEach(workspace => {
        this.workspaces.set(workspace.id, workspace);
      });
      return result;
    } catch (error) {
      console.warn('Tauri backend not available, using local storage:', error);
      // Fallback to local storage
      this.loadFromLocalStorage();
      return Array.from(this.workspaces.values());
    }
  }

  async activateWorkspace(id: string): Promise<Workspace> {
    try {
      // Try Tauri backend first
      const result = await invoke<Workspace>('activate_workspace', { id });
      this.activeWorkspace = result;
      this.workspaces.set(id, result);
      return result;
    } catch (error) {
      console.warn('Tauri backend not available, using local activation:', error);
      // Fallback to local activation
      return this.activateWorkspaceLocal(id);
    }
  }

  private activateWorkspaceLocal(id: string): Workspace {
    const workspace = this.workspaces.get(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Deactivate current active workspace
    if (this.activeWorkspace) {
      this.activeWorkspace.status = 'inactive';
      this.workspaces.set(this.activeWorkspace.id, this.activeWorkspace);
    }

    // Activate new workspace
    workspace.status = 'active';
    workspace.last_active = new Date();
    workspace.resource_usage = this.generateMockResourceUsage();
    
    this.activeWorkspace = workspace;
    this.workspaces.set(id, workspace);
    this.saveToLocalStorage();
    
    return workspace;
  }

  async deactivateWorkspace(id: string): Promise<Workspace> {
    try {
      const result = await invoke<Workspace>('deactivate_workspace', { id });
      if (this.activeWorkspace?.id === id) {
        this.activeWorkspace = null;
      }
      this.workspaces.set(id, result);
      return result;
    } catch (error) {
      console.warn('Tauri backend not available, using local deactivation:', error);
      return this.deactivateWorkspaceLocal(id);
    }
  }

  private deactivateWorkspaceLocal(id: string): Workspace {
    const workspace = this.workspaces.get(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    workspace.status = 'inactive';
    workspace.resource_usage = {
      cpu: 0,
      memory: 0,
      disk: workspace.resource_usage.disk, // Keep disk usage
      network_in: 0,
      network_out: 0
    };

    if (this.activeWorkspace?.id === id) {
      this.activeWorkspace = null;
    }

    this.workspaces.set(id, workspace);
    this.saveToLocalStorage();
    return workspace;
  }

  async deleteWorkspace(id: string): Promise<void> {
    try {
      await invoke('delete_workspace', { id });
    } catch (error) {
      console.warn('Tauri backend not available, using local deletion:', error);
    }
    
    if (this.activeWorkspace?.id === id) {
      this.activeWorkspace = null;
    }
    
    this.workspaces.delete(id);
    this.saveToLocalStorage();
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace> {
    try {
      const result = await invoke<Workspace>('update_workspace', { id, updates });
      this.workspaces.set(id, result);
      return result;
    } catch (error) {
      console.warn('Tauri backend not available, using local update:', error);
      return this.updateWorkspaceLocal(id, updates);
    }
  }

  private updateWorkspaceLocal(id: string, updates: Partial<Workspace>): Workspace {
    const workspace = this.workspaces.get(id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const updatedWorkspace = { ...workspace, ...updates };
    this.workspaces.set(id, updatedWorkspace);
    this.saveToLocalStorage();
    return updatedWorkspace;
  }

  getActiveWorkspace(): Workspace | null {
    return this.activeWorkspace;
  }

  // Workspace Templates
  getWorkspaceTemplates(): any[] {
    return [
      {
        id: 'data-science-template',
        name: 'Data Science Workspace',
        description: 'Complete setup for data analysis and machine learning',
        type: 'data-analysis',
        tools: ['Python', 'Jupyter', 'Pandas', 'NumPy', 'Scikit-learn', 'PostgreSQL'],
        downloads: 1250,
        rating: 4.8,
        author_name: 'DataSci Team',
        tags: ['python', 'ml', 'data', 'jupyter']
      },
      {
        id: 'web-dev-template',
        name: 'Full-Stack Web Development',
        description: 'Modern web development with React, Node.js, and PostgreSQL',
        type: 'web-dev',
        tools: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'VS Code'],
        downloads: 2100,
        rating: 4.9,
        author_name: 'WebDev Pro',
        tags: ['react', 'nodejs', 'typescript', 'fullstack']
      },
      {
        id: 'devops-template',
        name: 'DevOps & Infrastructure',
        description: 'Complete DevOps toolkit with Docker, Kubernetes, and monitoring',
        type: 'devops',
        tools: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Prometheus', 'Grafana'],
        downloads: 890,
        rating: 4.7,
        author_name: 'DevOps Master',
        tags: ['docker', 'kubernetes', 'terraform', 'monitoring']
      },
      {
        id: 'mobile-dev-template',
        name: 'Mobile App Development',
        description: 'Cross-platform mobile development with React Native and Flutter',
        type: 'mobile-dev',
        tools: ['React Native', 'Flutter', 'Android Studio', 'Xcode', 'Firebase'],
        downloads: 1560,
        rating: 4.6,
        author_name: 'Mobile Dev Team',
        tags: ['mobile', 'react-native', 'flutter', 'ios', 'android']
      },
      {
        id: 'blockchain-template',
        name: 'Blockchain Development',
        description: 'Smart contract development with Solidity and Web3 tools',
        type: 'blockchain',
        tools: ['Solidity', 'Truffle', 'Ganache', 'MetaMask', 'Web3.js', 'Hardhat'],
        downloads: 720,
        rating: 4.5,
        author_name: 'Blockchain Builder',
        tags: ['blockchain', 'solidity', 'web3', 'ethereum']
      }
    ];
  }

  // Helper methods
  private createMockTool(toolName: string): InstalledTool {
    const toolTypes: Record<string, any> = {
      'Python': { type: 'language', version: '3.11.0', size: 50000000 },
      'Node.js': { type: 'language', version: '18.17.0', size: 75000000 },
      'React': { type: 'package', version: '18.2.0', size: 5000000 },
      'TypeScript': { type: 'package', version: '5.0.0', size: 10000000 },
      'PostgreSQL': { type: 'database', version: '15.2', size: 100000000 },
      'Docker': { type: 'cli', version: '24.0.7', size: 150000000 },
      'VS Code': { type: 'ide', version: '1.85.0', size: 200000000 },
      'Jupyter': { type: 'ide', version: '6.4.0', size: 25000000 },
      'Git': { type: 'cli', version: '2.40.0', size: 30000000 }
    };

    const toolInfo = toolTypes[toolName] || { type: 'package', version: '1.0.0', size: 10000000 };

    return {
      name: toolName,
      type: toolInfo.type,
      version: toolInfo.version,
      path: `/usr/local/bin/${toolName.toLowerCase()}`,
      size: toolInfo.size,
      status: 'installed',
      dependencies: [],
      conflicts: []
    };
  }

  private getDefaultConfig(): WorkspaceConfig {
    return {
      auto_start: false,
      port_mappings: [],
      environment_variables: {},
      startup_commands: [],
      cleanup_commands: [],
      // provide minimal defaults for strict types
      shell_config: {
        default_shell: 'bash',
        available_shells: ['bash'],
        shell_rc_files: {},
        plugins: []
      },
      aliases: {},
      custom_paths: []
    };
  }

  private generateMockResourceUsage() {
    return {
      cpu: Math.random() * 30 + 5, // 5-35%
      memory: Math.random() * 1000 + 200, // 200-1200 MB
      disk: Math.random() * 2000 + 500, // 500-2500 MB
      network_in: Math.random() * 2, // 0-2 MB/s
      network_out: Math.random() * 1 // 0-1 MB/s
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveToLocalStorage(): void {
    try {
      const workspacesArray = Array.from(this.workspaces.values());
      localStorage.setItem('nuffi_workspaces', JSON.stringify(workspacesArray));
      if (this.activeWorkspace) {
        localStorage.setItem('nuffi_active_workspace', this.activeWorkspace.id);
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const workspacesData = localStorage.getItem('nuffi_workspaces');
      if (workspacesData) {
        const workspaces: Workspace[] = JSON.parse(workspacesData);
        workspaces.forEach(workspace => {
          // Convert date strings back to Date objects
          workspace.created_at = new Date(workspace.created_at);
          workspace.last_active = new Date(workspace.last_active);
          this.workspaces.set(workspace.id, workspace);
        });
      }

      const activeWorkspaceId = localStorage.getItem('nuffi_active_workspace');
      if (activeWorkspaceId && this.workspaces.has(activeWorkspaceId)) {
        this.activeWorkspace = this.workspaces.get(activeWorkspaceId)!;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
}

// Export interface for creating workspaces
// (Removed local CreateWorkspaceRequest; using shared type from ../types)