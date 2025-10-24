import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Code, 
  Settings, 
  Search, 
  Play, 
  Pause,
  RotateCcw,
  Sparkles,
  Cpu,
  Database,
  Globe,
  Shield,
  Rocket
} from 'lucide-react';

const WowFactorDemo: React.FC = () => {
  const [autonomyLevel, setAutonomyLevel] = useState(75);
  const [selectedModel, setSelectedModel] = useState('Claude');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* AI-Enhanced Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: i % 3 === 0 ? 'rgba(0, 191, 255, 0.4)' : 
                         i % 3 === 1 ? 'rgba(76, 175, 80, 0.4)' : 
                         'rgba(139, 92, 246, 0.4)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              y: [0, -200, 0],
              x: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="flex h-screen relative z-10">
        {/* VS Code-like Sidebar */}
        <motion.div 
          className="glass-sidebar w-80 flex flex-col"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center ai-glow"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-ai">NUFFI AI</h1>
                <p className="text-xs text-gray-400">Wow Factor Edition</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div 
            className="flex-1 p-4 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Brain, label: 'Agent Core', desc: 'AI coding assistant' },
              { icon: Zap, label: 'Productivity Suite', desc: 'Task management' },
              { icon: Globe, label: 'Forge Hub', desc: 'Community & marketplace' },
              { icon: Settings, label: 'System Config', desc: 'Advanced settings' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="glass-card p-4 hover-lift cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:ai-glow"
                      whileHover={{ rotate: 10 }}
                    >
                      <Icon className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white">{item.label}</h3>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <motion.div 
            className="glass-card m-4 p-4 flex items-center justify-between"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-4">
              {/* Model Switch */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Model:</span>
                <motion.select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="glass-input py-2 px-3 text-sm"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="Claude">Claude 3.5</option>
                  <option value="GPT">GPT-4</option>
                  <option value="Grok">Grok-2</option>
                </motion.select>
              </div>

              {/* Autonomy Slider */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">Autonomy:</span>
                <div className="relative w-32">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={autonomyLevel}
                    onChange={(e) => setAutonomyLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <motion.div
                    className="absolute -top-8 left-0 text-xs text-blue-400 font-medium"
                    animate={{ left: `${autonomyLevel}%` }}
                    style={{ transform: 'translateX(-50%)' }}
                  >
                    {autonomyLevel}%
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or ask AI..."
                className="glass-input pl-10 pr-4 py-2 w-64"
              />
            </div>
          </motion.div>

          {/* Hero Card */}
          <motion.div 
            className="m-4 flex-1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ 
                  rotate: isScanning ? 360 : 0,
                  scale: isScanning ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" },
                  scale: { duration: 1, repeat: isScanning ? Infinity : 0 }
                }}
                className="mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center ai-glow">
                  {isScanning ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-12 h-12 text-white" />
                    </motion.div>
                  ) : (
                    <Rocket className="w-12 h-12 text-white" />
                  )}
                </div>
              </motion.div>

              <motion.h2 
                className="text-4xl font-bold text-gradient-ai mb-4"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(0, 191, 255, 0.5)",
                    "0 0 40px rgba(0, 191, 255, 0.8)",
                    "0 0 20px rgba(0, 191, 255, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {isScanning ? 'AI Scanning in Progress...' : 'Welcome to the Future!'}
              </motion.h2>

              <motion.p 
                className="text-gray-400 mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {isScanning 
                  ? `Analyzing your development environment... ${scanProgress}%`
                  : 'Experience the next generation of AI-powered development tools with glassmorphism design and smooth animations.'
                }
              </motion.p>

              {/* Progress Bar */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    className="w-full max-w-md mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="glass-card p-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Scanning system...</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 ai-glow"
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <motion.button
                onClick={startScan}
                disabled={isScanning}
                className="ai-button text-lg px-8 py-4 disabled:opacity-50"
                whileHover={{ scale: isScanning ? 1 : 1.05 }}
                whileTap={{ scale: isScanning ? 1 : 0.95 }}
                animate={!isScanning ? {
                  boxShadow: [
                    "0 8px 25px rgba(0, 191, 255, 0.3)",
                    "0 12px 35px rgba(0, 191, 255, 0.5)",
                    "0 8px 25px rgba(0, 191, 255, 0.3)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isScanning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Start AI Quick Scan</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right AI Chat Sidebar */}
        <motion.div 
          className="glass-sidebar w-80 border-l border-white/10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        >
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span>AI Assistant</span>
            </h3>
          </div>
          
          <div className="flex-1 p-4 space-y-4">
            {[
              { type: 'ai', message: 'Hello! I\'m your AI assistant. How can I help you today?' },
              { type: 'user', message: 'Can you scan my development environment?' },
              { type: 'ai', message: 'Of course! I\'ll run a comprehensive scan to detect all your tools and suggest optimizations.' }
            ].map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: chat.type === 'ai' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.3 }}
                className={`glass-card p-3 ${chat.type === 'ai' ? 'ai-glow' : ''}`}
              >
                <p className="text-sm text-white">{chat.message}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask AI anything..."
                className="glass-input flex-1 text-sm"
              />
              <motion.button
                className="ai-button p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00BFFF, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00BFFF, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default WowFactorDemo;