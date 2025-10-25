import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Download, Settings, Zap, AlertCircle } from 'lucide-react';
import { ThemedWorkspace, InstallationStep } from '../../types/workspace';

interface InstallationWizardProps {
  workspace: ThemedWorkspace;
  onComplete: () => void;
  onCancel: () => void;
}

export const InstallationWizard: React.FC<InstallationWizardProps> = ({
  workspace,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [steps, setSteps] = useState<InstallationStep[]>([
    {
      id: 'check',
      name: 'System Check',
      description: 'Verifying system compatibility and requirements',
      status: 'pending',
      progress: 0,
      logs: []
    },
    {
      id: 'gui-tools',
      name: 'GUI Tools',
      description: 'Installing desktop applications and IDEs',
      status: 'pending',
      progress: 0,
      logs: []
    },
    {
      id: 'cli-tools',
      name: 'CLI Tools',
      description: 'Installing command-line tools and runtimes',
      status: 'pending',
      progress: 0,
      logs: []
    },
    {
      id: 'packages',
      name: 'Packages',
      description: 'Installing libraries and frameworks',
      status: 'pending',
      progress: 0,
      logs: []
    },
    {
      id: 'dotfiles',
      name: 'Configuration',
      description: 'Setting up dotfiles and preferences',
      status: 'pending',
      progress: 0,
      logs: []
    },
    {
      id: 'verify',
      name: 'Verification',
      description: 'Verifying installation and creating starter projects',
      status: 'pending',
      progress: 0,
      logs: []
    }
  ]);

  // Simulate installation process
  useEffect(() => {
    if (!isInstalling) return;

    const runInstallation = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Update current step
        setCurrentStep(i);
        
        // Start step
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'running' } : step
        ));

        // Simulate step progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          setSteps(prev => prev.map((step, index) => 
            index === i ? { 
              ...step, 
              progress,
              logs: [...step.logs, `${step.name}: ${progress}% complete`]
            } : step
          ));

          // Update overall progress
          const stepProgress = (i * 100 + progress) / steps.length;
          setOverallProgress(stepProgress);
        }

        // Complete step
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed' } : step
        ));
      }

      // Installation complete
      setTimeout(() => {
        onComplete();
      }, 1000);
    };

    runInstallation();
  }, [isInstalling, steps.length, onComplete]);

  const startInstallation = () => {
    setIsInstalling(true);
  };

  const getStepIcon = (step: InstallationStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'running':
        return <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Settings className="w-6 h-6 text-cyan-400" />
        </motion.div>;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  if (!isInstalling) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl mx-auto text-center space-y-6"
          >
            <motion.div 
              className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${workspace.color} flex items-center justify-center shadow-lg`}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 191, 255, 0.4)",
                  "0 0 30px rgba(0, 191, 255, 0.6)",
                  "0 0 20px rgba(0, 191, 255, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                Ready to Install {workspace.name}?
              </h2>
              <p className="text-text-secondary">
                This will install all necessary tools and configure your development environment.
              </p>
            </div>

            <div className="glass-card text-left">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Installation includes:</h3>
              <div className="space-y-2">
                {workspace.tools.slice(0, 5).map((tool, index) => (
                  <motion.div 
                    key={tool} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <CheckCircle className="w-4 h-4 text-accent-green" />
                    </motion.div>
                    <span className="text-text-secondary">{tool}</span>
                  </motion.div>
                ))}
                {workspace.tools.length > 5 && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-text-secondary">+{workspace.tools.length - 5} more tools</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={startInstallation}
                className="ai-button flex-1 py-4 rounded-xl font-semibold"
              >
                Start Installation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="ai-button-secondary px-8 py-4 rounded-xl font-semibold"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gradient-ai mb-4">
              Installing {workspace.name}
            </h1>
            <p className="text-text-secondary">
              Please wait while we set up your development environment...
            </p>
          </motion.div>

          {/* Overall Progress */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Overall Progress</h3>
              <span className="text-accent-blue font-bold">{Math.round(overallProgress)}%</span>
            </div>
            
            <div className="w-full bg-bg-quaternary rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-green"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Installation Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Steps List */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Installation Steps</h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    step.status === 'running' ? 'bg-accent-blue-10 border-accent-blue-30' :
                    step.status === 'completed' ? 'bg-accent-green-10 border-accent-green-30' :
                    step.status === 'error' ? 'bg-accent-red-10 border-accent-red-30' :
                    'bg-bg-quaternary/50 border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getStepIcon(step)}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary">{step.name}</h4>
                      <p className="text-sm text-text-secondary">{step.description}</p>
                      
                      {step.status === 'running' && (
                        <div className="mt-2">
                          <div className="w-full bg-bg-quaternary rounded-full h-2">
                            <motion.div
                              className="h-full bg-accent-blue rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${step.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {step.status === 'completed' && (
                        <span className="text-accent-green text-sm font-medium">Complete</span>
                      )}
                      {step.status === 'running' && (
                        <span className="text-accent-blue text-sm font-medium">{step.progress}%</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

            {/* Console Logs */}
            <div className="glass-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Installation Logs</h3>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-accent-blue hover:text-accent-green text-sm transition-colors"
                >
                  {showLogs ? 'Hide' : 'Show'} Details
                </button>
              </div>
              
              <div className="bg-bg-primary rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs border border-border">
                <AnimatePresence>
                  {steps.map((step) => 
                    step.logs.map((log, logIndex) => (
                      <motion.div
                        key={`${step.id}-${logIndex}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-text-secondary mb-1"
                      >
                        <span className="text-accent-blue">[{new Date().toLocaleTimeString()}]</span>{' '}
                        {log}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Current Tool */}
          {currentStep < steps.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card text-center"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Download className="w-8 h-8 text-accent-blue" />
                </motion.div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary">
                    Currently: {steps[currentStep]?.name}
                  </h4>
                  <p className="text-text-secondary">{steps[currentStep]?.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};