import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'ai' | 'power' | 'workflow' | 'preset';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  return (
    <>
      {/* V3Ultimate Style Background - piękne floating particles */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -2 }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'rgba(0, 191, 255, 0.4)' 
                : i % 3 === 1 
                ? 'rgba(76, 175, 80, 0.4)' 
                : 'rgba(139, 92, 246, 0.3)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0]
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

      {/* Gradient overlay for depth */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -3 }}
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(0, 191, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0, 191, 255, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.08) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)"
          ]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      />
      
      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ 
          zIndex: -1,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </>
  );
};

export default AnimatedBackground;