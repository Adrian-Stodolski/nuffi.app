import React from 'react';
import { motion } from 'framer-motion';

interface NuffiLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

const NuffiLogo: React.FC<NuffiLogoProps> = ({ 
  size = 40, 
  className = "", 
  animate = true 
}) => {
  const logoVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    glow: {
      filter: [
        "drop-shadow(0 0 10px rgba(0, 191, 255, 0.4))",
        "drop-shadow(0 0 20px rgba(0, 191, 255, 0.6))",
        "drop-shadow(0 0 10px rgba(0, 191, 255, 0.4))"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={animate ? logoVariants : {}}
      initial="idle"
      whileHover="hover"
      animate={animate ? "glow" : "idle"}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ghost body with gradient */}
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="ghostBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.7)" />
          </linearGradient>
        </defs>
        
        {/* Ghost body */}
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
          fill="url(#ghostBodyGradient)"
          stroke="url(#ghostGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Left eye */}
        <circle
          cx="42"
          cy="35"
          r="4"
          fill="#1F2937"
        />
        <polygon
          points="40,33 44,33 42,37"
          fill="white"
        />
        
        {/* Right eye */}
        <circle
          cx="58"
          cy="35"
          r="4"
          fill="#1F2937"
        />
        <polygon
          points="56,33 60,33 58,37"
          fill="white"
        />
        
        {/* Smile */}
        <path
          d="M45 48 Q50 53 55 48"
          stroke="#1F2937"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Floating sparkles */}
        <motion.circle
          cx="20"
          cy="25"
          r="1.5"
          fill="url(#ghostGradient)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0
          }}
        />
        <motion.circle
          cx="80"
          cy="35"
          r="1"
          fill="url(#ghostGradient)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.7
          }}
        />
        <motion.circle
          cx="85"
          cy="60"
          r="1.5"
          fill="url(#ghostGradient)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.4
          }}
        />
      </svg>
    </motion.div>
  );
};

export default NuffiLogo;