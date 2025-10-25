import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Shield, Rocket, Smartphone, Gamepad2, Brain, Blocks, Monitor, Sparkles } from 'lucide-react';
import { ThemedWorkspace } from '../../types/workspace';

interface WorkspaceSelectionProps {
  workspaces: ThemedWorkspace[];
  onWorkspaceSelect: (workspace: ThemedWorkspace) => void;
}

export const WorkspaceSelection: React.FC<WorkspaceSelectionProps> = ({ 
  workspaces, 
  onWorkspaceSelect 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Web Development', 'Server Development', 'Analytics', 'Security', 'Infrastructure', 'Mobile Apps', 'Gaming', 'AI/ML', 'Web3', 'Desktop'];

  const filteredWorkspaces = selectedCategory === 'all' 
    ? workspaces 
    : workspaces.filter(w => w.category === selectedCategory);

  return (
    <div className="h-full overflow-auto">
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
              className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 191, 255, 0.4)",
                  "0 0 30px rgba(0, 191, 255, 0.6)",
                  "0 0 20px rgba(0, 191, 255, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-ai">Themed Workspaces</h1>
              <p className="text-text-secondary">Complete pre-configured development environments for every specialization</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-glow'
                    : 'glass-card text-text-secondary hover:text-text-primary hover:bg-bg-quaternary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'all' ? 'All Categories' : category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Workspace Grid */}
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {filteredWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                className="glass-card hover-lift cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 2,
                  rotateX: 2
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onWorkspaceSelect(workspace)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="h-full">
                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${workspace.color} rounded-2xl flex items-center justify-center shadow-lg`}
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
                      {workspace.icon}
                    </motion.div>
                    <div className="text-right">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        workspace.difficulty === 'Beginner' ? 'bg-accent-green/20 text-accent-green' :
                        workspace.difficulty === 'Intermediate' ? 'bg-accent-orange/20 text-accent-orange' :
                        'bg-accent-red/20 text-accent-red'
                      }`}>
                        {workspace.difficulty}
                      </div>
                    </div>
                  </div>

                  <motion.h3 
                    className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {workspace.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-text-secondary mb-6 leading-relaxed"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {workspace.description}
                  </motion.p>

                  {/* Tools */}
                  <div className="space-y-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {workspace.tools.slice(0, 3).map((tool) => (
                        <span key={tool} className="px-3 py-1 bg-bg-quaternary/50 rounded-full text-xs text-text-secondary border border-border">
                          {tool}
                        </span>
                      ))}
                      {workspace.tools.length > 3 && (
                        <span className="px-3 py-1 bg-bg-quaternary/50 rounded-full text-xs text-text-muted border border-border">
                          +{workspace.tools.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Setup Time */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Setup time:</span>
                      <span className="text-accent-blue font-medium">{workspace.setupTime}</span>
                    </div>
                  </div>

                  {/* Install Button */}
                  <motion.div 
                    className="pt-4 border-t border-border"
                    animate={{ borderColor: ["#374151", "#4b5563", "#374151"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.div 
                      className="text-accent-green font-medium group-hover:text-accent-blue transition-colors"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Get Started →
                    </motion.div>
                  </motion.div>
                </div>
            </motion.div>
          ))}
        </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card text-center mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <div className="text-3xl font-bold text-accent-blue">10</div>
                <div className="text-text-secondary">Themed Workspaces</div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="text-3xl font-bold text-accent-green">150+</div>
                <div className="text-text-secondary">Pre-configured Tools</div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <div className="text-3xl font-bold text-accent-purple">15 min</div>
                <div className="text-text-secondary">Average Setup Time</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};