import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Download, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { ThemedWorkspace } from '../../types/workspace';

interface WorkspaceCardProps {
  workspace: ThemedWorkspace;
  onInstall: () => void;
  onClose: () => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ 
  workspace, 
  onInstall, 
  onClose 
}) => {
  const features = workspace.features || [
    'Pre-configured development environment',
    'All necessary tools and extensions',
    'Starter projects and templates',
    'Best practices configuration',
    'Ready to use in minutes'
  ];

  const requirements = workspace.requirements || {
    os: ['Windows 10+', 'macOS 10.15+', 'Ubuntu 20.04+'],
    diskSpace: '5-10 GB',
    ram: '8 GB recommended'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative p-8 ${workspace.gradient} rounded-t-3xl`}>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ×
          </button>
          
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${workspace.color} shadow-lg`}>
              {workspace.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{workspace.name}</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workspace.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  workspace.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {workspace.difficulty}
                </div>
              </div>
              
              <p className="text-white/80 text-lg mb-4">{workspace.description}</p>
              
              <div className="flex items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{workspace.setupTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{workspace.downloads || '1.2k'} installs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{workspace.rating || '4.8'}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* What's Included */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 glass rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Technologies */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-3">
              {workspace.tools.map((tool) => (
                <div key={tool} className="px-4 py-2 glass rounded-lg border border-gray-700/50">
                  <span className="text-gray-300 font-medium">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Requirements */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">System Requirements</h3>
            <div className="glass rounded-xl p-6 space-y-4">
              <div>
                <h4 className="text-gray-300 font-medium mb-2">Operating System</h4>
                <div className="flex flex-wrap gap-2">
                  {requirements.os.map((os) => (
                    <span key={os} className="px-3 py-1 bg-gray-800/50 rounded text-sm text-gray-400">
                      {os}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-gray-300 font-medium mb-1">Disk Space</h4>
                  <p className="text-gray-400">{requirements.diskSpace}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium mb-1">Memory</h4>
                  <p className="text-gray-400">{requirements.ram}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Process */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Installation Process</h3>
            <div className="space-y-3">
              {[
                'System compatibility check',
                'Download and install GUI tools',
                'Install CLI tools via package managers',
                'Configure development environment',
                'Set up dotfiles and preferences',
                'Create starter projects',
                'Verify installation'
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-3 glass rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onInstall}
              className={`flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r ${workspace.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
            >
              Install {workspace.name}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-semibold glass text-white hover:bg-gray-800 transition-all duration-300"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};