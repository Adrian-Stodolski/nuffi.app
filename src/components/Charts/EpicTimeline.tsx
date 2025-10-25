import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  color: string;
}

interface EpicTimelineProps {
  items: TimelineItem[];
  title: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'in-progress':
      return Zap;
    case 'pending':
      return Clock;
    case 'error':
      return AlertCircle;
    default:
      return Clock;
  }
};

const EpicTimeline: React.FC<EpicTimelineProps> = ({ items, title }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="p-6">
        <motion.h3
          className="text-xl font-semibold text-text-primary mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h3>
        
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Timeline line */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-blue via-accent-purple to-accent-green"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
          
          <div className="space-y-6">
            {items.map((item, index) => {
              const Icon = getStatusIcon(item.status);
              
              return (
                <motion.div
                  key={item.id}
                  className="relative flex items-start space-x-4"
                  variants={itemVariants}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-${item.color} to-${item.color}/70 flex items-center justify-center`}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      boxShadow: [
                        `0 0 10px ${item.color}40`,
                        `0 0 20px ${item.color}60`,
                        `0 0 10px ${item.color}40`
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity },
                      scale: { duration: 0.2 }
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                    
                    {/* Pulsing ring for in-progress items */}
                    {item.status === 'in-progress' && (
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 border-${item.color}`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Content */}
                  <motion.div
                    className="flex-1 min-w-0 pb-6"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-text-primary">
                        {item.title}
                      </h4>
                      <span className="text-sm text-text-muted">{item.time}</span>
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-3">
                      {item.description}
                    </p>
                    
                    {/* Status badge */}
                    <motion.span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${item.color}/20 text-${item.color} border border-${item.color}/30`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {item.status.replace('-', ' ')}
                    </motion.span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EpicTimeline;