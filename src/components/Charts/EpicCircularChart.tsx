import React from 'react';
import { motion } from 'framer-motion';

interface EpicCircularChartProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  title: string;
  subtitle?: string;
  showValue?: boolean;
}

const EpicCircularChart: React.FC<EpicCircularChartProps> = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color,
  title,
  subtitle,
  showValue = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / maxValue) * 100;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center space-y-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${color.replace('#', '')})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              delay: 0.5 
            }}
            style={{
              filter: `drop-shadow(0 0 10px ${color}40)`
            }}
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="50%" stopColor={`${color}CC`} />
              <stop offset="100%" stopColor={`${color}80`} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <motion.div
              className="text-2xl font-bold text-gradient-ai"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {Math.round(percentage)}%
            </motion.div>
          )}
          {subtitle && (
            <motion.div
              className="text-xs text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {subtitle}
            </motion.div>
          )}
        </div>
        
        {/* Glowing effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${color}20`,
              `0 0 40px ${color}40`,
              `0 0 20px ${color}20`
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="text-sm font-semibold text-text-primary">{title}</div>
      </motion.div>
    </motion.div>
  );
};

export default EpicCircularChart;