import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle, 
  X, 
  Star,
  Clock,
  Target,
  Sparkles,
  Code,
  Database,
  Shield,
  Rocket,
  Settings
} from 'lucide-react';

const AIRecommendations: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [applyingRecommendation, setApplyingRecommendation] = useState<number | null>(null);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<number>>(new Set());

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

  const recommendations = [
    {
      id: 1,
      type: 'performance',
      priority: 'high',
      title: 'Optimize Bundle Size',
      description: 'Your JavaScript bundle is 2.3MB larger than recommended. Consider code splitting and tree shaking.',
      impact: 'High',
      timeToImplement: '2-4 hours',
      potentialSavings: '40% faster load times',
      category: 'Performance',
      icon: Rocket,
      color: 'accent-red',
      tags: ['webpack', 'optimization', 'performance']
    },
    {
      id: 2,
      type: 'security',
      priority: 'high',
      title: 'Update Dependencies',
      description: '12 packages have security vulnerabilities. Update to latest versions.',
      impact: 'Critical',
      timeToImplement: '30 minutes',
      potentialSavings: 'Eliminate security risks',
      category: 'Security',
      icon: Shield,
      color: 'accent-orange',
      tags: ['npm', 'security', 'dependencies']
    },
    {
      id: 3,
      type: 'code-quality',
      priority: 'medium',
      title: 'Implement TypeScript',
      description: 'Adding TypeScript can improve code quality and developer experience.',
      impact: 'Medium',
      timeToImplement: '1-2 days',
      potentialSavings: '30% fewer runtime errors',
      category: 'Code Quality',
      icon: Code,
      color: 'accent-blue',
      tags: ['typescript', 'code-quality', 'dx']
    },
    {
      id: 4,
      type: 'database',
      priority: 'medium',
      title: 'Database Indexing',
      description: 'Add indexes to frequently queried columns for better performance.',
      impact: 'Medium',
      timeToImplement: '1 hour',
      potentialSavings: '60% faster queries',
      category: 'Database',
      icon: Database,
      color: 'accent-green',
      tags: ['database', 'indexing', 'performance']
    },
    {
      id: 5,
      type: 'tooling',
      priority: 'low',
      title: 'Setup Pre-commit Hooks',
      description: 'Automate code formatting and linting before commits.',
      impact: 'Low',
      timeToImplement: '15 minutes',
      potentialSavings: 'Consistent code quality',
      category: 'Tooling',
      icon: Settings,
      color: 'accent-purple',
      tags: ['git', 'automation', 'quality']
    }
  ];

  const stats = [
    { label: 'Total Recommendations', value: recommendations.length, icon: Lightbulb, color: 'accent-blue' },
    { label: 'High Priority', value: recommendations.filter(r => r.priority === 'high').length, icon: Target, color: 'accent-red' },
    { label: 'Potential Time Saved', value: '8+ hours', icon: Clock, color: 'accent-green' },
    { label: 'Impact Score', value: '85%', icon: TrendingUp, color: 'accent-purple' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-accent-red bg-accent-red/10 border-accent-red/20';
      case 'medium': return 'text-accent-orange bg-accent-orange/10 border-accent-orange/20';
      case 'low': return 'text-accent-green bg-accent-green/10 border-accent-green/20';
      default: return 'text-text-muted bg-bg-quaternary border-border';
    }
  };

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.priority === filter);

  const handleApplyRecommendation = async (id: number) => {
    setApplyingRecommendation(id);
    
    // Simulate applying recommendation
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    setAppliedRecommendations(prev => new Set([...prev, id]));
    setApplyingRecommendation(null);
  };

  const handleDismissRecommendation = (id: number) => {
    setAppliedRecommendations(prev => new Set([...prev, id]));
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
          <div className="flex items-center space-x-4 mb-6">
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
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-ai">AI Recommendations</h1>
              <p className="text-text-secondary">Intelligent suggestions to improve your development workflow</p>
            </div>
          </div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="glass-card hover-lift"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-muted text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 text-${stat.color}`} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-text-secondary font-medium">Filter by priority:</span>
            {['all', 'high', 'medium', 'low'].map((priority) => (
              <motion.button
                key={priority}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === priority 
                    ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30' 
                    : 'bg-bg-quaternary/30 text-text-muted hover:bg-bg-quaternary/50'
                }`}
                onClick={() => setFilter(priority)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Recommendations */}
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredRecommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={rec.id}
                className="glass-card hover-lift"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-${rec.color}/20 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-${rec.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-text-primary">{rec.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                        </div>
                        <p className="text-text-secondary mb-3">{rec.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">Impact: {rec.impact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">Time: {rec.timeToImplement}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">Savings: {rec.potentialSavings}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {rec.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleDismissRecommendation(rec.id)}
                          disabled={appliedRecommendations.has(rec.id)}
                          className="p-2 rounded-lg bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                        
                        {appliedRecommendations.has(rec.id) ? (
                          <div className="ai-button px-4 py-2 flex items-center space-x-2 bg-accent-green/20 text-accent-green cursor-default">
                            <CheckCircle className="w-4 h-4" />
                            <span>Applied</span>
                          </div>
                        ) : (
                          <motion.button
                            onClick={() => handleApplyRecommendation(rec.id)}
                            disabled={applyingRecommendation === rec.id}
                            className="ai-button px-4 py-2 flex items-center space-x-2 disabled:opacity-50"
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)"
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {applyingRecommendation === rec.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.div>
                                <span>Applying...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Apply</span>
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI Insights */}
        <motion.div 
          className="mt-8 glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">AI Insights</h2>
              <p className="text-text-secondary text-sm">Based on your project analysis</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-text-primary mb-3">Project Health Score</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-bg-quaternary rounded-full h-3">
                    <motion.div
                      className="h-3 bg-gradient-to-r from-accent-green to-accent-blue rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-gradient-ai">85%</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Your project is in good health. Focus on the high-priority recommendations for maximum impact.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-text-primary mb-3">Recommended Focus Areas</h3>
              <div className="space-y-2">
                {['Performance Optimization', 'Security Updates', 'Code Quality'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent-orange" />
                    <span className="text-text-secondary">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIRecommendations;