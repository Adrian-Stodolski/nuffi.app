import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Store, 
  Brain, 
  Users, 
  Settings, 
  Zap,
  Wand2,
  Search,
  Square
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import toast from 'react-hot-toast';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { scanSystem, loading } = useAppStore();

  const handleSystemScan = async () => {
    try {
      await scanSystem();
      toast.success('System scan completed!');
    } catch (error) {
      toast.error('System scan failed');
    }
  };

  const menuItems = [
    {
      id: 'environment-hub',
      path: '/',
      label: 'Environment Hub',
      icon: Home,
      description: 'Manage your workspaces'
    },
    {
      id: 'create-workspace',
      path: '/create',
      label: 'Create Workspace',
      icon: Plus,
      description: 'Set up new workspace'
    },
    {
      id: 'marketplace',
      path: '/marketplace',
      label: 'Marketplace',
      icon: Store,
      description: 'Browse templates'
    },
    {
      id: 'ai-center',
      path: '/ai-center',
      label: 'AI Command Center',
      icon: Brain,
      description: 'AI recommendations'
    },
    {
      id: 'community',
      path: '/community',
      label: 'Community Hub',
      icon: Users,
      description: 'Connect with developers'
    },
    {
      id: 'v3-ultimate',
      path: '/v3-ultimate',
      label: '🧪 V3 Ultimate Test',
      icon: Zap,
      description: 'Test dashboard design'
    },
    {
      id: 'wow-factor',
      path: '/wow-factor',
      label: '✨ Wow Factor Demo',
      icon: Wand2,
      description: '2025 AI design trends'
    }
  ];

  const aiFeatures = [
    {
      label: 'System Scanner',
      icon: Search,
      description: 'Scan installed tools',
      action: handleSystemScan,
      loading: loading.scanning,
      path: '/scanner'
    },
    {
      label: 'AI Recommendations',
      icon: Wand2,
      badge: 'Unlock full AI Scan',
      badgeColor: 'bg-purple-600',
      path: '/ai-recommendations'
    },
    {
      label: 'Preset Wizard',
      icon: Zap,
      description: 'Quick workspace setup',
      path: '/preset-wizard'
    }
  ];

  const powerFeatures = [
    {
      label: 'Power Mode',
      description: 'Advanced features',
      path: '/power-mode'
    },
    {
      label: 'Workflow Designer',
      description: 'Automate tasks',
      path: '/workflow-designer'
    }
  ];

  return (
    <motion.div 
      className="w-64 h-full glass-sidebar flex flex-col relative overflow-hidden"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* AI-Enhanced animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(0, 191, 255, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(0, 191, 255, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Header with Glassmorphism */}
      <motion.div 
        className="p-6 border-b border-white/10 relative z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ai-glow"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              boxShadow: [
                "0 0 15px rgba(0, 191, 255, 0.4)",
                "0 0 25px rgba(0, 191, 255, 0.6)",
                "0 0 15px rgba(0, 191, 255, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white font-bold text-lg">N</span>
          </motion.div>
          <div>
            <motion.h1 
              className="font-bold text-xl text-gradient-ai"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              NUFFI
            </motion.h1>
            <motion.p 
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              AI Dev Environment
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <motion.div 
          className="p-4 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link to={item.path}>
                  <motion.div
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-gray-800 text-white shadow-lg border-l-2 border-green-500'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    whileHover={{ 
                      scale: 1.02, 
                      x: 5,
                      backgroundColor: isActive ? "#1f2937" : "#1f2937"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={isActive ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'group-hover:text-green-400'} transition-colors`} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                        {item.description}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI Features Section */}
        <motion.div 
          className="px-4 py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            AI Features
          </motion.div>
          <div className="space-y-1">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = location.pathname === feature.path;
              return (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Link to={feature.path || '#'}>
                    <motion.div
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group ${
                        isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={feature.action}
                    >
                      <motion.div
                        animate={feature.loading ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: feature.loading ? Infinity : 0, ease: "linear" }}
                      >
                        <Icon className={`w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors`} />
                      </motion.div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                          {feature.loading ? 'Scanning...' : feature.label}
                        </div>
                        {feature.badge && (
                          <motion.div 
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${feature.badgeColor} text-white`}
                            animate={{ 
                              scale: [1, 1.05, 1],
                              opacity: [0.8, 1, 0.8]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {feature.badge}
                          </motion.div>
                        )}
                        {feature.description && (
                          <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                            {feature.description}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Power Features Section */}
        <motion.div 
          className="px-4 py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          >
            Power Features
          </motion.div>
          <div className="space-y-1">
            {powerFeatures.map((feature, index) => {
              const isActive = location.pathname === feature.path;
              return (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <Link to={feature.path || '#'}>
                    <motion.div
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group ${
                        isActive ? 'bg-orange-500/20 text-orange-300' : 'hover:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div 
                        className="w-4 h-4 bg-orange-500 rounded-sm"
                        whileHover={{ rotate: 45, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        animate={{
                          boxShadow: [
                            "0 0 5px rgba(249, 115, 22, 0.3)",
                            "0 0 10px rgba(249, 115, 22, 0.5)",
                            "0 0 5px rgba(249, 115, 22, 0.3)"
                          ]
                        }}
                        style={{ transition: "box-shadow 2s infinite" }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                          {feature.label}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          {feature.description}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        className="p-4 border-t border-gray-800 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Link to="/settings">
          <motion.div
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Settings
            </span>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;