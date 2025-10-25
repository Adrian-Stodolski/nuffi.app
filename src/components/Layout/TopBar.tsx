import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Bell, Search, Menu, Sparkles, ChevronLeft } from 'lucide-react';

interface TopBarProps {
  onMenuToggle?: () => void;
  collapsed?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, collapsed = false }) => {
  return (
    <motion.div 
      className={`${collapsed ? 'w-20' : 'w-64'} h-16 glass-card border-b border-white/10 flex items-center justify-center px-4 relative z-50 transition-all duration-300`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.6 }}
    >
      {/* Adaptive Content - changes based on collapsed state */}
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
              {/* Enhanced magical background for collapsed state */}
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
              
              {/* Toggle icon - enhanced for collapsed */}
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
              
              {/* Enhanced sparkles for collapsed */}
              <motion.div
                className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-blue rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div
                className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-accent-green rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
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
            {/* User Profile & Notifications */}
            <div className="flex items-center space-x-3">
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
                className="relative p-2 rounded-lg hover:bg-bg-quaternary/20 transition-all duration-300"
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
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-accent-red to-accent-orange rounded-full flex items-center justify-center"
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
              {/* Magical background effect */}
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
              
              {/* Toggle icon */}
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
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute top-0.5 right-0.5 w-1 h-1 bg-accent-blue rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-accent-green rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopBar;