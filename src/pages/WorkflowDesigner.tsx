import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  GitBranch,
  Code,
  Database,
  Cloud,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const WorkflowDesigner: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

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
    visible: { opacity: 1, y: 0 }
  };

  const workflows = [
    {
      id: 1,
      name: 'Full Stack Deploy',
      description: 'Complete deployment pipeline for full-stack applications',
      status: 'active',
      lastRun: '2 hours ago',
      steps: 8,
      icon: Cloud,
      color: 'accent-blue'
    },
    {
      id: 2,
      name: 'Code Quality Check',
      description: 'Automated testing, linting, and code review process',
      status: 'completed',
      lastRun: '1 day ago',
      steps: 5,
      icon: Code,
      color: 'accent-green'
    },
    {
      id: 3,
      name: 'Database Migration',
      description: 'Safe database schema updates and data migration',
      status: 'pending',
      lastRun: 'Never',
      steps: 4,
      icon: Database,
      color: 'accent-orange'
    }
  ];

  const workflowSteps = [
    { name: 'Code Checkout', icon: GitBranch, status: 'completed' },
    { name: 'Install Dependencies', icon: Code, status: 'completed' },
    { name: 'Run Tests', icon: CheckCircle, status: 'completed' },
    { name: 'Build Application', icon: Settings, status: 'running' },
    { name: 'Deploy to Staging', icon: Cloud, status: 'pending' },
    { name: 'Run E2E Tests', icon: Zap, status: 'pending' },
    { name: 'Deploy to Production', icon: Cloud, status: 'pending' },
    { name: 'Health Check', icon: CheckCircle, status: 'pending' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-accent-green';
      case 'running': return 'text-accent-blue';
      case 'pending': return 'text-text-muted';
      case 'error': return 'text-accent-red';
      default: return 'text-text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'running': return Clock;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="h-full overflow-auto relative">
      <div className="p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.4)",
                    "0 0 30px rgba(139, 92, 246, 0.6)",
                    "0 0 20px rgba(139, 92, 246, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Workflow className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-ai">Workflow Designer</h1>
                <p className="text-text-secondary">Create and manage automated development workflows</p>
              </div>
            </div>
            
            <motion.button
              className="ai-button flex items-center space-x-2"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Workflow</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List */}
          <motion.div 
            className="lg:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="glass-card" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Active Workflows</h2>
              <div className="space-y-3">
                {workflows.map((workflow) => {
                  const Icon = workflow.icon;
                  return (
                    <motion.div
                      key={workflow.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedWorkflow === workflow.id 
                          ? 'bg-accent-blue/20 border border-accent-blue/30' 
                          : 'bg-bg-quaternary/30 hover:bg-bg-quaternary/50'
                      }`}
                      onClick={() => setSelectedWorkflow(workflow.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${workflow.color}/20`}>
                          <Icon className={`w-4 h-4 text-${workflow.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text-primary truncate">{workflow.name}</h3>
                          <p className="text-sm text-text-secondary truncate">{workflow.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              workflow.status === 'active' ? 'bg-accent-green/20 text-accent-green' :
                              workflow.status === 'completed' ? 'bg-accent-blue/20 text-accent-blue' :
                              'bg-accent-orange/20 text-accent-orange'
                            }`}>
                              {workflow.status}
                            </span>
                            <span className="text-xs text-text-muted">{workflow.steps} steps</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Workflow Details */}
          <motion.div 
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="glass-card" variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Workflow Steps</h2>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 rounded-lg bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-accent-orange/20 text-accent-orange hover:bg-accent-orange/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Pause className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Square className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const StatusIcon = getStatusIcon(step.status);
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-bg-quaternary/20 hover:bg-bg-quaternary/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-accent-green/20' :
                        step.status === 'running' ? 'bg-accent-blue/20' :
                        'bg-bg-quaternary'
                      }`}>
                        <Icon className={`w-5 h-5 ${getStatusColor(step.status)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{step.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(step.status)}`} />
                          <span className={`text-sm capitalize ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                      
                      {step.status === 'running' && (
                        <motion.div
                          className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      
                      {index < workflowSteps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-text-muted" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Workflow Templates */}
            <motion.div className="glass-card mt-6" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Workflow Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'CI/CD Pipeline', icon: GitBranch, description: 'Continuous integration and deployment' },
                  { name: 'Testing Suite', icon: CheckCircle, description: 'Automated testing workflow' },
                  { name: 'Code Review', icon: Code, description: 'Automated code review process' },
                  { name: 'Security Scan', icon: AlertCircle, description: 'Security vulnerability scanning' }
                ].map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <motion.div
                      key={index}
                      className="p-4 rounded-lg bg-bg-quaternary/20 hover:bg-bg-quaternary/30 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-accent-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary">{template.name}</h3>
                          <p className="text-sm text-text-secondary">{template.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDesigner;