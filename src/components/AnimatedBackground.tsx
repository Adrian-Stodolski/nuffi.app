import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'ai' | 'power' | 'workflow' | 'preset';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = () => {
  return (
    <>
      {/* Quantum Particles + Floating Ghosts (z CreateWorkspace) */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {/* Quantum Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`quantum-${i}`}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Floating Ghosts */}
        {[...Array(6)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const delay = Math.random() * 4;
          const duration = 8 + Math.random() * 4;
          
          return (
            <motion.div
              key={`ghost-${i}`}
              className="absolute opacity-10"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                y: [0, -200, 0],
                x: [0, (Math.random() - 0.5) * 300, 0],
                rotate: [0, 360],
                scale: [0.3, 0.8, 0.3],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            >
              <svg
                width={60 + Math.random() * 40}
                height={60 + Math.random() * 40}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`ghostGradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00BFFF" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                
                <path
                  d="M50 15 
                     C35 15, 25 25, 25 40
                     L25 65
                     C25 70, 27 75, 30 78
                     L35 85
                     C37 87, 40 85, 42 82
                     L45 78
                     C47 75, 50 75, 50 75
                     C50 75, 53 75, 55 78
                     L58 82
                     C60 85, 63 87, 65 85
                     L70 78
                     C73 75, 75 70, 75 65
                     L75 40
                     C75 25, 65 15, 50 15 Z"
                  fill={`url(#ghostGradient-${i})`}
                  opacity="0.3"
                />
                
                <circle cx="42" cy="35" r="4" fill="#1F2937" />
                <circle cx="58" cy="35" r="4" fill="#1F2937" />
                <path d="M45 48 Q50 53 55 48" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* Dodatkowe cząsteczki dla sidebar (ORYGINALNE) */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 15 }}>
        {[...Array(8)].map((_, i) => {
          const x = Math.random() * 25; // Tylko po lewej stronie (sidebar)
          const y = Math.random() * 100;
          return (
            <motion.div
              key={`sidebar-particle-${i}`}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                background: i % 3 === 0 
                  ? 'rgba(0, 191, 255, 0.6)' 
                  : i % 3 === 1 
                  ? 'rgba(76, 175, 80, 0.6)' 
                  : 'rgba(139, 92, 246, 0.5)'
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
                y: [0, -60, 0],
                x: [0, (Math.random() - 0.5) * 20, 0]
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* ORYGINALNE Gradient overlay for depth */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 8 }}
        animate={{
          background: [
            "radial-gradient(circle at 15% 30%, rgba(0, 191, 255, 0.06) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.04) 0%, transparent 50%)",
            "radial-gradient(circle at 10% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 40%), radial-gradient(circle at 20% 20%, rgba(0, 191, 255, 0.04) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.06) 0%, transparent 40%), radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)"
          ]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      />
      
      {/* ORYGINALNA Subtle grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.01]"
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