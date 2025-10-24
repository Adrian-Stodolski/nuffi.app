import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Plus, 
  ArrowUp, 
  Scan, 
  Monitor, 
  Bot, 
  Heart, 
  Star, 
  Box,
  ArrowRight
} from 'lucide-react';

const V3Ultimate: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* AI-Enhanced Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'rgba(0, 191, 255, 0.4)' : 'rgba(76, 175, 80, 0.4)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Top Header */}
      <div className="p-8 relative z-10">
        <motion.h1 
          className="text-5xl font-bold text-gradient-ai mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          v3 Ultimate
        </motion.h1>
        
        <div className="flex gap-8">
          {/* Left Sidebar Navigation */}
          <motion.div 
            className="w-16 flex flex-col items-center space-y-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="glass-card w-12 h-12 flex items-center justify-center hover-lift"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Home className="w-5 h-5 text-blue-400" />
            </motion.div>
          </motion.div>
          
          {/* Main Left Column - Environment Hub */}
          <motion.div 
            className="w-80 space-y-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h2 
              className="text-2xl font-semibold text-gradient-ai"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(0, 191, 255, 0.3)",
                  "0 0 20px rgba(0, 191, 255, 0.5)",
                  "0 0 10px rgba(0, 191, 255, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Environment Hub
            </motion.h2>
            
            {/* Action Buttons Row */}
            <motion.div 
              className="grid grid-cols-2 gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                className="glass-card p-3 flex items-center space-x-2 hover-lift"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ai-glow">
                  <span className="text-xs text-white font-bold">G</span>
                </div>
                <span className="text-sm text-white">New Environment</span>
              </motion.button>
              
              <motion.button 
                className="glass-card p-3 flex items-center space-x-2 hover-lift"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Monitor className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white">Run Window</span>
              </motion.button>
              
              <motion.button 
                className="glass-card p-3 flex items-center space-x-2 hover-lift"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center success-glow">
                  <ArrowUp className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-white">Update Tools</span>
              </motion.button>
              
              <motion.button 
                className="ai-button p-3 flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Scan className="w-5 h-5 text-white" />
                <span className="text-sm text-white">Run AI Scan</span>
              </motion.button>
            </motion.div>
            
            {/* Environment Cards */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="glass-card p-4 hover-lift"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-medium mb-2">Environment 1</h3>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-500 rounded-full success-glow"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-green-400 font-medium">Active</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-4 hover-lift"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-medium mb-2">Environment 2</h3>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    className="w-2 h-2 bg-orange-500 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs text-orange-400 font-medium">Offline</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-4 hover-lift"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-medium mb-2">Environment 3</h3>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-red-400 font-medium">Issue</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-4 hover-lift relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-medium mb-2">Environment 4</h3>
                <div className="flex items-center justify-between">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </motion.div>
                  <motion.svg 
                    className="w-8 h-4" 
                    viewBox="0 0 32 16"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path d="M2 8 Q8 2 16 8 T30 8" stroke="#00BFFF" strokeWidth="1" fill="none" />
                  </motion.svg>
                </div>
              </motion.div>
            </motion.div>
            
            {/* AI Recommendations Section */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <motion.h3 
                  className="text-lg font-medium text-gradient-ai"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(0, 191, 255, 0.3)",
                      "0 0 15px rgba(0, 191, 255, 0.5)",
                      "0 0 10px rgba(0, 191, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  AI Recommendations
                </motion.h3>
                <motion.button 
                  className="glass-card w-8 h-8 flex items-center justify-center hover-lift"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                </motion.button>
              </div>
              
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">CTA</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="glass-card p-4 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Bot className="w-6 h-6 text-blue-400 mb-2 ai-glow" />
                  </motion.div>
                  <div className="space-y-1 mb-3">
                    <div className="h-2 loading-skeleton rounded w-3/4"></div>
                    <div className="h-2 loading-skeleton rounded w-1/2"></div>
                  </div>
                  <motion.button 
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    View Details
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-4 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-sm text-white mb-3">Unlock full AI Scan and QuickStart presets</p>
                  <motion.button 
                    className="ai-button text-xs px-3 py-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Upgrade for $39
                  </motion.button>
                </motion.div>
              </div>
              
              <motion.div 
                className="glass-card p-4 hover-lift"
                whileHover={{ scale: 1.02 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div 
                    className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full ai-glow"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm text-white font-medium">Community Hub</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-pink-400 mb-2" />
                </motion.div>
                <div className="space-y-1">
                  <div className="h-1 loading-skeleton rounded w-full"></div>
                  <div className="h-1 loading-skeleton rounded w-2/3"></div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Divider */}
            <hr className="border-gray-800" />
            
            {/* AI Command Center */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="flex items-center space-x-2">
                <motion.h3 
                  className="text-lg font-medium text-gradient-ai"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(0, 191, 255, 0.3)",
                      "0 0 15px rgba(0, 191, 255, 0.5)",
                      "0 0 10px rgba(0, 191, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  AI Command Center
                </motion.h3>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </motion.div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="glass-card p-4 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 mb-2" />
                  </motion.div>
                  <h4 className="text-sm text-white font-medium">Preset Wizard</h4>
                  <p className="text-xs text-gray-400 mt-1">Again: 21:stoot</p>
                  <p className="text-xs text-gray-500">L / in@aacan</p>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-4 hover-lift"
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <h4 className="text-sm text-white font-medium mb-2">AI Learning Fun</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <motion.div 
                        className="w-1 h-1 bg-blue-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <div className="h-1 loading-skeleton rounded w-16"></div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <motion.div 
                        className="w-1 h-1 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                      />
                      <div className="h-1 loading-skeleton rounded w-12"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </motion.div>
                <motion.div 
                  className="glass-card p-3 flex-1 hover-lift"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-sm text-white font-medium mb-1">Power Mode</h4>
                  <motion.button 
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    View Details
                  </motion.button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <motion.button 
                  className="text-sm text-gradient-ai hover:text-blue-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    textShadow: [
                      "0 0 5px rgba(0, 191, 255, 0.3)",
                      "0 0 10px rgba(0, 191, 255, 0.5)",
                      "0 0 5px rgba(0, 191, 255, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Store / Marketplace
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right Side - Power Mode */}
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <motion.h2 
                className="text-2xl font-semibold text-gradient-ai mb-2"
                animate={{ 
                  textShadow: [
                    "0 0 15px rgba(0, 191, 255, 0.4)",
                    "0 0 25px rgba(0, 191, 255, 0.6)",
                    "0 0 15px rgba(0, 191, 255, 0.4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Power Mode
              </motion.h2>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Box className="w-5 h-5 text-purple-400" />
                </motion.div>
                <span className="text-lg text-gray-300">Workflow Designer</span>
              </div>
            </div>
            
            {/* Flow visualization area */}
            <motion.div 
              className="glass-card p-8 h-96 flex items-center justify-center hover-lift"
              whileHover={{ scale: 1.01 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 mx-auto ai-glow"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-10 h-10 text-blue-400" />
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-gray-400"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  AI Workflow Visualization
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default V3Ultimate;