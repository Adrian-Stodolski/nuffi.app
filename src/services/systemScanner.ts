import { Tool } from '../types';

export class SystemScanner {
  async scanSystem(progressCallback?: (progress: number) => void): Promise<Tool[]> {
    // Simulate scanning progress
    const tools: Tool[] = [];
    const totalSteps = 10;
    
    for (let i = 0; i < totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (progressCallback) {
        progressCallback((i + 1) / totalSteps * 100);
      }
    }

    // Mock detected tools based on platform
    const platform = navigator.platform;
    
    if (platform.includes('Mac')) {
      tools.push(
        {
          id: 'macos',
          name: 'macOS',
          description: 'Operating System',
          version: this.extractMacOSVersion(navigator.userAgent),
          status: 'installed',
          type: 'service'
        },
        {
          id: 'safari',
          name: 'Safari',
          description: 'Web Browser',
          version: this.extractSafariVersion(navigator.userAgent),
          status: 'installed',
          type: 'gui'
        },
        {
          id: 'homebrew',
          name: 'Homebrew',
          description: 'Package Manager',
          status: 'not-installed',
          type: 'package'
        }
      );
    } else if (platform.includes('Win')) {
      tools.push(
        {
          id: 'windows',
          name: 'Windows',
          description: 'Operating System',
          version: this.extractWindowsVersion(navigator.userAgent),
          status: 'installed',
          type: 'service'
        },
        {
          id: 'chocolatey',
          name: 'Chocolatey',
          description: 'Package Manager',
          status: 'not-installed',
          type: 'package'
        }
      );
    } else {
      tools.push(
        {
          id: 'linux',
          name: 'Linux',
          description: 'Operating System',
          status: 'installed',
          type: 'service'
        }
      );
    }

    // Common development tools
    tools.push(
      {
        id: 'nodejs',
        name: 'Node.js',
        description: 'JavaScript Runtime',
        status: 'not-installed',
        type: 'language'
      },
      {
        id: 'python',
        name: 'Python',
        description: 'Programming Language',
        status: 'not-installed',
        type: 'language'
      },
      {
        id: 'git',
        name: 'Git',
        description: 'Version Control System',
        status: 'not-installed',
        type: 'cli'
      },
      {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: 'Code Editor',
        status: 'not-installed',
        type: 'ide'
      },
      {
        id: 'docker',
        name: 'Docker',
        description: 'Containerization Platform',
        status: 'not-installed',
        type: 'container'
      }
    );

    return tools;
  }

  private extractMacOSVersion(userAgent: string): string {
    const match = userAgent.match(/Mac OS X (\d+_\d+_?\d*)/);
    return match ? match[1].replace(/_/g, '.') : 'Unknown';
  }

  private extractWindowsVersion(userAgent: string): string {
    if (userAgent.includes('Windows NT 10.0')) return '10';
    if (userAgent.includes('Windows NT 6.3')) return '8.1';
    if (userAgent.includes('Windows NT 6.2')) return '8';
    if (userAgent.includes('Windows NT 6.1')) return '7';
    return 'Unknown';
  }

  private extractSafariVersion(userAgent: string): string {
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    return match ? match[1] : 'Unknown';
  }
}