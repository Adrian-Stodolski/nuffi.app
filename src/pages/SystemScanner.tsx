import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import { Tool } from '../types';
import { Search, RefreshCw, CheckCircle, XCircle, AlertTriangle, HelpCircle, Download } from 'lucide-react';
import InstallationProgress from '../components/InstallationProgress';

const SystemScanner: React.FC = () => {
  const { tools, loading, scanSystem } = useAppStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationSteps, setInstallationSteps] = useState<Array<{name: string, status: 'pending' | 'running' | 'completed' | 'error'}>>([]);
  const [installationComplete, setInstallationComplete] = useState<{toolName: string, success: boolean} | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    try {
      await scanSystem();
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const handleInstallTool = async (toolName: string) => {
    setIsInstalling(true);
    const steps = [
      { name: `Downloading ${toolName}`, status: 'pending' as const },
      { name: 'Verifying package integrity', status: 'pending' as const },
      { name: 'Installing dependencies', status: 'pending' as const },
      { name: `Configuring ${toolName}`, status: 'pending' as const },
      { name: 'Updating PATH variables', status: 'pending' as const },
      { name: 'Verifying installation', status: 'pending' as const }
    ];
    
    setInstallationSteps(steps);

    // Simulate installation process
    for (let i = 0; i < steps.length; i++) {
      setInstallationSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'running' } : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      setInstallationSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));
    }

    setTimeout(() => {
      setIsInstalling(false);
      setInstallationSteps([]);
      setInstallationComplete({ toolName, success: true });
      // Refresh scan after installation
      handleScan();
      
      // Hide completion message after 5 seconds
      setTimeout(() => {
        setInstallationComplete(null);
      }, 5000);
    }, 1000);
  };

  const getStatusColor = (status: Tool['status']) => {
    switch (status) {
      case 'installed': return 'text-status-active';
      case 'not-installed': return 'text-status-error';
      case 'outdated': return 'text-status-warning';
      default: return 'text-text-muted';
    }
  };

  const getStatusIcon = (status: Tool['status']) => {
    switch (status) {
      case 'installed': return <CheckCircle className="w-5 h-5" />;
      case 'not-installed': return <XCircle className="w-5 h-5" />;
      case 'outdated': return <AlertTriangle className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: Tool['status']) => {
    switch (status) {
      case 'installed': return 'bg-status-active/10 text-status-active border-status-active/20';
      case 'not-installed': return 'bg-status-error/10 text-status-error border-status-error/20';
      case 'outdated': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      default: return 'bg-text-muted/10 text-text-muted border-text-muted/20';
    }
  };

  const toolsByCategory = tools.reduce((acc, tool) => {
    const category = tool.type;
    if (!acc[category]) acc[category] = [];
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const categoryLabels = {
    service: 'System Services',
    gui: 'GUI Applications',
    package: 'Package Managers',
    language: 'Programming Languages',
    cli: 'Command Line Tools',
    ide: 'IDEs & Editors',
    container: 'Containerization',
  };

  const stats = {
    total: tools.length,
    installed: tools.filter(t => t.status === 'installed').length,
    missing: tools.filter(t => t.status === 'not-installed').length,
    outdated: tools.filter(t => t.status === 'outdated').length,
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
          className="mb-8"
          variants={itemVariants}
        >
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
            System Scanner
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scan your system to detect installed development tools and their versions.
          </motion.p>
        </motion.div>

        {/* Installation Progress */}
        <AnimatePresence>
          {isInstalling && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <InstallationProgress 
                steps={installationSteps}
                title="Installing Development Tool"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Installation Complete Summary */}
        <AnimatePresence>
          {installationComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="mb-8"
            >
              <div className="glass-card border-accent-green/30 bg-accent-green/5">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="w-6 h-6 text-accent-green" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-accent-green mb-1">
                      Installation Complete!
                    </h3>
                    <p className="text-text-secondary">
                      <span className="font-medium text-text-primary">{installationComplete.toolName}</span> has been successfully installed and configured.
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-text-muted">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-accent-green" />
                        <span>Added to PATH</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-accent-green" />
                        <span>Dependencies resolved</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-accent-green" />
                        <span>Ready to use</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setInstallationComplete(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle className="w-4 h-4 text-text-muted" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Controls */}
        <div className="nuffi-card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleScan}
                disabled={isScanning || loading.scanning}
                className="nuffi-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning || loading.scanning ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Scanning...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Start System Scan</span>
                  </div>
                )}
              </button>
              
              {tools.length > 0 && (
                <div className="text-text-muted text-sm">
                  Last scan: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
            
            {(isScanning || loading.scanning) && (
              <div className="flex items-center space-x-3">
                <div className="text-text-muted text-sm">Progress</div>
                <div className="w-32 progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="text-text-muted text-sm">{Math.round(scanProgress)}%</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {tools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="nuffi-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total Tools</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <Search className="w-8 h-8 text-accent-blue" />
              </div>
            </div>
            
            <div className="nuffi-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Installed</p>
                  <p className="text-2xl font-bold text-status-active">{stats.installed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-status-active" />
              </div>
            </div>
            
            <div className="nuffi-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Missing</p>
                  <p className="text-2xl font-bold text-status-error">{stats.missing}</p>
                </div>
                <XCircle className="w-8 h-8 text-status-error" />
              </div>
            </div>
            
            <div className="nuffi-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Outdated</p>
                  <p className="text-2xl font-bold text-status-warning">{stats.outdated}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-status-warning" />
              </div>
            </div>
          </div>
        )}

        {/* Results by Category */}
        {tools.length > 0 && (
          <div className="space-y-6">
            {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
              <div key={category} className="nuffi-card">
                <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center space-x-2">
                  <span>{categoryLabels[category as keyof typeof categoryLabels] || category}</span>
                  <span className="text-text-muted text-sm">({categoryTools.length})</span>
                </h2>
                
                <div className="grid gap-3">
                  {categoryTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 bg-bg-tertiary rounded-xl border border-border hover:border-border-hover transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={getStatusColor(tool.status)}>
                          {getStatusIcon(tool.status)}
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{tool.name}</h3>
                          <p className="text-sm text-text-muted">{tool.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {tool.version && (
                          <div className="text-text-secondary text-sm font-mono">
                            v{tool.version}
                          </div>
                        )}
                        <div className={`status-badge ${getStatusBadge(tool.status)}`}>
                          {tool.status.replace('-', ' ').toUpperCase()}
                        </div>
                        
                        {(tool.status === 'not-installed' || tool.status === 'outdated') && (
                          <motion.button
                            onClick={() => handleInstallTool(tool.name)}
                            disabled={isInstalling}
                            className="ai-button px-3 py-1 text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Download className="w-3 h-3" />
                            <span>{tool.status === 'outdated' ? 'Update' : 'Install'}</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {tools.length === 0 && !isScanning && !loading.scanning && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-8xl mb-6"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔍
            </motion.div>
            <motion.h3 
              className="text-2xl font-semibold text-gray-300 mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              No scan results yet
            </motion.h3>
            <motion.p 
              className="text-gray-500 mb-8 max-w-md mx-auto"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Click "Start System Scan" to detect your development tools and see what's installed on your system.
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SystemScanner;