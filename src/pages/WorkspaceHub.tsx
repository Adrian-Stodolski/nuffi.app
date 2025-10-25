import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Link } from 'react-router-dom';

const WorkspaceHub: React.FC = () => {
  const { workspaces, loading, loadWorkspaces } = useAppStore();

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

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

  if (loading.workspaces) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-400">Loading workspaces...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto relative">
      <motion.div 
        className="p-6 h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - dokładnie jak na zdjęciu */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          variants={itemVariants}
        >
          <div>
            <motion.h1 
              className="text-4xl font-bold text-gradient-ai mb-2"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(0, 191, 255, 0.5)",
                  "0 0 30px rgba(0, 191, 255, 0.8)",
                  "0 0 20px rgba(0, 191, 255, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Environment Hub
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI-powered workspace management for developers
            </motion.p>
          </div>
          <Link to="/create">
            <motion.button
              className="ai-button"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 12px 30px rgba(0, 191, 255, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 4px 15px rgba(0, 191, 255, 0.3)",
                  "0 8px 25px rgba(0, 191, 255, 0.5)",
                  "0 4px 15px rgba(0, 191, 255, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Plus className="w-5 h-5" />
              <span>New Environment</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Search and Filter - dokładnie jak na zdjęciu */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          variants={itemVariants}
        >
          <div className="flex-1 relative">
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </motion.div>
            <motion.input
              type="text"
              placeholder="Search workspaces..."
              className="glass-input w-full pl-10"
              whileFocus={{ 
                scale: 1.02,
                borderColor: "#10b981",
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
              }}
            />
          </div>
          <motion.select 
            className="glass-select px-4 py-2"
            whileFocus={{ scale: 1.02 }}
          >
            <option>All Types</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Full Stack</option>
            <option>Mobile</option>
          </motion.select>
        </motion.div>

        {/* Empty State - dokładnie jak na zdjęciu */}
        <AnimatePresence>
          {workspaces.length === 0 && (
            <motion.div 
              className="flex flex-col items-center justify-center h-96 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
            >
              {/* Plus icon w kółku - dokładnie jak na zdjęciu */}
              <motion.div 
                className="w-24 h-24 glass-card rounded-full flex items-center justify-center mb-6"
                animate={{ 
                  scale: [1, 1.05, 1],
                  borderColor: ["#374151", "#4b5563", "#374151"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ 
                  scale: 1.1,
                  borderColor: "#10b981",
                  backgroundColor: "#1f2937"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Plus className="w-12 h-12 text-gray-600" />
                </motion.div>
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold text-white mb-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                No workspaces found
              </motion.h3>
              
              <motion.p 
                className="text-gray-400 mb-6 max-w-md"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Create your first workspace to get started
              </motion.p>
              
              <Link to="/create">
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -2, 0],
                    boxShadow: [
                      "0 4px 15px rgba(34, 197, 94, 0.2)",
                      "0 6px 20px rgba(34, 197, 94, 0.3)",
                      "0 4px 15px rgba(34, 197, 94, 0.2)"
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Create Workspace
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspaces Grid - gdy będą workspace'y */}
        <AnimatePresence>
          {workspaces.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {workspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  className="glass-card hover-lift cursor-pointer group"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.h3 
                      className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {workspace.name}
                    </motion.h3>
                    <motion.span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workspace.status === 'active' 
                          ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' 
                          : 'bg-bg-quaternary/30 text-text-muted border border-border'
                      }`}
                      animate={workspace.status === 'active' ? {
                        boxShadow: [
                          "0 0 5px rgba(34, 197, 94, 0.3)",
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                          "0 0 5px rgba(34, 197, 94, 0.3)"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {workspace.status}
                    </motion.span>
                  </div>
                  
                  <motion.p 
                    className="text-gray-400 mb-4 capitalize"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                  >
                    {workspace.type.replace('-', ' ')} workspace
                  </motion.p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {workspace.tools.length} tools
                    </motion.span>
                    <span>{new Date(workspace.created_at).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WorkspaceHub;