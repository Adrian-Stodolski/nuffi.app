import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface V3BoxProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

const V3Box: React.FC<V3BoxProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'accent-blue',
  trend,
  description,
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      className={`glass-card hover-lift cursor-pointer group ${className}`}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        rotateX: 2
      }}
      whileTap={{ scale: 0.98 }}
      style={{ transformStyle: 'preserve-3d' }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend.startsWith('+') ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
          }`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-text-primary group-hover:text-gradient-ai transition-all duration-200">
          {value}
        </div>
        <div className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
          {title}
        </div>
        {description && (
          <div className="text-xs text-text-muted group-hover:text-text-secondary transition-colors">
            {description}
          </div>
        )}
      </div>
      
      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-${color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ zIndex: -1 }}
      />
    </motion.div>
  );
};

export default V3Box;