import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, Wand2, Zap, Check } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { WorkspaceType } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateWorkspace: React.FC = () => {
  const { createWorkspace, loading } = useAppStore();
  const navigate = useNavigate();
  const [creationMethod, setCreationMethod] = useState<'template' | 'repo' | 'scratch' | null>(null);
  
  // Form state
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>('frontend');
  const [repoUrl, setRepoUrl] = useState('');

  const creationMethods = [
    {
      id: 'template',
      title: 'From Template',
      description: 'Start with a pre-configured workspace template',
      icon: Wand2,
      gradient: 'from-accent-blue to-accent-purple',
      features: ['Pre-configured tools', 'Best practices', 'Quick setup']
    },
    {
      id: 'repo',
      title: 'From Repository',
      description: 'Import from GitHub, GitLab, or other Git repositories',
      icon: Github,
      gradient: 'from-accent-green to-accent-blue',
      features: ['Auto-detection', 'Smart analysis', 'Instant setup']
    },
    {
      id: 'scratch',
      title: 'From Scratch',
      description: 'Create a custom workspace with your own configuration',
      icon: Zap,
      gradient: 'from-accent-purple to-accent-orange',
      features: ['Full control', 'Custom tools', 'Your way']
    }
  ];

  const workspaceTypes: { value: WorkspaceType; label: string; description: string; icon: string }[] = [
    { value: 'frontend', label: 'Frontend', description: 'React, Vue, Angular, TypeScript', icon: '🎨' },
    { value: 'backend', label: 'Backend', description: 'Node.js, Python, Go, Java', icon: '⚙️' },
    { value: 'fullstack', label: 'Full Stack', description: 'Complete web development stack', icon: '🌐' },
    { value: 'mobile', label: 'Mobile', description: 'React Native, Flutter, Swift', icon: '📱' },
    { value: 'data-science', label: 'Data Science', description: 'Python, R, Jupyter, TensorFlow', icon: '📊' },
    { value: 'devops', label: 'DevOps', description: 'Docker, Kubernetes, Terraform', icon: '🚀' },
    { value: 'ai-ml', label: 'AI/ML', description: 'Machine Learning and AI development', icon: '🤖' },
    { value: 'custom', label: 'Custom', description: 'Define your own workspace type', icon: '🛠️' }
  ];

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    try {
      const workspaceData = {
        name: workspaceName,
        workspace_type: workspaceType,
        tools: [],
        config: {
          auto_start: false,
          port_mappings: [],
          environment_variables: {},
          startup_commands: [],
          cleanup_commands: [],
          shell_config: {
            default_shell: 'bash' as const,
            available_shells: ['bash', 'zsh'],
            shell_rc_files: {},
            plugins: []
          },
          aliases: {},
          custom_paths: []
        }
      };

      await createWorkspace(workspaceData);
      toast.success(`Workspace "${workspaceName}" created successfully!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to create workspace');
      console.error('Create workspace error:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (!creationMethod) {
    return (
      <div className="h-full overflow-auto">
        <motion.div 
          className="max-w-6xl mx-auto p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="flex items-center mb-8"
            variants={itemVariants}
          >
            <Link to="/">
              <motion.div
                className="mr-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </motion.div>
            </Link>
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white mb-2"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(16, 185, 129, 0.3)",
                    "0 0 20px rgba(16, 185, 129, 0.5)",
                    "0 0 10px rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Create Workspace
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Choose how you'd like to create your new development workspace.
              </motion.p>
            </div>
          </motion.div>

          {/* Creation Methods */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {creationMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.id}
                  className="glass-card hover-lift cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 2,
                    rotateX: 2
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCreationMethod(method.id as any)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="h-full">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: index * 0.5 
                      }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <motion.h3 
                      className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {method.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-text-secondary mb-6 leading-relaxed"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {method.description}
                    </motion.p>
                    
                    <div className="space-y-2 mb-6">
                      {method.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex} 
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + featureIndex * 0.1 }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.2 }}
                          >
                            <Check className="w-4 h-4 text-green-400" />
                          </motion.div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div 
                      className="pt-4 border-t border-gray-700"
                      animate={{ borderColor: ["#374151", "#4b5563", "#374151"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <motion.div 
                        className="text-green-400 font-medium group-hover:text-green-300 transition-colors"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Get Started →
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-bg-primary overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setCreationMethod(null)}
            className="mr-4 p-2 hover:bg-bg-tertiary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create Workspace - {creationMethod === 'template' ? 'From Template' : 
                                 creationMethod === 'repo' ? 'From Repository' : 'From Scratch'}
            </h1>
            <p className="text-text-secondary">
              Configure your new development workspace.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="nuffi-card max-w-2xl">
          <div className="space-y-8">
            {/* Workspace Name */}
            <div className="form-group">
              <label className="form-label">
                Workspace Name *
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name..."
                className="nuffi-input"
              />
            </div>

            {/* Repository URL (if from repo) */}
            {creationMethod === 'repo' && (
              <div className="form-group">
                <label className="form-label">
                  Repository URL *
                </label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="nuffi-input"
                />
                <p className="text-text-muted text-sm mt-2">
                  We'll analyze your repository and suggest the best tools and configuration.
                </p>
              </div>
            )}

            {/* Workspace Type */}
            <div className="form-group">
              <label className="form-label">
                Workspace Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaceTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setWorkspaceType(type.value)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      workspaceType === type.value
                        ? 'border-accent-blue bg-accent-blue/10 shadow-glow'
                        : 'border-border bg-bg-tertiary hover:border-border-hover hover:bg-bg-quaternary'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="font-semibold text-text-primary">{type.label}</div>
                    </div>
                    <div className="text-sm text-text-muted">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <button
                onClick={() => setCreationMethod(null)}
                className="nuffi-button-secondary"
              >
                Back
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={loading.workspaces || !workspaceName.trim()}
                className="nuffi-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.workspaces ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Workspace'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;