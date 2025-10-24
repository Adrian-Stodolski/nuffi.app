import React from 'react';
import { Brain, Lightbulb, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AICenter: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      type: 'optimization',
      title: 'Optimize Memory Usage',
      description: 'Your system is using 85% memory. Consider closing unused applications.',
      priority: 'high',
      savings: '512MB memory'
    },
    {
      id: 2,
      type: 'tool',
      title: 'Install Docker',
      description: 'Docker would be useful for your containerization projects.',
      priority: 'medium',
      savings: '2 hours setup time'
    },
    {
      id: 3,
      type: 'learning',
      title: 'Learn TypeScript',
      description: 'Based on your JavaScript projects, TypeScript could improve your workflow.',
      priority: 'low',
      savings: 'Better code quality'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'low': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-700';
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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full overflow-auto relative">
      <div className="p-6">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gradient-ai mb-1">AI Command Center</h1>
          <p className="text-text-secondary text-sm">Intelligent recommendations and automation</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Scans</p>
                <p className="text-2xl font-bold text-text-primary">3</p>
              </div>
              <Brain className="w-8 h-8 text-accent-purple" />
            </div>
          </motion.div>
          
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Recommendations</p>
                <p className="text-2xl font-bold text-text-primary">{recommendations.length}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-accent-orange" />
            </div>
          </motion.div>
          
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Optimizations</p>
                <p className="text-2xl font-bold text-text-primary">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-green" />
            </div>
          </motion.div>
          
          <motion.div className="glass-card hover-lift" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Time Saved</p>
                <p className="text-2xl font-bold text-text-primary">4.2h</p>
              </div>
              <Zap className="w-8 h-8 text-accent-blue" />
            </div>
          </motion.div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-4">AI Recommendations</h2>
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                className="glass-card hover-lift"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-2">{rec.description}</p>
                    <p className="text-accent-green text-sm">💡 Potential savings: {rec.savings}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button 
                    className="ai-button px-4 py-2"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply
                  </motion.button>
                  <motion.button 
                    className="ai-button-secondary px-4 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Dismiss
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* AI Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-4">AI Features</h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="glass-card hover-lift" variants={itemVariants}>
              <Brain className="w-12 h-12 text-accent-purple mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Smart Analysis</h3>
              <p className="text-text-secondary mb-4">AI analyzes your development patterns and suggests optimizations.</p>
              <motion.button 
                className="ai-button px-4 py-2"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Run Analysis
              </motion.button>
            </motion.div>
            
            <motion.div className="glass-card hover-lift" variants={itemVariants}>
              <Zap className="w-12 h-12 text-accent-orange mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Auto Setup</h3>
              <p className="text-text-secondary mb-4">Automatically configure workspaces based on your project type.</p>
              <motion.button 
                className="ai-button px-4 py-2"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)' }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Enable Auto Setup
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AICenter;