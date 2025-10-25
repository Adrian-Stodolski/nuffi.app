import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimpleCreateWorkspace: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState('frontend');

  return (
    <div className="h-full overflow-auto relative">
      <motion.div 
        className="p-6 h-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <motion.button
                className="p-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gradient-ai">Create Workspace</h1>
              <p className="text-gray-400 mt-2">Set up your development environment</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card max-w-2xl">
          <h2 className="text-xl font-semibold mb-6">Workspace Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Awesome Project"
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Workspace Type
              </label>
              <select
                value={workspaceType}
                onChange={(e) => setWorkspaceType(e.target.value)}
                className="glass-select w-full"
              >
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="fullstack">Full Stack Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="data-science">Data Science</option>
                <option value="devops">DevOps</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <Link to="/" className="flex-1">
                <button className="ai-button-secondary w-full">
                  Cancel
                </button>
              </Link>
              <button 
                className="ai-button flex-1"
                disabled={!workspaceName.trim()}
              >
                <Plus className="w-4 h-4" />
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleCreateWorkspace;