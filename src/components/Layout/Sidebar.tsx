import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Layers,
  HelpCircle,
  Keyboard
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import toast from 'react-hot-toast';
import NuffiLogo from '../NuffiLogo';

interface SidebarProps {
  collapsed?: boolean;
  onMenuToggle?: () => void;
  onShowHelp?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onMenuToggle, onShowHelp }) => {
  const location = useLocation();
  const { scanSystem, loading } = useAppStore();
  // Use props directly instead of local state
  const isCollapsed = collapsed;

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
      id: 'workspaces',
      path: '/workspaces',
      label: 'Themed Workspaces',
      icon: Layers,
      description: 'Pre-configured environments'
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
      label: 'Dashboard Overview',
      icon: Zap,
      description: 'System overview and metrics'
    },
    {
      id: 'wow-factor',
      path: '/wow-factor',
      label: 'Performance Monitor',
      icon: Wand2,
      description: 'Real-time system monitoring'
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
    },
    {
      label: 'Team Setup',
      description: 'Company onboarding',
      path: '/team-setup'
    }
  ];

  return (
    <motion.div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} h-full glass-sidebar flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Synchronized animated background matching main app background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{
          background: [
            "radial-gradient(circle at 15% 30%, rgba(0, 191, 255, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.06) 0%, transparent 50%)",
            "radial-gradient(circle at 10% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 20%, rgba(0, 191, 255, 0.06) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.08) 0%, transparent 40%), radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)"
          ]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      />

      {/* Sidebar-specific particles */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {[...Array(6)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          return (
            <motion.div
              key={`sidebar-particle-${i}`}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                background: i % 3 === 0 
                  ? 'rgba(0, 191, 255, 0.4)' 
                  : i % 3 === 1 
                  ? 'rgba(76, 175, 80, 0.4)' 
                  : 'rgba(139, 92, 246, 0.3)'
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.5, 1.2, 0.5],
                y: [0, -40, 0],
                x: [0, (Math.random() - 0.5) * 20, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
      {/* Synchronized with main AnimatedBackground - no separate background needed */}

      {/* Integrated TopBar - part of sidebar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-center px-4 relative z-50">
        <AnimatePresence mode="wait">
          {collapsed ? (
            /* Collapsed State - Only Toggle Button (centered) */
            <motion.div
              key="collapsed"
              className="flex items-center justify-center w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={onMenuToggle}
                className="relative p-3 rounded-xl bg-gradient-to-r from-bg-quaternary/30 to-bg-quaternary/10 border border-accent-purple/20 hover:border-accent-purple/50 transition-all duration-300 backdrop-blur-sm group overflow-hidden"
                whileHover={{ 
                  scale: 1.15,
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)"
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  borderColor: [
                    "rgba(139, 92, 246, 0.2)",
                    "rgba(139, 92, 246, 0.6)",
                    "rgba(139, 92, 246, 0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                title="Expand sidebar"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-purple/15 via-accent-blue/15 to-accent-green/15 opacity-0 group-hover:opacity-100"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(139, 92, 246, 0.15), rgba(0, 191, 255, 0.15), rgba(76, 175, 80, 0.15))",
                      "linear-gradient(45deg, rgba(76, 175, 80, 0.15), rgba(139, 92, 246, 0.15), rgba(0, 191, 255, 0.15))",
                      "linear-gradient(45deg, rgba(0, 191, 255, 0.15), rgba(76, 175, 80, 0.15), rgba(139, 92, 246, 0.15))"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div
                  className="relative z-10"
                  animate={{ 
                    rotate: 180,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 0.3, ease: "easeInOut" },
                    scale: { duration: 1.5, repeat: Infinity }
                  }}
                >
                  <ChevronLeft className="w-5 h-5 text-accent-purple group-hover:text-white transition-colors duration-300" />
                </motion.div>
              </motion.button>
            </motion.div>
          ) : (
            /* Expanded State - Avatar + Notifications + Toggle */
            <motion.div
              key="expanded"
              className="flex items-center justify-between w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* User Profile, Notifications & Settings */}
              <div className="flex items-center space-x-2 flex-1">
                {/* User Avatar & Info */}
                <Link to="/v3-ultimate">
                  <motion.div
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-bg-quaternary/20 transition-all duration-300 cursor-pointer"
                    whileHover={{ 
                      scale: 1.02, 
                      y: -1
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center relative overflow-hidden"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(0, 191, 255, 0.3)",
                          "0 0 15px rgba(0, 191, 255, 0.5)",
                          "0 0 10px rgba(0, 191, 255, 0.3)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <User className="w-4 h-4 text-white relative z-10" />
                    </motion.div>
                    <motion.div
                      className="text-left"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xs font-semibold text-text-primary">Adrian</div>
                      <div className="text-xs text-accent-blue font-medium">Developer</div>
                    </motion.div>
                  </motion.div>
                </Link>

                {/* Notifications */}
                <motion.button
                  className="relative p-1.5 rounded-lg hover:bg-bg-quaternary/20 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Bell className="w-4 h-4 text-accent-orange" />
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-accent-red to-accent-orange rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 3px rgba(239, 68, 68, 0.4)",
                        "0 0 8px rgba(239, 68, 68, 0.6)",
                        "0 0 3px rgba(239, 68, 68, 0.4)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs font-bold text-white">3</span>
                  </motion.div>
                </motion.button>

                {/* Settings - w TopBar */}
                <Link to="/settings">
                  <motion.button
                    className={`relative p-1.5 rounded-lg transition-all duration-300 ${
                      location.pathname === '/settings' 
                        ? 'bg-accent-blue/20 text-accent-blue' 
                        : 'hover:bg-bg-quaternary/20 text-gray-400 hover:text-accent-blue'
                    }`}
                    whileHover={{ 
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Help / Keyboard Shortcuts */}
                {onShowHelp && (
                  <motion.button
                    onClick={onShowHelp}
                    className="relative p-1.5 rounded-lg hover:bg-bg-quaternary/20 text-gray-400 hover:text-accent-purple transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    title="Keyboard Shortcuts (Press ?)"
                  >
                    <Keyboard className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Menu Toggle Button */}
              <motion.button
                onClick={onMenuToggle}
                className="relative p-2 rounded-xl bg-gradient-to-r from-bg-quaternary/30 to-bg-quaternary/10 border border-accent-purple/20 hover:border-accent-purple/50 transition-all duration-300 backdrop-blur-sm group overflow-hidden"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  borderColor: [
                    "rgba(139, 92, 246, 0.2)",
                    "rgba(139, 92, 246, 0.5)",
                    "rgba(139, 92, 246, 0.2)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                title="Collapse sidebar"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 via-accent-blue/10 to-accent-green/10 opacity-0 group-hover:opacity-100"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(0, 191, 255, 0.1), rgba(76, 175, 80, 0.1))",
                      "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 92, 246, 0.1), rgba(0, 191, 255, 0.1))",
                      "linear-gradient(45deg, rgba(0, 191, 255, 0.1), rgba(76, 175, 80, 0.1), rgba(139, 92, 246, 0.1))"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div
                  className="relative z-10"
                  animate={{ 
                    rotate: 0,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 0.3, ease: "easeInOut" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <ChevronLeft className="w-4 h-4 text-accent-purple group-hover:text-white transition-colors duration-300" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <motion.div 
          className="p-3 space-y-0.5"
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
                    className={`relative flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-2 rounded-lg cursor-pointer group overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-blue/20 to-accent-green/20 text-white shadow-lg border border-accent-blue/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: isActive ? "rgba(0, 191, 255, 0.15)" : "rgba(255, 255, 255, 0.05)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Hover background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-green/10 opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <motion.div
                      className="relative z-10"
                      animate={isActive ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'group-hover:text-accent-blue'} transition-colors duration-200`} />
                    </motion.div>
                    
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div 
                          className="flex-1 relative z-10"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-blue to-accent-green"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Removed - Avatar/Notifications moved to TopBar */}

        {/* AI Features Section */}
        <motion.div 
          className="px-3 py-1.5 border-t border-white/5 mt-1.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="space-y-0.5">
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
                      className={`relative flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-1.5 rounded-lg cursor-pointer group overflow-hidden ${
                        isActive ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30' : 'hover:bg-white/5'
                      }`}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: "rgba(139, 92, 246, 0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={feature.action}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 to-accent-blue/5 opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.div
                        className="relative z-10"
                        animate={feature.loading ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: feature.loading ? Infinity : 0, ease: "linear" }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon className={`w-4 h-4 text-accent-purple group-hover:text-accent-blue transition-colors duration-200`} />
                      </motion.div>
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div 
                            className="flex-1 text-left relative z-10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                              {feature.loading ? 'Scanning...' : feature.label}
                            </div>
                            {feature.badge && (
                              <motion.div 
                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${feature.badgeColor} text-white backdrop-blur-sm`}
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Power Features Section */}
        <motion.div 
          className="px-3 py-1.5 border-t border-white/5 mt-1.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="space-y-0.5">
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
                      className={`relative flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-1.5 rounded-lg cursor-pointer group overflow-hidden ${
                        isActive ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30' : 'hover:bg-white/5'
                      }`}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: "rgba(249, 115, 22, 0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent-orange/5 to-accent-red/5 opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <motion.div 
                        className="w-4 h-4 bg-accent-orange rounded-sm relative z-10"
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
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div 
                            className="flex-1 relative z-10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                              {feature.label}
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                              {feature.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Footer with Logo */}
      <motion.div 
        className="p-2 border-t border-white/10 relative z-10 space-y-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >


        {/* Logo NUFFI - na samym dole */}
        <div className="flex items-center justify-center space-x-3 mt-1">
          <NuffiLogo size={40} animate={true} />
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-xl text-gradient-ai">NUFFI</h1>
              <p className="text-xs text-gray-400 text-center">AI Dev Environment</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Old floating button removed - now using TopBar toggle */}
    </motion.div>
  );
};

export default Sidebar;