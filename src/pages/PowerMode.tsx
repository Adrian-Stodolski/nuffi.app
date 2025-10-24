import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Wifi, 
  Battery, 
  Settings, 
  TrendingUp,
  Activity,
  Shield,
  Rocket
} from 'lucide-react';

const PowerMode: React.FC = () => {
  const [powerLevel, setPowerLevel] = useState(75);
  const [isOverclocked, setIsOverclocked] = useState(false);

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

  const systemStats = [
    { label: 'CPU Usage', value: 45, icon: Cpu, color: 'accent-blue' },
    { label: 'Memory', value: 68, icon: HardDrive, color: 'accent-green' },
    { label: 'GPU Load', value: 32, icon: Monitor, color: 'accent-purple' },
    { label: 'Network', value: 89, icon: Wifi, color: 'accent-orange' }
  ];

  const powerFeatures = [
    {
      title: 'Turbo Boost',
      description: 'Overclock your development environment for maximum performance',
      icon: Rocket,
      enabled: isOverclocked,
      toggle: () => setIsOverclocked(!isOverclocked)
    },
    {
      title: 'Smart Caching',
      description: 'Intelligent caching system for faster builds and deployments',
      icon: Zap,
      enabled: true
    },
    {
      title: 'Resource Monitor',
      description: 'Real-time monitoring of system resources and optimization',
      icon: Activity,
      enabled: true
    },
    {
      title: 'Security Shield',
      description: 'Advanced security features for enterprise development',
      icon: Shield,
      enabled: false
    }
  ];

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
          <div className="flex items-center space-x-4 mb-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-accent-orange to-accent-red rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(249, 115, 22, 0.4)",
                  "0 0 30px rgba(249, 115, 22, 0.6)",
                  "0 0 20px rgba(249, 115, 22, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-ai">Power Mode</h1>
              <p className="text-text-secondary">Advanced performance controls and system optimization</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Power Level Control */}
          <motion.div className="glass-card" variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">System Power Level</h2>
                <p className="text-text-secondary">Adjust overall system performance</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gradient-ai">{powerLevel}%</div>
                <div className="text-sm text-text-muted">Current Level</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={powerLevel}
                  onChange={(e) => setPowerLevel(Number(e.target.value))}
                  className="w-full h-2 bg-bg-quaternary rounded-lg appearance-none cursor-pointer slider"
                />
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-accent-blue to-accent-green rounded-lg"
                  style={{ width: `${powerLevel}%` }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(0, 191, 255, 0.3)",
                      "0 0 20px rgba(0, 191, 255, 0.5)",
                      "0 0 10px rgba(0, 191, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-text-muted">
                <span>Eco Mode</span>
                <span>Balanced</span>
                <span>Performance</span>
                <span>Turbo</span>
              </div>
            </div>
          </motion.div>

          {/* System Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
            {systemStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="glass-card hover-lift"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                    <span className="text-2xl font-bold text-text-primary">{stat.value}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">{stat.label}</span>
                    </div>
                    <div className="w-full bg-bg-quaternary rounded-full h-2">
                      <motion.div
                        className={`h-2 bg-gradient-to-r from-${stat.color} to-accent-green rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Power Features */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Power Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {powerFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="glass-card hover-lift"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          feature.enabled ? 'bg-accent-green/20 text-accent-green' : 'bg-bg-quaternary text-text-muted'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                          <p className="text-sm text-text-secondary">{feature.description}</p>
                        </div>
                      </div>
                      
                      {feature.toggle && (
                        <motion.button
                          onClick={feature.toggle}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 backdrop-blur-sm border ${
                            feature.enabled 
                              ? 'bg-gradient-to-r from-accent-blue to-accent-green border-accent-blue/30 shadow-lg shadow-accent-blue/25' 
                              : 'bg-bg-quaternary/50 border-border hover:border-accent-blue/30'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg ${
                              feature.enabled ? 'shadow-accent-blue/30' : 'shadow-black/20'
                            }`}
                            animate={{
                              x: feature.enabled ? 24 : 4,
                              boxShadow: feature.enabled 
                                ? "0 2px 8px rgba(0, 191, 255, 0.3)" 
                                : "0 2px 4px rgba(0, 0, 0, 0.2)"
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      )}
                    </div>
                    
                    {feature.enabled && (
                      <motion.div
                        className="mt-4 p-3 bg-accent-green/10 rounded-lg border border-accent-green/20"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                          <span className="text-sm text-accent-green font-medium">Active</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="ai-button flex items-center space-x-2"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Optimize System</span>
              </motion.button>
              
              <motion.button
                className="ai-button-secondary flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-4 h-4" />
                <span>Advanced Settings</span>
              </motion.button>
              
              <motion.button
                className="ai-button-secondary flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Battery className="w-4 h-4" />
                <span>Power Profile</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PowerMode;