import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface InstallationStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface InstallationProgressProps {
  steps: InstallationStep[];
  title?: string;
  className?: string;
}

const InstallationProgress: React.FC<InstallationProgressProps> = ({ 
  steps, 
  title = "Installation Progress",
  className = ''
}) => {
  return (
    <motion.div 
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
      )}
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step.status === 'completed' 
                  ? 'bg-accent-green text-white' 
                  : step.status === 'running'
                  ? 'bg-accent-blue text-white'
                  : step.status === 'error'
                  ? 'bg-accent-red text-white'
                  : 'bg-bg-quaternary text-text-muted'
              }`}
              animate={step.status === 'completed' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {step.status === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : step.status === 'running' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </motion.div>
            
            <div className="flex-1">
              <span className={`text-sm ${
                step.status === 'completed' 
                  ? 'text-accent-green' 
                  : step.status === 'running'
                  ? 'text-accent-blue'
                  : step.status === 'error'
                  ? 'text-accent-red'
                  : 'text-text-secondary'
              }`}>
                {step.name}
              </span>
            </div>
            
            {step.status === 'running' && (
              <motion.div
                className="w-2 h-2 bg-accent-blue rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-bg-quaternary rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-accent-blue to-accent-green rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-2">
          <span>{steps.filter(s => s.status === 'completed').length} of {steps.length} completed</span>
          <span>{Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default InstallationProgress;