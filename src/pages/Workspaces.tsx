import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceSelection } from '../components/workspace/WorkspaceSelection';
import { WorkspaceCard } from '../components/workspace/WorkspaceCard';
import { InstallationWizard } from '../components/installation/InstallationWizard';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { Code, Database, Shield, Rocket, Smartphone, Gamepad2, Brain, Blocks, Monitor } from 'lucide-react';
import { ThemedWorkspace } from '../types/workspace';

// Initial workspace data - will be moved to API/database later
const initialWorkspaces: ThemedWorkspace[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    category: 'Web Development',
    description: 'Modern web development with React, Vue, and cutting-edge tools',
    longDescription: 'Complete frontend development environment with React, Vue, Angular, and all modern web technologies. Includes pre-configured build tools, testing frameworks, and deployment pipelines.',
    icon: <Code className="w-8 h-8" />,
    color: 'from-cyan-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
    tools: ['VS Code', 'Node.js 20', 'React 18', 'Vue 3', 'TailwindCSS', 'Vite', 'Chrome DevTools', 'Figma', 'Postman'],
    setupTime: '12-15 min',
    difficulty: 'Beginner',
    downloads: 15420,
    rating: 4.9,
    features: [
      'Pre-configured VS Code with extensions',
      'Node.js 20 LTS with npm, yarn, pnpm',
      'React, Vue, Angular starter templates',
      'TailwindCSS and modern CSS tools',
      'ESLint, Prettier, and code formatting',
      'Chrome with developer extensions',
      'Figma desktop for design handoff',
      'Postman for API testing'
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Ubuntu 20.04+'],
      diskSpace: '8 GB',
      ram: '8 GB recommended'
    }
  },
  {
    id: 'backend',
    name: 'Backend Development',
    category: 'Server Development',
    description: 'Server-side development with APIs, databases, and microservices',
    longDescription: 'Complete backend development stack with Node.js, Python, databases, and containerization. Perfect for building scalable APIs and microservices.',
    icon: <Database className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    tools: ['VS Code', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'Postman', 'DBeaver'],
    setupTime: '15-18 min',
    difficulty: 'Intermediate',
    downloads: 12850,
    rating: 4.8,
    features: [
      'Node.js and Python environments',
      'Docker Desktop with containers',
      'PostgreSQL, MongoDB, Redis databases',
      'Express, FastAPI frameworks',
      'API testing with Postman',
      'Database GUI with DBeaver',
      'Docker Compose templates',
      'Microservices boilerplate'
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Ubuntu 20.04+'],
      diskSpace: '12 GB',
      ram: '16 GB recommended'
    }
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'Analytics',
    description: 'Data analysis, visualization, and machine learning workflows',
    longDescription: 'Complete data science environment with Jupyter, Python, R, and all major ML libraries. Ready for data analysis, visualization, and machine learning projects.',
    icon: <Brain className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    tools: ['Jupyter Lab', 'Python', 'R Studio', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
    setupTime: '18-20 min',
    difficulty: 'Intermediate',
    downloads: 8920,
    rating: 4.7,
    features: [
      'Jupyter Lab with extensions',
      'Python data science stack',
      'R and RStudio Desktop',
      'Machine learning libraries',
      'Data visualization tools',
      'Sample datasets included',
      'Notebook templates',
      'Statistical analysis tools'
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Ubuntu 20.04+'],
      diskSpace: '15 GB',
      ram: '16 GB recommended'
    }
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Security',
    description: 'Penetration testing, security analysis, and ethical hacking',
    longDescription: 'Professional cybersecurity toolkit with penetration testing tools, network analysis, and security frameworks for ethical hacking and security research.',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-red-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
    tools: ['Burp Suite', 'Wireshark', 'Metasploit', 'Nmap', 'OWASP ZAP', 'John the Ripper', 'Hashcat', 'Ghidra'],
    setupTime: '20-25 min',
    difficulty: 'Advanced',
    downloads: 5640,
    rating: 4.6,
    features: [
      'Professional penetration testing tools',
      'Network analysis with Wireshark',
      'Web application security testing',
      'Password cracking utilities',
      'Reverse engineering tools',
      'Vulnerable VMs for practice',
      'Security frameworks',
      'Forensics tools'
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Ubuntu 20.04+'],
      diskSpace: '25 GB',
      ram: '16 GB recommended'
    }
  },
  {
    id: 'devops',
    name: 'DevOps Engineering',
    category: 'Infrastructure',
    description: 'Container orchestration, CI/CD, and cloud infrastructure',
    longDescription: 'Complete DevOps toolkit with Kubernetes, Docker, Terraform, and cloud tools. Perfect for infrastructure automation and deployment pipelines.',
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-blue-500 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
    tools: ['Docker', 'Kubernetes', 'Terraform', 'AWS CLI', 'kubectl', 'Helm', 'Grafana', 'Prometheus', 'Jenkins'],
    setupTime: '20-25 min',
    difficulty: 'Advanced',
    downloads: 7320,
    rating: 4.8,
    features: [
      'Container orchestration with K8s',
      'Infrastructure as Code with Terraform',
      'Cloud CLI tools (AWS, GCP, Azure)',
      'Monitoring with Grafana/Prometheus',
      'CI/CD pipeline templates',
      'Helm charts and manifests',
      'Local development clusters',
      'DevOps best practices'
    ],
    requirements: {
      os: ['Windows 10+', 'macOS 10.15+', 'Ubuntu 20.04+'],
      diskSpace: '20 GB',
      ram: '16 GB recommended'
    }
  }
];

type ViewState = 'selection' | 'details' | 'installation' | 'complete';

export const Workspaces: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('selection');
  const [selectedWorkspace, setSelectedWorkspace] = useState<ThemedWorkspace | null>(null);

  const handleWorkspaceSelect = (workspace: ThemedWorkspace) => {
    setSelectedWorkspace(workspace);
    setCurrentView('details');
  };

  const handleInstallStart = () => {
    setCurrentView('installation');
  };

  const handleInstallComplete = () => {
    setCurrentView('complete');
  };

  const handleBack = () => {
    setCurrentView('selection');
    setSelectedWorkspace(null);
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {currentView === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorkspaceSelection 
              workspaces={initialWorkspaces}
              onWorkspaceSelect={handleWorkspaceSelect}
            />
          </motion.div>
        )}

        {currentView === 'details' && selectedWorkspace && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorkspaceCard
              workspace={selectedWorkspace}
              onInstall={handleInstallStart}
              onClose={handleBack}
            />
          </motion.div>
        )}

        {currentView === 'installation' && selectedWorkspace && (
          <motion.div
            key="installation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InstallationWizard
              workspace={selectedWorkspace}
              onComplete={handleInstallComplete}
              onCancel={handleBack}
            />
          </motion.div>
        )}

        {currentView === 'complete' && selectedWorkspace && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-900 flex items-center justify-center p-8"
          >
            <div className="glass rounded-3xl p-8 max-w-2xl w-full text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ✓
                </motion.div>
              </motion.div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🎉 {selectedWorkspace.name} Ready!
                </h2>
                <p className="text-gray-400">
                  Your development environment has been successfully installed and configured.
                </p>
              </div>

              <div className="glass rounded-xl p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">What's ready:</h3>
                <div className="space-y-2">
                  {selectedWorkspace.tools.slice(0, 5).map((tool) => (
                    <div key={tool} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r ${selectedWorkspace.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  Open VS Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-8 py-4 rounded-xl font-semibold glass text-white hover:bg-gray-800 transition-all duration-300"
                >
                  Install Another
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};